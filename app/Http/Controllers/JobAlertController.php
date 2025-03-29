<?php

namespace App\Http\Controllers;

use App\Models\JobAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobAlertController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the user's job alerts
     */
    public function index()
    {
        $alerts = JobAlert::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('JobSeeker/Alerts/Index', [
            'alerts' => $alerts
        ]);
    }

    /**
     * Show the form for creating a new job alert
     */
    public function create()
    {
        return Inertia::render('JobSeeker/Alerts/Create');
    }

    /**
     * Store a newly created job alert
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_title' => 'nullable|string|max:255',
            'job_type' => 'nullable|string|in:Full-time,Part-time,Contract,Freelance,Internship',
            'location' => 'nullable|string|max:255',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|gt:salary_min',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:50',
            'notification_type' => 'required|string|in:email,push,both',
            'frequency' => 'required|string|in:immediately,daily,weekly'
        ]);

        $alert = JobAlert::create([
            'user_id' => auth()->id(),
            ...$validated,
            'is_active' => true
        ]);

        return redirect()->route('job-alerts.index')
            ->with('success', 'Job alert created successfully.');
    }

    /**
     * Show the form for editing a job alert
     */
    public function edit(JobAlert $jobAlert)
    {
        // Ensure user owns the alert
        if ($jobAlert->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('JobSeeker/Alerts/Edit', [
            'alert' => $jobAlert
        ]);
    }

    /**
     * Update the specified job alert
     */
    public function update(Request $request, JobAlert $jobAlert)
    {
        // Ensure user owns the alert
        if ($jobAlert->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'job_title' => 'nullable|string|max:255',
            'job_type' => 'nullable|string|in:Full-time,Part-time,Contract,Freelance,Internship',
            'location' => 'nullable|string|max:255',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|gt:salary_min',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:50',
            'notification_type' => 'required|string|in:email,push,both',
            'frequency' => 'required|string|in:immediately,daily,weekly',
            'is_active' => 'required|boolean'
        ]);

        $jobAlert->update($validated);

        return redirect()->route('job-alerts.index')
            ->with('success', 'Job alert updated successfully.');
    }

    /**
     * Toggle the active status of a job alert
     */
    public function toggle(JobAlert $jobAlert)
    {
        // Ensure user owns the alert
        if ($jobAlert->user_id !== auth()->id()) {
            abort(403);
        }

        $jobAlert->update([
            'is_active' => !$jobAlert->is_active
        ]);

        return back()->with('success', 
            $jobAlert->is_active 
                ? 'Job alert has been activated.' 
                : 'Job alert has been deactivated.'
        );
    }

    /**
     * Remove the specified job alert
     */
    public function destroy(JobAlert $jobAlert)
    {
        // Ensure user owns the alert
        if ($jobAlert->user_id !== auth()->id()) {
            abort(403);
        }

        $jobAlert->delete();

        return redirect()->route('job-alerts.index')
            ->with('success', 'Job alert deleted successfully.');
    }
}

