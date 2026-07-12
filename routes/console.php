<?php

use App\Models\Task;
use App\Services\TaskDeadlineReminderService;
use App\Services\TelegramTaskReminderService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('tasks:prune-done', function () {
    $deleted = Task::query()->prunableDone()->delete();

    $this->components->info("Deleted {$deleted} done task(s).");

    return 0;
})->purpose('Delete top-level done tasks inactive for 30 days')->daily();

Artisan::command('tasks:send-deadline-reminders', function () {
    $sent = app(TaskDeadlineReminderService::class)->sendDueReminders();

    $this->components->info("Sent {$sent} task deadline reminder(s).");

    return 0;
})->purpose('Send task deadline reminders')->hourly();

Artisan::command('tasks:send-telegram-reminders', function () {
    $sent = app(TelegramTaskReminderService::class)->sendDueReminders();

    $this->components->info("Sent {$sent} Telegram task reminder message(s).");

    return 0;
})->purpose('Send grouped Telegram task deadline reminders')->hourly();
