<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\JobSeekerProfile;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $profile = $user->jobSeekerProfile;

        return Inertia::render('JobSeeker/Profile/Edit', [
            'profile' => $profile,
            'user' => $user
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'profile_picture' => 'nullable|image|max:2048',
            'location' => 'required|string|max:255',
            'about' => 'required|string',
            'education' => 'required|array',
            'education.*.institution' => 'required|string',
            'education.*.degree' => 'required|string',
            'experience' => 'required|array',
            'experience.*.company' => 'required|string',
            'experience.*.position' => 'required|string',
            'skills' => 'required|array',
            'skills.*' => 'required|string',
            'linkedin_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'privacy_settings' => 'required|array',
            'privacy_settings.profile_visibility' => 'required|in:public,private,registered',
            'privacy_settings.show_email' => 'required|boolean',
            'privacy_settings.show_phone' => 'required|boolean',
            'privacy_settings.show_education' => 'required|boolean',
            'privacy_settings.show_experience' => 'required|boolean',
        ]);

        $profile = auth()->user()->jobSeekerProfile;

        // Handle file uploads
        if ($request->hasFile('profile_picture')) {
            $photoPath = $request->file('profile_picture')->store('profile-photos', 'public');
            $validated['profile_picture'] = Storage::url($photoPath);
        }

        if ($request->hasFile('resume')) {
            $resumePath = $request->file('resume')->store('resumes', 'public');
            $validated['resume'] = Storage::url($resumePath);
        }

        $profile->update($validated);

        return redirect()->route('jobseeker.profile.show')
            ->with('success', 'Profile updated successfully');
    }

    public function show($id = null)
    {
        $user = $id ? \App\Models\User::findOrFail($id) : auth()->user();
        $profile = $user->jobSeekerProfile ?? new JobSeekerProfile();
        $isOwnProfile = !$id || $id === auth()->id();

        return Inertia::render('JobSeeker/Profile/Show', [
            'profile' => [
                'name' => $user->name,
                'email' => $isOwnProfile ? $user->email : null,
                'phone' => $isOwnProfile ? $profile->phone : null,
                'profile_picture' => $profile->profile_picture,
                'location' => $profile->location,
                'education' => $profile->education,
                'experience' => $profile->experience,
                'skills' => $profile->skills,
                'about' => $profile->about,
                'linkedin_url' => $profile->linkedin_url,
                'github_url' => $profile->github_url,
                'resume' => $profile->resume,
                'privacy_settings' => $profile->privacy_settings ?? [
                    'profile_visibility' => 'public',
                    'show_email' => false,
                    'show_phone' => false,
                    'show_education' => true,
                    'show_experience' => true
                ]
            ],
            'isOwnProfile' => $isOwnProfile
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|max:2048'
        ]);
        
        $profile = auth()->user()->jobSeekerProfile;

        if ($profile->profile_picture) {
            Storage::delete($profile->profile_picture);
        }

        $photoPath = $request->file('profile_picture')->store('profile-photos', 'public');
        $profile->update(['profile_picture' => Storage::url($photoPath)]);

        return response()->json(['profile_picture' => Storage::url($photoPath)]);
    }

    public function create()
    {
        $user = Auth::user();
        $profile = $user->jobSeekerProfile;

        return Inertia::render('JobSeeker/Profile/Create', [
            'profile' => $profile,
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $profile = $user->jobSeekerProfile;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'profile_picture' => 'nullable|image|max:2048',
            'location' => 'required|string|max:255',
            'education' => 'required|array',
            'experience' => 'required|array',
            'skills' => 'required|array',
            'about' => 'required|string|max:1000',
            'linkedin_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'privacy_settings' => 'required|array',
            'privacy_settings.profile_visibility' => 'required|in:public,private,registered',
            'privacy_settings.show_email' => 'required|boolean',
            'privacy_settings.show_phone' => 'required|boolean',
            'privacy_settings.show_education' => 'required|boolean',
            'privacy_settings.show_experience' => 'required|boolean',
        ]);

        // Handle file uploads
        if ($request->hasFile('profile_picture')) {
            if ($profile && $profile->profile_picture) {
                Storage::delete($profile->profile_picture);
            }
            $photoPath = $request->file('profile_picture')->store('profile-photos', 'public');
            $validated['profile_picture'] = Storage::url($photoPath);
        }

        if ($request->hasFile('resume')) {
            if ($profile && $profile->resume) {
                Storage::delete($profile->resume);
            }
            $resumePath = $request->file('resume')->store('resumes', 'public');
            $validated['resume'] = Storage::url($resumePath);
        }

        // Update user basic info
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        // Prepare profile data
        $profileData = [
            'phone' => $validated['phone'],
            'location' => $validated['location'],
            'education' => $validated['education'],
            'experience' => $validated['experience'],
            'skills' => $validated['skills'],
            'about' => $validated['about'],
            'linkedin_url' => $validated['linkedin_url'] ?? null,
            'github_url' => $validated['github_url'] ?? null,
            'is_public' => $validated['privacy_settings']['profile_visibility'] === 'public',
            'privacy_settings' => $validated['privacy_settings']
        ];

        if (isset($validated['profile_picture'])) {
            $profileData['profile_picture'] = $validated['profile_picture'];
        }

        if (isset($validated['resume'])) {
            $profileData['resume'] = $validated['resume'];
        }

        if ($profile) {
            $profile->update($profileData);
        } else {
            $user->jobSeekerProfile()->create($profileData);
        }

        return redirect()->route('jobseeker.profile.show')
            ->with('success', 'Profile created successfully!');
    }
}
