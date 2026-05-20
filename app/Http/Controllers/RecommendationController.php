<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecommendationRequest;
use App\Models\Recommendation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RecommendationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Recommendations/Index', [
            'recommendations' => Recommendation::ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Recommendations/Create');
    }

    public function store(RecommendationRequest $request): RedirectResponse
    {
        $data = $this->recommendationData($request);

        if ($request->hasFile('image')) {
            $data['image_path'] = $this->storeImage($request);
        } elseif ($request->filled('image_data')) {
            $data['image_path'] = $this->storeImageData($request);
        }

        Recommendation::create($data);

        return redirect()->route('dashboard.recommendations.index')
            ->with('success', 'Recommendation added.');
    }

    public function edit(Recommendation $recommendation): Response
    {
        return Inertia::render('Recommendations/Edit', [
            'recommendation' => $recommendation,
        ]);
    }

    public function update(RecommendationRequest $request, Recommendation $recommendation): RedirectResponse
    {
        $data = $this->recommendationData($request);

        if ($request->hasFile('image')) {
            $this->deleteImage($recommendation);
            $data['image_path'] = $this->storeImage($request);
        } elseif ($request->filled('image_data')) {
            $this->deleteImage($recommendation);
            $data['image_path'] = $this->storeImageData($request);
        }

        $recommendation->update($data);

        return redirect()->route('dashboard.recommendations.index')
            ->with('success', 'Recommendation updated.');
    }

    public function destroy(Recommendation $recommendation): RedirectResponse
    {
        $this->deleteImage($recommendation);
        $recommendation->delete();

        return redirect()->route('dashboard.recommendations.index')
            ->with('success', 'Recommendation deleted.');
    }

    private function recommendationData(RecommendationRequest $request): array
    {
        return $request->safe()->except('image', 'image_data', 'image_filename');
    }

    private function storeImage(Request $request): string
    {
        $image = $request->file('image');
        $directory = public_path('img/recommendations');
        File::ensureDirectoryExists($directory);

        $filename = Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = ($filename ?: 'recommendation').'-'.Str::random(8).'.'.$image->getClientOriginalExtension();

        $image->move($directory, $filename);

        return 'img/recommendations/'.$filename;
    }

    private function storeImageData(Request $request): string
    {
        $imageData = (string) $request->string('image_data');
        $imageFilename = (string) $request->string('image_filename');

        preg_match('/^data:image\/(?<type>jpe?g|png|webp);base64,(?<data>.+)$/', $imageData, $matches);

        $directory = public_path('img/recommendations');
        File::ensureDirectoryExists($directory);

        $extension = $matches['type'] === 'jpeg' ? 'jpg' : $matches['type'];
        $filename = Str::slug(pathinfo($imageFilename, PATHINFO_FILENAME));
        $filename = ($filename ?: 'recommendation').'-'.Str::random(8).'.'.$extension;

        File::put($directory.DIRECTORY_SEPARATOR.$filename, base64_decode($matches['data'], true));

        return 'img/recommendations/'.$filename;
    }

    private function deleteImage(Recommendation $recommendation): void
    {
        if (! $recommendation->image_path) {
            return;
        }

        $path = public_path($recommendation->image_path);

        if (File::exists($path)) {
            File::delete($path);
        }
    }
}
