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
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ContactController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Public job routes
Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{job}', [JobController::class, 'show'])->name('jobs.show');
Route::get('/companies/{user}', [EmployeeProfileController::class, 'show'])->name('companies.show');

// About page route
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

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

// Add this route near the top of your web.php file
Route::get('/csrf-token', function() {
    return response()->json(['csrfToken' => csrf_token()]);
});

// Public routes
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'submit'])->name('contact.submit');

// Protected job routes
Route::middleware(['auth'])->group(function () {
    Route::post('/jobs', [JobController::class, 'store'])->name('jobs.store');
    Route::get('/create', [JobController::class, 'create'])->name('create');
    Route::get('/jobs/{job}/edit', [JobController::class, 'edit'])->name('jobs.edit');
    Route::put('/jobs/{job}', [JobController::class, 'update'])->name('jobs.update');
    Route::delete('/jobs/{job}', [JobController::class, 'destroy'])->name('jobs.destroy');

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
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Simple auth check endpoint for debugging
    Route::get('/user/auth-check', function() {
        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => auth()->id(),
                'name' => auth()->user()->name,
                'role' => auth()->user()->role
            ]
        ]);
    });

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::get('/notifications/latest', [NotificationController::class, 'getLatestNotifications'])->name('notifications.latest');
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');

    // Messaging routes
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/api/messages/conversations', [MessageController::class, 'apiGetConversations']);
    Route::get('/api/messages/{userId}', [MessageController::class, 'getMessages']);
    Route::post('/api/messages/send', [MessageController::class, 'sendMessage']);
    Route::post('/api/messages/{userId}/read', [MessageController::class, 'markAsRead']);
    Route::get('/api/messages/unread-count', [MessageController::class, 'getUnreadCount']);

    // User search route for messaging
    Route::get('/api/users/search', [App\Http\Controllers\UserController::class, 'search']);

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
// Profile creation routes (accessible to unverified users)
Route::prefix('jobseeker')->name('jobseeker.')->middleware(['auth'])->group(function () {
    Route::get('/profile/create', [JobSeekerProfileController::class, 'create'])->name('profile.create');
    Route::post('/profile', [JobSeekerProfileController::class, 'store'])->name('profile.store');
});

// Other job seeker profile routes (require email verification)
Route::prefix('jobseeker')->name('jobseeker.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [JobSeekerProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [JobSeekerProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [JobSeekerProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::get('/profile/show/{id?}', [JobSeekerProfileController::class, 'show'])->name('profile.show');
});

    Route::prefix('employer')->name('employer.')->middleware(['auth', 'verified', 'ensure.profile.complete'])->group(function () {
        Route::get('/my-jobs', [JobManagementController::class, 'index'])->name('my-jobs.index');
        Route::get('/applications', [JobManagementController::class, 'applications'])->name('applications.index');
        Route::get('/applications/{application}', [JobManagementController::class, 'show'])->name('applications.show');
        Route::put('/applications/{application}/status', [JobManagementController::class, 'updateStatus'])->name('applications.update-status');
        Route::post('/applications/{application}/notify', [JobManagementController::class, 'sendNotification'])
            ->name('applications.notify');
        Route::post('/applications/{application}/schedule-interview', [JobManagementController::class, 'scheduleInterview'])
            ->name('applications.schedule-interview');
        Route::post('/message/jobseeker/{user}', [\App\Http\Controllers\Employer\MessageController::class, 'sendMessage'])
            ->name('message.jobseeker');
    });

    // Job Alerts Routes
    Route::get('/job-alerts', [App\Http\Controllers\JobAlertController::class, 'index'])->name('job-alerts.index');
    Route::get('/job-alerts/create', [App\Http\Controllers\JobAlertController::class, 'create'])->name('job-alerts.create');
    Route::post('/job-alerts', [App\Http\Controllers\JobAlertController::class, 'store'])->name('job-alerts.store');
    Route::get('/job-alerts/{jobAlert}/edit', [App\Http\Controllers\JobAlertController::class, 'edit'])->name('job-alerts.edit');
    Route::put('/job-alerts/{jobAlert}', [App\Http\Controllers\JobAlertController::class, 'update'])->name('job-alerts.update');
    Route::delete('/job-alerts/{jobAlert}', [App\Http\Controllers\JobAlertController::class, 'destroy'])->name('job-alerts.destroy');
    Route::post('/job-alerts/{jobAlert}/toggle-status', [App\Http\Controllers\JobAlertController::class, 'toggleStatus'])->name('job-alerts.toggle-status');
});

// Employee route group
// Profile creation/edit routes (accessible to unverified users)
Route::prefix('employee')->name('employee.')->middleware(['auth'])->group(function () {
    Route::get('/profile/create', [EmployeeProfileController::class, 'create'])->name('profile.create');
    Route::post('/profile', [EmployeeProfileController::class, 'store'])->name('profile.store');
});

// Other employee routes (require email verification)
Route::prefix('employee')->name('employee.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [EmployeeProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [EmployeeProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [EmployeeProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::get('/profile/show/{id?}', [EmployeeProfileController::class, 'show'])->name('profile.show');
});

// Job Seeker routes that require profile completion
Route::middleware(['auth'])->group(function () {
    Route::post('/jobs/{job}/apply', [JobApplicationController::class, 'store'])->name('jobs.apply');
    Route::get('/applications', [JobApplicationController::class, 'index'])->name('applications.index');
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
    
    Route::get('/admin/test-notification', function () {
        $user = auth()->user();
        $testNotification = new \Illuminate\Notifications\DatabaseNotification([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'type' => 'App\\Notifications\\TestNotification',
            'notifiable_type' => get_class($user),
            'notifiable_id' => $user->id,
            'data' => json_encode([
                'message' => 'This is a manual test notification',
                'job_title' => 'Test Job',
                'company' => 'Test Company',
                'employer_name' => 'Test Employer',
                'created_at' => now()->toIsoString()
            ]),
            'read_at' => null,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        
        $success = $testNotification->save();
        
        return response()->json([
            'success' => $success,
            'notification_id' => $testNotification->id,
            'user_id' => $user->id,
            'message' => $success ? 'Test notification created successfully' : 'Failed to create test notification'
        ]);
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
    
    // Debug route for notifications
    Route::get('/admin/debug-notifications', function () {
        $user = auth()->user();
        $notifications = $user->notifications()->latest()->limit(5)->get();
        $formatted = [];
        
        foreach ($notifications as $notification) {
            $formatted[] = [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at
            ];
        }
        
        return response()->json([
            'user_id' => $user->id,
            'user_role' => $user->role,
            'notifications_count' => count($notifications),
            'notifications' => $formatted
        ]);
    });
});

// Employer Routes
Route::middleware(['auth', 'verified', 'ensure.profile.complete'])->prefix('employer')->name('employer.')->group(function () {
    // Candidates search routes - move these inside this group
    Route::get('/candidates', [CandidatesController::class, 'search'])->name('candidates.search');
    Route::get('/candidates/{id}', [CandidatesController::class, 'show'])->name('candidates.show');
});

Route::get('/test-welcome-notification', function () {
    $user = auth()->user();
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }
    
    try {
        $user->notify(new \App\Notifications\WelcomeNotification());
        return response()->json([
            'success' => true,
            'message' => 'Welcome notification sent successfully'
        ]);
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Failed to send welcome notification', [
            'error' => $e->getMessage(),
            'user_id' => $user->id
        ]);
        return response()->json([
            'error' => 'Failed to send notification',
            'message' => $e->getMessage()
        ], 500);
    }
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/moderator.php';
