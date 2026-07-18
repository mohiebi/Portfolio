<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TelegramConnection;
use App\Models\User;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use DefStudio\Telegraph\Models\TelegraphChat;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class TelegramTaskBotService
{
    private const PAGE_SIZE = 6;

    public function sendMainMenu(TelegraphChat $chat, ?TelegramConnection $connection = null, ?int $editMessageId = null): void
    {
        $name = $connection?->user?->name;
        $message = $name
            ? "👋 Hello, <b>{$this->escape($name)}</b>!\n\nWhat would you like to do?"
            : "🔗 <b>Not connected yet.</b>\n\nVisit your profile page to link this Telegram chat and start managing tasks.";

        $this->reply($chat, $editMessageId, $message, $connection?->isConnected() ? $this->mainMenuKeyboard() : Keyboard::make());
    }

    public function sendSettings(TelegraphChat $chat, TelegramConnection $connection, ?int $editMessageId = null): void
    {
        $remindersIcon = $connection->reminders_enabled ? '🔔' : '🔕';
        $remindersLabel = $connection->reminders_enabled ? 'Enabled' : 'Disabled';
        $username = $connection->telegram_username ? '@'.$connection->telegram_username : 'this chat';

        $user = $connection->user;
        $reminderTime = $user?->taskReminderTime() ?? '08:00';
        $reminderTimezone = $user?->taskReminderTimezone() ?? '+00:00';
        $reminderDisplay = $reminderTime.' (UTC'.$reminderTimezone.')';

        $this->reply(
            $chat,
            $editMessageId,
            "⚙️ <b>Settings</b>\n\n".
            "👤 Account: <b>{$this->escape($username)}</b>\n".
            "{$remindersIcon} Reminders: <b>{$remindersLabel}</b>\n".
            "🕐 Reminder time: <b>{$reminderDisplay}</b>\n\n".
            '<i>Timezone is managed from your profile page.</i>',
            Keyboard::make()
                ->row([
                    Button::make('🕐 Update reminder time')->action('updateReminderHour'),
                ])
                ->row([
                    Button::make('📋 All Tasks')->action('showTasks')->param('filter', 'all')->param('page', 1),
                    Button::make('🏠 Main Menu')->action('mainMenu'),
                ])
        );
    }

    public function sendTaskList(TelegraphChat $chat, User $user, string $filter = 'all', int $page = 1, ?int $editMessageId = null): void
    {
        $filter = $this->normalizeFilter($filter);
        $page = max(1, $page);
        $timezone = $user->taskReminderTimezone();

        $taskQuery = $this->taskQuery($user, $filter)
            ->when($filter === 'all', fn (Builder $query) => $query->whereNull('parent_id'))
            ->with(['parent', 'subtasks']);

        $tasks = $this->applyTaskListOrdering($taskQuery, $filter)
            ->paginate(self::PAGE_SIZE, ['*'], 'page', $page);

        $offset = ($tasks->currentPage() - 1) * self::PAGE_SIZE;
        $numbered = $tasks->getCollection()->values()->map(fn (Task $task, int $i) => [$i + $offset + 1, $task]);

        $this->reply($chat, $editMessageId, $this->taskListMessage($tasks, $filter, $numbered, $timezone), $this->taskListKeyboard($tasks, $filter, $numbered));
    }

    public function sendTaskDetail(TelegraphChat $chat, User $user, int $taskId, ?int $editMessageId = null): void
    {
        $task = $user->tasks()
            ->with(['parent', 'subtasks'])
            ->whereKey($taskId)
            ->first();

        if (! $task) {
            $this->reply($chat, $editMessageId, 'Task not found.', $this->mainMenuKeyboard());

            return;
        }

        $this->reply(
            $chat,
            $editMessageId,
            $this->taskDetailMessage($task, $user->taskReminderTimezone()),
            $this->taskDetailKeyboard($task)
        );
    }

    public function mainMenuKeyboard(): Keyboard
    {
        return Keyboard::make()
            ->row([
                Button::make('➕ Add Task')->action('createTask'),
            ])
            ->row([
                Button::make('📋 All Tasks')->action('showTasks')->param('filter', 'all')->param('page', 1),
                Button::make('📅 Due Today')->action('showTasks')->param('filter', 'due_today')->param('page', 1),
            ])
            ->row([
                Button::make('🗓 Due Tomorrow')->action('showTasks')->param('filter', 'due_tomorrow')->param('page', 1),
                Button::make('🆕 Open')->action('showTasks')->param('filter', 'open')->param('page', 1),
            ])
            ->row([
                Button::make('⚡ In Progress')->action('showTasks')->param('filter', 'in_progress')->param('page', 1),
                Button::make('✅ Done')->action('showTasks')->param('filter', 'done')->param('page', 1),
            ])
            ->row([
                Button::make('⚙️ Settings')->action('settings'),
            ]);
    }

    /**
     * @param  Collection<int, Task>  $warningTasks
     * @param  Collection<int, Task>  $dueTasks
     * @param  Collection<int, Task>  $overdueTasks
     */
    public function sendReminderMessage(
        TelegraphChat $chat,
        Collection $warningTasks,
        Collection $dueTasks,
        Collection $overdueTasks,
        Carbon $today,
    ): void {
        $chat->html($this->reminderMessage($warningTasks, $dueTasks, $overdueTasks, $today))
            ->keyboard(Keyboard::make()
                ->row([
                    Button::make('📅 Due Today')->action('showTasks')->param('filter', 'due_today')->param('page', 1),
                    Button::make('🗓 Due Tomorrow')->action('showTasks')->param('filter', 'due_tomorrow')->param('page', 1),
                ])
                ->row([
                    Button::make('🔴 Overdue')->action('showTasks')->param('filter', 'overdue')->param('page', 1),
                    Button::make('📋 All Tasks')->action('showTasks')->param('filter', 'all')->param('page', 1),
                ])
                ->row([
                    Button::make('🏠 Main Menu')->action('mainMenu'),
                ]))
            ->send();
    }

    private function reply(TelegraphChat $chat, ?int $editMessageId, string $html, Keyboard $keyboard): void
    {
        if ($editMessageId !== null) {
            $chat->edit($editMessageId)->html($html)->keyboard($keyboard)->send();

            return;
        }

        $chat->html($html)->keyboard($keyboard)->send();
    }

    private function taskQuery(User $user, string $filter)
    {
        $today = Carbon::now($user->taskReminderTimezone())->startOfDay();

        return $user->tasks()
            ->when($user->task_done_cleanup_enabled, fn ($query) => $query->visibleOnTaskBoard())
            ->when($filter === 'due_today', fn (Builder $query) => $query->whereDate('deadline', $today->toDateString()))
            ->when($filter === 'due_tomorrow', fn (Builder $query) => $query->whereDate('deadline', $today->copy()->addDay()->toDateString()))
            ->when($filter === 'overdue', fn (Builder $query) => $query->whereDate('deadline', '<', $today->toDateString()))
            ->when($filter === 'open', fn (Builder $query) => $query->where('status', Task::STATUS_OPEN)->where('complete', false))
            ->when($filter === 'in_progress', fn (Builder $query) => $query->where('status', Task::STATUS_IN_PROGRESS)->where('complete', false))
            ->when($filter === 'done', fn (Builder $query) => $query->done());
    }

    private function applyTaskListOrdering(Builder|HasMany $query, string $filter): Builder|HasMany
    {
        if ($filter === 'all') {
            $query->orderByRaw(
                'case when (status = ? or complete = 1) then 2 when status = ? then 0 else 1 end',
                [Task::STATUS_DONE, Task::STATUS_IN_PROGRESS],
            );
        }

        return $query
            ->orderByRaw('case when deadline is null then 1 else 0 end')
            ->orderBy('deadline')
            ->orderByDesc('updated_at')
            ->orderByDesc('created_at')
            ->orderByDesc('id');
    }

    private function taskListMessage(LengthAwarePaginator $tasks, string $filter, \Illuminate\Support\Collection $numbered, string $timezone): string
    {
        $title = $this->filterLabel($filter);

        if ($tasks->isEmpty()) {
            return "📭 <b>{$title}</b>\n\nNo tasks here. Tap <b>➕ Add Task</b> to create one.";
        }

        $lines = $numbered
            ->map(fn (array $entry): string => $this->taskSummaryBlock($entry[0], $entry[1], $timezone, $filter === 'all'))
            ->implode("\n");

        $pagination = $tasks->lastPage() > 1
            ? "  ·  page {$tasks->currentPage()}/{$tasks->lastPage()}"
            : '';

        return "<b>{$title}</b>{$pagination}\n\n{$lines}";
    }

    private function taskListKeyboard(LengthAwarePaginator $tasks, string $filter, \Illuminate\Support\Collection $numbered): Keyboard
    {
        $keyboard = Keyboard::make();

        foreach ($numbered->chunk(2) as $chunk) {
            $keyboard = $keyboard->row($chunk
                ->map(fn (array $entry): Button => Button::make("{$entry[0]}. {$this->taskButtonTitle($entry[1])}")->action('showTask')->param('task_id', $entry[1]->id))
                ->values()
                ->all());
        }

        $pagination = [];

        if ($tasks->currentPage() > 1) {
            $pagination[] = Button::make('⬅️ Prev')->action('showTasks')->param('filter', $filter)->param('page', $tasks->currentPage() - 1);
        }

        if ($tasks->hasMorePages()) {
            $pagination[] = Button::make('Next ➡️')->action('showTasks')->param('filter', $filter)->param('page', $tasks->currentPage() + 1);
        }

        if ($pagination !== []) {
            $keyboard = $keyboard->row($pagination);
        }

        return $keyboard
            ->row([
                Button::make('➕ Add Task')->action('createTask'),
                Button::make('🏠 Main Menu')->action('mainMenu'),
            ]);
    }

    private function taskDetailKeyboard(Task $task): Keyboard
    {
        $keyboard = Keyboard::make();

        if (! $task->parent_id) {
            foreach ($task->subtasks->values()->chunk(2) as $chunk) {
                $keyboard = $keyboard->row($chunk
                    ->map(fn (Task $subtask, int $index): Button => Button::make($this->statusIcon($subtask).' '.$this->buttonTitle($subtask->title))->action('showTask')->param('task_id', $subtask->id))
                    ->values()
                    ->all());
            }

            $keyboard = $keyboard->row([
                Button::make('➕ Add Subtask')->action('createSubtask')->param('task_id', $task->id),
            ]);
        }

        $keyboard = $keyboard->row([
            Button::make('🔄 Change Status')->action('taskStatus')->param('task_id', $task->id),
            Button::make('📅 Set Deadline')->action('updateTaskDeadline')->param('task_id', $task->id),
        ]);

        if ($task->deadline) {
            $keyboard = $keyboard->row([
                Button::make('🗑 Clear Deadline')->action('clearTaskDeadline')->param('task_id', $task->id),
            ]);
        }

        $keyboard = $keyboard->row([
            Button::make('✏️ Update Description')->action('updateTaskDescription')->param('task_id', $task->id),
        ]);

        if ($task->description) {
            $keyboard = $keyboard->row([
                Button::make('🗑 Clear Description')->action('clearTaskDescription')->param('task_id', $task->id),
            ]);
        }

        return $keyboard
            ->row([
                Button::make('🗑 Delete Task')->action('confirmDeleteTask')->param('task_id', $task->id),
            ])
            ->row([
                Button::make('📋 All Tasks')->action('showTasks')->param('filter', 'all')->param('page', 1),
                Button::make('🏠 Main Menu')->action('mainMenu'),
            ]);
    }

    private function taskDetailMessage(Task $task, string $timezone): string
    {
        $lines = [
            $this->statusIcon($task).' <b>'.$this->escape($task->title).'</b>',
            '📌 Status: '.$this->statusLabel($task),
            '📆 Deadline: '.$this->deadlineLabel($task, $timezone),
        ];

        if ($task->parent) {
            $lines[] = '🔗 Subtask of: <i>'.$this->escape($task->parent->title).'</i>';
        }

        if ($task->description) {
            $lines[] = "\n".$this->escape($task->description);
        }

        if ($task->long_description) {
            $lines[] = "\n".$this->escape($task->long_description);
        }

        if ($task->subtasks->isNotEmpty()) {
            $lines[] = "\n📂 Subtasks:";
            foreach ($task->subtasks as $subtask) {
                $lines[] = '  '.$this->statusIcon($subtask).' '.$this->escape($subtask->title).' · '.$this->statusLabel($subtask);
            }
        }

        return implode("\n", $lines);
    }

    /**
     * @param  Collection<int, Task>  $warningTasks
     * @param  Collection<int, Task>  $dueTasks
     * @param  Collection<int, Task>  $overdueTasks
     */
    private function reminderMessage(Collection $warningTasks, Collection $dueTasks, Collection $overdueTasks, Carbon $today): string
    {
        $sections = ["<b>Task Reminders - {$today->toFormattedDateString()}</b>"];

        $sections[] = $this->reminderSection('🟡 Due today', $dueTasks);
        $sections[] = $this->reminderSection('🟠 Due tomorrow', $warningTasks);
        $sections[] = $this->reminderSection('🔴 Overdue', $overdueTasks);

        return collect($sections)->filter()->implode("\n\n");
    }

    /**
     * @param  Collection<int, Task>  $tasks
     */
    private function reminderSection(string $label, Collection $tasks): string
    {
        if ($tasks->isEmpty()) {
            return '';
        }

        $lines = $tasks
            ->take(10)
            ->map(fn (Task $task): string => '· '.$this->taskReminderLine($task))
            ->all();

        if ($tasks->count() > 10) {
            $lines[] = '+'.($tasks->count() - 10).' more';
        }

        return '<b>'.$label.' ('.$tasks->count().')</b>'."\n".implode("\n", $lines);
    }

    private function taskSummaryBlock(int $number, Task $task, string $timezone, bool $includeSubtasks): string
    {
        $lines = ["{$number}. {$this->statusIcon($task)} {$this->escape($task->title)} · {$this->deadlineLabel($task, $timezone)}"];

        if ($task->parent) {
            $lines[] = '   🔗 Subtask of: '.$this->escape($task->parent->title);
        }

        if ($includeSubtasks) {
            foreach ($task->subtasks as $subtask) {
                $lines[] = '   ↳ '.$this->statusIcon($subtask).' '.$this->escape($subtask->title).' · '.$this->deadlineLabel($subtask, $timezone);
            }
        }

        return implode("\n", $lines);
    }

    private function taskReminderLine(Task $task): string
    {
        $title = $this->escape($task->title);

        if ($task->parent) {
            return "{$title} (subtask of {$this->escape($task->parent->title)})";
        }

        return $title;
    }

    private function normalizeFilter(string $filter): string
    {
        return in_array($filter, ['all', 'due_today', 'due_tomorrow', 'overdue', 'open', 'in_progress', 'done'], true)
            ? $filter
            : 'all';
    }

    private function filterLabel(string $filter): string
    {
        return match ($filter) {
            'due_today' => 'Due Today',
            'due_tomorrow' => 'Due Tomorrow',
            'overdue' => 'Overdue',
            'open' => 'Open Tasks',
            'in_progress' => 'In Progress Tasks',
            'done' => 'Done Tasks',
            default => 'All Tasks',
        };
    }

    private function statusLabel(Task $task): string
    {
        return match ($task->status) {
            Task::STATUS_IN_PROGRESS => 'In Progress',
            Task::STATUS_DONE => 'Done',
            default => $task->complete ? 'Done' : 'Open',
        };
    }

    private function statusIcon(Task $task): string
    {
        return match ($task->status) {
            Task::STATUS_IN_PROGRESS => '⚡',
            Task::STATUS_DONE => '✅',
            default => $task->complete ? '✅' : '⬜',
        };
    }

    private function deadlineLabel(Task $task, string $timezone = 'Asia/Tehran'): string
    {
        if (! $task->deadline) {
            return 'no deadline';
        }

        $deadline = $task->deadline->copy()->timezone($timezone);
        $today = Carbon::now($timezone)->startOfDay();

        if ($deadline->lt($today)) {
            return '🔴 Overdue ('.$deadline->toFormattedDateString().')';
        }

        if ($deadline->isSameDay($today)) {
            return '🟡 Today';
        }

        if ($deadline->isSameDay($today->copy()->addDay())) {
            return '🟠 Tomorrow';
        }

        return $deadline->toFormattedDateString();
    }

    private function escape(?string $value): string
    {
        return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    private function buttonTitle(string $title): string
    {
        return Str::limit($title, 34);
    }

    private function taskButtonTitle(Task $task): string
    {
        $prefix = $task->parent_id ? 'Subtask: ' : '';

        return Str::limit($prefix.$task->title, 34);
    }
}
