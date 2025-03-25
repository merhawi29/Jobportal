<?php

namespace App\Http\Controllers;

use App\Models\InterviewInvitation;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use App\Notifications\InterviewInvitation as InterviewInvitationNotification;
use Inertia\Inertia;
use App\Notifications\InterviewScheduled;
use App\Notifications\InterviewCancelled;

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

        // Notify the applicant
        $jobApplication->user->notify(new InterviewScheduled($interview));

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

        // Notify the applicant about the changes
        $interview->job_application->user->notify(new InterviewScheduled($interview));

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

    
    

    
    
} 