<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\JobController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Job routes
    Route::prefix('jobs')->group(function () {
        Route::get('/create', [JobController::class, 'create'])->name('jobs.create');
        Route::post('/', [JobController::class, 'store'])->name('jobs.store');
        Route::get('/{job}', [JobController::class, 'show'])->name('jobs.show');
        Route::get('/', [JobController::class, 'index'])->name('jobs.index');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/moderator.php';
