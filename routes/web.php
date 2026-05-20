<?php

use App\Http\Controllers\Auth\GoogleAuth;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Projects\BookReview\BookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Projects\BookReview\ReviewController;
use App\Http\Controllers\Projects\JobBoard\EmployerController;
use App\Http\Controllers\Projects\JobBoard\JobApplicationController;
use App\Http\Controllers\Projects\JobBoard\JobController;
use App\Http\Controllers\Projects\JobBoard\myJobApplicationController;
use App\Http\Controllers\Projects\JobBoard\MyJobController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\TaskmanagerController;
use App\Models\Recommendation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Portfolio/Home', [
        'recommendations' => Recommendation::published()->ordered()->get(),
    ]);
})->name('portfolio');

Route::get('/recommendations/all', function () {
    return Inertia::render('Recommendations/PublicIndex', [
        'recommendations' => Recommendation::published()->ordered()->get(),
    ]);
})->name('recommendations.public');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->resource('recommendations', RecommendationController::class)
    ->except(['show']);

require __DIR__.'/auth.php';

Route::get('google/auth', [GoogleAuth::class,'auth'])->name('googleLogin');
Route::get('auth/google/callback', [GoogleAuth::class,'callback']);
 
Route::resource('books', BookController::class)
    ->only(['index', 'show']);

Route::middleware(['throttle'])->group(function () {
    Route::resource('books.reviews', ReviewController::class)
        ->scoped(['review'=>'book'])
        ->only(['create', 'store']);
    
});

Route::resource('jobs', JobController::class)
    ->only(['index' , 'show']);

Route::middleware('auth')->group(function(){
    Route::get('jobs/{job}/apply', [JobApplicationController::class, 'create'])
        ->name('jobs.apply');
    Route::post('jobs/{job}/apply', [JobApplicationController::class, 'store'])
        ->name('jobs.apply.store');

    Route::resource('my-job-applications', myJobApplicationController::class)
        ->only(['index', 'destroy']);

    Route::resource('employer', EmployerController::class)
        ->only(['create', 'store']);

    Route::middleware('employer')
        ->resource('my-jobs', MyJobController::class);
});
Route::middleware('auth')->group(function(){
    Route::resource('taskmanager', TaskmanagerController::class)
        ->except(['index']);
});

Route::resource('taskmanager', TaskmanagerController::class)
    ->only(['index']);

Route::put('taskmanager/{task}/toggle-complete', [TaskmanagerController::class ,'togglecomplete'])
    ->middleware('auth')
    ->name('taskmanager-toggle');

Route::patch('taskmanager/{task}/status', [TaskmanagerController::class, 'updateStatus'])
    ->middleware('auth')
    ->name('taskmanager-status');

Route::post('sendmail', [ContactController::class ,'contact'] )
->name('contact');
