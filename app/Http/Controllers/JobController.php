<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Services\JobAlertService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class JobController extends Controller
{
    protected $jobAlertService;

    public function __construct(JobAlertService $jobAlertService)
    {
        // Only apply auth middleware to specific methods
        $this->middleware('auth')->only(['create', 'store', 'edit', 'update', 'destroy']);
        $this->jobAlertService = $jobAlertService;
    }

    public function create()
    {
        return Inertia::render('Employee/PostJob');
    }

    public function store(Request $request)
    {
        try {
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
            ]);

            // Parse salary range into min and max
            list($salary_min, $salary_max) = $this->parseSalaryRange($validated['salary_range']);

            $job = Job::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'company' => $validated['company'],
                'location' => $validated['location'],
                'type' => $validated['type'],
                'salary_range' => $validated['salary_range'],
                'salary_min' => $salary_min,
                'salary_max' => $salary_max,
                'description' => $validated['description'],
                'requirements' => $validated['requirements'],
                'benefits' => $validated['benefits'],
                'deadline' => $validated['deadline'],
                'status' => 'pending', // Jobs need moderator approval
            ]);

            // Job alerts will be processed after the job is approved by a moderator
            // See the approve method in the moderator's JobController

            return redirect()->route('jobs.show', $job->id)
                ->with('success', 'Job posted successfully! It will be reviewed by our moderators.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to create job posting. ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function show(Job $job)
    {
        $isSaved = false;
        $hasApplied = false;

        if (auth()->check()) {
            $isSaved = $job->savedBy()
                ->where('user_id', auth()->id())
                ->where('joblists_id', $job->id)
                ->exists();

            $hasApplied = $job->applications()
                ->where('user_id', auth()->id())
                ->exists();
        }

        return Inertia::render('Jobs/Show', [
            'job' => $job->load('user'),
            'isSaved' => $isSaved,
            'hasApplied' => $hasApplied
        ]);
    }

    public function index(Request $request)
    {
        $query = Job::with('user')->approved()->active();
        
        // Initialize filters array based on user role
        $filters = [];
        
        if (auth()->check()) {
            $userRole = auth()->user()->role;
            
            // Debug the user role
            Log::info('User role in JobController: ' . $userRole);
            
            if ($userRole === 'employer') {
                // For employers, use specific search parameters
                $filters = $request->only([
                    'name',
                    'experience',
                    'skills'
                ]);
                
                Log::info('Employer search filters: ', $filters);
            } else {
                // For job seekers, use limited search parameters
                $filters = $request->only([
                    'search',
                    'location',
                    'type'
                ]);
                
                Log::info('Job seeker search filters: ', $filters);
            }
        } else {
            // For guests, same as job seekers
            $filters = $request->only([
                'search',
                'location',
                'type'
            ]);
        }
        
        $query->filter($filters);
        
        $jobs = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $filters,
            'debug_role' => auth()->check() ? auth()->user()->role : 'guest' // Add this for debugging
        ]);
    }

    public function edit(Job $job)
    {
        // Check if user owns the job
        if ($job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Employee/EditJob', [
            'job' => $job
        ]);
    }

    public function update(Request $request, Job $job)
    {
        // Check if user owns the job
        if ($job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        try {
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
            ]);

            $job->update($validated);

            return redirect()->route('jobs.show', $job->id)
                ->with('success', 'Job updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to update job posting. ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function destroy(Job $job)
    {
        // Check if user owns the job
        if ($job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            $job->delete();
            return redirect()->route('jobs.index')
                ->with('success', 'Job deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to delete job posting. ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Parse salary range string into min and max values
     * 
     * @param string $salaryRange Format: "$min - $max" or "$amount"
     * @return array [$min, $max]
     */
    protected function parseSalaryRange(string $salaryRange): array
    {
        // Remove currency symbols and whitespace
        $clean = preg_replace('/[^\d\-]/', '', $salaryRange);
        
        // Split on hyphen if range
        $parts = explode('-', $clean);
        
        if (count($parts) === 2) {
            return [
                (float) trim($parts[0]),
                (float) trim($parts[1])
            ];
        }
        
        // Single value - use as both min and max
        $value = (float) $clean;
        return [$value, $value];
    }
}
