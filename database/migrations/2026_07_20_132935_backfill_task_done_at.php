<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('tasks')
            ->where(function ($query) {
                $query->where('status', 'done')
                    ->orWhere('complete', true);
            })
            ->whereNull('done_at')
            ->update([
                'done_at' => DB::raw('updated_at'),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('tasks')
            ->where(function ($query) {
                $query->where('status', 'done')
                    ->orWhere('complete', true);
            })
            ->update([
                'done_at' => null,
            ]);
    }
};
