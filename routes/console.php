<?php

use App\Models\Task;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('tasks:prune-done', function () {
    $deleted = Task::query()->prunableDone()->delete();

    $this->components->info("Deleted {$deleted} done task(s).");

    return 0;
})->purpose('Delete top-level done tasks older than one week')->daily();
