<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\ActivityLog;
use App\Models\EmployerVerification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // Basic stats
            $jobSeekerCount = User::where('role', User::ROLES['job_seeker'])->count();
            $jobCount = Job::count();
            $applicationCount = JobApplication::count();
            $employerCount = User::where('role', User::ROLES['employer'])->count();
            $pendingVerifications = EmployerVerification::where('status', 'pending')->count();
            $pendingJobs = Job::where('status', 'pending')->count();

            // Get job applications for the last 7 days
            $lastWeekApplications = JobApplication::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
                ->where('created_at', '>=', Carbon::now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [Carbon::parse($item->date)->format('Y-m-d') => $item->count];
                })
                ->toArray();

            // Get top job categories
            $topJobCategories = Job::select('category', DB::raw('COUNT(*) as count'))
                ->groupBy('category')
                ->orderByDesc('count')
                ->limit(5)
                ->get()
                ->toArray();

            // Get application success rate
            $totalApplications = JobApplication::count();
            $successfulApplications = JobApplication::where('status', 'accepted')->count();
            $applicationSuccessRate = $totalApplications > 0 
                ? round(($successfulApplications / $totalApplications) * 100, 2)
                : 0;

            // Get employer verification stats
            $verificationStats = [
                'pending' => EmployerVerification::where('status', 'pending')->count(),
                'verified' => EmployerVerification::where('status', 'verified')->count(),
                'rejected' => EmployerVerification::where('status', 'rejected')->count(),
            ];

            // Get user growth trend
            $userGrowth = User::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [Carbon::parse($item->date)->format('Y-m-d') => $item->count];
                })
                ->toArray();

            $stats = [
                // Basic stats
                'total_users' => $jobSeekerCount ?? 0,
                'total_jobs' => $jobCount ?? 0,
                'total_applications' => $applicationCount ?? 0,
                'total_employers' => $employerCount ?? 0,
                'pending_verifications' => $pendingVerifications ?? 0,
                'pending_jobs' => $pendingJobs ?? 0,

                // Enhanced analytics
                'applications_trend' => $lastWeekApplications,
                'top_job_categories' => $topJobCategories,
                'application_success_rate' => $applicationSuccessRate,
                'verification_stats' => $verificationStats,
                'user_growth' => $userGrowth,

                // Job market health indicators
                'jobs_per_employer' => $employerCount > 0 ? round($jobCount / $employerCount, 2) : 0,
                'applications_per_job' => $jobCount > 0 ? round($applicationCount / $jobCount, 2) : 0,

                // Recent activities
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