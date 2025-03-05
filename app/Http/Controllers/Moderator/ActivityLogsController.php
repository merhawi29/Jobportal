<?php

namespace App\Http\Controllers\Moderator;

use App\Http\Controllers\Controller;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogsController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with(['causer', 'subject']);

        // Apply filters
        if ($request->filled('log_name') && $request->log_name !== 'all') {
            $query->where('log_name', $request->log_name);
        }

        if ($request->filled('event') && $request->event !== 'all') {
            $query->where('event', $request->event);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('causer', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply sorting
        switch ($request->sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->latest();
        }

        $logs = $query->paginate(10)->withQueryString();

        return Inertia::render('Moderator/ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['log_name', 'event', 'search'])
        ]);
    }

    public function show(Activity $activity)
    {
        return Inertia::render('Moderator/ActivityLogs/Show', [
            'activity' => $activity->load(['causer', 'subject'])
        ]);
    }
}
