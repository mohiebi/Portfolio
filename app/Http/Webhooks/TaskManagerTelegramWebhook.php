<?php

namespace App\Http\Webhooks;

use App\Models\TelegramConnection;
use App\Services\TelegramTaskBotService;
use DefStudio\Telegraph\Handlers\WebhookHandler;
use Illuminate\Support\Carbon;
use Illuminate\Support\Stringable;

class TaskManagerTelegramWebhook extends WebhookHandler
{
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

        app(TelegramTaskBotService::class)->sendMainMenu($this->chat, $connection->fresh(['user']));
    }

    public function help(): void
    {
        $this->showMainMenuOrConnectMessage();
    }

    public function mainMenu(): void
    {
        $this->showMainMenuOrConnectMessage();
    }

    public function settings(): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        app(TelegramTaskBotService::class)->sendSettings($this->chat, $connection);
    }

    public function showTasks(string $filter = 'all', string|int $page = 1): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        app(TelegramTaskBotService::class)->sendTaskList($this->chat, $connection->user, $filter, (int) $page);
    }

    public function showTask(string|int $task_id): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        app(TelegramTaskBotService::class)->sendTaskDetail($this->chat, $connection->user, (int) $task_id);
    }

    protected function handleChatMessage(Stringable $text): void
    {
        $this->showMainMenuOrConnectMessage();
    }

    private function showMainMenuOrConnectMessage(): void
    {
        $connection = $this->connectedTelegramConnection();

        if (! $connection) {
            $this->sendConnectMessage();

            return;
        }

        app(TelegramTaskBotService::class)->sendMainMenu($this->chat, $connection);
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
}
