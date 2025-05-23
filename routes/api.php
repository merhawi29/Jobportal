<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\API\JobController;
use App\Http\Controllers\NotificationController;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;

// Debug route - no authentication required
Route::get('/auth-check', function () {
    return [
        'is_authenticated' => auth()->check(),
        'user' => auth()->check() ? auth()->user()->only(['id', 'name', 'email', 'role']) : null,
        'csrf_token' => csrf_token()
    ];
});

// Use web+auth middleware instead of auth:sanctum so that cookie-based sessions work for same-site requests
Route::middleware(['web', 'auth'])->group(function () {
    // Notifications with specific paths first
    Route::get('/notifications/latest', [NotificationController::class, 'getLatestNotifications'])->name('api.notifications.latest');
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('api.notifications.unread-count');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.mark-all-read');
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('api.notifications.mark-as-read');
    
    // Then generic notification routes (these might be causing conflicts)
    // Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    // Route::post('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'store']);
    // Route::delete('/notifications/{id}', [App\Http\Controllers\Api\NotificationController::class, 'destroy']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});