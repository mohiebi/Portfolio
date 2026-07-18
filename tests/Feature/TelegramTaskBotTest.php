<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\TelegramConnection;
use App\Models\User;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Models\TelegraphBot;
use DefStudio\Telegraph\Models\TelegraphChat;
use DefStudio\Telegraph\Telegraph as TelegraphClient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class TelegramTaskBotTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        Cache::flush();

        parent::tearDown();
    }

    public function test_profile_shows_telegram_connection_state(): void
    {
        config(['services.telegram.bot_username' => 'task_bot']);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/profile')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Profile/Edit')
                ->where('telegram.connected', false)
                ->where('telegram.bot_username', 'task_bot')
                ->where('taskReminderSchedule.time', User::DEFAULT_TASK_REMINDER_TIME)
                ->where('taskReminderSchedule.timezone', User::DEFAULT_TASK_REMINDER_TIMEZONE));
    }

    public function test_connect_route_creates_link_token_and_redirects_to_telegram(): void
    {
        config(['services.telegram.bot_username' => 'task_bot']);

        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post('/profile/telegram/connect');

        $response->assertStatus(302);
        $response->assertHeader('Location');

        $connection = $user->telegramConnection()->firstOrFail();

        $this->assertNotNull($connection->link_token_hash);
        $this->assertNotNull($connection->link_token_expires_at);
        $this->assertStringStartsWith('https://t.me/task_bot?start=', $response->headers->get('Location'));
    }

    public function test_start_token_links_telegram_chat_to_user(): void
    {
        Telegraph::fake();

        $bot = TelegraphBot::create(['token' => 'bot-token', 'name' => 'Task Bot']);
        $user = User::factory()->create(['name' => 'Mohammad']);
        $token = 'valid-token';
        TelegramConnection::create([
            'user_id' => $user->id,
            'link_token_hash' => hash('sha256', $token),
            'link_token_expires_at' => now()->addMinutes(10),
        ]);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->messagePayload('/start '.$token))
            ->assertNoContent();

        $connection = $user->telegramConnection()->firstOrFail();

        $this->assertNotNull($connection->connected_at);
        $this->assertSame('987654', $connection->telegram_chat_id);
        $this->assertSame('444', $connection->telegram_user_id);
        $this->assertSame('john_smith', $connection->telegram_username);

        Telegraph::assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'text' => 'TaskManager is connected',
        ], false);
    }

    public function test_invalid_start_token_is_rejected(): void
    {
        Telegraph::fake();

        $bot = TelegraphBot::create(['token' => 'bot-token', 'name' => 'Task Bot']);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->messagePayload('/start bad-token'))
            ->assertNoContent();

        Telegraph::assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'text' => 'invalid or expired',
        ], false);
    }

    public function test_unlinked_chat_cannot_view_task_lists(): void
    {
        Telegraph::fake();

        [$bot, $chat] = $this->botAndChat();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, 'action:showTasks;filter:all;page:1'))
            ->assertNoContent();

        Telegraph::assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'text' => 'Not connected yet',
        ], false);
    }

    public function test_menu_buttons_show_filtered_task_lists(): void
    {
        Telegraph::fake();
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00', 'Asia/Tehran'));

        [$bot, $chat, $user] = $this->connectedUser();
        Task::factory()->for($user)->create([
            'title' => 'Today reminder task',
            'status' => Task::STATUS_OPEN,
            'complete' => false,
            'deadline' => now('Asia/Tehran'),
        ]);
        Task::factory()->for($user)->create([
            'title' => 'Progress task',
            'status' => Task::STATUS_IN_PROGRESS,
            'complete' => false,
            'deadline' => now('Asia/Tehran')->addDays(5),
        ]);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, 'action:showTasks;filter:due_today;page:1'))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, 'action:showTasks;filter:in_progress;page:1'))
            ->assertNoContent();

        Telegraph::assertSentData(TelegraphClient::ENDPOINT_EDIT_MESSAGE, ['text' => 'Today reminder task'], false);
        Telegraph::assertSentData(TelegraphClient::ENDPOINT_EDIT_MESSAGE, ['text' => 'Progress task'], false);
    }

    public function test_task_detail_is_scoped_to_linked_user(): void
    {
        Telegraph::fake();

        [$bot, $chat, $user] = $this->connectedUser();
        $otherUser = User::factory()->create();
        $otherTask = Task::factory()->for($otherUser)->create(['title' => 'Hidden task']);
        $ownTask = Task::factory()->for($user)->create(['title' => 'Visible task']);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:showTask;task_id:{$otherTask->id}"))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:showTask;task_id:{$ownTask->id}"))
            ->assertNoContent();

        Telegraph::assertSentData(TelegraphClient::ENDPOINT_EDIT_MESSAGE, ['text' => 'Task not found'], false);
        Telegraph::assertSentData(TelegraphClient::ENDPOINT_EDIT_MESSAGE, ['text' => 'Visible task'], false);
    }

    public function test_telegram_creates_task_with_optional_deadline_skip(): void
    {
        Telegraph::fake();

        [$bot, $chat, $user] = $this->connectedUser();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, 'action:createTask'))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->messagePayload('Telegram created task'))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, 'action:skipCreateDeadline'))
            ->assertNoContent();

        $task = $user->tasks()->where('title', 'Telegram created task')->firstOrFail();

        $this->assertNull($task->deadline);
        $this->assertSame('', $task->description);
        $this->assertSame(Task::STATUS_OPEN, $task->status);
        $this->assertFalse($task->complete);
    }

    public function test_telegram_creates_task_with_deadline_after_title_prompt(): void
    {
        Telegraph::fake();
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00', 'Asia/Tehran'));

        [$bot, $chat, $user] = $this->connectedUser();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, 'action:createTask'))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->messagePayload('Task with deadline'))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->messagePayload('2026-07-20'))
            ->assertNoContent();

        $task = $user->tasks()->where('title', 'Task with deadline')->firstOrFail();

        $this->assertSame('2026-07-20', $task->deadline->timezone($user->taskReminderTimezone())->toDateString());
    }

    public function test_telegram_creates_subtask_from_parent_detail(): void
    {
        Telegraph::fake();

        [$bot, $chat, $user] = $this->connectedUser();
        $parent = Task::factory()->for($user)->create([
            'title' => 'Parent task',
            'status' => Task::STATUS_OPEN,
            'complete' => false,
        ]);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:createSubtask;task_id:{$parent->id}"))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->messagePayload('Telegram subtask'))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, 'action:skipCreateDeadline'))
            ->assertNoContent();

        $subtask = $user->tasks()->where('title', 'Telegram subtask')->firstOrFail();

        $this->assertSame($parent->id, $subtask->parent_id);
        $this->assertNull($subtask->deadline);
    }

    public function test_telegram_updates_parent_and_subtask_statuses(): void
    {
        Telegraph::fake();

        [$bot, $chat, $user] = $this->connectedUser();
        $parent = Task::factory()->for($user)->create([
            'status' => Task::STATUS_OPEN,
            'complete' => false,
        ]);
        $subtask = Task::factory()->for($user)->create([
            'parent_id' => $parent->id,
            'status' => Task::STATUS_OPEN,
            'complete' => false,
        ]);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:setTaskStatus;task_id:{$subtask->id};status:done"))
            ->assertNoContent();

        $this->assertSame(Task::STATUS_DONE, $subtask->fresh()->status);
        $this->assertSame(Task::STATUS_DONE, $parent->fresh()->status);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:setTaskStatus;task_id:{$parent->id};status:open"))
            ->assertNoContent();

        $this->assertSame(Task::STATUS_OPEN, $parent->fresh()->status);
        $this->assertSame(Task::STATUS_OPEN, $subtask->fresh()->status);
    }

    public function test_telegram_updates_and_clears_deadline(): void
    {
        Telegraph::fake();

        [$bot, $chat, $user] = $this->connectedUser();
        $task = Task::factory()->for($user)->create([
            'deadline' => now(),
            'telegram_due_reminded_at' => now(),
        ]);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:updateTaskDeadline;task_id:{$task->id}"))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->messagePayload('2026-07-21'))
            ->assertNoContent();

        $task = $task->fresh();
        $this->assertSame('2026-07-21', $task->deadline->timezone($user->taskReminderTimezone())->toDateString());
        $this->assertNull($task->telegram_due_reminded_at);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:clearTaskDeadline;task_id:{$task->id}"))
            ->assertNoContent();

        $this->assertNull($task->fresh()->deadline);
    }

    public function test_telegram_updates_and_clears_description(): void
    {
        Telegraph::fake();

        [$bot, $chat, $user] = $this->connectedUser();
        $task = Task::factory()->for($user)->create([
            'description' => '',
        ]);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:updateTaskDescription;task_id:{$task->id}"))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->messagePayload('Updated from Telegram'))
            ->assertNoContent();

        $this->assertSame('Updated from Telegram', $task->fresh()->description);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:clearTaskDescription;task_id:{$task->id}"))
            ->assertNoContent();

        $this->assertSame('', $task->fresh()->description);
    }

    public function test_telegram_deletes_task_only_after_confirmation(): void
    {
        Telegraph::fake();

        [$bot, $chat, $user] = $this->connectedUser();
        $task = Task::factory()->for($user)->create();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:confirmDeleteTask;task_id:{$task->id}"))
            ->assertNoContent();

        $this->assertModelExists($task);

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, "action:deleteTask;task_id:{$task->id}"))
            ->assertNoContent();

        $this->assertModelMissing($task);
    }

    public function test_telegram_updates_reminder_hour_without_changing_timezone(): void
    {
        Telegraph::fake();

        [$bot, $chat, $user] = $this->connectedUser(reminderTime: '09:00', reminderTimezone: '+03:30');

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload($chat, 'action:updateReminderHour'))
            ->assertNoContent();
        $this->postJson("/telegraph/{$bot->token}/webhook", $this->messagePayload('14'))
            ->assertNoContent();

        $user = $user->fresh();

        $this->assertSame('14:00', $user->task_reminder_time);
        $this->assertSame('+03:30', $user->task_reminder_timezone);
    }

    public function test_grouped_telegram_reminders_send_once_for_all_due_stages(): void
    {
        Telegraph::fake();
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00', 'Asia/Tehran'));

        [, , $user] = $this->connectedUser();
        $warningTask = Task::factory()->for($user)->create([
            'title' => 'Tomorrow task',
            'status' => Task::STATUS_OPEN,
            'complete' => false,
            'deadline' => now('Asia/Tehran')->addDay(),
        ]);
        $dueTask = Task::factory()->for($user)->create([
            'title' => 'Today task',
            'status' => Task::STATUS_OPEN,
            'complete' => false,
            'deadline' => now('Asia/Tehran'),
        ]);
        $overdueTask = Task::factory()->for($user)->create([
            'title' => 'Overdue task',
            'status' => Task::STATUS_OPEN,
            'complete' => false,
            'deadline' => now('Asia/Tehran')->subDay(),
        ]);

        $this->artisan('tasks:send-telegram-reminders')->assertExitCode(0);

        Telegraph::assertSentData(TelegraphClient::ENDPOINT_MESSAGE, ['text' => 'Due today'], false);
        Telegraph::assertSentData(TelegraphClient::ENDPOINT_MESSAGE, ['text' => 'Due tomorrow'], false);
        Telegraph::assertSentData(TelegraphClient::ENDPOINT_MESSAGE, ['text' => 'Overdue'], false);

        $this->assertNotNull($warningTask->fresh()->telegram_warning_reminded_at);
        $this->assertNotNull($dueTask->fresh()->telegram_due_reminded_at);
        $this->assertNotNull($overdueTask->fresh()->telegram_overdue_reminded_at);

        Telegraph::fake();
        $this->artisan('tasks:send-telegram-reminders')->assertExitCode(0);
        Telegraph::assertNothingSent();
    }

    public function test_telegram_reminders_skip_disabled_connections_and_empty_due_sets(): void
    {
        Telegraph::fake();
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00', 'Asia/Tehran'));

        [, , $user] = $this->connectedUser(remindersEnabled: false);
        Task::factory()->for($user)->create([
            'status' => Task::STATUS_OPEN,
            'complete' => false,
            'deadline' => now('Asia/Tehran'),
        ]);

        $this->artisan('tasks:send-telegram-reminders')->assertExitCode(0);

        Telegraph::assertNothingSent();
    }

    public function test_telegram_reminders_wait_for_the_user_reminder_window(): void
    {
        Telegraph::fake();
        Carbon::setTestNow(Carbon::parse('2026-07-12 09:00:00', 'Asia/Tehran'));

        [, , $user] = $this->connectedUser(reminderTime: '11:00');
        Task::factory()->for($user)->create([
            'status' => Task::STATUS_OPEN,
            'complete' => false,
            'deadline' => now('Asia/Tehran'),
        ]);

        $this->artisan('tasks:send-telegram-reminders')->assertExitCode(0);

        Telegraph::assertNothingSent();
    }

    public function test_changing_deadline_resets_telegram_reminder_tracking(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create([
            'deadline' => now(),
            'telegram_due_reminded_at' => now(),
        ]);

        $task->update(['deadline' => now()->addDay()]);

        $this->assertNull($task->fresh()->telegram_due_reminded_at);
    }

    private function connectedUser(bool $remindersEnabled = true, string $reminderTime = '09:00', string $reminderTimezone = '+03:30'): array
    {
        [$bot, $chat] = $this->botAndChat();
        $user = User::factory()->create([
            'task_reminder_time' => $reminderTime,
            'task_reminder_timezone' => $reminderTimezone,
        ]);

        TelegramConnection::create([
            'user_id' => $user->id,
            'telegraph_chat_id' => $chat->id,
            'telegram_chat_id' => (string) $chat->chat_id,
            'telegram_user_id' => '444',
            'telegram_username' => 'john_smith',
            'connected_at' => now(),
            'reminders_enabled' => $remindersEnabled,
        ]);

        return [$bot, $chat, $user];
    }

    private function botAndChat(): array
    {
        $bot = TelegraphBot::create(['token' => 'bot-token', 'name' => 'Task Bot']);
        $chat = $bot->chats()->create([
            'chat_id' => '987654',
            'name' => 'Test chat',
        ]);

        return [$bot, $chat];
    }

    private function messagePayload(string $text): array
    {
        return [
            'update_id' => 123456,
            'message' => [
                'message_id' => 42,
                'from' => [
                    'id' => 444,
                    'is_bot' => false,
                    'first_name' => 'John',
                    'last_name' => 'Smith',
                    'username' => 'john_smith',
                    'language_code' => 'en',
                ],
                'chat' => [
                    'id' => 987654,
                    'first_name' => 'John',
                    'last_name' => 'Smith',
                    'username' => 'john_smith',
                    'type' => 'private',
                ],
                'date' => now()->timestamp,
                'text' => $text,
                'entities' => [
                    [
                        'offset' => 0,
                        'length' => str($text)->before(' ')->length(),
                        'type' => 'bot_command',
                    ],
                ],
            ],
        ];
    }

    private function callbackPayload(TelegraphChat $chat, string $data): array
    {
        return [
            'update_id' => 123457,
            'callback_query' => [
                'id' => 12345,
                'from' => [
                    'id' => 444,
                    'is_bot' => false,
                    'first_name' => 'John',
                    'last_name' => 'Smith',
                    'username' => 'john_smith',
                ],
                'message' => [
                    'message_id' => 99,
                    'chat' => [
                        'id' => (int) $chat->chat_id,
                        'type' => 'private',
                        'username' => 'john_smith',
                    ],
                    'date' => now()->timestamp,
                    'text' => 'Task menu',
                ],
                'data' => $data,
            ],
        ];
    }
}
