<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
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
        return Inertia::render('Jobs/Show', [
            'job' => $job->load('user')
        ]);
    }

    public function index()
    {
        $jobs = Job::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs
        ]);
    }
}
