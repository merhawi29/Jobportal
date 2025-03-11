<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class JobApplicationController extends Controller
{
    public function index()
    {
        $applications = JobApplication::with('job')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('JobSeeker/Applications/Index', [
            'applications' => $applications
        ]);
    }

    public function store(Request $request, Job $job)
    {
        // Check if user has already applied
        $existingApplication = JobApplication::where('user_id', auth()->id())
            ->where('job_id', $job->id)
            ->first();

        if ($existingApplication) {
            return back()->with('error', 'You have already applied for this job!');
        }

        // Validate request
        $validated = $request->validate([
            'cover_letter' => 'required|string|min:100',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        // Store resume
        $resumePath = $request->file('resume')->store('resumes');

        // Create application
        JobApplication::create([
            'user_id' => auth()->id(),
            'job_id' => $job->id,
            'cover_letter' => $validated['cover_letter'],
            'resume' => $resumePath,
            'status' => 'pending'
        ]);

        return redirect()->route('applications.index')
            ->with('success', 'Application submitted successfully!');
    }

    public function show(JobApplication $application)
    {
        // Ensure user can only view their own applications
        if ($application->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('JobSeeker/Applications/Show', [
            'application' => $application->load('job')
        ]);
    }

    public function destroy(JobApplication $application)
    {
        // Ensure user can only delete their own applications
        if ($application->user_id !== auth()->id()) {
            abort(403);
        }

        // Delete resume file if exists
        if ($application->resume) {
            Storage::delete($application->resume);
        }

        $application->delete();

        return redirect()->route('applications.index')
            ->with('success', 'Application withdrawn successfully.');
    }
}

