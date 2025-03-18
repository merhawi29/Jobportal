<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Job;
use App\Models\JobApplication;

class JobManagementController extends Controller
{
    public function index()
    {
        $jobs = Job::where('user_id', auth()->id())
            ->with(['applications'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Employer/Jobs/Index', [
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

        return Inertia::render('Employer/Applications/Index', [
            'applications' => $applications
        ]);
    }
} 