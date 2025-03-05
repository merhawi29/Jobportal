<?php

namespace App\Http\Controllers\Moderator;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['reporter', 'target'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Moderator/Reports/Index', [
            'reports' => $reports
        ]);
    }

    public function resolve(Report $report, Request $request)
    {
        $report->update([
            'status' => 'resolved',
            'resolution_notes' => $request->notes
        ]);

        // Log the action
        activity()
            ->performedOn($report)
            ->causedBy(auth()->user())
            ->withProperties(['notes' => $request->notes])
            ->log('report_resolved');

        return back()->with('success', 'Report has been resolved.');
    }

    public function dismiss(Report $report, Request $request)
    {
        $report->update([
            'status' => 'dismissed',
            'dismissal_reason' => $request->reason
        ]);

        // Log the action
        activity()
            ->performedOn($report)
            ->causedBy(auth()->user())
            ->withProperties(['reason' => $request->reason])
            ->log('report_dismissed');

        return back()->with('success', 'Report has been dismissed.');
    }
}
