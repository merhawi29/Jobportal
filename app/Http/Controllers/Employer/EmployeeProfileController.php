<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Employer;
use Illuminate\Validation\ValidationException;

class EmployeeProfileController extends Controller
{
    public function create()
    {
        $user = auth()->user();
        $profile = $user->employer ?? new Employer();
        
        return Inertia::render('Employee/profile/Create', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'company_name' => $profile->company_name,
                'company_website' => $profile->company_website,
                'company_size' => $profile->company_size,
                'industry' => $profile->industry,
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
                'industry' => 'required|string|max:100',
                'company_description' => 'required|string|max:1000',
                'location' => 'required|string|max:255',
            ]);

            $user = auth()->user();

            // Update user basic info
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ]);

            // Create or update employer profile
            $user->employer()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'company_name' => $validated['company_name'],
                    'company_website' => $validated['company_website'] ?? null,
                    'company_size' => $validated['company_size'],
                    'industry' => $validated['industry'],
                    'company_description' => $validated['company_description'],
                    'location' => $validated['location'],
                ]
            );

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
            $employer = Employer::with('user')->findOrFail($id);
            $isOwnProfile = auth()->id() === $employer->user_id;
        } else {
            $user = auth()->user();
            $employer = $user->employer ?? new Employer();
            $isOwnProfile = true;
        }

        return Inertia::render('Employee/profile/Show', [
            'employee' => [
                'id' => $employer->id ?? null,
                'name' => $employer->user?->name ?? '',
                'email' => $employer->user?->email ?? '',
                'phone' => $employer->user?->phone ?? '',
                'photo' => $employer->photo ? Storage::url($employer->photo) : null,
                'company_name' => $employer->company_name ?? '',
                'company_website' => $employer->company_website,
                'company_size' => $employer->company_size ?? '',
                'industry' => $employer->industry ?? '',
                'company_description' => $employer->company_description ?? '',
                'location' => $employer->location ?? '',
            ],
            'isOwnProfile' => $isOwnProfile
        ]);
    }

    public function edit()
    {
        $user = auth()->user();
        $profile = $user->employer ?? new Employer();

        return Inertia::render('Employee/profile/Edit', [
            'employee' => [
                'id' => $profile->id ?? null,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'photo' => $profile->photo ? Storage::url($profile->photo) : null,
                'company_name' => $profile->company_name ?? '',
                'company_website' => $profile->company_website,
                'company_size' => $profile->company_size ?? '',
                'industry' => $profile->industry ?? '',
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
                'industry' => 'required|string|max:100',
                'company_description' => 'required|string|max:1000',
                'location' => 'required|string|max:255',
            ]);

            $user = auth()->user();
            Log::info('Authenticated user', ['user_id' => $user->id]);

            try {
                // Update user basic info
                $user->update([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                ]);
                Log::info('User basic info updated successfully');

                // Create or update employer profile
                $employer = $user->employer()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'company_name' => $validated['company_name'],
                        'company_website' => $validated['company_website'] ?? null,
                        'company_size' => $validated['company_size'],
                        'industry' => $validated['industry'],
                        'company_description' => $validated['company_description'],
                        'location' => $validated['location'],
                    ]
                );
                Log::info('Employer profile updated successfully', ['employer_id' => $employer->id]);

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
            if ($user->employer?->photo) {
                Storage::delete($user->employer->photo);
            }

            $photoPath = $request->file('photo')->store('employee_photos', 'public');

            $user->employer()->update(['photo' => $photoPath]);

            return response()->json(['photo' => Storage::url($photoPath)]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to upload photo'], 500);
        }
    }
}
