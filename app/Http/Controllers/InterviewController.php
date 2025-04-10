<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InterviewController extends Controller
{
    public function index()
    {
        // List all interviews
    }

    public function create()
    {
        // Show create form
    }

    public function store(Request $request)
    {
        // Store new interview
    }

    public function show(Interview $interview)
    {
        // Show single interview
    }

    public function edit(Interview $interview)
    {
        return Inertia::render('Employee/Interviews/Edit', [
            'interview' => $interview->load(['job_application.user', 'job_application.job'])
        ]);
    }

    public function update(Request $request, Interview $interview)
    {
        $validated = $request->validate([
            'scheduled_at' => 'required|date',
            'location' => 'required|string',
            'type' => 'required|in:in_person,video,phone',
            'notes' => 'nullable|string',
            'status' => 'required|string'
        ]);

        $interview->update($validated);

        return back()->with('success', 'Interview updated successfully.');
    }

    public function destroy(Interview $interview)
    {
        $interview->delete();
        
        return redirect()->back()->with('success', 'Interview cancelled successfully.');
    }
} 