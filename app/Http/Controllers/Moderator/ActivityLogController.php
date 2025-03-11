<?php

namespace App\Http\Controllers\Moderator;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')
            ->when($request->log_name, function ($query, $logName) {
                if ($logName !== 'all') {
                    $query->where('log_name', $logName);
                }
            })
            ->when($request->event, function ($query, $event) {
                if ($event !== 'all') {
                    $query->where('event', $event);
                }
            })
            ->when($request->search, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%");
            });

        $logs = $query->latest()->paginate(15);

        return Inertia::render('Moderator/ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['log_name', 'event', 'search'])
        ]);
    }
}
