<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->timestamp('telegram_warning_reminded_at')->nullable()->after('deadline_overdue_reminded_at');
            $table->timestamp('telegram_due_reminded_at')->nullable()->after('telegram_warning_reminded_at');
            $table->timestamp('telegram_overdue_reminded_at')->nullable()->after('telegram_due_reminded_at');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn([
                'telegram_warning_reminded_at',
                'telegram_due_reminded_at',
                'telegram_overdue_reminded_at',
            ]);
        });
    }
};
