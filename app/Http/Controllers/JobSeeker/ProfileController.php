<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\JobSeekerProfile;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $profile = $user->jobSeekerProfile ?? new JobSeekerProfile();

        return Inertia::render('JobSeeker/Profile/Edit', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'location' => $profile->location,
                'education' => $profile->education,
                'experience' => $profile->experience,
                'skills' => $profile->skills,
                'certifications' => $profile->certifications,
                'about' => $profile->about,
                'linkedin_url' => $profile->linkedin_url,
                'github_url' => $profile->github_url,
                'profile_image' => $profile->profile_image,
                'resume' => $profile->resume,
                'is_public' => $profile->is_public
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        // Convert is_public to boolean integer (0 or 1)
        $isPublic = filter_var($request->is_public, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;

        // Update user basic info
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone
        ]);

        // Handle resume upload
        if ($request->hasFile('resume')) {
            if ($user->jobSeekerProfile?->resume) {
                Storage::delete($user->jobSeekerProfile->resume);
            }
            $resumePath = $request->file('resume')->store('resumes');
        }
        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            if ($user->jobSeekerProfile?->profile_image) {
                Storage::delete($user->jobSeekerProfile->profile_image);
            }
            $profileImagePath = $request->file('profile_image')->store('profile_images');
        }

        try {
            // Create or update profile with properly formatted JSON data
            $profile = $user->jobSeekerProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'location' => $request->location,
                    'education' => $request->education ? json_decode($request->education) : [],
                    'experience' => $request->experience ? json_decode($request->experience) : [],
                    'skills' => $request->skills ? json_decode($request->skills) : [],
                    'certifications' => $request->certifications ? json_decode($request->certifications) : [],
                    'about' => $request->about,
                    'linkedin_url' => $request->linkedin_url,
                    'github_url' => $request->github_url,
                    'profile_image' => $profileImagePath ?? $user->jobSeekerProfile?->profile_image,
                    'resume' => $resumePath ?? $user->jobSeekerProfile?->resume,
                    'is_public' => $isPublic,
                    'show_email' => filter_var($request->show_email, FILTER_VALIDATE_BOOLEAN),
                    'show_phone' => filter_var($request->show_phone, FILTER_VALIDATE_BOOLEAN),
                    'show_education' => filter_var($request->show_education, FILTER_VALIDATE_BOOLEAN),
                    'show_experience' => filter_var($request->show_experience, FILTER_VALIDATE_BOOLEAN),
                    'show_skills' => filter_var($request->show_skills, FILTER_VALIDATE_BOOLEAN),
                    'show_certifications' => filter_var($request->show_certifications, FILTER_VALIDATE_BOOLEAN),
                    'show_social_links' => filter_var($request->show_social_links, FILTER_VALIDATE_BOOLEAN),
                    'show_resume' => filter_var($request->show_resume, FILTER_VALIDATE_BOOLEAN)
                ]
            );

            \Log::info('Profile data being saved:', [
                'education' => json_decode($request->education),
                'experience' => json_decode($request->experience),
                'skills' => json_decode($request->skills),
                'certifications' => json_decode($request->certifications)
            ]);

            return back()->with('success', 'Profile updated successfully!');
        } catch (\Exception $e) {
            \Log::error('Profile update error:', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to update profile: ' . $e->getMessage()]);
        }
    }

    public function updatePrivacy(Request $request)
    {
        $validated = $request->validate([
            'is_public' => 'required|boolean',
            'show_email' => 'required|boolean',
            'show_phone' => 'required|boolean',
            'show_education' => 'required|boolean',
            'show_experience' => 'required|boolean',
            'show_skills' => 'required|boolean',
            'show_certifications' => 'required|boolean'
        ]);

        auth()->user()->update($validated);

        return back()->with('success', 'Privacy settings updated successfully!');
    }

    public function show()
    {
        $user = auth()->user();
        // This line gets the user's job seeker profile if it exists, otherwise creates a new empty profile
        // The ?? is the null coalescing operator - returns left side if not null, right side if null
        $profile = $user->jobSeekerProfile ?? new JobSeekerProfile();
        $isOwnProfile = true; // Since we're viewing our own profile

        return Inertia::render('JobSeeker/Profile/Show', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'location' => $profile->location,
                'education' => $profile->education,
                'experience' => $profile->experience,
                'skills' => $profile->skills,
                'certifications' => $profile->certifications,
                'about' => $profile->about,
                'linkedin_url' => $profile->linkedin_url,
                'github_url' => $profile->github_url,
                'profile_image' => $profile->profile_image,
                'resume' => $profile->resume,
                'is_public' => $profile->is_public,
                'show_email' => $profile->show_email,
                'show_phone' => $profile->show_phone,
                'show_education' => $profile->show_education,
                'show_experience' => $profile->show_experience,
                'show_skills' => $profile->show_skills,
                'show_certifications' => $profile->show_certifications,
                'show_social_links' => $profile->show_social_links,
                'show_resume' => $profile->show_resume
            ],
            'isOwnProfile' => $isOwnProfile
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'profile_image' => 'required|image|max:2048'
        ]);

        $user = auth()->user();

        if ($user->job_seeker_profile?->profile_image) {
            Storage::delete($user->job_seeker_profile->profile_image);

        }

        $photoPath = $request->file('profile_image')->store('profile_images');

        $user->employee()->update(['profile_image' => $photoPath]);
        return response()->json(['profile_image' => Storage::url($photoPath)]);
    }
}
