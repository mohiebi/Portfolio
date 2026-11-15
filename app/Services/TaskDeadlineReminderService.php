<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskDeadlineReminder;
use App\Notifications\TaskDueDigest;
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
        $tasks = $deadlineConstraint($this->applyActiveDeadlineTaskConstraints($user->tasks()))
            ->whereNull($remindedAtColumn)
            ->with('parent')
            ->orderBy('id')
            ->get();

        if ($tasks->isEmpty()) {
            return 0;
        }

        // One email per user listing every task due today. It goes out before the
        // tasks are marked as reminded, so a failed send is retried on the next run.
        if ($stage === TaskDeadlineReminder::STAGE_DUE) {
            $user->notify(new TaskDueDigest($tasks));
        }

        $now = now();

        foreach ($tasks as $task) {
            $user->notify(new TaskDeadlineReminder($task, $stage));

            try {
                $task->timestamps = false;
                $task->forceFill([$remindedAtColumn => $now])->saveQuietly();
            } finally {
                $task->timestamps = true;
            }
        }

        return $tasks->count();
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
