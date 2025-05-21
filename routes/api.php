<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\API\JobController;
use App\Http\Controllers\NotificationController;
use App\Traits\LogsActivity;

Route::middleware(['auth:sanctum'])->group(function () {
    // Notifications with specific paths first
    Route::get('/notifications/latest', [NotificationController::class, 'getLatestNotifications'])->name('api.notifications.latest');
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('api.notifications.unread-count');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.mark-all-read');
    
    // Then generic notification routes
    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'store']);
    Route::post('/notifications/{id}/mark-as-read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [App\Http\Controllers\Api\NotificationController::class, 'destroy']);

    // Job routes
    // Route::get('/jobs', [JobController::class, 'index']); 
    // Route::get('/jobs/{id}', [JobController::class, 'show']); 
    // Route::post('/jobs', [JobController::class, 'store']); 
    // Route::put('/jobs/{id}', [JobController::class, 'update']); 
    // Route::delete('/jobs/{id}', [JobController::class, 'destroy']); 
});