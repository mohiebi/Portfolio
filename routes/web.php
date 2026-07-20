<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Auth\GoogleAuth;
use App\Http\Controllers\CaseStudyController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TaskmanagerController;
use App\Models\Article;
use App\Models\CaseStudy;
use App\Models\Recommendation;
use App\Models\Service;
use App\Support\Seo;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Portfolio/Home', [
        'caseStudies' => CaseStudy::published()->ordered()->limit(4)->get(),
        'recommendations' => Recommendation::published()->ordered()->get(),
        'articles' => Article::published()->ordered()->limit(3)->get(),
    ]);
})->name('portfolio');

Route::get('/products', function () {
    return Inertia::render('Products/Index');
})->name('products.index');
Route::redirect('/projects', '/products', 301);

Route::get('/sitemap.xml', function () {
    return response(Seo::sitemapXml(), 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
    ]);
})->name('seo.sitemap');

Route::get('/articles', [ArticleController::class, 'publicIndex'])
    ->name('articles.public.index');
Route::get('/articles/{article:slug}', [ArticleController::class, 'publicShow'])
    ->name('articles.public.show');

Route::get('/case-studies', [CaseStudyController::class, 'publicIndex'])
    ->name('case-studies.public.index');
Route::get('/case-studies/{caseStudy:slug}', [CaseStudyController::class, 'publicShow'])
    ->name('case-studies.public.show');

Route::get('/services', [ServiceController::class, 'publicIndex'])
    ->name('services.public.index');
Route::get('/services/{service:slug}', [ServiceController::class, 'publicShow'])
    ->name('services.public.show');

Route::get('/recommendations', function () {
    return Inertia::render('Recommendations/PublicIndex', [
        'recommendations' => Recommendation::published()->ordered()->get(),
    ]);
})->name('recommendations.public');
Route::redirect('/recommendations/all', '/recommendations', 301);

Route::get('/dashboard', function () {
    $packageSlugs = [
        'launch-sprint',
        'operations-system-sprint',
        'ai-operations-platform',
    ];

    return Inertia::render('Dashboard', [
        'services' => Service::query()
            ->select(['id', 'slug', 'name', 'badge', 'cover', 'is_published', 'sort_order'])
            ->whereIn('slug', $packageSlugs)
            ->withCount('sampleProjects')
            ->get()
            ->sortBy(fn (Service $service) => array_search($service->slug, $packageSlugs, true))
            ->values()
            ->whenEmpty(fn () => Service::query()
                ->select(['id', 'slug', 'name', 'badge', 'cover', 'is_published', 'sort_order'])
                ->ordered()
                ->withCount('sampleProjects')
                ->limit(3)
                ->get()),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/telegram/connect', [ProfileController::class, 'connectTelegram'])->name('profile.telegram.connect');
    Route::delete('/profile/telegram', [ProfileController::class, 'disconnectTelegram'])->name('profile.telegram.disconnect');
    Route::patch('/profile/telegram/reminders', [ProfileController::class, 'updateTelegramReminders'])->name('profile.telegram.reminders');
    Route::patch('/profile/task-reminder-schedule', [ProfileController::class, 'updateTaskReminderSchedule'])->name('profile.task-reminders.schedule');
});

Route::redirect('/recommendations/create', '/dashboard/recommendations/create');

Route::middleware(['auth', 'admin'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::resource('recommendations', RecommendationController::class)
        ->except(['show']);
    Route::resource('case-studies', CaseStudyController::class)
        ->except(['show'])
        ->parameters(['case-studies' => 'caseStudy']);
    Route::resource('articles', ArticleController::class)
        ->except(['show']);
    Route::resource('services', ServiceController::class)
        ->except(['show']);
});

require __DIR__.'/auth.php';

Route::get('google/auth', [GoogleAuth::class, 'auth'])->name('googleLogin');
Route::get('auth/google/callback', [GoogleAuth::class, 'callback']);

Route::middleware('auth')->group(function () {
    Route::patch('taskmanager/done-cleanup', [TaskmanagerController::class, 'updateDoneCleanup'])
        ->name('taskmanager.done-cleanup.update');

    Route::post('taskmanager/{task}/subtasks', [TaskmanagerController::class, 'storeSubtask'])
        ->name('taskmanager.subtasks.store');
    Route::patch('taskmanager/{task}/subtasks/{subtask}', [TaskmanagerController::class, 'updateSubtask'])
        ->name('taskmanager.subtasks.update');
    Route::delete('taskmanager/{task}/subtasks/{subtask}', [TaskmanagerController::class, 'destroySubtask'])
        ->name('taskmanager.subtasks.destroy');

    Route::resource('taskmanager', TaskmanagerController::class)
        ->except(['index']);

    Route::get('notification', [NotificationController::class, 'index'])
        ->name('notification.index');
    Route::put('notification/{notification}/seen', [NotificationController::class, 'markAsRead'])
        ->name('notification.seen');
});

Route::resource('taskmanager', TaskmanagerController::class)
    ->only(['index']);

Route::put('taskmanager/{task}/toggle-complete', [TaskmanagerController::class, 'togglecomplete'])
    ->middleware('auth')
    ->name('taskmanager-toggle');

Route::patch('taskmanager/{task}/status', [TaskmanagerController::class, 'updateStatus'])
    ->middleware('auth')
    ->name('taskmanager-status');

Route::post('sendmail', [ContactController::class, 'contact'])
    ->name('contact');
