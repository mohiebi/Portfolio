<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskDeadlineReminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Resend\Laravel\Facades\Resend;
use Tests\TestCase;

class NotificationReadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $emails = Mockery::mock();
        $emails->shouldReceive('send')->zeroOrMoreTimes();

        Resend::shouldReceive('emails')
            ->zeroOrMoreTimes()
            ->andReturn($emails);
    }

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

    public function test_user_can_mark_all_their_notifications_as_read(): void
    {
        $user = User::factory()->create();

        foreach (range(1, 3) as $ignored) {
            $task = Task::factory()->for($user)->create([
                'complete' => false,
                'status' => Task::STATUS_OPEN,
                'deadline' => now(),
            ]);

            $user->notify(new TaskDeadlineReminder($task, TaskDeadlineReminder::STAGE_DUE));
        }

        $this->assertSame(3, $user->unreadNotifications()->count());

        $this->actingAs($user)
            ->put(route('notification.seen-all'))
            ->assertRedirect();

        $this->assertSame(0, $user->unreadNotifications()->count());
        $this->assertSame(3, $user->notifications()->whereNotNull('read_at')->count());
    }

    public function test_marking_all_as_read_does_not_touch_another_users_notifications(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $task = Task::factory()->for($otherUser)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);

        $otherUser->notify(new TaskDeadlineReminder($task, TaskDeadlineReminder::STAGE_DUE));

        $this->actingAs($user)
            ->put(route('notification.seen-all'))
            ->assertRedirect();

        $this->assertSame(1, $otherUser->unreadNotifications()->count());
    }

    public function test_marking_all_as_read_keeps_the_original_read_timestamp(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);

        $user->notify(new TaskDeadlineReminder($task, TaskDeadlineReminder::STAGE_DUE));

        $notification = $user->notifications()->firstOrFail();
        $notification->markAsRead();
        $readAt = $notification->fresh()->read_at;

        $this->travel(1)->hour();

        $this->actingAs($user)
            ->put(route('notification.seen-all'))
            ->assertRedirect();

        $this->assertTrue($notification->fresh()->read_at->equalTo($readAt));
    }

    public function test_guest_cannot_mark_all_notifications_as_read(): void
    {
        $this->put(route('notification.seen-all'))
            ->assertRedirect(route('login'));
    }
}
