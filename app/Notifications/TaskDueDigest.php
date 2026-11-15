<?php

namespace App\Notifications;

use App\Models\Task;
use App\Notifications\Channels\ResendChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

/**
 * One email listing every task that is due today, so a busy day does not
 * flood the inbox with a message per task.
 */
class TaskDueDigest extends Notification
{
    use Queueable;

    /**
     * @param  Collection<int, Task>  $tasks
     */
    public function __construct(private Collection $tasks)
    {
    }

    public function via(object $notifiable): array
    {
        return [ResendChannel::class];
    }

    /**
     * @return array<string, mixed>
     */
    public function toResend(object $notifiable): array
    {
        $count = $this->tasks->count();

        return [
            'from' => 'Mohi Portfolio <info@mohiebi.com>',
            'to' => [$notifiable->email],
            'subject' => $count === 1
                ? "Task due today: {$this->tasks->first()->title}"
                : "{$count} tasks due today",
            'html' => view('emails.task-deadline-reminder', [
                'deadlineDate' => $this->tasks->first()->deadline?->toDateString(),
                'tasks' => $this->tasks->map(fn (Task $task): array => [
                    'title' => $task->title,
                    'url' => route('taskmanager.show', ['taskmanager' => $task->reminderTargetTask()->id]),
                    'isSubtask' => $task->parent_id !== null,
                    'parentTitle' => $task->parent?->title,
                ])->values()->all(),
                'indexUrl' => route('taskmanager.index'),
            ])->render(),
        ];
    }
}
