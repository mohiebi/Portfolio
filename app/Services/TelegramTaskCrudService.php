<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TelegramConnection;
use App\Models\User;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use DefStudio\Telegraph\Models\TelegraphChat;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Stringable;

class TelegramTaskCrudService
{
    private const STATE_TTL_MINUTES = 15;

    private const ACTION_CREATE_TITLE = 'create_title';

    private const ACTION_CREATE_DEADLINE = 'create_deadline';

    private const ACTION_UPDATE_DEADLINE = 'update_deadline';

    private const ACTION_UPDATE_DESCRIPTION = 'update_description';

    private const ACTION_UPDATE_REMINDER_HOUR = 'update_reminder_hour';

    public function __construct(private readonly TelegramTaskBotService $botService)
    {
    }

    public function beginTaskCreation(TelegraphChat $chat, TelegramConnection $connection, ?int $editMessageId = null): void
    {
        $this->putState($chat, $connection, [
            'action' => self::ACTION_CREATE_TITLE,
            'parent_id' => null,
        ]);

        $this->reply(
            $chat,
            $editMessageId,
            "<b>New task</b>\n\nSend the task title.",
            $this->cancelKeyboard()
        );
    }

    public function beginSubtaskCreation(TelegraphChat $chat, TelegramConnection $connection, int $parentId, ?int $editMessageId = null): void
    {
        $parent = $this->parentTask($connection->user, $parentId);

        if (! $parent) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->botService->mainMenuKeyboard());

            return;
        }

        $this->putState($chat, $connection, [
            'action' => self::ACTION_CREATE_TITLE,
            'parent_id' => $parent->id,
        ]);

        $this->reply(
            $chat,
            $editMessageId,
            "<b>New subtask</b>\n\nSend the subtask title for <b>{$this->escape($parent->title)}</b>.",
            $this->cancelKeyboard()
        );
    }

    public function skipCreateDeadline(TelegraphChat $chat, TelegramConnection $connection, ?int $editMessageId = null): void
    {
        $state = $this->state($chat, $connection);

        if (($state['action'] ?? null) !== self::ACTION_CREATE_DEADLINE) {
            $this->expiredStateReply($chat, $editMessageId, $connection);

            return;
        }

        $this->createDraftTask($chat, $connection, $state, null, $editMessageId);
    }

    public function useCreateDeadlinePreset(TelegraphChat $chat, TelegramConnection $connection, string $preset, ?int $editMessageId = null): void
    {
        $state = $this->state($chat, $connection);
        $deadline = $this->presetDeadline($preset, $connection->user);

        if (($state['action'] ?? null) !== self::ACTION_CREATE_DEADLINE || ! $deadline) {
            $this->expiredStateReply($chat, $editMessageId, $connection);

            return;
        }

        $this->createDraftTask($chat, $connection, $state, $deadline, $editMessageId);
    }

    public function beginDeadlineUpdate(TelegraphChat $chat, TelegramConnection $connection, int $taskId, ?int $editMessageId = null): void
    {
        $task = $this->userTask($connection->user, $taskId);

        if (! $task) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->botService->mainMenuKeyboard());

            return;
        }

        $this->putState($chat, $connection, [
            'action' => self::ACTION_UPDATE_DEADLINE,
            'task_id' => $task->id,
        ]);

        $this->reply(
            $chat,
            $editMessageId,
            "<b>Update deadline</b>\n\nChoose a quick date for <b>{$this->escape($task->title)}</b>, or send a date as <code>YYYY-MM-DD</code>.",
            $this->updateDeadlineKeyboard($task)
        );
    }

    public function useDeadlinePreset(TelegraphChat $chat, TelegramConnection $connection, int $taskId, string $preset, ?int $editMessageId = null): void
    {
        $task = $this->userTask($connection->user, $taskId);
        $deadline = $this->presetDeadline($preset, $connection->user);

        if (! $task || ! $deadline) {
            $this->expiredStateReply($chat, $editMessageId, $connection);

            return;
        }

        $this->forgetState($chat);
        $task->update(['deadline' => $deadline]);

        $this->botService->sendTaskDetail($chat, $connection->user, $task->id, $editMessageId);
    }

    public function clearDeadline(TelegraphChat $chat, TelegramConnection $connection, int $taskId, ?int $editMessageId = null): void
    {
        $task = $this->userTask($connection->user, $taskId);

        if (! $task) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->botService->mainMenuKeyboard());

            return;
        }

        $task->update(['deadline' => null]);

        $this->botService->sendTaskDetail($chat, $connection->user, $task->id, $editMessageId);
    }

    public function beginDescriptionUpdate(TelegraphChat $chat, TelegramConnection $connection, int $taskId, ?int $editMessageId = null): void
    {
        $task = $this->userTask($connection->user, $taskId);

        if (! $task) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->botService->mainMenuKeyboard());

            return;
        }

        $this->putState($chat, $connection, [
            'action' => self::ACTION_UPDATE_DESCRIPTION,
            'task_id' => $task->id,
        ]);

        $this->reply(
            $chat,
            $editMessageId,
            "<b>Update description</b>\n\nSend the new description for <b>{$this->escape($task->title)}</b>.",
            $this->cancelKeyboard()
        );
    }

    public function clearDescription(TelegraphChat $chat, TelegramConnection $connection, int $taskId, ?int $editMessageId = null): void
    {
        $task = $this->userTask($connection->user, $taskId);

        if (! $task) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->botService->mainMenuKeyboard());

            return;
        }

        $task->update(['description' => '']);

        $this->botService->sendTaskDetail($chat, $connection->user, $task->id, $editMessageId);
    }

    public function sendStatusMenu(TelegraphChat $chat, TelegramConnection $connection, int $taskId, ?int $editMessageId = null): void
    {
        $task = $this->userTask($connection->user, $taskId);

        if (! $task) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->botService->mainMenuKeyboard());

            return;
        }

        $this->reply(
            $chat,
            $editMessageId,
            "<b>Change status</b>\n\nChoose a new status for <b>{$this->escape($task->title)}</b>.",
            Keyboard::make()
                ->row([
                    Button::make('Open')->action('setTaskStatus')->param('task_id', $task->id)->param('status', Task::STATUS_OPEN),
                    Button::make('In progress')->action('setTaskStatus')->param('task_id', $task->id)->param('status', Task::STATUS_IN_PROGRESS),
                ])
                ->row([
                    Button::make('Done')->action('setTaskStatus')->param('task_id', $task->id)->param('status', Task::STATUS_DONE),
                    Button::make('Back')->action('showTask')->param('task_id', $task->id),
                ])
        );
    }

    public function updateStatus(TelegraphChat $chat, TelegramConnection $connection, int $taskId, string $status, ?int $editMessageId = null): void
    {
        if (! in_array($status, [Task::STATUS_OPEN, Task::STATUS_IN_PROGRESS, Task::STATUS_DONE], true)) {
            $this->reply($chat, $editMessageId, 'That status is not valid.', $this->botService->mainMenuKeyboard());

            return;
        }

        $task = $this->userTask($connection->user, $taskId);

        if (! $task) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->botService->mainMenuKeyboard());

            return;
        }

        DB::transaction(function () use ($task, $status): void {
            $task->moveToStatus($status);

            if ($task->parent_id) {
                $task->parent()->first()?->syncStatusFromSubtasks();
            }
        });

        $this->botService->sendTaskDetail($chat, $connection->user, $task->id, $editMessageId);
    }

    public function confirmDelete(TelegraphChat $chat, TelegramConnection $connection, int $taskId, ?int $editMessageId = null): void
    {
        $task = $this->userTask($connection->user, $taskId);

        if (! $task) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->botService->mainMenuKeyboard());

            return;
        }

        $this->reply(
            $chat,
            $editMessageId,
            "Delete <b>{$this->escape($task->title)}</b>?\n\nThis cannot be undone.",
            Keyboard::make()
                ->row([
                    Button::make('Cancel')->action('showTask')->param('task_id', $task->id),
                    Button::make('Yes, delete')->action('deleteTask')->param('task_id', $task->id),
                ])
        );
    }

    public function deleteTask(TelegraphChat $chat, TelegramConnection $connection, int $taskId, ?int $editMessageId = null): void
    {
        $task = $this->userTask($connection->user, $taskId);

        if (! $task) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->botService->mainMenuKeyboard());

            return;
        }

        $parentId = $task->parent_id;
        $title = $task->title;

        DB::transaction(function () use ($task, $parentId, $connection): void {
            $task->delete();

            if ($parentId) {
                $this->parentTask($connection->user, $parentId)?->syncStatusFromSubtasks();
            }
        });

        $this->reply(
            $chat,
            $editMessageId,
            "Deleted <b>{$this->escape($title)}</b>.",
            Keyboard::make()->row([
                Button::make('All Tasks')->action('showTasks')->param('filter', 'all')->param('page', 1),
                Button::make('Main Menu')->action('mainMenu'),
            ])
        );
    }

    public function beginReminderHourUpdate(TelegraphChat $chat, TelegramConnection $connection, ?int $editMessageId = null): void
    {
        $this->putState($chat, $connection, [
            'action' => self::ACTION_UPDATE_REMINDER_HOUR,
        ]);

        $this->reply(
            $chat,
            $editMessageId,
            "<b>Reminder hour</b>\n\nChoose an hour. Your timezone stays UTC{$connection->user->taskReminderTimezone()}.\n\nYou can also send an hour from <code>0</code> to <code>23</code>.",
            $this->reminderHourKeyboard()
        );
    }

    public function setReminderHour(TelegraphChat $chat, TelegramConnection $connection, string|int $hour, ?int $editMessageId = null): void
    {
        $this->handleReminderHour($chat, $connection, (string) $hour, $editMessageId);
    }

    public function cancel(TelegraphChat $chat, TelegramConnection $connection, ?int $editMessageId = null): void
    {
        $this->forgetState($chat);

        $this->reply($chat, $editMessageId, 'Canceled.', $this->botService->mainMenuKeyboard());
    }

    public function clearInputState(TelegraphChat $chat): void
    {
        $this->forgetState($chat);
    }

    public function handleTextInput(TelegraphChat $chat, TelegramConnection $connection, Stringable $text): bool
    {
        $state = $this->state($chat, $connection);

        if ($state === []) {
            return false;
        }

        $value = $text->trim()->toString();

        match ($state['action'] ?? null) {
            self::ACTION_CREATE_TITLE => $this->handleCreateTitle($chat, $connection, $state, $value),
            self::ACTION_CREATE_DEADLINE => $this->handleCreateDeadline($chat, $connection, $state, $value),
            self::ACTION_UPDATE_DEADLINE => $this->handleUpdateDeadline($chat, $connection, $state, $value),
            self::ACTION_UPDATE_DESCRIPTION => $this->handleUpdateDescription($chat, $connection, $state, $value),
            self::ACTION_UPDATE_REMINDER_HOUR => $this->handleReminderHour($chat, $connection, $value),
            default => $this->expiredStateReply($chat, null, $connection),
        };

        return true;
    }

    /**
     * @param  array<string, mixed>  $state
     */
    private function handleCreateTitle(TelegraphChat $chat, TelegramConnection $connection, array $state, string $title): void
    {
        $validator = Validator::make(['title' => $title], [
            'title' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            $this->reply($chat, null, "Please send a title up to 255 characters.\n\nTap Cancel to stop.", $this->cancelKeyboard());

            return;
        }

        $this->putState($chat, $connection, [
            ...$state,
            'action' => self::ACTION_CREATE_DEADLINE,
            'title' => $title,
        ]);

        $this->reply(
            $chat,
            null,
            "<b>Optional deadline</b>\n\nChoose a quick date, send a date as <code>YYYY-MM-DD</code>, or tap Skip.",
            $this->createDeadlineKeyboard()
        );
    }

    /**
     * @param  array<string, mixed>  $state
     */
    private function handleCreateDeadline(TelegraphChat $chat, TelegramConnection $connection, array $state, string $deadline): void
    {
        $parsedDeadline = $this->parseDeadline($deadline, $connection->user);

        if (! $parsedDeadline) {
            $this->reply($chat, null, 'Please send the deadline as <code>YYYY-MM-DD</code>, or tap Skip.', $this->createDeadlineKeyboard());

            return;
        }

        $this->createDraftTask($chat, $connection, $state, $parsedDeadline);
    }

    /**
     * @param  array<string, mixed>  $state
     */
    private function handleUpdateDeadline(TelegraphChat $chat, TelegramConnection $connection, array $state, string $deadline): void
    {
        $task = $this->userTask($connection->user, (int) ($state['task_id'] ?? 0));
        $parsedDeadline = $this->parseDeadline($deadline, $connection->user);

        if (! $task) {
            $this->expiredStateReply($chat, null, $connection);

            return;
        }

        if (! $parsedDeadline) {
            $this->reply($chat, null, 'Please send the deadline as <code>YYYY-MM-DD</code>.', $this->cancelKeyboard());

            return;
        }

        $task->update(['deadline' => $parsedDeadline]);
        $this->forgetState($chat);

        $this->botService->sendTaskDetail($chat, $connection->user, $task->id);
    }

    /**
     * @param  array<string, mixed>  $state
     */
    private function handleUpdateDescription(TelegraphChat $chat, TelegramConnection $connection, array $state, string $description): void
    {
        $task = $this->userTask($connection->user, (int) ($state['task_id'] ?? 0));

        if (! $task) {
            $this->expiredStateReply($chat, null, $connection);

            return;
        }

        $validator = Validator::make(['description' => $description], [
            'description' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            $this->reply($chat, null, 'That description is not valid. Please try again.', $this->cancelKeyboard());

            return;
        }

        $task->update(['description' => $description]);
        $this->forgetState($chat);

        $this->botService->sendTaskDetail($chat, $connection->user, $task->id);
    }

    private function handleReminderHour(TelegraphChat $chat, TelegramConnection $connection, string $hour, ?int $editMessageId = null): void
    {
        $validator = Validator::make(['hour' => $hour], [
            'hour' => ['required', 'integer', 'min:0', 'max:23'],
        ]);

        if ($validator->fails()) {
            $this->reply($chat, $editMessageId, 'Please choose or send an hour from 0 to 23.', $this->reminderHourKeyboard());

            return;
        }

        $connection->user->forceFill([
            'task_reminder_time' => str_pad((string) ((int) $hour), 2, '0', STR_PAD_LEFT).':00',
        ])->save();

        $this->forgetState($chat);
        $this->botService->sendSettings($chat, $connection->fresh(['user']), $editMessageId);
    }

    /**
     * @param  array<string, mixed>  $state
     */
    private function createDraftTask(TelegraphChat $chat, TelegramConnection $connection, array $state, ?Carbon $deadline, ?int $editMessageId = null): void
    {
        $task = DB::transaction(function () use ($connection, $state, $deadline): Task {
            $parentId = $state['parent_id'] ?? null;
            $data = [
                'title' => $state['title'],
                'description' => '',
                'deadline' => $deadline,
                'status' => Task::STATUS_OPEN,
                'complete' => false,
            ];

            if ($parentId) {
                $parent = $this->parentTask($connection->user, (int) $parentId);

                if (! $parent) {
                    throw new \RuntimeException('Parent task not found.');
                }

                $subtask = $parent->subtasks()->create([
                    ...$data,
                    'user_id' => $connection->user_id,
                ]);
                $parent->syncStatusFromSubtasks();

                return $subtask;
            }

            return $connection->user->tasks()->create($data);
        });

        $this->forgetState($chat);
        $this->botService->sendTaskDetail($chat, $connection->user, $task->id, $editMessageId);
    }

    private function parseDeadline(string $value, User $user): ?Carbon
    {
        if (! preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return null;
        }

        $deadline = Carbon::createFromFormat('Y-m-d', $value, $user->taskReminderTimezone());

        if (! $deadline || $deadline->format('Y-m-d') !== $value) {
            return null;
        }

        return $deadline->startOfDay();
    }

    private function presetDeadline(string $preset, User $user): ?Carbon
    {
        $today = $user->taskReminderDate();

        return match ($preset) {
            'today' => $today,
            'tomorrow' => $today->copy()->addDay(),
            'next_week' => $today->copy()->addWeek(),
            default => null,
        };
    }

    private function userTask(User $user, int $taskId): ?Task
    {
        return $user->tasks()
            ->with(['parent', 'subtasks'])
            ->whereKey($taskId)
            ->first();
    }

    private function parentTask(User $user, int $taskId): ?Task
    {
        return $user->tasks()
            ->topLevel()
            ->with('subtasks')
            ->whereKey($taskId)
            ->first();
    }

    /**
     * @param  array<string, mixed>  $state
     */
    private function putState(TelegraphChat $chat, TelegramConnection $connection, array $state): void
    {
        Cache::put($this->stateKey($chat), [
            ...$state,
            'user_id' => $connection->user_id,
        ], now()->addMinutes(self::STATE_TTL_MINUTES));
    }

    /**
     * @return array<string, mixed>
     */
    private function state(TelegraphChat $chat, TelegramConnection $connection): array
    {
        $state = Cache::get($this->stateKey($chat), []);

        if (! is_array($state) || (int) ($state['user_id'] ?? 0) !== $connection->user_id) {
            return [];
        }

        return $state;
    }

    private function forgetState(TelegraphChat $chat): void
    {
        Cache::forget($this->stateKey($chat));
    }

    private function stateKey(TelegraphChat $chat): string
    {
        return "telegram-task-input:{$chat->id}";
    }

    private function expiredStateReply(TelegraphChat $chat, ?int $editMessageId, TelegramConnection $connection): void
    {
        $this->forgetState($chat);

        $this->reply(
            $chat,
            $editMessageId,
            'That action expired. Please start again.',
            $connection->isConnected() ? $this->botService->mainMenuKeyboard() : Keyboard::make()
        );
    }

    private function cancelKeyboard(): Keyboard
    {
        return Keyboard::make()->row([
            Button::make('Cancel')->action('cancelTaskInput'),
        ]);
    }

    private function createDeadlineKeyboard(): Keyboard
    {
        return Keyboard::make()
            ->row([
                Button::make('Today')->action('createDeadlinePreset')->param('preset', 'today'),
                Button::make('Tomorrow')->action('createDeadlinePreset')->param('preset', 'tomorrow'),
            ])
            ->row([
                Button::make('Next week')->action('createDeadlinePreset')->param('preset', 'next_week'),
                Button::make('Skip')->action('skipCreateDeadline'),
            ])
            ->row([
                Button::make('Cancel')->action('cancelTaskInput'),
            ]);
    }

    private function updateDeadlineKeyboard(Task $task): Keyboard
    {
        return Keyboard::make()
            ->row([
                Button::make('Today')->action('setDeadlinePreset')->param('task_id', $task->id)->param('preset', 'today'),
                Button::make('Tomorrow')->action('setDeadlinePreset')->param('task_id', $task->id)->param('preset', 'tomorrow'),
            ])
            ->row([
                Button::make('Next week')->action('setDeadlinePreset')->param('task_id', $task->id)->param('preset', 'next_week'),
                Button::make('Cancel')->action('showTask')->param('task_id', $task->id),
            ]);
    }

    private function reminderHourKeyboard(): Keyboard
    {
        $keyboard = Keyboard::make();

        foreach (array_chunk(range(0, 23), 4) as $hours) {
            $keyboard = $keyboard->row(array_map(
                fn (int $hour): Button => Button::make(str_pad((string) $hour, 2, '0', STR_PAD_LEFT))->action('setReminderHour')->param('hour', $hour),
                $hours,
            ));
        }

        return $keyboard->row([
            Button::make('Cancel')->action('cancelTaskInput'),
        ]);
    }

    private function reply(TelegraphChat $chat, ?int $editMessageId, string $html, Keyboard $keyboard): void
    {
        if ($editMessageId !== null) {
            $chat->edit($editMessageId)->html($html)->keyboard($keyboard)->send();

            return;
        }

        $chat->html($html)->keyboard($keyboard)->send();
    }

    private function escape(?string $value): string
    {
        return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
