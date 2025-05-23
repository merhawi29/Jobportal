<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Moderator\DashboardController;
use App\Http\Controllers\Moderator\JobsController;
use App\Http\Controllers\Moderator\UserController;
use App\Http\Controllers\Moderator\ReportController;
use App\Http\Controllers\Moderator\AnalyticsController;
use App\Http\Controllers\Moderator\ActivityLogController;
use App\Http\Controllers\Moderator\SettingsController;
use App\Http\Controllers\Moderator\ActivityLogsController;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', \App\Http\Middleware\CheckRole::class.':moderator'])->prefix('moderator')->name('moderator.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Jobs Management
    Route::prefix('jobs')->name('jobs.')->group(function () {
        Route::get('/', [JobsController::class, 'index'])->name('index');
        Route::post('/{job}/approve', [JobsController::class, 'approve'])->name('approve');
        Route::post('/{job}/reject', [JobsController::class, 'reject'])->name('reject');
        Route::get('/{job}/edit', [JobsController::class, 'edit'])->name('edit');
        Route::put('/{job}', [JobsController::class, 'update'])->name('update');
        Route::delete('/{job}', [JobsController::class, 'destroy'])->name('destroy');
    });

    // Users Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::post('/{user}/ban', [UserController::class, 'ban'])->name('ban');
        Route::post('/{user}/warn', [UserController::class, 'warn'])->name('warn');
        Route::post('/{user}/unban', [UserController::class, 'unban'])->name('unban');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // Reports Management
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/{report}', [ReportController::class, 'show'])->name('show');
        Route::post('/{report}/resolve', [ReportController::class, 'resolve'])->name('resolve');
        Route::post('/{report}/dismiss', [ReportController::class, 'dismiss'])->name('dismiss');
    });

    // Analytics
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');

    // Activity Logs
    Route::get('/activity-logs', [ActivityLogsController::class, 'index'])->name('activity-logs.index');
    Route::get('/activity-logs/{activity}', [ActivityLogsController::class, 'show'])->name('activity-logs.show');

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        Route::post('/', [SettingsController::class, 'update'])->name('update');
    });
});
