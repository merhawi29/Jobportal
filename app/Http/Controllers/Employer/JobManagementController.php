<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Job;
use App\Models\JobApplication;
use App\Notifications\JobApplicationNotification;
use Illuminate\Support\Facades\DB;

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
            'status' => ['required', 'string', 'in:pending,shortlisted,hired,rejected']
        ]);

        // Make sure status is passed as a string
        $application->status = $validated['status'];
        $application->save();

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
            'status' => 'required|in:shortlisted,hired,rejected'
        ]);

        // Fix: Ensure status is properly quoted by using array syntax
        $application->status = $validated['status'];
        $application->save();

        // Send notification to job seeker
        $application->user->notify(new JobApplicationNotification(
            $application->job->title,
            $validated['status'],
            $validated['message']
        ));

        return back()->with('success', 'Notification sent successfully');
    }
} 