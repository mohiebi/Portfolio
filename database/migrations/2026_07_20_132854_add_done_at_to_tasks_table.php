<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->timestamp('done_at')->nullable()->after('status');
            $table->index(['user_id', 'done_at'], 'tasks_user_done_at_index');
            $table->index(['parent_id', 'done_at'], 'tasks_parent_done_at_index');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('tasks_parent_done_at_index');
            $table->dropIndex('tasks_user_done_at_index');
            $table->dropColumn('done_at');
        });
    }
};
