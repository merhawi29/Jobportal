<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

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
                ->with('employeeProfile')
                ->latest()
                ->get()
                ->map(function ($user) {
                    $data = $user->toArray();
                    if (!$user->employeeProfile) {
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
                            'status' => 'inactive'
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
                $userData['employer_profile'] = $user->employeeProfile;
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
                $user->employeeProfile()->updateOrCreate(
                    ['user_id' => $user->id],
                    $employerData
                );
            }

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user->load('employeeProfile')
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

    public function banJobSeeker(User $user, Request $request)
    {
        try {
            if ($user->role !== User::ROLES['job_seeker']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $banDuration = $request->duration ?? 30; // Default to 30 days if not specified
            $bannedUntil = now()->addDays($banDuration);

            $user->update([
                'status' => User::STATUSES['banned'],
                'ban_reason' => $request->reason,
                'banned_until' => $bannedUntil
            ]);

            // Log the action
            activity()
                ->performedOn($user)
                ->causedBy(auth()->user())
                ->withProperties([
                    'reason' => $request->reason,
                    'duration' => $banDuration,
                    'banned_until' => $bannedUntil
                ])
                ->log('user_banned');

            return response()->json(['message' => 'User banned successfully']);
        } catch (\Exception $e) {
            Log::error('Error banning user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to ban user'], 500);
        }
    }

    public function unbanJobSeeker(User $user)
    {
        try {
            if ($user->role !== User::ROLES['job_seeker']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $user->update([
                'status' => User::STATUSES['active'],
                'ban_reason' => null,
                'banned_until' => null
            ]);

            // Log the action
            activity()
                ->performedOn($user)
                ->causedBy(auth()->user())
                ->log('user_unbanned');

            return response()->json(['message' => 'User unbanned successfully']);
        } catch (\Exception $e) {
            Log::error('Error unbanning user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to unban user'], 500);
        }
    }

    public function banEmployer(User $user, Request $request)
    {
        try {
            if ($user->role !== User::ROLES['employer']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $banDuration = $request->duration ?? 30; // Default to 30 days if not specified
            $bannedUntil = now()->addDays($banDuration);

            $user->update([
                'status' => User::STATUSES['banned'],
                'ban_reason' => $request->reason,
                'banned_until' => $bannedUntil
            ]);

            // Log the action
            activity()
                ->performedOn($user)
                ->causedBy(auth()->user())
                ->withProperties([
                    'reason' => $request->reason,
                    'duration' => $banDuration,
                    'banned_until' => $bannedUntil
                ])
                ->log('employer_banned');

            return response()->json(['message' => 'Employer banned successfully']);
        } catch (\Exception $e) {
            Log::error('Error banning employer: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to ban employer'], 500);
        }
    }

    public function unbanEmployer(User $user)
    {
        try {
            if ($user->role !== User::ROLES['employer']) {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            $user->update([
                'status' => User::STATUSES['active'],
                'ban_reason' => null,
                'banned_until' => null
            ]);

            // Log the action
            activity()
                ->performedOn($user)
                ->causedBy(auth()->user())
                ->log('employer_unbanned');

            return response()->json(['message' => 'Employer unbanned successfully']);
        } catch (\Exception $e) {
            Log::error('Error unbanning employer: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to unban employer'], 500);
        }
    }

    public function createJobSeeker()
    {
        try {
            return Inertia::render('Admin/Users/JobSeekers/Create');
        } catch (\Exception $e) {
            Log::error('Error loading create job seeker page: ' . $e->getMessage());
            return back()->with('error', 'Failed to load create job seeker page');
        }
    }

    public function storeJobSeeker(Request $request)
    {
        try {
            // Validate request data
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:8|confirmed',
                'phone' => 'nullable|string|max:20',
            ]);

            // Create the user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'role' => User::ROLES['job_seeker'],
                'status' => User::STATUSES['active']
            ]);

            // Create job seeker profile
            $user->jobSeekerProfile()->create([
                'skills' => json_encode([]),
                'experience' => json_encode([]),
                'education' => json_encode([]),
                'location' => '',
                'about' => '',
                'linkedin_url' => null,
                'github_url' => null,
                'is_public' => true,
                'show_email' => true,
                'show_phone' => true,
                'show_education' => true,
                'show_experience' => true,
                'show_skills' => true,
                'show_social_links' => true,
                'show_resume' => true
            ]);

            return response()->json([
                'message' => 'Job seeker created successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating job seeker: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create job seeker: ' . $e->getMessage()], 500);
        }
    }

    public function createEmployer()
    {
        try {
            return Inertia::render('Admin/Users/Employers/Create');
        } catch (\Exception $e) {
            Log::error('Error loading create employer page: ' . $e->getMessage());
            return back()->with('error', 'Failed to load create employer page');
        }
    }

    public function storeEmployer(Request $request)
    {
        try {
            // Validate request data
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:8|confirmed',
                'phone' => 'nullable|string|max:20',
                'company_name' => 'required|string|max:255',
                'company_website' => 'nullable|url',
                'industry' => 'required|string|max:255',
                'company_size' => 'required|string',
                'company_description' => 'required|string',
                'location' => 'nullable|string|max:255',
                'country' => 'nullable|string|max:255',
            ]);

            // Create the user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'role' => User::ROLES['employer'],
                'status' => User::STATUSES['active']
            ]);

            // Log for debugging
            Log::info('User created successfully, creating employer profile next', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            try {
                // Create employer profile - use employeeProfile instead of employerProfile
                $employerProfile = $user->employeeProfile()->create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'company_name' => $validated['company_name'],
                    'company_website' => $validated['company_website'] ?? null,
                    'industry' => $validated['industry'],
                    'company_size' => $validated['company_size'],
                    'company_description' => $validated['company_description'],
                    'location' => $validated['location'] ?? '',
                    'country' => $validated['country'] ?? null,
                    'status' => 'verified' // Admin-created employers are automatically verified
                ]);
                
                Log::info('Employer profile created successfully', [
                    'user_id' => $user->id,
                    'profile_id' => $employerProfile->id
                ]);

                return response()->json([
                    'message' => 'Employer created successfully',
                    'user' => $user->load('employeeProfile')
                ]);
            } catch (\Exception $e) {
                // If profile creation fails, delete the user to prevent orphaned records
                $user->delete();
                Log::error('Error creating employer profile: ' . $e->getMessage(), [
                    'user_id' => $user->id,
                    'trace' => $e->getTraceAsString()
                ]);
                throw new \Exception('Error creating employer profile: ' . $e->getMessage());
            }
        } catch (\Exception $e) {
            Log::error('Error creating employer: ' . $e->getMessage(), [
                'request_data' => $request->except(['password', 'password_confirmation']),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to create employer: ' . $e->getMessage()], 500);
        }
    }

    // Add a new method for role assignment
    public function assignRole(Request $request, User $user)
    {
        try {
            // Validate role
            $validated = $request->validate([
                'role' => 'required|in:' . implode(',', User::ROLES),
            ]);

            // Update user role
            $user->update([
                'role' => $validated['role']
            ]);

            // Log action
            activity()
                ->performedOn($user)
                ->causedBy(auth()->user())
                ->withProperties(['new_role' => $validated['role']])
                ->log('role_assigned');

            return response()->json([
                'message' => 'User role updated successfully', 
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Error assigning role: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to assign role: ' . $e->getMessage()], 500);
        }
    }

    public function emailVerificationsIndex()
    {
        try {
            return Inertia::render('Admin/EmailVerifications/Index');
        } catch (\Exception $e) {
            Log::error('Error loading email verifications page: ' . $e->getMessage());
            return back()->with('error', 'Failed to load email verifications page');
        }
    }

    public function emailVerifications()
    {
        try {
            $users = User::select('id', 'name', 'email', 'email_verified_at', 'role', 'status', 'created_at')
                ->orderBy('email_verified_at', 'asc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'status' => $user->status,
                        'verified' => !is_null($user->email_verified_at),
                        'verification_date' => $user->email_verified_at ? $user->email_verified_at->format('Y-m-d H:i:s') : null,
                        'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error fetching email verifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch email verifications'], 500);
        }
    }

    public function manuallyVerifyEmail(User $user)
    {
        try {
            if ($user->email_verified_at) {
                return response()->json(['message' => 'Email is already verified'], 400);
            }

            $user->email_verified_at = now();
            $user->save();

            return response()->json(['message' => 'Email verified successfully']);
        } catch (\Exception $e) {
            Log::error('Error verifying email: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to verify email'], 500);
        }
    }

    public function unverifyEmail(User $user)
    {
        try {
            if (!$user->email_verified_at) {
                return response()->json(['message' => 'Email is already unverified'], 400);
            }

            $user->email_verified_at = null;
            $user->save();

            return response()->json(['message' => 'Email verification removed successfully']);
        } catch (\Exception $e) {
            Log::error('Error unverifying email: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to unverify email'], 500);
        }
    }

    public function resendVerificationEmail(User $user)
    {
        try {
            if ($user->email_verified_at) {
                return response()->json(['message' => 'Email is already verified'], 400);
            }

            $user->sendEmailVerificationNotification();

            return response()->json(['message' => 'Verification email sent successfully']);
        } catch (\Exception $e) {
            Log::error('Error sending verification email: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send verification email'], 500);
        }
    }

    public function deleteUnverifiedUser(User $user)
    {
        try {
            // Check if the user is verified - optionally we can restrict deletion to unverified users only
            if ($user->email_verified_at) {
                return response()->json(['message' => 'Cannot delete verified users from this interface'], 400);
            }

            // Get user name for logging
            $userName = $user->name;
            $userEmail = $user->email;

            // Delete the user
            $user->delete();

            // Log the action
            Log::info('Admin deleted unverified user', [
                'admin_id' => auth()->id(),
                'deleted_user_name' => $userName,
                'deleted_user_email' => $userEmail
            ]);

            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete user'], 500);
        }
    }
} 