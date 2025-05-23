<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\EmployeeProfile;
use Illuminate\Validation\ValidationException;

class EmployeeProfileController extends Controller
{
    public function create()
    {
        $user = auth()->user();
        $profile = $user->employeeProfile ?? new EmployeeProfile();
        
        return Inertia::render('Employee/profile/Create', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'company_name' => $profile->company_name,
                'company_website' => $profile->company_website,
                'company_size' => $profile->company_size,
                'company_description' => $profile->company_description,
                'location' => $profile->location,
            ]
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'company_name' => 'required|string|max:255',
                'company_website' => 'nullable|url|max:255',
                'company_size' => 'required|string|max:20',
                'company_description' => 'required|string|max:1000',
                'location' => 'required|string|max:255',
                'photo' => 'nullable|image|max:2048', // 2MB max
            ]);

            $user = auth()->user();

            // Handle photo upload if present
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('employee_photos', 'public');
            }

            // Create or update employee profile
            $user->employeeProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'company_name' => $validated['company_name'],
                    'company_website' => $validated['company_website'] ?? null,
                    'company_size' => $validated['company_size'],
                    'company_description' => $validated['company_description'],
                    'location' => $validated['location'],
                    'photo' => $photoPath,
                ]
            );
            
            // Send profile completion notification
            try {
                // Queue the notification with a small delay
                $when = now()->addSeconds(2);
                $user->notify((new \App\Notifications\ProfileCompletedNotification())->delay($when));
            } catch (\Exception $e) {
                // Log error but don't block the process
                \Illuminate\Support\Facades\Log::error('Failed to queue profile completion notification: ' . $e->getMessage());
            }

            return redirect()
                ->route('home')
                ->with('success', 'Company profile completed successfully! Welcome to the platform.');

        } catch (ValidationException $e) {
            return redirect()
                ->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to create profile: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function show($id = null)
    {
        if ($id) {
            $profile = EmployeeProfile::with('user')->findOrFail($id);
            $isOwnProfile = auth()->id() === $profile->user_id;
        } else {
            $user = auth()->user();
            $profile = $user->employeeProfile ?? new EmployeeProfile();
            $isOwnProfile = true;
        }

        return Inertia::render('Employee/profile/Show', [
            'employee' => [
                'id' => $profile->id ?? null,
                'name' => $profile->name ?? $profile->user->name ?? '',
                'email' => $profile->email ?? $profile->user->email ?? '',
                'phone' => $profile->phone ?? $profile->user->phone ?? '',
                'photo' => $profile->photo ? Storage::url($profile->photo) : null,
                'company_name' => $profile->company_name ?? '',
                'company_website' => $profile->company_website,
                'company_size' => $profile->company_size ?? '',
                'company_description' => $profile->company_description ?? '',
                'location' => $profile->location ?? '',
            ],
            'isOwnProfile' => $isOwnProfile
        ]);
    }

    public function edit()
    {
        $user = auth()->user();
        $profile = $user->employeeProfile ?? new EmployeeProfile();

        return Inertia::render('Employee/profile/Edit', [
            'employee' => [
                'id' => $profile->id ?? null,
                'name' => $profile->name ?? $user->name,
                'email' => $profile->email ?? $user->email,
                'phone' => $profile->phone ?? $user->phone,
                'photo' => $profile->photo ? Storage::url($profile->photo) : null,
                'company_name' => $profile->company_name ?? '',
                'company_website' => $profile->company_website,
                'company_size' => $profile->company_size ?? '',
                'company_description' => $profile->company_description ?? '',
                'location' => $profile->location ?? '',
            ]
        ]);
    }

    public function update(Request $request)
    {
        try {
            Log::info('Profile update request received', ['data' => $request->all()]);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'company_name' => 'required|string|max:255',
                'company_website' => 'nullable|url|max:255',
                'company_size' => 'required|string|max:20',
                'company_description' => 'required|string|max:1000',
                'location' => 'required|string|max:255',
                'photo' => 'nullable|image|max:2048', // 2MB max
            ]);

            $user = auth()->user();
            Log::info('Authenticated user', ['user_id' => $user->id]);

            try {
                // Handle photo upload if present
                $photoPath = null;
                if ($request->hasFile('photo')) {
                    // Delete old photo if exists
                    if ($user->employeeProfile?->photo) {
                        Storage::delete($user->employeeProfile->photo);
                    }
                    $photoPath = $request->file('photo')->store('employee_photos', 'public');
                }

                // Create or update employee profile
                $profile = $user->employeeProfile()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'name' => $validated['name'],
                        'email' => $validated['email'],
                        'phone' => $validated['phone'] ?? null,
                        'company_name' => $validated['company_name'],
                        'company_website' => $validated['company_website'] ?? null,
                        'company_size' => $validated['company_size'],
                        'company_description' => $validated['company_description'],
                        'location' => $validated['location'],
                        'photo' => $photoPath ?? $user->employeeProfile?->photo,
                    ]
                );
                Log::info('Employee profile updated successfully', ['profile_id' => $profile->id]);

                return redirect()
                    ->back()
                    ->with('success', 'Profile updated successfully!');

            } catch (\Exception $e) {
                Log::error('Database update error', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }

        } catch (ValidationException $e) {
            Log::warning('Validation failed', ['errors' => $e->errors()]);
            return redirect()
                ->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Unexpected error during profile update', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()
                ->back()
                ->with('error', 'Failed to update profile: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048' // 2MB max
        ]);

        try {
            $user = auth()->user();
            
            // Delete old photo if exists
            if ($user->employeeProfile?->photo) {
                Storage::delete($user->employeeProfile->photo);
            }

            $photoPath = $request->file('photo')->store('employee_photos', 'public');

            $user->employeeProfile()->update(['photo' => $photoPath]);

            return response()->json(['photo' => Storage::url($photoPath)]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to upload photo'], 500);
        }
    }
}
