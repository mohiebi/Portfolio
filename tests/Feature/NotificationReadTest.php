<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskDeadlineReminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationReadTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_mark_their_own_notification_as_read(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);

        $user->notify(new TaskDeadlineReminder($task, TaskDeadlineReminder::STAGE_DUE));

        $notification = $user->notifications()->firstOrFail();

        $this->actingAs($user)
            ->put(route('notification.seen', ['notification' => $notification->id]))
            ->assertRedirect();

        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_user_cannot_mark_another_users_notification_as_read(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $task = Task::factory()->for($otherUser)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);

        $otherUser->notify(new TaskDeadlineReminder($task, TaskDeadlineReminder::STAGE_DUE));

        $notification = $otherUser->notifications()->firstOrFail();

        $this->actingAs($user)
            ->put(route('notification.seen', ['notification' => $notification->id]))
            ->assertForbidden();

        $this->assertNull($notification->fresh()->read_at);
    }
}
