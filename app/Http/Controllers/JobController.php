<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    public function __construct()
    {
        // Only apply auth middleware to specific methods
        $this->middleware('auth')->only(['create', 'store']);
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

            $job = Job::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'company' => $validated['company'],
                'location' => $validated['location'],
                'type' => $validated['type'],
                'salary_range' => $validated['salary_range'],
                'description' => $validated['description'],
                'requirements' => $validated['requirements'],
                'benefits' => $validated['benefits'],
                'deadline' => $validated['deadline'],
                'status' => 'pending', // Jobs need moderator approval
            ]);

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
        $query = Job::with('user');

        // Search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Job type filter
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $jobs = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'type'])
        ]);
    }
}
