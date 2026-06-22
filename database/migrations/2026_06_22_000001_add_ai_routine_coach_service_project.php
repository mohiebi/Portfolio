<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $serviceId = DB::table('services')
            ->where('slug', 'ai-operations-platform')
            ->value('id');

        if (! $serviceId) {
            return;
        }

        $now = now();
        $slug = Str::slug('AI Routine Coach');

        DB::table('service_projects')->updateOrInsert(
            [
                'service_id' => $serviceId,
                'slug' => $slug,
            ],
            [
                'service_id' => $serviceId,
                'slug' => $slug,
                'name' => 'AI Routine Coach',
                'url' => 'https://t.me/AIRoutineCoachBot',
                'tag' => 'AI Operations Platform sample',
                'summary' => 'A Telegram-based AI routine coach that turns personal goals into daily planning, guidance, and habit support inside a focused conversational workflow.',
                'outcome' => 'Practical AI assistant delivered through a real user workflow.',
                'preview' => 'routine',
                'accent' => 'from-indigo-400/25 to-cyan-500/10',
                'is_published' => true,
                'sort_order' => 10,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );
    }

    public function down(): void
    {
        $serviceId = DB::table('services')
            ->where('slug', 'ai-operations-platform')
            ->value('id');

        if (! $serviceId) {
            return;
        }

        DB::table('service_projects')
            ->where('service_id', $serviceId)
            ->where('slug', Str::slug('AI Routine Coach'))
            ->delete();
    }
};
