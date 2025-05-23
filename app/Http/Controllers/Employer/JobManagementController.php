<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Job;
use App\Models\JobApplication;
use App\Notifications\JobApplicationNotification;
use Illuminate\Support\Facades\DB;
use App\Notifications\InterviewScheduled;

class JobManagementController extends Controller
{
    public function index()
    {
        $jobs = Job::where('user_id', auth()->id())
            ->with(['applications'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Employee/Jobs/Index', [
            'jobs' => $jobs
        ]);
    }

    public function applications()
    {
        $applications = JobApplication::whereHas('job', function($query) {
            $query->where('user_id', auth()->id());
        })
        ->with(['job', 'user'])
        ->latest()
        ->paginate(10);

        return Inertia::render('Employee/Applications/Index', [
            'applications' => $applications
        ]);
    }

    public function show(JobApplication $application)
    {
        // Ensure the employer owns the job this application is for
        if ($application->job->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Employee/Applications/Show', [
            'application' => $application->load(['job', 'user'])
        ]);
    }

    public function updateStatus(Request $request, JobApplication $application)
    {
        // Ensure the employer owns the job this application is for
        if ($application->job->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,under_review,interview_scheduled,hired,rejected']
        ]);

        $application->update([
            'status' => $validated['status']
        ]);

        // Send notification to job seeker
        $application->user->notify(new JobApplicationNotification(
            $application->job->title,
            $validated['status'],
            $request->message ?? 'Your application status has been updated.'
        ));

        return back()->with('success', 'Application status updated successfully');
    }

    public function sendNotification(Request $request, JobApplication $application)
    {
        // Validate the employer owns this job application
        if ($application->job->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'message' => 'required|string|max:500',
            'status' => ['required', 'string', 'in:pending,under_review,interview_scheduled,hired,rejected']
        ]);

        $application->update([
            'status' => $validated['status']
        ]);

        // Send notification to job seeker
        $application->user->notify(new JobApplicationNotification(
            $application->job->title,
            $validated['status'],
            $validated['message']
        ));

        return redirect()->route('employer.applications.index')
            ->with('success', 'Notification sent successfully');
    }

    public function scheduleInterview(Request $request, JobApplication $application)
    {
        // Ensure the employer owns the job this application is for
        if ($application->job->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'scheduled_at' => 'required|date|after:now',
            'type' => 'required|in:in_person,video,phone',
            'location' => 'required|string|max:255',
            'message' => 'nullable|string|max:1000'
        ]);

        // Create interview invitation
        $interview = $application->interviews()->create([
            'scheduled_at' => $validated['scheduled_at'],
            'type' => $validated['type'],
            'location' => $validated['location'],
            'notes' => $validated['message'],
            'status' => 'pending'
        ]);

        // Update application status
        $application->update(['status' => 'interview_scheduled']);

        try {
            // Notify the applicant
            $application->user->notify(new InterviewScheduled($interview));
            
            // Log successful notification
            \Illuminate\Support\Facades\Log::info('Interview notification sent successfully', [
                'interview_id' => $interview->id,
                'user_id' => $application->user->id
            ]);
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Illuminate\Support\Facades\Log::error('Failed to send interview notification', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'interview_id' => $interview->id,
                'user_id' => $application->user->id
            ]);
        }

        return redirect()->route('employer.applications.index')
            ->with('success', 'Interview scheduled successfully');
    }
} 