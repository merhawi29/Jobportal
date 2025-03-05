<?php

namespace App\Http\Controllers\Moderator;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\User;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $stats = [
            'jobStats' => [
                'total' => Job::count(),
                'active' => Job::where('status', 'active')->count(),
                'pending' => Job::where('moderation_status', 'pending')->count(),
                'rejected' => Job::where('moderation_status', 'rejected')->count(),
            ],
            'userStats' => [
                'total' => User::where('role', '!=', 'moderator')->count(),
                'active' => User::where('status', 'active')->count(),
                'banned' => User::where('status', 'banned')->count(),
            ],
            'reportStats' => [
                'total' => Report::count(),
                'pending' => Report::where('status', 'pending')->count(),
                'resolved' => Report::where('status', 'resolved')->count(),
                'dismissed' => Report::where('status', 'dismissed')->count(),
            ],
        ];

        return Inertia::render('Moderator/Analytics', [
            'stats' => $stats
        ]);
    }
}
