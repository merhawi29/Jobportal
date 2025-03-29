<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employer;
use App\Models\JobSeekerProfile;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:employer,job_seeker',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active'
        ]);

        // Create initial profile based on role
        if ($request->role === 'employer') {
            Employer::create([
                'user_id' => $user->id,
                'company_name' => '', // Will be filled out later
                'company_website' => null,
                'company_size' => '1-10', // Default value
                'industry' => '', // Will be filled out later
                'company_description' => '', // Will be filled out later
                'location' => '', // Will be filled out later
            ]);
        } else {
            JobSeekerProfile::create([
                'user_id' => $user->id,
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
        }

        event(new Registered($user));

        Auth::login($user);
        // Redirect to profile completion page based on role
        if ($request->role === 'employer') {
            return redirect()->route('employee.profile.create')
                ->with('message', 'Welcome! Please complete your company profile to get started.');
        } elseif ($request->role === 'job_seeker') {
            return redirect()->route('jobseeker.profile.create')
                ->with('message', 'Welcome! Please complete your profile to get started.');
        }

        // Add a fallback redirect
        return redirect()->route('home');
    }
}
