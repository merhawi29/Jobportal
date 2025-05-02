<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\JobController;
use App\Traits\LogsActivity;

Route::middleware(['auth:sanctum'])->group(function () {
    // Notifications
    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'store']);
    Route::post('/notifications/{id}/mark-as-read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [App\Http\Controllers\Api\NotificationController::class, 'destroy']);

    Route::get('/jobs', [JobController::class, 'index']); // List all approved jobs
    Route::get('/jobs/{id}', [JobController::class, 'show']); // Get single job details
    Route::post('/jobs', [JobController::class, 'store']); // Create a new job (Employer only)
    Route::put('/jobs/{id}', [JobController::class, 'update']); // Update a job
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']); // Delete a job
});