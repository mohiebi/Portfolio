<?php

namespace App\Http\Controllers;

use App\Http\Requests\CaseStudyRequest;
use App\Models\CaseStudy;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CaseStudyController extends Controller
{
    public function publicIndex(): Response
    {
        return Inertia::render('CaseStudies/PublicIndex', [
            'caseStudies' => CaseStudy::published()->ordered()->get(),
        ]);
    }

    public function publicShow(CaseStudy $caseStudy): Response
    {
        abort_unless($caseStudy->is_published, 404);

        return Inertia::render('CaseStudies/PublicShow', [
            'caseStudy' => $caseStudy,
            'nextCaseStudy' => CaseStudy::published()
                ->ordered()
                ->where('id', '!=', $caseStudy->id)
                ->get()
                ->first(),
        ]);
    }

    public function index(): Response
    {
        return Inertia::render('CaseStudies/Index', [
            'caseStudies' => CaseStudy::ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('CaseStudies/Create');
    }

    public function store(CaseStudyRequest $request): RedirectResponse
    {
        CaseStudy::create($request->validated());

        return redirect()->route('dashboard.case-studies.index')
            ->with('success', 'Case study added.');
    }

    public function edit(CaseStudy $caseStudy): Response
    {
        return Inertia::render('CaseStudies/Edit', [
            'caseStudy' => $caseStudy,
        ]);
    }

    public function update(CaseStudyRequest $request, CaseStudy $caseStudy): RedirectResponse
    {
        $caseStudy->update($request->validated());

        return redirect()->route('dashboard.case-studies.index')
            ->with('success', 'Case study updated.');
    }

    public function destroy(CaseStudy $caseStudy): RedirectResponse
    {
        $caseStudy->delete();

        return redirect()->route('dashboard.case-studies.index')
            ->with('success', 'Case study deleted.');
    }
}
