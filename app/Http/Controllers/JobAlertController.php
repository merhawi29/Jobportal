<?php

namespace App\Http\Controllers;

use App\Models\JobAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobAlertController extends Controller
{
    public function index()
    {
        $alerts = auth()->user()->jobAlerts()
            ->latest()
            ->paginate(10);

        return Inertia::render('JobSeeker/JobAlerts/Index', [
            'alerts' => $alerts
        ]);
    }

    public function create()
    {
        return Inertia::render('JobSeeker/JobAlerts/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_title' => 'nullable|string|max:255',
            'job_type' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gt:salary_min',
            'keywords' => 'nullable|string',
            'notification_type' => 'required|in:email,push,both',
            'frequency' => 'required|in:immediately,daily,weekly',
        ]);

        if (!empty($validated['keywords'])) {
            $validated['keywords'] = array_map('trim', explode(',', $validated['keywords']));
        }

        auth()->user()->jobAlerts()->create($validated);

        return redirect()->route('job-alerts.index')
            ->with('success', 'Job alert created successfully');
    }

    public function toggle(JobAlert $alert)
    {
        $this->authorize('update', $alert);
        
        $alert->update([
            'is_active' => !$alert->is_active
        ]);

        return back()->with('success', 'Alert status updated successfully');
    }

    public function destroy(JobAlert $alert)
    {
        $this->authorize('delete', $alert);
        
        $alert->delete();

        return back()->with('success', 'Alert deleted successfully');
    }
}

