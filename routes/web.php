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
use App\Http\Controllers\CandidatesController;

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
    Route::patch('/interviews/{interview}', [InterviewInvitationController::class, 'update'])->name('interviews.update');
    Route::delete('/interviews/{interview}', [InterviewInvitationController::class, 'destroy'])->name('interviews.destroy');
    Route::post('/interviews/{interview}/test-email', [InterviewInvitationController::class, 'testEmail'])->name('interviews.test-email');

    // Job Alerts
 
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');

    // Job Seeker routes
    Route::prefix('job-seeker')->group(function () {
        Route::get('/applications', [JobApplicationController::class, 'index'])->name('applications.index');
        Route::post('/jobs/{job}/apply', [JobApplicationController::class, 'store'])->name('job-applications.store');
        Route::get('/applications/{application}', [JobApplicationController::class, 'show'])->name('applications.show');
        Route::delete('/applications/{application}', [JobApplicationController::class, 'destroy'])->name('applications.destroy');

        Route::get('/saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');
        Route::post('/jobs/{job}/save', [SavedJobController::class, 'store'])->name('jobs.save');
        Route::delete('/jobs/{job}/unsave', [SavedJobController::class, 'destroy'])->name('jobs.unsave');

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
        Route::get('/my-jobs', [JobManagementController::class, 'index'])->name('my-jobs.index');
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

// Employer Routes
Route::middleware(['auth'])->prefix('employer')->name('employer.')->group(function () {
    // Candidates search routes - move these inside this group
    Route::get('/candidates', [CandidatesController::class, 'search'])->name('candidates.search');
    Route::get('/candidates/{id}', [CandidatesController::class, 'show'])->name('candidates.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/moderator.php';
