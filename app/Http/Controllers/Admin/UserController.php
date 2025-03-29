<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
    public function jobSeekersIndex()
    {
        try {
            return Inertia::render('Admin/Users/JobSeekers/Index');
        } catch (\Exception $e) {
            Log::error('Error loading job seekers page: ' . $e->getMessage());
            return back()->with('error', 'Failed to load job seekers page');
        }
    }

    public function jobSeekers()
    {
        try {
            $jobSeekers = User::where('role', User::ROLES['job_seeker'])
                ->with('jobSeekerProfile')
                ->latest()
                ->get();

            return response()->json($jobSeekers);
        } catch (\Exception $e) {
            Log::error('Error fetching job seekers: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch job seekers'], 500);
        }
    }

    public function employers()
    {
        try {
            $employers = User::where('role', User::ROLES['employer'])
                ->with('employerProfile')
                ->latest()
                ->get()
                ->map(function ($user) {
                    $data = $user->toArray();
                    if (!$user->employerProfile) {
                        $data['employer_profile'] = [
                            'company_name' => 'Not Set',
                            'company_website' => null,
                            'company_size' => null,
                            'industry' => null,
                            'company_description' => null,
                            'location' => null,
                            'position' => null,
                            'department' => null,
                            'hire_date' => null,
                            'photo' => null,
                            'country' => null,
                            'status' => 'pending'
                        ];
                    }
                    return $data;
                });

            return response()->json($employers);
        } catch (\Exception $e) {
            Log::error('Error fetching employers: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch employers'], 500);
        }
    }

    public function suspendJobSeeker(User $user)
    {
        try {
            if ($user->role !== User::ROLES['job_seeker']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $user->update(['status' => User::STATUSES['suspended']]);
            return response()->json(['message' => 'User suspended successfully']);
        } catch (\Exception $e) {
            Log::error('Error suspending user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to suspend user'], 500);
        }
    }

    public function activateJobSeeker(User $user)
    {
        try {
            if ($user->role !== User::ROLES['job_seeker']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $user->update(['status' => User::STATUSES['active']]);
            return response()->json(['message' => 'User activated successfully']);
        } catch (\Exception $e) {
            Log::error('Error activating user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to activate user'], 500);
        }
    }

    public function deleteJobSeeker(User $user)
    {
        try {
            if ($user->role !== User::ROLES['job_seeker']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $user->delete();
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete user'], 500);
        }
    }

    public function suspendEmployer(User $user)
    {
        try {
            if ($user->role !== User::ROLES['employer']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $user->update(['status' => User::STATUSES['suspended']]);
            return response()->json(['message' => 'Employer suspended successfully']);
        } catch (\Exception $e) {
            Log::error('Error suspending employer: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to suspend employer'], 500);
        }
    }

    public function activateEmployer(User $user)
    {
        try {
            if ($user->role !== User::ROLES['employer']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $user->update(['status' => User::STATUSES['active']]);
            return response()->json(['message' => 'Employer activated successfully']);
        } catch (\Exception $e) {
            Log::error('Error activating employer: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to activate employer'], 500);
        }
    }

    public function deleteEmployer(User $user)
    {
        try {
            if ($user->role !== User::ROLES['employer']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $user->delete();
            return response()->json(['message' => 'Employer deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting employer: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete employer'], 500);
        }
    }

    public function edit(User $user)
    {
        try {
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ];

            if ($user->role === 'job_seeker') {
                $userData['job_seeker_profile'] = $user->jobSeekerProfile;
                return Inertia::render('Admin/Users/JobSeekers/Edit', [
                    'jobSeeker' => $userData
                ]);
            } elseif ($user->role === 'employer') {
                $userData['employer_profile'] = $user->employerProfile;
                return Inertia::render('Admin/Users/Employers/Edit', [
                    'employer' => $userData
                ]);
            }

            return back()->with('error', 'Invalid user role');
        } catch (\Exception $e) {
            Log::error('Error loading user for edit: ' . $e->getMessage());
            return back()->with('error', 'Failed to load user for editing');
        }
    }

    public function update(Request $request, User $user)
    {
        try {
            // Validate user data
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'phone' => 'nullable|string|max:20',
                'status' => 'required|in:active,suspended',
            ]);

            // Update user data
            $user->update($validated);

            // If user is an employer, update employer profile
            if ($user->role === User::ROLES['employer']) {
                $employerData = $request->validate([
                    'company_name' => 'required|string|max:255',
                    'company_website' => 'nullable|url',
                    'industry' => 'required|string|max:255',
                    'company_size' => 'required|string',
                    'company_description' => 'required|string',
                    'location' => 'nullable|string|max:255',
                    'position' => 'nullable|string|max:255',
                    'department' => 'nullable|string|max:255',
                    'country' => 'nullable|string|max:255',
                    'status' => 'nullable|string|in:pending,verified,rejected'
                ]);

                // Update or create employer profile
                $user->employerProfile()->updateOrCreate(
                    ['user_id' => $user->id],
                    $employerData
                );
            }

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user->load('employerProfile')
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to update user: ' . $e->getMessage()], 500);
        }
    }

    public function editJobSeeker(User $user)
    {
        if ($user->role !== User::ROLES['job_seeker']) {
            abort(404);
        }

        return Inertia::render('Admin/Users/JobSeekers/Edit', [
            'jobSeeker' => $user->load('jobSeekerProfile')
        ]);
    }

    public function updateJobSeeker(Request $request, User $user)
    {
        if ($user->role !== User::ROLES['job_seeker']) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'status' => 'required|in:active,suspended'
        ]);

        $user->update($validated);

        return redirect()->route('admin.users.job-seekers.index')
            ->with('success', 'Job seeker updated successfully');
    }
} 