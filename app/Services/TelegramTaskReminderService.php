<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TelegramConnection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class TelegramTaskReminderService
{
    public function __construct(private readonly TelegramTaskBotService $botService)
    {
    }

    public function sendDueReminders(?Carbon $today = null): int
    {
        $today = ($today ?? Carbon::now('Asia/Tehran'))->copy()->timezone('Asia/Tehran')->startOfDay();
        $sentMessages = 0;

        TelegramConnection::query()
            ->whereNotNull('connected_at')
            ->where('reminders_enabled', true)
            ->whereNotNull('telegraph_chat_id')
            ->with(['telegraphChat', 'user'])
            ->orderBy('id')
            ->chunkById(50, function ($connections) use ($today, &$sentMessages): void {
                foreach ($connections as $connection) {
                    if (! $connection->user || ! $connection->telegraphChat) {
                        continue;
                    }

                    $warningTasks = $this->tasksFor($connection, 'telegram_warning_reminded_at', fn ($query) => $query->whereDate('deadline', $today->copy()->addDay()->toDateString()));
                    $dueTasks = $this->tasksFor($connection, 'telegram_due_reminded_at', fn ($query) => $query->whereDate('deadline', $today->toDateString()));
                    $overdueTasks = $this->tasksFor($connection, 'telegram_overdue_reminded_at', fn ($query) => $query->whereDate('deadline', '<', $today->toDateString()));

                    if ($warningTasks->isEmpty() && $dueTasks->isEmpty() && $overdueTasks->isEmpty()) {
                        continue;
                    }

                    $this->botService->sendReminderMessage($connection->telegraphChat, $warningTasks, $dueTasks, $overdueTasks, $today);

                    $now = now();
                    $this->markReminded($warningTasks, 'telegram_warning_reminded_at', $now);
                    $this->markReminded($dueTasks, 'telegram_due_reminded_at', $now);
                    $this->markReminded($overdueTasks, 'telegram_overdue_reminded_at', $now);

                    $sentMessages++;
                }
            });

        return $sentMessages;
    }

    /**
     * @param  callable(mixed): mixed  $deadlineConstraint
     * @return Collection<int, Task>
     */
    private function tasksFor(TelegramConnection $connection, string $remindedAtColumn, callable $deadlineConstraint): Collection
    {
        return $deadlineConstraint($connection->user->tasks()
            ->where('complete', false)
            ->where(function (Builder $query) {
                $query->whereNull('status')
                    ->orWhere('status', '!=', Task::STATUS_DONE);
            })
            ->whereNotNull('deadline')
            ->whereNull($remindedAtColumn)
            ->with('parent')
            ->orderBy('deadline')
            ->orderBy('id'))
            ->get();
    }

    /**
     * @param  Collection<int, Task>  $tasks
     */
    private function markReminded(Collection $tasks, string $column, Carbon $sentAt): void
    {
        $tasks->each(function (Task $task) use ($column, $sentAt): void {
            try {
                $task->timestamps = false;
                $task->forceFill([$column => $sentAt])->saveQuietly();
            } finally {
                $task->timestamps = true;
            }
        });
    }
}
