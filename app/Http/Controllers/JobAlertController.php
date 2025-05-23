<?php

namespace App\Http\Controllers;

use App\Models\JobAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class JobAlertController extends Controller
{
    /**
     * Display a listing of job alerts.
     */
    public function index()
    {
        $jobAlerts = JobAlert::where('user_id', Auth::id())->get();
        
        return Inertia::render('JobSeeker/JobAlerts/Index', [
            'jobAlerts' => $jobAlerts
        ]);
    }

    /**
     * Show the form for creating a new job alert.
     */
    public function create()
    {
        // Get job categories and types for dropdown options
        $categories = \App\Models\JobCategory::pluck('name', 'id');
        $jobTypes = \App\Models\JobType::pluck('name', 'id');
        
        return Inertia::render('JobSeeker/JobAlerts/Create', [
            'categories' => $categories,
            'jobTypes' => $jobTypes
        ]);
    }

    /**
     * Store a newly created job alert in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'keywords' => 'nullable|array',
            'location' => 'nullable|string|max:100',
            'categories' => 'nullable|array',
            'job_types' => 'nullable|array',
            'min_salary' => 'nullable|numeric|min:0',
            'max_salary' => 'nullable|numeric|gt:min_salary',
            'frequency' => ['required', Rule::in(['daily', 'weekly', 'immediate'])],
            'notification_method' => ['required', Rule::in(['email', 'push', 'both'])],
        ]);
        
        $validated['user_id'] = Auth::id();
        
        JobAlert::create($validated);
        
        return redirect()->route('job-alerts.index')
            ->with('success', 'Job alert created successfully.');
    }

    /**
     * Show the form for editing the specified job alert.
     */
    public function edit(JobAlert $jobAlert)
    {
        $this->authorize('update', $jobAlert);
        
        $categories = \App\Models\JobCategory::pluck('name', 'id');
        $jobTypes = \App\Models\JobType::pluck('name', 'id');
        
        return Inertia::render('JobSeeker/JobAlerts/Edit', [
            'jobAlert' => $jobAlert,
            'categories' => $categories,
            'jobTypes' => $jobTypes
        ]);
    }

    /**
     * Update the specified job alert in storage.
     */
    public function update(Request $request, JobAlert $jobAlert)
    {
        $this->authorize('update', $jobAlert);
        
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'keywords' => 'nullable|array',
            'location' => 'nullable|string|max:100',
            'categories' => 'nullable|array',
            'job_types' => 'nullable|array',
            'min_salary' => 'nullable|numeric|min:0',
            'max_salary' => 'nullable|numeric|gt:min_salary',
            'frequency' => ['required', Rule::in(['daily', 'weekly', 'immediate'])],
            'notification_method' => ['required', Rule::in(['email', 'push', 'both'])],
            'is_active' => 'boolean',
        ]);
        
        $jobAlert->update($validated);
        
        return redirect()->route('job-alerts.index')
            ->with('success', 'Job alert updated successfully.');
    }

    /**
     * Remove the specified job alert from storage.
     */
    public function destroy(JobAlert $jobAlert)
    {
        $this->authorize('delete', $jobAlert);
        
        $jobAlert->delete();
        
        return redirect()->route('job-alerts.index')
            ->with('success', 'Job alert deleted successfully.');
    }

    /**
     * Toggle the active status of a job alert.
     */
    public function toggleStatus(JobAlert $jobAlert)
    {
        $this->authorize('update', $jobAlert);
        
        $jobAlert->update([
            'is_active' => !$jobAlert->is_active
        ]);
        
        return redirect()->route('job-alerts.index')
            ->with('success', 'Job alert status updated successfully.');
    }
} 