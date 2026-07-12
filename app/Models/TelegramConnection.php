<?php

namespace App\Models;

use DefStudio\Telegraph\Models\TelegraphChat;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TelegramConnection extends Model
{
    protected $fillable = [
        'user_id',
        'telegraph_chat_id',
        'telegram_chat_id',
        'telegram_user_id',
        'telegram_username',
        'link_token_hash',
        'link_token_expires_at',
        'connected_at',
        'reminders_enabled',
    ];

    protected $casts = [
        'link_token_expires_at' => 'datetime',
        'connected_at' => 'datetime',
        'reminders_enabled' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function telegraphChat(): BelongsTo
    {
        return $this->belongsTo(TelegraphChat::class);
    }

    public function isConnected(): bool
    {
        return $this->connected_at !== null && $this->telegraph_chat_id !== null;
    }
}
