<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('url');
            $table->string('tag')->nullable();
            $table->text('summary');
            $table->string('outcome')->nullable();
            $table->string('preview')->default('web');
            $table->string('accent')->default('from-emerald-400/25 to-sky-500/10');
            $table->boolean('is_published')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['service_id', 'slug']);
        });

        $this->seedSampleProjects();
    }

    public function down(): void
    {
        Schema::dropIfExists('service_projects');
    }

    private function seedSampleProjects(): void
    {
        $now = now();
        $serviceIds = DB::table('services')
            ->whereIn('slug', ['launch-sprint', 'operations-system-sprint'])
            ->pluck('id', 'slug');

        $samples = [
            'launch-sprint' => [
                [
                    'name' => 'Mahdieh Design',
                    'url' => 'https://mahdiehdesign.com',
                    'tag' => 'Launch Sprint sample',
                    'summary' => 'A polished public website for a design brand, built around a clear visual identity, mobile-first presentation, and a confident path from visit to inquiry.',
                    'outcome' => 'Client-facing brand site launched as a focused sprint.',
                    'preview' => 'design',
                    'accent' => 'from-fuchsia-400/25 to-amber-400/10',
                    'sort_order' => 10,
                ],
            ],
            'operations-system-sprint' => [
                [
                    'name' => 'CashPilot',
                    'url' => 'https://cashpilot.mohiebi.com',
                    'tag' => 'Operations System Sprint sample',
                    'summary' => 'A finance operations workspace for tracking cash flow, categories, and day-to-day money decisions with practical dashboards and cleaner transaction workflows.',
                    'outcome' => 'Personal finance operations system with dashboard workflows.',
                    'preview' => 'cash',
                    'accent' => 'from-lime-400/25 to-cyan-500/10',
                    'sort_order' => 10,
                ],
            ],
        ];

        foreach ($samples as $serviceSlug => $projects) {
            $serviceId = $serviceIds[$serviceSlug] ?? null;

            if (! $serviceId) {
                continue;
            }

            foreach ($projects as $project) {
                DB::table('service_projects')->updateOrInsert(
                    [
                        'service_id' => $serviceId,
                        'slug' => Str::slug($project['name']),
                    ],
                    [
                        ...$project,
                        'service_id' => $serviceId,
                        'slug' => Str::slug($project['name']),
                        'is_published' => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }
    }
};
