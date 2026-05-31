<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleRequest;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function publicIndex(): Response
    {
        return Inertia::render('Articles/PublicIndex', [
            'articles' => Article::published()->ordered()->get(),
        ]);
    }

    public function publicShow(Article $article): Response
    {
        abort_unless(
            $article->is_published && ($article->published_at === null || $article->published_at->lessThanOrEqualTo(now())),
            404
        );

        return Inertia::render('Articles/PublicShow', [
            'article' => $article,
            'nextArticle' => Article::published()
                ->ordered()
                ->where('id', '!=', $article->id)
                ->first(),
        ]);
    }

    public function index(): Response
    {
        return Inertia::render('Articles/Index', [
            'articles' => Article::ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Articles/Create');
    }

    public function store(ArticleRequest $request): RedirectResponse
    {
        $data = $this->articleData($request);

        if ($request->hasFile('cover')) {
            $data['cover_path'] = $this->storeCover($request);
        } elseif ($request->filled('cover_data')) {
            $data['cover_path'] = $this->storeCoverData($request);
        }

        Article::create($data);

        return redirect()->route('dashboard.articles.index')
            ->with('success', 'Article added.');
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('Articles/Edit', [
            'article' => $article,
        ]);
    }

    public function update(ArticleRequest $request, Article $article): RedirectResponse
    {
        $data = $this->articleData($request);

        if ($request->hasFile('cover')) {
            $this->deleteCover($article);
            $data['cover_path'] = $this->storeCover($request);
        } elseif ($request->filled('cover_data')) {
            $this->deleteCover($article);
            $data['cover_path'] = $this->storeCoverData($request);
        }

        $article->update($data);

        return redirect()->route('dashboard.articles.index')
            ->with('success', 'Article updated.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->deleteCover($article);
        $article->delete();

        return redirect()->route('dashboard.articles.index')
            ->with('success', 'Article deleted.');
    }

    private function articleData(ArticleRequest $request): array
    {
        return $request->safe()->except('cover', 'cover_data', 'cover_filename');
    }

    private function storeCover(Request $request): string
    {
        $cover = $request->file('cover');
        $directory = public_path('img/articles');
        File::ensureDirectoryExists($directory);

        $filename = Str::slug(pathinfo($cover->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = ($filename ?: 'article-cover').'-'.Str::random(8).'.'.$cover->getClientOriginalExtension();

        $cover->move($directory, $filename);

        return 'img/articles/'.$filename;
    }

    private function storeCoverData(Request $request): string
    {
        $coverData = (string) $request->string('cover_data');
        $coverFilename = (string) $request->string('cover_filename');

        preg_match('/^data:image\/(?<type>jpe?g|png|webp);base64,(?<data>.+)$/', $coverData, $matches);

        $directory = public_path('img/articles');
        File::ensureDirectoryExists($directory);

        $extension = $matches['type'] === 'jpeg' ? 'jpg' : $matches['type'];
        $filename = Str::slug(pathinfo($coverFilename, PATHINFO_FILENAME));
        $filename = ($filename ?: 'article-cover').'-'.Str::random(8).'.'.$extension;

        File::put($directory.DIRECTORY_SEPARATOR.$filename, base64_decode($matches['data'], true));

        return 'img/articles/'.$filename;
    }

    private function deleteCover(Article $article): void
    {
        if (! $article->cover_path) {
            return;
        }

        $path = public_path($article->cover_path);

        if (File::exists($path)) {
            File::delete($path);
        }
    }
}
