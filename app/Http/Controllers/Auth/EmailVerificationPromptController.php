<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            $role = $request->user()->role;
            
            // Redirect verified users based on their role
            if ($role === 'employer') {
                // If the employer has not completed their profile, redirect to profile creation
                $profile = $request->user()->employeeProfile;
                if (!$profile || empty($profile->company_name) || empty($profile->company_size) || empty($profile->company_description)) {
                    return redirect()->route('employee.profile.create')
                        ->with('info', 'Please complete your company profile to get started.');
                }
            } elseif ($role === 'job_seeker') {
                // If the job seeker has not completed their profile, redirect to profile creation
                $profile = $request->user()->jobSeekerProfile;
                if (!$profile || empty($profile->location) || empty($profile->skills) || empty($profile->about)) {
                    return redirect()->route('jobseeker.profile.create')
                        ->with('info', 'Please complete your profile to get started.');
                }
            }
            
            // Fallback to dashboard if profile is complete or role is admin/moderator
            return redirect()->intended(route('dashboard', absolute: false));
        }
        
        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
