<?php

namespace App\Http\Controllers\Moderator;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\User;
use App\Models\Report;
use App\Models\ModeratorAction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalJobs' => Job::count(),
            'activeJobs' => Job::where('status', 'active')->count(),
            'totalUsers' => User::where('role', '!=', 'moderator')->count(),
            'pendingReports' => Report::where('status', 'pending')->count(),
        ];

        $recentActivities = ModeratorAction::with(['moderator'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($action) {
                return [
                    'id' => $action->id,
                    'action' => ucfirst(str_replace('_', ' ', $action->action_type)),
                    'description' => $this->getActionDescription($action),
                    'date' => $action->created_at->diffForHumans(),
                    'status' => $this->getActionStatus($action->action_type)
                ];
            });

        $pendingJobs = Job::where('moderation_status', 'pending')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $pendingReports = Report::where('status', 'pending')
            ->with(['reporter', 'reported'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Moderator/Dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'pendingJobs' => $pendingJobs,
            'pendingReports' => $pendingReports
        ]);
    }

    private function getActionDescription($action)
    {
        switch ($action->action_type) {
            case 'job_review':
                return "Job '{$action->details['job_title']}' was {$action->action}ed";
            case 'user_ban':
                return "User was banned for {$action->details['duration']} days";
            case 'user_warning':
                return "Warning issued to user";
            case 'user_unban':
                return "User was unbanned";
            case 'report_resolve':
                return "Report resolved with action: {$action->details['action_taken']}";
            case 'report_dismiss':
                return "Report was dismissed";
            default:
                return ucfirst(str_replace('_', ' ', $action->action_type));
        }
    }

    private function getActionStatus($actionType)
    {
        switch ($actionType) {
            case 'job_review':
                return 'success';
            case 'user_ban':
                return 'danger';
            case 'user_warning':
                return 'warning';
            case 'report_resolve':
                return 'info';
            case 'report_dismiss':
                return 'secondary';
            default:
                return 'primary';
        }
    }
}
