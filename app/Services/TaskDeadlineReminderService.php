<?php

namespace App\Services;

use App\Models\Task;
use App\Notifications\TaskDeadlineReminder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class TaskDeadlineReminderService
{
    public function sendDueReminders(?Carbon $today = null): int
    {
        $today = ($today ?? now())->copy()->startOfDay();

        return $this->sendStage(
            TaskDeadlineReminder::STAGE_WARNING,
            'deadline_warning_reminded_at',
            fn (Builder $query) => $query->whereDate('deadline', $today->copy()->addDay()->toDateString()),
        ) + $this->sendStage(
            TaskDeadlineReminder::STAGE_DUE,
            'deadline_due_reminded_at',
            fn (Builder $query) => $query->whereDate('deadline', $today->toDateString()),
        ) + $this->sendStage(
            TaskDeadlineReminder::STAGE_OVERDUE,
            'deadline_overdue_reminded_at',
            fn (Builder $query) => $query->whereDate('deadline', '<', $today->toDateString()),
        );
    }

    /**
     * @param callable(Builder): Builder $deadlineConstraint
     */
    private function sendStage(string $stage, string $remindedAtColumn, callable $deadlineConstraint): int
    {
        $sent = 0;
        $now = now();

        $deadlineConstraint($this->activeDeadlineTasks())
            ->whereNull($remindedAtColumn)
            ->with(['parent', 'user'])
            ->orderBy('id')
            ->chunkById(100, function ($tasks) use ($stage, $remindedAtColumn, $now, &$sent) {
                foreach ($tasks as $task) {
                    if (! $task->user) {
                        continue;
                    }

                    $task->user->notify(new TaskDeadlineReminder($task, $stage));
                    try {
                        $task->timestamps = false;
                        $task->forceFill([$remindedAtColumn => $now])->saveQuietly();
                    } finally {
                        $task->timestamps = true;
                    }
                    $sent++;
                }
            });

        return $sent;
    }

    private function activeDeadlineTasks(): Builder
    {
        return Task::query()
            ->where('complete', false)
            ->where(function (Builder $query) {
                $query->whereNull('status')
                    ->orWhere('status', '!=', Task::STATUS_DONE);
            })
            ->whereNotNull('deadline');
    }
}
