<?php

namespace App\Http\Controllers;

use App\Models\InterviewInvitation;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use App\Notifications\InterviewNotification;
use Inertia\Inertia;
use App\Notifications\InterviewScheduled;
use App\Notifications\InterviewCancelled;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class InterviewInvitationController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $interviews = InterviewInvitation::with(['job_application.user', 'job_application.job'])
            ->whereHas('job_application.job', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Employee/Interviews/Index', [
            'interviews' => $interviews
        ]);
    }

    public function create(JobApplication $jobApplication)
    {
        // Verify the authenticated user owns the job
        if ($jobApplication->job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Employee/Interviews/Create', [
            'jobApplication' => $jobApplication->load(['user', 'job'])
        ]);
    }

    public function store(Request $request, JobApplication $jobApplication)
    {
        // Verify the authenticated user owns the job
        if ($jobApplication->job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'scheduled_at' => 'required|date|after:now',
            'location' => 'required|string|max:255',
            'type' => 'required|in:in_person,video,phone',
            'notes' => 'nullable|string|max:1000'
        ]);

        // Create interview invitation
        $interview = $jobApplication->interviews()->create([
            'scheduled_at' => $validated['scheduled_at'],
            'location' => $validated['location'],
            'type' => $validated['type'],
            'notes' => $validated['notes'],
            'status' => 'pending'
        ]);

        // Update application status
        $jobApplication->update(['status' => 'interview_scheduled']);

        try {
            // Send notification using Laravel's notification system
            $jobApplication->user->notify(new InterviewScheduled($interview));
            
            Log::info('Interview notification sent successfully', [
                'interview_id' => $interview->id,
                'user_id' => $jobApplication->user->id,
                'email' => $jobApplication->user->email
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to send interview notification', [
                'error' => $e->getMessage(),
                'interview_id' => $interview->id
            ]);
        }

        return redirect()->route('applications.show', $jobApplication->id)
            ->with('success', 'Interview scheduled successfully.');
    }

    public function show(InterviewInvitation $interview)
    {
        // Verify the authenticated user owns the job or is the applicant
        if ($interview->job_application->job->user_id !== auth()->id() && 
            $interview->job_application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Employee/Interviews/Show', [
            'interview' => $interview->load([
                'job_application.user',
                'job_application.job'
            ])
        ]);
    }

    public function update(Request $request, InterviewInvitation $interview)
    {
        // Verify the authenticated user owns the job
        if ($interview->job_application->job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'scheduled_at' => 'required|date|after:now',
            'location' => 'required|string|max:255',
            'type' => 'required|in:in_person,video,phone',
            'notes' => 'nullable|string|max:1000'
        ]);

        $interview->update($validated);

        try {
            // Send notification using Laravel's notification system
            $interview->job_application->user->notify(new InterviewScheduled($interview));
            
            Log::info('Interview update notification sent successfully', [
                'interview_id' => $interview->id,
                'user_id' => $interview->job_application->user->id,
                'email' => $interview->job_application->user->email
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to send interview update notification', [
                'error' => $e->getMessage(), 
                'interview_id' => $interview->id
            ]);
        }

        return redirect()->route('interviews.show', $interview->id)
            ->with('success', 'Interview updated successfully.');
    }

    public function destroy(InterviewInvitation $interview)
    {
        // Verify the authenticated user owns the job
        if ($interview->job_application->job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Store application reference before deletion
        $jobApplication = $interview->job_application;

        // Delete the interview
        $interview->delete();

        // Update application status if this was the only interview
        if ($jobApplication->interviews()->count() === 0) {
            $jobApplication->update(['status' => 'under_review']);
        }

        // Notify the applicant
        $jobApplication->user->notify(new InterviewCancelled($jobApplication, [
            'interview_date' => $interview->scheduled_at,
            'job_title' => $jobApplication->job->title,
            'company' => $jobApplication->job->company
        ]));

        return redirect()->route('applications.show', $jobApplication->id)
            ->with('success', 'Interview cancelled successfully.');
    }

    public function edit(InterviewInvitation $interview)
    {
        // Verify the authenticated user owns the job
        if ($interview->job_application->job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Employee/Interviews/Edit', [
            'interview' => $interview->load([
                'job_application.user',
                'job_application.job'
            ])
        ]);
    }
    
    public function testEmail(InterviewInvitation $interview)
    {
        // Verify the authenticated user owns the job
        if ($interview->job_application->job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
        
        try {
            // Get email configuration for debugging
            $mailConfig = NotificationService::debugMailConfig();
            
            // Test direct mail sending
            $to = $interview->job_application->user->email;
            $subject = "Test Email - Interview for " . $interview->job_application->job->title;
            
            Mail::raw("This is a test email for your interview scheduled on " . 
                $interview->scheduled_at->format('F j, Y g:i A') . ". If you received this, email is working correctly.", 
                function($message) use ($to, $subject) {
                    $message->to($to)->subject($subject);
                }
            );
            
            return back()->with('success', 'Test email sent successfully to ' . $to);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to send test email: ' . $e->getMessage())
                ->with('details', [
                    'mail_config' => NotificationService::debugMailConfig(),
                    'error_trace' => $e->getTraceAsString(),
                ]);
        }
    }
} 