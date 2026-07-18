<?php

namespace App\Http\Webhooks;

use App\Models\TelegramConnection;
use App\Services\TelegramTaskBotService;
use App\Services\TelegramTaskCrudService;
use DefStudio\Telegraph\Handlers\WebhookHandler;
use Illuminate\Support\Carbon;
use Illuminate\Support\Stringable;

class TaskManagerTelegramWebhook extends WebhookHandler
{
    public function __construct(
        private readonly TelegramTaskBotService $botService,
        private readonly TelegramTaskCrudService $crudService,
    ) {
        parent::__construct();
    }

    public function start(string $token = ''): void
    {
        $token = trim($token);

        if ($token === '') {
            $this->showMainMenuOrConnectMessage();

            return;
        }

        $connection = TelegramConnection::query()
            ->where('link_token_hash', hash('sha256', $token))
            ->where('link_token_expires_at', '>=', now())
            ->with('user')
            ->first();

        if (! $connection || ! $connection->user) {
            $this->chat->html('❌ This link is invalid or expired. Please generate a fresh link from your profile page.')->send();

            return;
        }

        TelegramConnection::query()
            ->whereKeyNot($connection->id)
            ->where(function ($query) {
                $query->where('telegraph_chat_id', $this->chat->id)
                    ->orWhere('telegram_chat_id', $this->chat->chat_id);
            })
            ->update([
                'telegraph_chat_id' => null,
                'telegram_chat_id' => null,
                'telegram_user_id' => null,
                'telegram_username' => null,
                'connected_at' => null,
            ]);

        $telegramUser = $this->message?->from();

        $connection->forceFill([
            'telegraph_chat_id' => $this->chat->id,
            'telegram_chat_id' => (string) $this->chat->chat_id,
            'telegram_user_id' => $telegramUser ? (string) $telegramUser->id() : null,
            'telegram_username' => $telegramUser?->username() ?: null,
            'link_token_hash' => null,
            'link_token_expires_at' => null,
            'connected_at' => Carbon::now(),
            'reminders_enabled' => true,
        ])->save();

        $this->botService->sendMainMenu($this->chat, $connection->fresh(['user']));
    }

    public function help(): void
    {
        $this->showMainMenuOrConnectMessage();
    }

    public function mainMenu(): void
    {
        $this->showMainMenuOrConnectMessage($this->callbackMessageId());
    }

    public function settings(): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->botService->sendSettings($this->chat, $connection, $this->callbackMessageId());
    }

    public function showTasks(string $filter = 'all', string|int $page = 1): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->botService->sendTaskList($this->chat, $connection->user, $filter, (int) $page, $this->callbackMessageId());
    }

    public function showTask(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->botService->sendTaskDetail($this->chat, $connection->user, (int) $task_id, $this->callbackMessageId());
    }

    public function createTask(): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->beginTaskCreation($this->chat, $connection, $this->callbackMessageId());
    }

    public function createSubtask(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->beginSubtaskCreation($this->chat, $connection, (int) $task_id, $this->callbackMessageId());
    }

    public function skipCreateDeadline(): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->skipCreateDeadline($this->chat, $connection, $this->callbackMessageId());
    }

    public function createDeadlinePreset(string $preset): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->useCreateDeadlinePreset($this->chat, $connection, $preset, $this->callbackMessageId());
    }

    public function updateTaskDeadline(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->beginDeadlineUpdate($this->chat, $connection, (int) $task_id, $this->callbackMessageId());
    }

    public function clearTaskDeadline(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->crudService->clearDeadline($this->chat, $connection, (int) $task_id, $this->callbackMessageId());
    }

    public function setDeadlinePreset(string|int $task_id, string $preset): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->crudService->useDeadlinePreset($this->chat, $connection, (int) $task_id, $preset, $this->callbackMessageId());
    }

    public function updateTaskDescription(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->beginDescriptionUpdate($this->chat, $connection, (int) $task_id, $this->callbackMessageId());
    }

    public function clearTaskDescription(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->crudService->clearDescription($this->chat, $connection, (int) $task_id, $this->callbackMessageId());
    }

    public function taskStatus(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->crudService->sendStatusMenu($this->chat, $connection, (int) $task_id, $this->callbackMessageId());
    }

    public function setTaskStatus(string|int $task_id, string $status): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->crudService->updateStatus($this->chat, $connection, (int) $task_id, $status, $this->callbackMessageId());
    }

    public function confirmDeleteTask(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->crudService->confirmDelete($this->chat, $connection, (int) $task_id, $this->callbackMessageId());
    }

    public function deleteTask(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->crudService->deleteTask($this->chat, $connection, (int) $task_id, $this->callbackMessageId());
    }

    public function updateReminderHour(): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->beginReminderHourUpdate($this->chat, $connection, $this->callbackMessageId());
    }

    public function setReminderHour(string|int $hour): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->setReminderHour($this->chat, $connection, $hour, $this->callbackMessageId());
    }

    public function cancelTaskInput(): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->cancel($this->chat, $connection, $this->callbackMessageId());
    }

    protected function handleChatMessage(Stringable $text): void
    {
        $connection = $this->connectedTelegramConnection();

        if ($connection && $this->crudService->handleTextInput($this->chat, $connection, $text)) {
            return;
        }

        $this->showMainMenuOrConnectMessage();
    }

    private function showMainMenuOrConnectMessage(?int $editMessageId = null): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        $this->crudService->clearInputState($this->chat);
        $this->botService->sendMainMenu($this->chat, $connection, $editMessageId);
    }

    private function connectedTelegramConnection(): ?TelegramConnection
    {
        return TelegramConnection::query()
            ->where('telegraph_chat_id', $this->chat->id)
            ->whereNotNull('connected_at')
            ->with('user')
            ->first();
    }

    private function sendConnectMessage(): void
    {
        $this->chat->html("🔗 <b>Not connected yet.</b>\n\nVisit your profile page to link this Telegram account and start viewing tasks &amp; receiving reminders.")->send();
    }

    private function callbackMessageId(): ?int
    {
        return $this->callbackQuery?->message()?->id();
    }
}
