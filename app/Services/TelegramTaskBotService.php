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
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class TelegramTaskBotService
{
    private const PAGE_SIZE = 6;

    public function sendMainMenu(TelegraphChat $chat, ?TelegramConnection $connection = null, ?int $editMessageId = null): void
    {
        $name = $connection?->user?->name;
        $message = $name
            ? "👋 Hello, <b>{$this->escape($name)}</b>!\n\nWhat would you like to view?"
            : "🔗 <b>Not connected yet.</b>\n\nPlease connect this Telegram chat from your profile page to get started.";

        $this->reply($chat, $editMessageId, $message, $connection?->isConnected() ? $this->mainMenuKeyboard() : Keyboard::make());
    }

    public function sendSettings(TelegraphChat $chat, TelegramConnection $connection, ?int $editMessageId = null): void
    {
        $remindersIcon = $connection->reminders_enabled ? '🔔' : '🔕';
        $remindersLabel = $connection->reminders_enabled ? 'Enabled' : 'Disabled';
        $username = $connection->telegram_username ? '@'.$connection->telegram_username : 'this chat';

        $this->reply(
            $chat,
            $editMessageId,
            "⚙️ <b>Settings</b>\n\n".
            "👤 Connected as: <b>{$this->escape($username)}</b>\n".
            "{$remindersIcon} Daily reminders: <b>{$remindersLabel}</b>",
            Keyboard::make()->row([
                Button::make('📋 All Tasks')->action('showTasks')->param('filter', 'all')->param('page', 1),
                Button::make('🏠 Main Menu')->action('mainMenu'),
            ])
        );
    }

    public function sendTaskList(TelegraphChat $chat, User $user, string $filter = 'all', int $page = 1, ?int $editMessageId = null): void
    {
        $filter = $this->normalizeFilter($filter);
        $page = max(1, $page);

        $tasks = $this->taskQuery($user, $filter)
            ->with('parent')
            ->orderByRaw('parent_id is null desc')
            ->orderBy('deadline')
            ->orderByDesc('created_at')
            ->paginate(self::PAGE_SIZE, ['*'], 'page', $page);

        $this->reply($chat, $editMessageId, $this->taskListMessage($tasks, $filter), $this->taskListKeyboard($tasks, $filter));
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
            $this->taskDetailMessage($task),
            Keyboard::make()->row([
                Button::make('📋 All Tasks')->action('showTasks')->param('filter', 'all')->param('page', 1),
                Button::make('🏠 Main Menu')->action('mainMenu'),
            ])
        );
    }

    private function reply(TelegraphChat $chat, ?int $editMessageId, string $html, Keyboard $keyboard): void
    {
        if ($editMessageId !== null) {
            $chat->edit($editMessageId)->html($html)->keyboard($keyboard)->send();
        } else {
            $chat->html($html)->keyboard($keyboard)->send();
        }
    }

    public function mainMenuKeyboard(): Keyboard
    {
        return Keyboard::make()
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
                ]))
            ->send();
    }

    private function taskQuery(User $user, string $filter)
    {
        $today = Carbon::now('Asia/Tehran')->startOfDay();

        return $user->tasks()
            ->when($filter === 'due_today', fn (Builder $query) => $query->whereDate('deadline', $today->toDateString()))
            ->when($filter === 'due_tomorrow', fn (Builder $query) => $query->whereDate('deadline', $today->copy()->addDay()->toDateString()))
            ->when($filter === 'overdue', fn (Builder $query) => $query->whereDate('deadline', '<', $today->toDateString()))
            ->when($filter === 'open', fn (Builder $query) => $query->where('status', Task::STATUS_OPEN)->where('complete', false))
            ->when($filter === 'in_progress', fn (Builder $query) => $query->where('status', Task::STATUS_IN_PROGRESS)->where('complete', false))
            ->when($filter === 'done', fn (Builder $query) => $query->done());
    }

    private function taskListMessage(LengthAwarePaginator $tasks, string $filter): string
    {
        $title = $this->filterLabel($filter);

        if ($tasks->isEmpty()) {
            return "📭 <b>{$title}</b>\n\nNo tasks found.";
        }

        $lines = $tasks->getCollection()
            ->map(fn (Task $task): string => $this->taskSummaryLine($task))
            ->implode("\n");

        $pagination = $tasks->lastPage() > 1
            ? " · page {$tasks->currentPage()}/{$tasks->lastPage()}"
            : '';

        return "<b>{$title}</b>{$pagination}\n\n{$lines}";
    }

    private function taskListKeyboard(LengthAwarePaginator $tasks, string $filter): Keyboard
    {
        $keyboard = Keyboard::make();

        foreach ($tasks->getCollection()->chunk(2) as $chunk) {
            $keyboard = $keyboard->row($chunk
                ->map(fn (Task $task): Button => Button::make("#{$task->id} {$this->statusIcon($task)}")->action('showTask')->param('task_id', $task->id))
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

        return $keyboard->row([
            Button::make('🏠 Main Menu')->action('mainMenu'),
        ]);
    }

    private function taskDetailMessage(Task $task): string
    {
        $lines = [
            $this->statusIcon($task).' <b>'.$this->escape($task->title).'</b>',
            '📌 Status: '.$this->statusLabel($task),
            '📆 Deadline: '.$this->deadlineLabel($task),
        ];

        if ($task->parent) {
            $lines[] = '🔗 Subtask of: '.$this->escape($task->parent->title);
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
                $lines[] = $this->statusIcon($subtask).' '.$this->escape($subtask->title).' — '.$this->statusLabel($subtask);
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
        $sections = ["🔔 <b>Task Reminders — {$today->toFormattedDateString()}</b>"];

        $sections[] = $this->reminderSection('📅 Due today', $dueTasks);
        $sections[] = $this->reminderSection('🗓 Due tomorrow', $warningTasks);
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
            ->map(fn (Task $task): string => '- '.$this->taskReminderLine($task))
            ->all();

        if ($tasks->count() > 10) {
            $lines[] = '+'.($tasks->count() - 10).' more';
        }

        return '<b>'.$label.' ('.$tasks->count().')</b>'."\n".implode("\n", $lines);
    }

    private function taskSummaryLine(Task $task): string
    {
        $subtask = $task->parent_id ? ' ↳' : '';

        return $this->statusIcon($task).$subtask.' <b>#'.$task->id.'</b> '.$this->escape($task->title).' · '.$this->deadlineLabel($task);
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
            default => $task->complete ? '✅' : '🔵',
        };
    }

    private function deadlineLabel(Task $task): string
    {
        if (! $task->deadline) {
            return 'no deadline';
        }

        $deadline = $task->deadline->copy()->timezone('Asia/Tehran');
        $today = Carbon::now('Asia/Tehran')->startOfDay();

        if ($deadline->lt($today)) {
            return '🔴 '.$deadline->toFormattedDateString();
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
}
