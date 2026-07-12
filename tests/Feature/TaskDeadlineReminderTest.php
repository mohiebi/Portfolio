<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskDeadlineReminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Mockery;
use Resend\Laravel\Facades\Resend;
use Tests\TestCase;

class TaskDeadlineReminderTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_deadline_reminder_command_creates_warning_due_and_overdue_notifications_and_emails_only_due_tasks(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00'));
        $this->expectResendEmails(1);

        $user = $this->reminderUser();
        $warningTask = Task::factory()->for($user)->create([
            'title' => 'Tomorrow task',
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now()->addDay(),
        ]);
        $dueTask = Task::factory()->for($user)->create([
            'title' => 'Today task',
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);
        $overdueTask = Task::factory()->for($user)->create([
            'title' => 'Expired task',
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now()->subDay(),
        ]);

        $this->artisan('tasks:send-deadline-reminders')
            ->assertExitCode(0);

        $stages = $user->notifications()
            ->where('type', TaskDeadlineReminder::class)
            ->get()
            ->pluck('data.stage')
            ->sort()
            ->values()
            ->all();

        $this->assertSame([
            TaskDeadlineReminder::STAGE_DUE,
            TaskDeadlineReminder::STAGE_OVERDUE,
            TaskDeadlineReminder::STAGE_WARNING,
        ], $stages);
        $this->assertNotNull($warningTask->fresh()->deadline_warning_reminded_at);
        $this->assertNotNull($dueTask->fresh()->deadline_due_reminded_at);
        $this->assertNotNull($overdueTask->fresh()->deadline_overdue_reminded_at);
    }

    public function test_deadline_reminders_ignore_completed_null_and_future_tasks(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00'));
        $this->expectResendEmails(0);

        $user = $this->reminderUser();
        Task::factory()->for($user)->create([
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'deadline' => now(),
        ]);
        Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => null,
        ]);
        Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now()->addDays(2),
        ]);

        $this->artisan('tasks:send-deadline-reminders')
            ->assertExitCode(0);

        $this->assertSame(0, $user->notifications()->count());
    }

    public function test_deadline_reminders_do_not_duplicate_the_same_stage(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00'));
        $this->expectResendEmails(1);

        $user = $this->reminderUser();
        Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);

        $this->artisan('tasks:send-deadline-reminders')->assertExitCode(0);
        $this->artisan('tasks:send-deadline-reminders')
            ->assertExitCode(0);

        $this->assertSame(1, $user->notifications()->count());
    }

    public function test_changing_a_deadline_resets_reminder_tracking_and_allows_a_new_stage(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00'));
        $this->expectResendEmails(1);

        $user = $this->reminderUser();
        $task = Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);

        $this->artisan('tasks:send-deadline-reminders')->assertExitCode(0);
        $this->assertNotNull($task->fresh()->deadline_due_reminded_at);

        $task->update(['deadline' => now()->addDay()]);

        $task = $task->fresh();
        $this->assertNull($task->deadline_warning_reminded_at);
        $this->assertNull($task->deadline_due_reminded_at);
        $this->assertNull($task->deadline_overdue_reminded_at);

        $this->artisan('tasks:send-deadline-reminders')
            ->assertExitCode(0);

        $this->assertSame(2, $user->notifications()->count());
        $this->assertNotNull($task->fresh()->deadline_warning_reminded_at);
    }

    public function test_subtask_deadline_reminder_links_to_parent_task(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00'));
        $this->expectResendEmails(1);

        $user = $this->reminderUser();
        $parent = Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => null,
        ]);
        $subtask = Task::factory()->for($user)->create([
            'parent_id' => $parent->id,
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);

        $this->artisan('tasks:send-deadline-reminders')->assertExitCode(0);

        $notification = $user->notifications()->firstOrFail();

        $this->assertSame($subtask->id, $notification->data['task_id']);
        $this->assertSame($parent->id, $notification->data['parent_id']);
        $this->assertSame("/taskmanager/{$parent->id}", $notification->data['url']);
    }

    public function test_deadline_reminders_only_send_during_the_user_reminder_window(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00'));
        $this->expectResendEmails(1);

        $dueUser = $this->reminderUser();
        $laterUser = User::factory()->create([
            'task_reminder_time' => '11:00',
            'task_reminder_timezone' => '+00:00',
        ]);

        Task::factory()->for($dueUser)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);
        Task::factory()->for($laterUser)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);

        $this->artisan('tasks:send-deadline-reminders')
            ->assertExitCode(0);

        $this->assertSame(1, $dueUser->notifications()->count());
        $this->assertSame(0, $laterUser->notifications()->count());
    }

    public function test_profile_updates_task_reminder_schedule(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch('/profile/task-reminder-schedule', [
                'time' => '14:45',
                'timezone' => '+03:30',
            ])
            ->assertRedirect('/profile');

        $user = $user->fresh();

        $this->assertSame('14:45', $user->task_reminder_time);
        $this->assertSame('+03:30', $user->task_reminder_timezone);
    }

    private function expectResendEmails(int $times): void
    {
        $emails = Mockery::mock();
        $emails->shouldReceive('send')
            ->times($times)
            ->with(Mockery::on(fn (array $payload) => str_starts_with($payload['subject'] ?? '', 'Task due today:')));

        Resend::shouldReceive('emails')
            ->times($times)
            ->andReturn($emails);
    }

    private function reminderUser(): User
    {
        return User::factory()->create([
            'task_reminder_time' => '09:00',
            'task_reminder_timezone' => '+00:00',
        ]);
    }
}
