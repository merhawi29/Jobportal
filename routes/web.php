<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\JobController;
use App\Http\Controllers\JobSeeker\ProfileController as JobSeekerProfileController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\SavedJobController;
use App\Http\Controllers\JobAlertController;
use App\Http\Controllers\EmployeeProfileController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Public job routes
Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{job}', [JobController::class, 'show'])->name('jobs.show');

// Route::get('/haha', function () {
//     return Inertia::render('Employee/PostJob');
// })->name('haha');

// Protected job routes
Route::middleware(['auth'])->group(function () {
    Route::post('/jobs', [JobController::class, 'store'])->name('jobs.store');
    Route::get('/create', [JobController::class, 'create'])->name('create');
    Route::get('/jobs/{job}/edit', [JobController::class, 'edit'])->name('jobs.edit');
    Route::put('/jobs/{job}', [JobController::class, 'update'])->name('jobs.update');
    Route::delete('/jobs/{job}', [JobController::class, 'destroy'])->name('jobs.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    // Route::get('/profile', [JobSeekerProfileController::class, 'edit'])->name('profile.edit');
    // Route::put('/profile', [JobSeekerProfileController::class, 'update'])->name('profile.update');
    // Route::put('/profile/privacy', [JobSeekerProfileController::class, 'updatePrivacy'])->name('profile.privacy.update');


    // Job Seeker routes
    Route::prefix('job-seeker')->group(function () {
        Route::get('/applications', [JobApplicationController::class, 'index'])->name('applications.index');
        Route::post('/jobs/{job}/apply', [JobApplicationController::class, 'store'])->name('job-applications.store');
        Route::get('/applications/{application}', [JobApplicationController::class, 'show'])->name('applications.show');
        Route::delete('/applications/{application}', [JobApplicationController::class, 'destroy'])->name('applications.destroy');

        Route::get('/saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');
        Route::post('/jobs/{job}/save', [SavedJobController::class, 'store'])->name('jobs.save');
        Route::delete('/jobs/{job}/unsave', [SavedJobController::class, 'destroy'])->name('jobs.unsave');

        Route::get('/job-alerts', [JobAlertController::class, 'index'])->name('job-alerts.index');
        Route::post('/job-alerts', [JobAlertController::class, 'store'])->name('job-alerts.store');
        Route::delete('/job-alerts/{alert}', [JobAlertController::class, 'destroy'])->name('job-alerts.destroy');
    });

    // Job Seeker Profile routes


    Route::prefix('jobseeker')->name('jobseeker.')->group(function () {
        Route::get('/profile', [JobSeekerProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [JobSeekerProfileController::class, 'update'])->name('profile.update');
        Route::post('/profile/photo', [JobSeekerProfileController::class, 'updatePhoto'])->name('profile.photo');
        Route::get('/profile/show/{id?}', [JobSeekerProfileController::class, 'show'])->name('profile.show');
    });


        Route::prefix('employee')->name('employee.')->group(function () {
            Route::get('/profile', [EmployeeProfileController::class, 'edit'])->name('profile.edit');
            Route::put('/profile', [EmployeeProfileController::class, 'update'])->name('profile.update');
            Route::post('/profile/photo', [EmployeeProfileController::class, 'updatePhoto'])->name('profile.photo');
            Route::get('/profile/show/{id?}', [EmployeeProfileController::class, 'show'])->name('profile.show');
        });

        // Employer routes
        Route::prefix('employer')->name('employer.')->middleware(['auth'])->group(function () {
            Route::get('/jobs', [\App\Http\Controllers\Employer\JobManagementController::class, 'index'])->name('jobs.index');
            Route::get('/applications', [\App\Http\Controllers\Employer\JobManagementController::class, 'applications'])->name('applications.index');
        });

});



// Route::prefix('employee')->name('employee.')->group(function () {
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/moderator.php';
