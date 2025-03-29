<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\ActivityLog;
use App\Models\EmployerVerification;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $jobSeekerCount = User::where('role', User::ROLES['job_seeker'])->count();
            $jobCount = Job::count();
            $applicationCount = JobApplication::count();
            $employerCount = User::where('role', User::ROLES['employer'])->count();
            $pendingVerifications = EmployerVerification::where('status', 'pending')->count();
            $pendingJobs = Job::where('status', 'pending')->count();
            
            Log::info('Dashboard Stats:', [
                'job_seekers' => $jobSeekerCount,
                'jobs' => $jobCount,
                'applications' => $applicationCount,
                'employers' => $employerCount,
                'pending_verifications' => $pendingVerifications,
                'pending_jobs' => $pendingJobs
            ]);

            $stats = [
                'total_users' => $jobSeekerCount ?? 0,
                'total_jobs' => $jobCount ?? 0,
                'total_applications' => $applicationCount ?? 0,
                'total_employers' => $employerCount ?? 0,
                'pending_verifications' => $pendingVerifications ?? 0,
                'pending_jobs' => $pendingJobs ?? 0,
                'recent_activities' => ActivityLog::latest()
                    ->take(10)
                    ->get()
                    ->map(function ($activity) {
                        return [
                            'id' => $activity->id,
                            'description' => $activity->description,
                            'created_at' => $activity->created_at->toISOString(),
                        ];
                    })->toArray(),
            ];

            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching dashboard stats: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Inertia::render('Admin/Dashboard', [
                'stats' => null,
                'error' => 'Error fetching dashboard statistics. Please try again later.',
            ]);
        }
    }
} 