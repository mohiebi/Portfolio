<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskDeadlineReminder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class TaskDeadlineReminderService
{
    public function sendDueReminders(?Carbon $now = null): int
    {
        $now = $now ?? now();
        $sent = 0;

        User::query()
            ->whereHas('tasks', fn (Builder $query) => $this->applyActiveDeadlineTaskConstraints($query))
            ->orderBy('id')
            ->chunkById(100, function ($users) use ($now, &$sent): void {
                foreach ($users as $user) {
                    if (! $user->isTaskReminderDueAt($now)) {
                        continue;
                    }

                    $today = $user->taskReminderDate($now);

                    $sent += $this->sendStage(
                        $user,
                        TaskDeadlineReminder::STAGE_WARNING,
                        'deadline_warning_reminded_at',
                        fn ($query) => $query->whereDate('deadline', $today->copy()->addDay()->toDateString()),
                    );
                    $sent += $this->sendStage(
                        $user,
                        TaskDeadlineReminder::STAGE_DUE,
                        'deadline_due_reminded_at',
                        fn ($query) => $query->whereDate('deadline', $today->toDateString()),
                    );
                    $sent += $this->sendStage(
                        $user,
                        TaskDeadlineReminder::STAGE_OVERDUE,
                        'deadline_overdue_reminded_at',
                        fn ($query) => $query->whereDate('deadline', '<', $today->toDateString()),
                    );
                }
            });

        return $sent;
    }

    /**
     * @param  callable(mixed): mixed  $deadlineConstraint
     */
    private function sendStage(User $user, string $stage, string $remindedAtColumn, callable $deadlineConstraint): int
    {
        $sent = 0;
        $now = now();

        $deadlineConstraint($this->applyActiveDeadlineTaskConstraints($user->tasks()))
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

    private function applyActiveDeadlineTaskConstraints($query)
    {
        return $query
            ->where('complete', false)
            ->where(function (Builder $query) {
                $query->whereNull('status')
                    ->orWhere('status', '!=', Task::STATUS_DONE);
            })
            ->whereNotNull('deadline');
    }
}
