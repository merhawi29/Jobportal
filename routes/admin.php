<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\JobController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\JobApplicationController;

Route::middleware(['auth'])->name('admin.')->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Applications Management
    Route::get('/admin/applications', [JobApplicationController::class, 'index'])->name('applications.index');
    Route::get('/admin/applications/{application}', [JobApplicationController::class, 'show'])->name('applications.show');
    Route::patch('/admin/applications/{application}/status', [JobApplicationController::class, 'updateStatus'])->name('applications.update-status');
    
    // Jobs Management
    Route::get('/admin/api/jobs', [JobController::class, 'index']);
    Route::post('/admin/jobs/{job}/approve', [JobController::class, 'approve']);
    Route::post('/admin/jobs/{job}/reject', [JobController::class, 'reject']);
    Route::get('/admin/jobs/{job}/edit', [JobController::class, 'edit']);
    Route::put('/admin/jobs/{job}', [JobController::class, 'update']);
    Route::delete('/admin/jobs/{job}', [JobController::class, 'destroy']);
    
    // User Management
    Route::prefix('admin/users')->name('users.')->group(function () {
        // Job Seeker Management
        Route::prefix('job-seekers')->name('job-seekers.')->group(function () {
            Route::get('/', [UserController::class, 'jobSeekersIndex'])->name('index');
            Route::get('/{user}/edit', [UserController::class, 'editJobSeeker'])->name('edit');
            Route::put('/{user}', [UserController::class, 'updateJobSeeker'])->name('update');
            Route::post('/{user}/suspend', [UserController::class, 'suspendJobSeeker'])->name('suspend');
            Route::post('/{user}/activate', [UserController::class, 'activateJobSeeker'])->name('activate');
            Route::post('/{user}/ban', [UserController::class, 'banJobSeeker'])->name('ban');
            Route::post('/{user}/unban', [UserController::class, 'unbanJobSeeker'])->name('unban');
            Route::delete('/{user}', [UserController::class, 'deleteJobSeeker'])->name('delete');
            Route::post('/{user}/role', [UserController::class, 'assignRole'])->name('assign-role');
        });

        // Employer Management
        Route::prefix('employers')->name('employers.')->group(function () {
            Route::get('/', function () {
                return Inertia::render('Admin/Users/Employers/Index');
            })->name('index');
            Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
            Route::put('/{user}', [UserController::class, 'update'])->name('update');
            Route::post('/{user}/suspend', [UserController::class, 'suspendEmployer'])->name('suspend');
            Route::post('/{user}/activate', [UserController::class, 'activateEmployer'])->name('activate');
            Route::post('/{user}/ban', [UserController::class, 'banEmployer'])->name('ban');
            Route::post('/{user}/unban', [UserController::class, 'unbanEmployer'])->name('unban');
            Route::delete('/{user}', [UserController::class, 'deleteEmployer'])->name('delete');
            Route::post('/{user}/role', [UserController::class, 'assignRole'])->name('assign-role');
        });
    });

    // Job Management
    Route::prefix('admin/jobs')->name('jobs.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Jobs/Index');
        })->name('index');
        Route::get('/{job}/edit', [JobController::class, 'edit'])->name('edit');
        Route::put('/{job}', [JobController::class, 'update'])->name('update');
        Route::post('/{job}/approve', [JobController::class, 'approve'])->name('approve');
        Route::post('/{job}/reject', [JobController::class, 'reject'])->name('reject');
    });

    // Employer Verification
    Route::prefix('admin/verifications')->name('verifications.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Verifications/Index');
        })->name('index');
        Route::post('/{employer}/verify', [VerificationController::class, 'verify'])->name('verify');
        Route::post('/{employer}/reject', [VerificationController::class, 'reject'])->name('reject');
    });

    // Content Management
    Route::get('/admin/content', [ContentController::class, 'index'])->name('content.index');
    Route::get('/admin/content/{type}/create', [ContentController::class, 'create'])
        ->where('type', 'career_resource|blog_post|faq')
        ->name('content.create');
    Route::post('/admin/content', [ContentController::class, 'store'])->name('content.store');
    Route::get('/admin/content/{content}/edit', [ContentController::class, 'edit'])->name('content.edit');
    Route::put('/admin/content/{content}', [ContentController::class, 'update'])->name('content.update');
    Route::patch('/admin/content/{content}/status', [ContentController::class, 'updateStatus'])->name('content.update-status');
    Route::delete('/admin/content/{content}', [ContentController::class, 'destroy'])->name('content.destroy');

    // Reports
    Route::get('/admin/reports/download', [ReportController::class, 'downloadReport'])->name('reports.download');
}); 