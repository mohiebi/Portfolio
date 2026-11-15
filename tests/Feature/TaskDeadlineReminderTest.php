<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskDeadlineReminder;
use App\Services\TaskDeadlineReminderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Mockery;
use Resend\Laravel\Facades\Resend;
use RuntimeException;
use Tests\TestCase;

class TaskDeadlineReminderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var list<array<string, mixed>>
     */
    private array $sentEmails = [];

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

        $this->assertCount(1, $this->sentEmails);
        $this->assertSame('Task due today: Today task', $this->sentEmails[0]['subject']);
        $this->assertStringContainsString('Today task', $this->sentEmails[0]['html']);
        $this->assertStringNotContainsString('Tomorrow task', $this->sentEmails[0]['html']);
        $this->assertStringNotContainsString('Expired task', $this->sentEmails[0]['html']);
    }

    public function test_all_tasks_due_today_are_grouped_into_a_single_email(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00'));
        $this->expectResendEmails(1);

        $user = $this->reminderUser();
        $parent = Task::factory()->for($user)->create([
            'title' => 'Record GTA V',
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => null,
        ]);
        $dueTasks = collect([
            Task::factory()->for($user)->create([
                'title' => 'Fix <b>escaping</b>',
                'complete' => false,
                'status' => Task::STATUS_OPEN,
                'deadline' => now(),
            ]),
            Task::factory()->for($user)->create([
                'title' => 'Studio checks',
                'complete' => false,
                'status' => Task::STATUS_OPEN,
                'deadline' => now(),
            ]),
            Task::factory()->for($user)->create([
                'parent_id' => $parent->id,
                'title' => 'Swamp scene',
                'complete' => false,
                'status' => Task::STATUS_OPEN,
                'deadline' => now(),
            ]),
        ]);

        $this->artisan('tasks:send-deadline-reminders')
            ->expectsOutputToContain('Sent 3 task deadline reminder(s).')
            ->assertExitCode(0);

        $this->assertCount(1, $this->sentEmails);

        $email = $this->sentEmails[0];

        $this->assertSame([$user->email], $email['to']);
        $this->assertSame('3 tasks due today', $email['subject']);
        $this->assertStringContainsString('3 tasks are due today', $email['html']);
        $this->assertStringContainsString('Fix &lt;b&gt;escaping&lt;/b&gt;', $email['html']);
        $this->assertStringContainsString('Studio checks', $email['html']);
        $this->assertStringContainsString('Swamp scene', $email['html']);
        $this->assertStringContainsString('Subtask of Record GTA V', $email['html']);
        $this->assertStringContainsString(route('taskmanager.show', ['taskmanager' => $parent->id]), $email['html']);
        $this->assertStringContainsString(route('taskmanager.index'), $email['html']);

        $this->assertSame(3, $user->notifications()->count());
        $dueTasks->each(fn (Task $task) => $this->assertNotNull($task->fresh()->deadline_due_reminded_at));
    }

    public function test_each_user_receives_their_own_grouped_email(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00'));
        $this->expectResendEmails(2);

        $firstUser = $this->reminderUser();
        $secondUser = $this->reminderUser();

        foreach ([[$firstUser, 'First A'], [$firstUser, 'First B'], [$secondUser, 'Second A'], [$secondUser, 'Second B']] as [$user, $title]) {
            Task::factory()->for($user)->create([
                'title' => $title,
                'complete' => false,
                'status' => Task::STATUS_OPEN,
                'deadline' => now(),
            ]);
        }

        $this->artisan('tasks:send-deadline-reminders')->assertExitCode(0);

        $emailsByRecipient = collect($this->sentEmails)->keyBy(fn (array $email) => $email['to'][0]);

        $this->assertCount(2, $emailsByRecipient);
        $this->assertStringContainsString('First A', $emailsByRecipient[$firstUser->email]['html']);
        $this->assertStringContainsString('First B', $emailsByRecipient[$firstUser->email]['html']);
        $this->assertStringNotContainsString('Second', $emailsByRecipient[$firstUser->email]['html']);
        $this->assertStringContainsString('Second A', $emailsByRecipient[$secondUser->email]['html']);
        $this->assertStringContainsString('Second B', $emailsByRecipient[$secondUser->email]['html']);
        $this->assertStringNotContainsString('First', $emailsByRecipient[$secondUser->email]['html']);
    }

    public function test_tasks_stay_unreminded_when_the_grouped_email_fails_to_send(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00'));

        $emails = Mockery::mock();
        $emails->shouldReceive('send')->once()->andThrow(new RuntimeException('Resend is down'));
        Resend::shouldReceive('emails')->once()->andReturn($emails);

        $user = $this->reminderUser();
        $task = Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'deadline' => now(),
        ]);

        try {
            app(TaskDeadlineReminderService::class)->sendDueReminders();
            $this->fail('The failed email should have surfaced.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Resend is down', $exception->getMessage());
        }

        $this->assertNull($task->fresh()->deadline_due_reminded_at);
        $this->assertSame(0, $user->notifications()->count());
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
            ->andReturnUsing(function (array $payload): void {
                $this->sentEmails[] = $payload;
            });

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
