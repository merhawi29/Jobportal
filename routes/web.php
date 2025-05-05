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
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\BlogController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Public job routes
Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{job}', [JobController::class, 'show'])->name('jobs.show');
Route::get('/companies/{user}', [EmployeeProfileController::class, 'show'])->name('companies.show');

// Career Resources route
Route::get('/career-resources', function () {
    $careerResources = \App\Models\CareerResource::all();
    return Inertia::render('CareerResource/Index', [
        'careerResources' => $careerResources
    ]);
})->name('career-resources.index');

// FAQs route
Route::get('/faqs', function () {
    $faqs = \App\Models\FAQ::all();
    return Inertia::render('FAQ/Index', [
        'faqs' => $faqs
    ]);
})->name('faqs.index');

// Protected job routes
Route::middleware(['auth'])->group(function () {
    Route::post('/jobs', [JobController::class, 'store'])->name('jobs.store');
    Route::get('/create', [JobController::class, 'create'])->name('create');
    Route::get('/jobs/{job}/edit', [JobController::class, 'edit'])->name('jobs.edit');
    Route::put('/jobs/{job}', [JobController::class, 'update'])->name('jobs.update');
    Route::delete('/jobs/{job}', [JobController::class, 'destroy'])->name('jobs.destroy');
    // Route::resource('job-alerts', JobAlertController::class);
    // Route::put('job-alerts/{alert}/toggle', [JobAlertController::class, 'toggle'])
    //     ->name('job-alerts.toggle');
    // Route::post('/jobs/{job}/save', [JobController::class, 'save'])->name('jobs.save');

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

    // Job Alerts
 
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    // Job Seeker routes
    Route::prefix('job-seeker')->group(function () {
        Route::get('/applications', [JobApplicationController::class, 'index'])->name('applications.index');
        Route::post('/jobs/{job}/apply', [JobApplicationController::class, 'store'])->name('job-applications.store');
        Route::get('/applications/{application}', [JobApplicationController::class, 'show'])->name('applications.show');
        Route::delete('/applications/{application}', [JobApplicationController::class, 'destroy'])->name('applications.destroy');

        Route::get('/saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');
        Route::post('/jobs/{job}/save', [SavedJobController::class, 'store'])->name('jobs.save');
        Route::delete('/jobs/{job}/unsave', [SavedJobController::class, 'destroy'])->name('jobs.unsave');

        // Job Alerts routes
        // Route::get('/job-alerts', function () {
        //     return Inertia::render('Jobseeker/notifications/index');
        // })->name('job-alerts.index');
        // Route::get('/job-alerts', [JobAlertController::class, 'index'])->name('job-alerts.index');
        // Route::get('/job-alerts/create', [JobAlertController::class, 'create'])->name('job-alerts.create');
        // Route::post('/job-alerts', [JobAlertController::class, 'store'])->name('job-alerts.store');
        // Route::get('/job-alerts/{alert}/edit', [JobAlertController::class, 'edit'])->name('job-alerts.edit');
        // Route::put('/job-alerts/{alert}', [JobAlertController::class, 'update'])->name('job-alerts.update');
        // Route::put('/job-alerts/{alert}/toggle', [JobAlertController::class, 'toggle'])->name('job-alerts.toggle');
        // Route::delete('/job-alerts/{alert}', [JobAlertController::class, 'destroy'])->name('job-alerts.destroy');
        
        // // Notification routes
        // Route::post('/notifications/{id}/mark-as-read', [JobAlertController::class, 'markAsRead'])->name('job-alerts.mark-as-read');
    });

    // Job Seeker Profile routes


    Route::prefix('jobseeker')->name('jobseeker.')->group(function () {
        Route::get('/profile', [JobSeekerProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [JobSeekerProfileController::class, 'update'])->name('profile.update');
        Route::post('/profile/photo', [JobSeekerProfileController::class, 'updatePhoto'])->name('profile.photo');
        Route::get('/profile/show/{id?}', [JobSeekerProfileController::class, 'show'])->name('profile.show');
        Route::get('/profile/create', [JobSeekerProfileController::class, 'create'])->name('profile.create');
        Route::post('/profile', [JobSeekerProfileController::class, 'store'])->name('profile.store');
        Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    });
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

       



    });


    Route::prefix('employer')->name('employer.')->middleware(['auth'])->group(function () {
        Route::get('/jobs', [JobManagementController::class, 'index'])->name('jobs.index');
        Route::get('/applications', [JobManagementController::class, 'applications'])->name('applications.index');
        Route::get('/applications/{application}', [JobManagementController::class, 'show'])->name('applications.show');
        Route::put('/applications/{application}/status', [JobManagementController::class, 'updateStatus'])->name('applications.update-status');
        Route::post('/applications/{application}/notify', [JobManagementController::class, 'sendNotification'])
            ->name('applications.notify');
        Route::post('/applications/{application}/schedule-interview', [JobManagementController::class, 'scheduleInterview'])
            ->name('applications.schedule-interview');
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
    Route::post('/jobs/{job}/apply', [JobApplicationController::class, 'store'])->name('jobs.apply');
    Route::get('/applications', [JobApplicationController::class, 'index'])->name('applications.index');
    // Route::get('/dashboard', [JobSeekerDashboardController::class, 'index'])->name('jobseeker.dashboard');
});

// Admin routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Jobs Management
    Route::get('/api/jobs', [App\Http\Controllers\Admin\JobController::class, 'index']);
    Route::post('/jobs/{job}/approve', [App\Http\Controllers\Admin\JobController::class, 'approve']);
    Route::post('/jobs/{job}/reject', [App\Http\Controllers\Admin\JobController::class, 'reject']);
    Route::get('/jobs/{job}/edit', [App\Http\Controllers\Admin\JobController::class, 'edit']);
    Route::put('/jobs/{job}', [App\Http\Controllers\Admin\JobController::class, 'update']);
    Route::delete('/jobs/{job}', [App\Http\Controllers\Admin\JobController::class, 'destroy']);
    
    // User Management
    Route::prefix('users')->name('users.')->group(function () {
        // Job Seeker Management
        Route::prefix('job-seekers')->name('job-seekers.')->group(function () {
            Route::get('/', [UserController::class, 'jobSeekersIndex'])->name('index');
            Route::get('/create', [UserController::class, 'createJobSeeker'])->name('create');
            Route::get('/{user}/edit', [UserController::class, 'editJobSeeker'])->name('edit');
            Route::put('/{user}', [UserController::class, 'updateJobSeeker'])->name('update');
            Route::post('/{user}/suspend', [UserController::class, 'suspendJobSeeker'])->name('suspend');
            Route::post('/{user}/activate', [UserController::class, 'activateJobSeeker'])->name('activate');
            Route::post('/{user}/ban', [UserController::class, 'banJobSeeker'])->name('ban');
            Route::post('/{user}/unban', [UserController::class, 'unbanJobSeeker'])->name('unban');
            Route::delete('/{user}', [UserController::class, 'deleteJobSeeker'])->name('delete');
        });

        // Employer Management
        Route::prefix('employers')->name('employers.')->group(function () {
            Route::get('/', function () {
                return Inertia::render('Admin/Users/Employers/Index');
            })->name('index');
            Route::get('/create', [App\Http\Controllers\Admin\UserController::class, 'createEmployer'])->name('create');
            Route::get('/{user}/edit', [App\Http\Controllers\Admin\UserController::class, 'edit'])->name('edit');
            Route::put('/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('update');
            Route::post('/{user}/suspend', [App\Http\Controllers\Admin\UserController::class, 'suspendEmployer'])->name('suspend');
            Route::post('/{user}/activate', [App\Http\Controllers\Admin\UserController::class, 'activateEmployer'])->name('activate');
            Route::post('/{user}/ban', [App\Http\Controllers\Admin\UserController::class, 'banEmployer'])->name('ban');
            Route::post('/{user}/unban', [App\Http\Controllers\Admin\UserController::class, 'unbanEmployer'])->name('unban');
            Route::delete('/{user}', [App\Http\Controllers\Admin\UserController::class, 'deleteEmployer'])->name('delete');
        });
    });

    // Job Seeker API Routes
    Route::prefix('api/users/job-seekers')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\UserController::class, 'jobSeekers']);
        Route::post('/', [App\Http\Controllers\Admin\UserController::class, 'storeJobSeeker']);
        Route::post('/{user}/suspend', [App\Http\Controllers\Admin\UserController::class, 'suspendJobSeeker']);
        Route::post('/{user}/activate', [App\Http\Controllers\Admin\UserController::class, 'activateJobSeeker']);
        Route::delete('/{user}', [App\Http\Controllers\Admin\UserController::class, 'deleteJobSeeker']);
    });

    // Employer API Routes
    Route::prefix('api/users/employers')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\UserController::class, 'employers']);
        Route::post('/', [App\Http\Controllers\Admin\UserController::class, 'storeEmployer']);
        Route::post('/{user}/suspend', [App\Http\Controllers\Admin\UserController::class, 'suspendEmployer']);
        Route::post('/{user}/activate', [App\Http\Controllers\Admin\UserController::class, 'activateEmployer']);
        Route::delete('/{user}', [App\Http\Controllers\Admin\UserController::class, 'deleteEmployer']);
    });

    // Job Management
    Route::prefix('jobs')->name('jobs.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Jobs/Index');
        })->name('index');
        Route::get('/{job}/edit', [App\Http\Controllers\Admin\JobController::class, 'edit'])->name('edit');
        Route::put('/{job}', [App\Http\Controllers\Admin\JobController::class, 'update'])->name('update');
        Route::post('/{job}/approve', [App\Http\Controllers\Admin\JobController::class, 'approve'])->name('approve');
        Route::post('/{job}/reject', [App\Http\Controllers\Admin\JobController::class, 'reject'])->name('reject');
    });

    // Job API Routes
    Route::prefix('api/jobs')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\JobController::class, 'index']);
    });

    // Employer Verification
    Route::prefix('verifications')->name('verifications.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Verifications/Index');
        })->name('index');
        Route::post('/{employer}/verify', [App\Http\Controllers\Admin\VerificationController::class, 'verify'])->name('verify');
        Route::post('/{employer}/reject', [App\Http\Controllers\Admin\VerificationController::class, 'reject'])->name('reject');
    });

    // Content Management
    Route::get('/content', [App\Http\Controllers\Admin\ContentController::class, 'index'])->name('content.index');
    Route::get('/content/{type}/create', [App\Http\Controllers\Admin\ContentController::class, 'create'])
        ->where('type', 'career_resource|blog_post|faq')
        ->name('content.create');
    Route::post('/content', [App\Http\Controllers\Admin\ContentController::class, 'store'])->name('content.store');
    Route::get('/content/{content}/edit', [App\Http\Controllers\Admin\ContentController::class, 'edit'])->name('content.edit');
    Route::put('/content/{content}', [App\Http\Controllers\Admin\ContentController::class, 'update'])->name('content.update');
    Route::patch('/content/{content}/status', [App\Http\Controllers\Admin\ContentController::class, 'updateStatus'])->name('content.update-status');
    Route::delete('/content/{content}', [App\Http\Controllers\Admin\ContentController::class, 'destroy'])->name('content.destroy');

    // Verification routes
    Route::get('/verifications', [VerificationController::class, 'index'])->name('verifications.index');
    Route::post('/verifications/{verification}/verify', [VerificationController::class, 'verify'])->name('verifications.verify');
    Route::post('/verifications/{verification}/reject', [VerificationController::class, 'reject'])->name('verifications.reject');
    Route::get('/verifications/{verification}/document', [VerificationController::class, 'viewDocument'])->name('verifications.document');

    // Content API Routes
    Route::prefix('api/content')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\ContentController::class, 'index']);
    });

    // ... rest of the admin routes ...
    Route::get('/reports/download', [ReportController::class, 'downloadReport'])->name('admin.reports.download');
});

// Test route for debugging


// Test route for job alerts (JSON only)


// Debug route for job alerts

// Test page for notifications

// Blog routes
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{id}', [BlogController::class, 'show'])->name('blog.show');

// Admin-only diagnostic routes (add near the end of file)
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/notification-debug', function () {
        $debug = \App\Services\NotificationService::debugMailConfig();
        return response()->json($debug);
    });
    
    Route::get('/admin/test-email', function () {
        $user = auth()->user();
        \Illuminate\Support\Facades\Mail::raw('Test email from job portal at ' . now(), function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Test Email from Job Portal');
        });
        return 'Test email sent to ' . $user->email;
    });
    
    Route::get('/admin/resend-interview-notifications', function () {
        $interviews = \App\Models\InterviewInvitation::with('job_application.user')
            ->latest()
            ->take(10)
            ->get();
            
        $results = [];
        foreach ($interviews as $interview) {
            $success = \App\Services\NotificationService::resendInterviewNotification($interview);
            $results[] = [
                'id' => $interview->id,
                'success' => $success,
                'user' => $interview->job_application->user->email ?? 'no user'
            ];
        }
        
        return response()->json($results);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/moderator.php';
