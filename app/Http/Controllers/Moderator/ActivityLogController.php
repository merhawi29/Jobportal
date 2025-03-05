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
        $query = ActivityLog::with(['moderator', 'target'])
            ->latest();

        // Filter by action type if provided
        if ($request->has('action_type')) {
            $query->where('action_type', $request->action_type);
        }

        // Filter by date range if provided
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $logs = $query->paginate(15)
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'moderator' => [
                        'id' => $log->moderator->id,
                        'name' => $log->moderator->name,
                    ],
                    'action_type' => $log->action_type,
                    'target_type' => $log->target_type,
                    'target_id' => $log->target_id,
                    'reason' => $log->reason,
                    'details' => $log->details,
                    'created_at' => $log->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Moderator/ActivityLogs', [
            'logs' => $logs,
            'filters' => $request->only(['action_type', 'from_date', 'to_date']),
        ]);
    }
}
