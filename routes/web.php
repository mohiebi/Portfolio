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
use App\Http\Controllers\TaskmanagerController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('front.portfolio');
})->name('portfolio');

Route::get('/dashboard', function () {
    return view('admin.dashboard');
})->middleware(['auth', 'verified' , 'admin'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

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
    Route::resource('job.application' , JobApplicationController::class)
    ->only(['store' , 'create']);

    Route::resource('my-job-applications', myJobApplicationController::class)
        ->only(['index', 'destroy']);

    Route::resource('employer', EmployerController::class)
        ->only(['create', 'store']);

    Route::middleware('employer')
        ->resource('my-jobs', MyJobController::class);
});
Route::middleware('auth')->group(function(){
    Route::resource('taskmanager', TaskmanagerController::class) ;
});


Route::put('taskmanager/{task}/toggle-complete', [TaskmanagerController::class ,'togglecomplete'])->name('taskmanager-toggle');

Route::post('sendmail', [ContactController::class ,'contact'] )
->name('contact');