<?php

use App\Http\Controllers\API\JobController;

Route::middleware(['auth:sanctum'])->group(function () {
Route::get('/jobs', [JobController::class, 'index']); // List all approved jobs
Route::get('/jobs/{id}', [JobController::class, 'show']); // Get single job details
Route::post('/jobs', [JobController::class, 'store']); // Create a new job (Employer only)
Route::put('/jobs/{id}', [JobController::class, 'update']); // Update a job
Route::delete('/jobs/{id}', [JobController::class, 'destroy']); // Delete a job
});