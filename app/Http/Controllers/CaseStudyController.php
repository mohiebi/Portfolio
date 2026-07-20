<?php

namespace App\Http\Controllers;

use App\Http\Requests\CaseStudyRequest;
use App\Models\CaseStudy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
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
            'nextCaseStudy' => $this->nextPublishedCaseStudy($caseStudy),
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
        $data = $this->caseStudyData($request);

        if ($request->hasFile('featured_image')) {
            $data['featured_image_path'] = $this->storeFeaturedImage($request);
        }

        CaseStudy::create($data);

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
        $data = $this->caseStudyData($request);

        if ($request->boolean('remove_featured_image')) {
            $this->deleteFeaturedImage($caseStudy);
            $data['featured_image_path'] = null;
        }

        if ($request->hasFile('featured_image')) {
            $this->deleteFeaturedImage($caseStudy);
            $data['featured_image_path'] = $this->storeFeaturedImage($request);
        }

        $caseStudy->update($data);

        return redirect()->route('dashboard.case-studies.index')
            ->with('success', 'Case study updated.');
    }

    public function destroy(CaseStudy $caseStudy): RedirectResponse
    {
        $this->deleteFeaturedImage($caseStudy);
        $caseStudy->delete();

        return redirect()->route('dashboard.case-studies.index')
            ->with('success', 'Case study deleted.');
    }

    private function caseStudyData(CaseStudyRequest $request): array
    {
        return $request->safe()->except('featured_image', 'remove_featured_image');
    }

    private function storeFeaturedImage(Request $request): string
    {
        $image = $request->file('featured_image');
        $directory = public_path('img/case-studies/uploads');
        File::ensureDirectoryExists($directory);

        $filename = Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = ($filename ?: 'case-study').'-'.Str::random(8).'.'.$image->getClientOriginalExtension();

        $image->move($directory, $filename);

        return 'img/case-studies/uploads/'.$filename;
    }

    private function deleteFeaturedImage(CaseStudy $caseStudy): void
    {
        if (! $caseStudy->featured_image_path || ! str_starts_with($caseStudy->featured_image_path, 'img/case-studies/uploads/')) {
            return;
        }

        $path = public_path($caseStudy->featured_image_path);

        if (File::exists($path)) {
            File::delete($path);
        }
    }

    private function nextPublishedCaseStudy(CaseStudy $caseStudy): ?CaseStudy
    {
        $caseStudies = CaseStudy::published()->ordered()->get()->values();

        if ($caseStudies->count() <= 1) {
            return null;
        }

        $currentIndex = $caseStudies->search(fn (CaseStudy $publishedCaseStudy): bool => $publishedCaseStudy->is($caseStudy));

        if ($currentIndex === false) {
            return $caseStudies->first();
        }

        return $caseStudies->get($currentIndex + 1) ?? $caseStudies->first();
    }
}
