<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\JobController;
use App\Http\Controllers\JobSeeker\ProfileController as JobSeekerProfileController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\SavedJobController;
use App\Http\Controllers\JobAlertController;
// use App\Http\Controllers\Employer\EmployeeProfileController as EmployerProfileController;
use App\Http\Controllers\Employer\EmployeeProfileController;
use App\Http\Controllers\Employer\JobManagementController;
use App\Http\Controllers\InterviewInvitationController;
use App\Http\Controllers\JobSeeker\JobSeekerDashboardController;

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
    Route::resource('job-alerts', JobAlertController::class);
    Route::put('job-alerts/{alert}/toggle', [JobAlertController::class, 'toggle'])
        ->name('job-alerts.toggle');
    Route::post('/jobs/{job}/save', [JobController::class, 'save'])->name('jobs.save');

    // Applications
    Route::get('/applications', [JobApplicationController::class, 'index'])->name('applications.index');
    Route::patch('/applications/{application}/status', [JobApplicationController::class, 'updateStatus'])->name('applications.update-status');

    // Interview routes
    Route::get('/interviews', [InterviewInvitationController::class, 'index'])->name('interviews.index');
    Route::get('/applications/{jobApplication}/interviews/create', [InterviewInvitationController::class, 'create'])->name('interviews.create');
    Route::post('/applications/{jobApplication}/interviews', [InterviewInvitationController::class, 'store'])->name('interviews.store');
    Route::get('/interviews/{interview}', [InterviewInvitationController::class, 'show'])->name('interviews.show');
    Route::get('/interviews/{interview}/edit', [InterviewInvitationController::class, 'edit'])->name('interviews.edit');
    Route::put('/interviews/{interview}', [InterviewInvitationController::class, 'update'])->name('interviews.update');
    Route::delete('/interviews/{interview}', [InterviewInvitationController::class, 'destroy'])->name('interviews.destroy');
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
        Route::get('/profile/', [JobSeekerProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [JobSeekerProfileController::class, 'update'])->name('profile.update');
        Route::post('/profile/photo', [JobSeekerProfileController::class, 'updatePhoto'])->name('profile.photo');
        Route::get('/profile/show/{id?}', [JobSeekerProfileController::class, 'show'])->name('profile.show');
        Route::get('/profile/create', [JobSeekerProfileController::class, 'create'])->name('profile.create');
        Route::post('/profile', [JobSeekerProfileController::class, 'store'])->name('profile.store');
    });


        // Route::prefix('employee')->name('employee.')->group(function () {
        //     Route::get('/profile', [EmployeeProfileController::class, 'edit'])->name('profile.edit');
        //     Route::put('/profile', [EmployeeProfileController::class, 'update'])->name('profile.update');
        //     Route::post('/profile/photo', [EmployeeProfileController::class, 'updatePhoto'])->name('profile.photo');
        //     Route::get('/profile/show/{id?}', [EmployeeProfileController::class, 'show'])->name('profile.show');
        //     Route::get('/profile/create', [EmployeeProfileController::class, 'create'])->name('profile.create');
        //     Route::post('/profile', [EmployeeProfileController::class, 'store'])->name('profile.store');
        // });

        // Employer routes
       



    });


    Route::prefix('employer')->name('employer.')->middleware(['auth'])->group(function () {
        Route::get('/jobs', [JobManagementController::class, 'index'])->name('jobs.index');
        Route::get('/applications', [JobManagementController::class, 'applications'])->name('applications.index');
        Route::get('/applications/{application}', [JobManagementController::class, 'show'])->name('applications.show');
        Route::put('/applications/{application}/status', [JobManagementController::class, 'updateStatus'])->name('applications.update-status');
        Route::post('/applications/{application}/notify', [JobManagementController::class, 'sendNotification'])
            ->name('applications.notify');
    });
// Route::prefix('employee')->name('employee.')->group(function () {
// });

Route::prefix('employee')->name('employee.')->middleware(['auth'])->group(function () {
    Route::get('/profile', [EmployeeProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [EmployeeProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [EmployeeProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::get('/profile/show/{id?}', [EmployeeProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/create', [EmployeeProfileController::class, 'create'])->name('profile.create');
    Route::post('/profile', [EmployeeProfileController::class, 'store'])->name('profile.store');
});

// Job Seeker routes that require profile completion
Route::middleware(['auth'])->group(function () {
    Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
    Route::get('/jobs/{job}', [JobController::class, 'show'])->name('jobs.show');
    Route::post('/jobs/{job}/apply', [JobApplicationController::class, 'store'])->name('jobs.apply');
    Route::get('/applications', [JobApplicationController::class, 'index'])->name('applications.index');
    // Route::get('/dashboard', [JobSeekerDashboardController::class, 'index'])->name('jobseeker.dashboard');
});

// Profile routes (no profile completion middleware needed)
// Route::prefix('jobseeker')->name('jobseeker.')->middleware(['auth'])->group(function () {
//     Route::get('/profile/create', [App\Http\Controllers\JobSeeker\ProfileController::class, 'create'])->name('jobseeker.profile.create');
//     Route::post('/profile', [App\Http\Controllers\JobSeeker\ProfileController::class, 'store'])->name('jobseeker.profile.store');
//     Route::get('/profile/edit', [App\Http\Controllers\JobSeeker\ProfileController::class, 'edit'])->name('jobseeker.profile.edit');
//     Route::put('/profile', [App\Http\Controllers\JobSeeker\ProfileController::class, 'update'])->name('jobseeker.profile.update');
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/moderator.php';
