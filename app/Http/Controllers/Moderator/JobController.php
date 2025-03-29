<?php

namespace App\Http\Controllers\Moderator;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Services\JobAlertService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Gate;

class JobsController extends Controller
{
    protected $jobAlertService;

    public function __construct(JobAlertService $jobAlertService)
    {
        $this->jobAlertService = $jobAlertService;
    }

    public function index(Request $request)
    {
        $query = Job::with('user');

        // Apply filters
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('moderation_status') && $request->moderation_status !== 'all') {
            $query->where('moderation_status', $request->moderation_status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        switch ($request->sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'title':
                $query->orderBy('title', 'asc');
                break;
            default:
                $query->latest();
        }

        $jobs = $query->paginate(10)->withQueryString();

        return Inertia::render('Moderator/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only(['status', 'moderation_status', 'search'])
        ]);
    }

    public function edit(Job $job)
    {
        return Inertia::render('Moderator/Jobs/Edit', [
            'job' => $job->load('user')
        ]);
    }

    public function update(Request $request, Job $job)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'type' => 'required|string|in:Full-time,Part-time,Contract,Freelance,Internship',
            'salary_range' => 'required|string|max:100',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'benefits' => 'required|string',
            'deadline' => 'required|date|after:today',
            'status' => 'required|string|in:active,inactive,closed',
            'moderation_status' => 'required|string|in:pending,approved,rejected',
            'moderation_reason' => 'nullable|string|max:255'
        ]);

        $job->update($validated);

        // Log the action
        activity()
            ->performedOn($job)
            ->causedBy(auth()->user())
            ->withProperties($validated)
            ->log('job_updated');

        return redirect()->route('moderator.jobs.index')
            ->with('success', 'Job updated successfully.');
    }

    public function approve(Job $job)
    {
        // Update job status
        $job->update([
            'status' => 'active',
            'moderation_status' => 'approved'
        ]);

        // Process job alerts
        $this->jobAlertService->processNewJob($job);

        // Log the action
        activity()
            ->performedOn($job)
            ->causedBy(auth()->user())
            ->log('job_approved');

        return back()->with('success', 'Job has been approved and notifications have been sent to matching job seekers.');
    }

    public function reject(Job $job, Request $request)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:255'
        ]);

        $job->update([
            'moderation_status' => 'rejected',
            'moderation_reason' => $validated['reason']
        ]);

        // Log the action
        activity()
            ->performedOn($job)
            ->causedBy(auth()->user())
            ->withProperties(['reason' => $validated['reason']])
            ->log('job_rejected');

        return back()->with('success', 'Job has been rejected.');
    }

    public function destroy(Job $job)
    {
        // Log the action before deletion
        activity()
            ->performedOn($job)
            ->causedBy(auth()->user())
            ->log('job_deleted');

        $job->delete();

        return back()->with('success', 'Job has been deleted.');
    }
}
