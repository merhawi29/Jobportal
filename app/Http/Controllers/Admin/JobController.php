<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index()
    {
        try {
            $jobs = Job::with('user')
                ->latest()
                ->get()
                ->map(function ($job) {
                    return [
                        'id' => $job->id,
                        'title' => $job->title,
                        'company' => $job->company,
                        'location' => $job->location,
                        'type' => $job->type,
                        'salary_range' => $job->salary_range,
                        'description' => $job->description,
                        'requirements' => $job->requirements,
                        'benefits' => $job->benefits,
                        'deadline' => $job->deadline,
                        'status' => $job->status,
                        'created_at' => $job->created_at,
                        'updated_at' => $job->updated_at,
                        'user' => [
                            'id' => $job->user->id,
                            'name' => $job->user->name,
                            'verified' => $job->user->verified,
                        ],
                    ];
                });

            return response()->json($jobs);
        } catch (\Exception $e) {
            Log::error('Error fetching jobs: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch jobs'], 500);
        }
    }

    public function approve(Job $job)
    {
        try {
            $job->update(['status' => 'approved']);
            return response()->json(['message' => 'Job approved successfully']);
        } catch (\Exception $e) {
            Log::error('Error approving job: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to approve job'], 500);
        }
    }

    public function reject(Job $job)
    {
        try {
            $job->update(['status' => 'rejected']);
            return response()->json(['message' => 'Job rejected successfully']);
        } catch (\Exception $e) {
            Log::error('Error rejecting job: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to reject job'], 500);
        }
    }

    public function edit(Job $job)
    {
        try {
            $jobData = [
                'id' => $job->id,
                'title' => $job->title,
                'company' => $job->company,
                'location' => $job->location,
                'type' => $job->type,
                'salary_range' => $job->salary_range,
                'description' => $job->description,
                'requirements' => $job->requirements,
                'benefits' => $job->benefits,
                'deadline' => $job->deadline,
                'status' => $job->status,
                'created_at' => $job->created_at,
                'updated_at' => $job->updated_at,
                'user' => [
                    'id' => $job->user->id,
                    'name' => $job->user->name,
                ],
            ];

            return Inertia::render('Admin/Jobs/Edit', [
                'job' => $jobData
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading job for edit: ' . $e->getMessage());
            return back()->with('error', 'Failed to load job for editing');
        }
    }

    public function update(Request $request, Job $job)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'company' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'type' => 'required|string',
                'salary_range' => 'required|string',
                'description' => 'required|string',
                'requirements' => 'required|string',
                'benefits' => 'required|string',
                'deadline' => 'required|date',
            ]);

            $job->update($validated);
            return response()->json(['message' => 'Job updated successfully']);
        } catch (\Exception $e) {
            Log::error('Error updating job: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update job'], 500);
        }
    }

    public function destroy(Job $job)
    {
        try {
            // Delete associated job applications first
            $job->applications()->delete();
            
            // Delete the job
            $job->delete();
            
            return response()->json(['message' => 'Job deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting job: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete job'], 500);
        }
    }
} 