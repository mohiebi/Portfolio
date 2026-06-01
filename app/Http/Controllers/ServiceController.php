<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function publicIndex(): Response
    {
        return Inertia::render('Services/PublicIndex', [
            'services' => Service::published()->ordered()->get(),
        ]);
    }

    public function publicShow(Service $service): Response
    {
        abort_unless($service->is_published, 404);

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
            'services' => Service::ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Services/Create');
    }

    public function store(ServiceRequest $request): RedirectResponse
    {
        Service::create($request->validated());

        return redirect()->route('dashboard.services.index')
            ->with('success', 'Service added.');
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('Services/Edit', [
            'service' => $service,
        ]);
    }

    public function update(ServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        return redirect()->route('dashboard.services.index')
            ->with('success', 'Service updated.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()->route('dashboard.services.index')
            ->with('success', 'Service deleted.');
    }
}
