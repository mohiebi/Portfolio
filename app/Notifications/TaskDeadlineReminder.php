<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskDeadlineReminder extends Notification
{
    use Queueable;

    public const STAGE_WARNING = 'warning';
    public const STAGE_DUE = 'due';
    public const STAGE_OVERDUE = 'overdue';

    public function __construct(
        private Task $task,
        private string $stage,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Shared payload shape for current database notifications and future channels.
     *
     * @return array<string, mixed>
     */
    public function reminderPayload(): array
    {
        $targetTask = $this->task->reminderTargetTask();

        return [
            'task_id' => $this->task->id,
            'parent_id' => $this->task->parent_id,
            'title' => $this->task->title,
            'deadline_date' => $this->task->deadline?->toDateString(),
            'stage' => $this->stage,
            'url' => route('taskmanager.show', ['taskmanager' => $targetTask->id], false),
            'message' => $this->message(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return $this->reminderPayload();
    }

    private function message(): string
    {
        return match ($this->stage) {
            self::STAGE_WARNING => "Task due tomorrow: {$this->task->title}",
            self::STAGE_DUE => "Task due today: {$this->task->title}",
            self::STAGE_OVERDUE => "Task overdue: {$this->task->title}",
            default => "Task reminder: {$this->task->title}",
        };
    }
}
