<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('app:seed-once', function () {
    if (! Schema::hasTable('deployment_markers')) {
        Schema::create('deployment_markers', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->timestamp('created_at')->nullable();
        });
    }

    if (DB::table('deployment_markers')->where('key', 'database_seeded')->exists()) {
        $this->info('Database has already been seeded. Skipping.');

        return 0;
    }

    $this->call('db:seed', [
        '--force' => true,
    ]);

    DB::table('deployment_markers')->insert([
        'key' => 'database_seeded',
        'created_at' => now(),
    ]);

    $this->info('Database seeded and marker saved.');

    return 0;
})->purpose('Run the database seeder once per database.');
