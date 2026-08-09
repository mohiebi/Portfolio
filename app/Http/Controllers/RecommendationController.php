<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecommendationRequest;
use App\Models\Recommendation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RecommendationController extends Controller
{
    private const IMAGE_DIRECTORY = 'uploads/recommendations';

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
        $filename = Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = ($filename ?: 'recommendation').'-'.Str::random(8).'.'.$image->getClientOriginalExtension();

        return $image->storeAs(self::IMAGE_DIRECTORY, $filename, 'public');
    }

    private function storeImageData(Request $request): string
    {
        $imageData = (string) $request->string('image_data');
        $imageFilename = (string) $request->string('image_filename');

        preg_match('/^data:image\/(?<type>jpe?g|png|webp);base64,(?<data>.+)$/', $imageData, $matches);

        $extension = $matches['type'] === 'jpeg' ? 'jpg' : $matches['type'];
        $filename = Str::slug(pathinfo($imageFilename, PATHINFO_FILENAME));
        $filename = ($filename ?: 'recommendation').'-'.Str::random(8).'.'.$extension;
        $path = self::IMAGE_DIRECTORY.'/'.$filename;

        Storage::disk('public')->put($path, base64_decode($matches['data'], true));

        return $path;
    }

    private function deleteImage(Recommendation $recommendation): void
    {
        if (! $recommendation->image_path) {
            return;
        }

        if (Str::startsWith($recommendation->image_path, self::IMAGE_DIRECTORY.'/')) {
            Storage::disk('public')->delete($recommendation->image_path);

            return;
        }

        if (Str::startsWith($recommendation->image_path, 'img/recommendations/')) {
            File::delete(public_path($recommendation->image_path));
        }
    }
}
