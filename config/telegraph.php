<?php

use App\Http\Webhooks\TaskManagerTelegramWebhook;
use DefStudio\Telegraph\Telegraph;

return [
    'telegram_api_url' => 'https://api.telegram.org/',
    'default_parse_mode' => Telegraph::PARSE_HTML,

    'webhook' => [
        'domain' => env('TELEGRAM_WEBHOOK_DOMAIN'),
        'url' => env('TELEGRAPH_WEBHOOK_URL', '/telegraph/{token}/webhook'),
        'handler' => TaskManagerTelegramWebhook::class,
        'middleware' => [],
        'report_unknown_commands' => env('TELEGRAPH_REPORT_UNKNOWN_COMMANDS', true),
        'secret' => env('TELEGRAPH_WEBHOOK_SECRET'),
        'max_connections' => env('TELEGRAPH_WEBHOOK_MAX_CONNECTIONS', 40),
        'allowed_updates' => null,
        'debug' => env('TELEGRAPH_WEBHOOK_DEBUG', false),
    ],

    'http_timeout' => env('TELEGRAPH_HTTP_TIMEOUT', 30),
    'http_proxy' => env('TELEGRAPH_HTTP_PROXY'),
    'http_connection_timeout' => env('TELEGRAPH_HTTP_CONNECTION_TIMEOUT', 10),

    'security' => [
        'allow_callback_queries_from_unknown_chats' => false,
        'allow_messages_from_unknown_chats' => true,
        'store_unknown_chats_in_db' => true,
    ],

    'models' => [
        'bot' => DefStudio\Telegraph\Models\TelegraphBot::class,
        'chat' => DefStudio\Telegraph\Models\TelegraphChat::class,
    ],

    'storage' => [
        'default' => 'file',
        'stores' => [
            'file' => [
                'driver' => DefStudio\Telegraph\Storage\FileStorageDriver::class,
                'disk' => 'local',
                'root' => 'telegraph',
            ],
            'cache' => [
                'driver' => DefStudio\Telegraph\Storage\CacheStorageDriver::class,
                'store' => null,
                'key_prefix' => 'tgph',
            ],
        ],
    ],

    'commands' => [
        'start_with' => ['/'],
    ],

    'payments' => [
        'provider_token' => env('TELEGRAPH_PAYMENT_PROVIDER_TOKEN', ''),
    ],
];
