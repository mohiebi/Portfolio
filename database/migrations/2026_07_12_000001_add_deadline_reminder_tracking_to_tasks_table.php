<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->timestamp('deadline_warning_reminded_at')->nullable()->after('deadline');
            $table->timestamp('deadline_due_reminded_at')->nullable()->after('deadline_warning_reminded_at');
            $table->timestamp('deadline_overdue_reminded_at')->nullable()->after('deadline_due_reminded_at');
            $table->index(['complete', 'deadline'], 'tasks_active_deadline_index');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('tasks_active_deadline_index');
            $table->dropColumn([
                'deadline_warning_reminded_at',
                'deadline_due_reminded_at',
                'deadline_overdue_reminded_at',
            ]);
        });
    }
};
