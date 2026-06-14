<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function publicIndex(): Response
    {
        return Inertia::render('Services/PublicIndex', [
            'services' => Service::published()
                ->with(['sampleProjects' => fn ($query) => $query->published()->ordered()])
                ->ordered()
                ->get(),
        ]);
    }

    public function publicShow(Service $service): Response
    {
        abort_unless($service->is_published, 404);

        $service->load(['sampleProjects' => fn ($query) => $query->published()->ordered()]);

        return Inertia::render('Services/PublicShow', [
            'service' => $service,
            'otherServices' => Service::published()
                ->ordered()
                ->where('id', '!=', $service->id)
                ->get(),
        ]);
    }

    public function index(): Response
    {
        return Inertia::render('Services/Index', [
            'services' => Service::withCount('sampleProjects')->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Services/Create');
    }

    public function store(ServiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $service = Service::create(Arr::except($validated, ['sample_projects']));

            $this->syncSampleProjects($service, $validated['sample_projects'] ?? []);
        });

        return redirect()->route('dashboard.services.index')
            ->with('success', 'Service added.');
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('Services/Edit', [
            'service' => $service->load('sampleProjects'),
        ]);
    }

    public function update(ServiceRequest $request, Service $service): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($service, $validated) {
            $service->update(Arr::except($validated, ['sample_projects']));

            $this->syncSampleProjects($service, $validated['sample_projects'] ?? []);
        });

        return redirect()->route('dashboard.services.index')
            ->with('success', 'Service updated.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()->route('dashboard.services.index')
            ->with('success', 'Service deleted.');
    }

    private function syncSampleProjects(Service $service, array $projects): void
    {
        $service->sampleProjects()->delete();

        $usedSlugs = [];

        foreach ($projects as $index => $project) {
            $name = trim((string) ($project['name'] ?? ''));
            $url = trim((string) ($project['url'] ?? ''));
            $summary = trim((string) ($project['summary'] ?? ''));

            if (! $name || ! $url || ! $summary) {
                continue;
            }

            $baseSlug = Str::slug($project['slug'] ?? $name) ?: 'sample-project';
            $slug = $baseSlug;
            $counter = 2;

            while (in_array($slug, $usedSlugs, true)) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }

            $usedSlugs[] = $slug;

            $service->sampleProjects()->create([
                'name' => $name,
                'slug' => $slug,
                'url' => $url,
                'tag' => trim((string) ($project['tag'] ?? '')) ?: null,
                'summary' => $summary,
                'outcome' => trim((string) ($project['outcome'] ?? '')) ?: null,
                'preview' => trim((string) ($project['preview'] ?? '')) ?: 'web',
                'accent' => trim((string) ($project['accent'] ?? '')) ?: 'from-emerald-400/25 to-sky-500/10',
                'is_published' => (bool) ($project['is_published'] ?? true),
                'sort_order' => (int) ($project['sort_order'] ?? (($index + 1) * 10)),
            ]);
        }
    }
}
