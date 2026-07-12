<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('task_reminder_time', 5)->default('08:00');
            $table->string('task_reminder_timezone', 6)->default('+00:00');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'task_reminder_time',
                'task_reminder_timezone',
            ]);
        });
    }
};
