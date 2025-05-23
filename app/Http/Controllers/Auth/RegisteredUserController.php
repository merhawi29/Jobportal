<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EmployeeProfile;
use App\Models\JobSeekerProfile;
use App\Notifications\WelcomeMessage;
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
            EmployeeProfile::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'company_name' => '', // Will be filled out later
                'company_website' => null,
                'company_size' => '', // Will be filled out later
                'company_description' => '', // Will be filled out later
                'location' => '', // Will be filled out later
            ]);
        } elseif ($request->role === 'job_seeker') {
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

        try {
            // Background processing for welcome notification
            // We'll use a try-catch to prevent errors from blocking registration
            $when = now()->addSeconds(5); // Delay by 5 seconds
            $user->notify((new WelcomeMessage())->delay($when));
        } catch (\Exception $e) {
            // Log the error but don't block registration
            \Illuminate\Support\Facades\Log::error('Failed to queue welcome email: ' . $e->getMessage());
        }

        event(new Registered($user));

        Auth::login($user);
        
        // Redirect to email verification notice page
        return redirect()->route('verification.notice')
            ->with('info', 'Please verify your email address to continue.');
    }
}
