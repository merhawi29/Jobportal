<?php

namespace App\Http\Controllers;

use App\Models\SavedJob;
use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SavedJobController extends Controller
{
    public function index()
    {
        $savedJobs = SavedJob::with('job')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('JobSeeker/SavedJobs/Index', [
            'savedJobs' => $savedJobs
        ]);
    }

    public function store(Job $job)
    {
        $savedJob = SavedJob::where('user_id', auth()->id())
            ->where('job_id', $job->id)
            ->first();

        if ($savedJob) {
            return back()->with('error', 'Job already saved!');
        }

        SavedJob::create([
            'user_id' => auth()->id(),
            'job_id' => $job->id
        ]);

        return back()->with('success', 'Job saved successfully!');
    }

    public function destroy(Job $job)
    {
        SavedJob::where('user_id', auth()->id())
            ->where('job_id', $job->id)
            ->delete();

        return back()->with('success', 'Job removed from saved list.');
    }
}
