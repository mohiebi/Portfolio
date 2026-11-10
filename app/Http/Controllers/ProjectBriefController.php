<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectBriefRequest;
use App\Models\ProjectBrief;
use App\Models\User;
use App\Notifications\ProjectBriefSubmitted;
use App\Support\BriefOptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class ProjectBriefController extends Controller
{
    /** Private disk: brand files are never served from a public URL. */
    private const DISK = 'local';

    public function create(?string $locale = null): Response
    {
        return Inertia::render('Brief/Create', [
            'locale' => $locale ?? BriefOptions::DEFAULT_LOCALE,
        ]);
    }

    public function store(StoreProjectBriefRequest $request): RedirectResponse
    {
        if (filled($request->input(BriefOptions::SPAM_FIELD))) {
            return $this->thankYou();
        }

        $brief = ProjectBrief::create([
            ...$request->safe()->except([BriefOptions::SPAM_FIELD, 'consent', 'attachments']),
            'attachments' => [],
            'consented_at' => now(),
        ]);

        $brief->update(['attachments' => $this->storeAttachments($request, $brief)]);

        $this->notifyAdmins($brief);

        return $this->thankYou();
    }

    public function index(): Response
    {
        return Inertia::render('Brief/Index', [
            'briefs' => ProjectBrief::query()
                ->select(['id', 'name', 'email', 'company', 'project_type', 'budget', 'timeline', 'locale', 'reviewed_at', 'created_at'])
                ->latest()
                ->latest('id')
                ->paginate(15)
                ->withQueryString(),
            'unreviewedCount' => ProjectBrief::whereNull('reviewed_at')->count(),
        ]);
    }

    public function show(ProjectBrief $projectBrief): Response
    {
        $attachments = collect($projectBrief->attachments)
            ->map(fn (array $file, int $index): array => [
                'name' => $file['name'],
                'size' => $file['size'],
                'mime' => $file['mime'],
                'url' => route('dashboard.briefs.attachments.show', [
                    'projectBrief' => $projectBrief->id,
                    'index' => $index,
                ]),
            ])
            ->values();

        return Inertia::render('Brief/Show', [
            'brief' => [
                ...$projectBrief->makeHidden('attachments')->toArray(),
                'attachments' => $attachments,
            ],
        ]);
    }

    public function toggleReviewed(ProjectBrief $projectBrief): RedirectResponse
    {
        $projectBrief->update([
            'reviewed_at' => $projectBrief->isReviewed() ? null : now(),
        ]);

        return back();
    }

    public function downloadAttachment(ProjectBrief $projectBrief, int $index): StreamedResponse
    {
        $file = $projectBrief->attachments[$index] ?? null;

        abort_if($file === null || ! Storage::disk(self::DISK)->exists($file['path']), 404);

        return Storage::disk(self::DISK)->download($file['path'], $file['name']);
    }

    public function destroy(ProjectBrief $projectBrief): RedirectResponse
    {
        Storage::disk(self::DISK)->deleteDirectory("briefs/{$projectBrief->id}");
        $projectBrief->delete();

        return redirect()->route('dashboard.briefs.index')->with('success', 'Brief deleted.');
    }

    /**
     * @return list<array{path: string, name: string, size: int, mime: string}>
     */
    private function storeAttachments(StoreProjectBriefRequest $request, ProjectBrief $brief): array
    {
        return collect($request->file('attachments', []))
            ->map(fn (UploadedFile $file): array => [
                'size' => (int) $file->getSize(),
                'mime' => $file->getMimeType() ?? 'application/octet-stream',
                'name' => Str::limit($file->getClientOriginalName(), 180, ''),
                'path' => $file->store("briefs/{$brief->id}", self::DISK),
            ])
            ->values()
            ->all();
    }

    /**
     * The brief is already saved at this point, so a mail outage must not turn the
     * visitor's submission into an error. Each failure is reported and the rest carry on.
     */
    private function notifyAdmins(ProjectBrief $brief): void
    {
        foreach (User::where('role', 7)->get() as $admin) {
            try {
                $admin->notify(new ProjectBriefSubmitted($brief));
            } catch (Throwable $exception) {
                report($exception);
            }
        }
    }

    private function thankYou(): RedirectResponse
    {
        return back()->with('success', __('brief.thank_you'));
    }
}
