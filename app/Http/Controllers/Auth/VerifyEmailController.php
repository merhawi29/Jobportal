<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        try {
            if ($request->user()->hasVerifiedEmail()) {
                Log::info('User already verified email', ['user_id' => $request->user()->id]);
                return $this->redirectBasedOnRole($request);
            }

            if ($request->user()->markEmailAsVerified()) {
                // Log successful verification
                Log::info('User successfully verified email', ['user_id' => $request->user()->id]);
                
                event(new Verified($request->user()));
            }

            return $this->redirectBasedOnRole($request);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Email verification failed', [
                'user_id' => $request->user()->id ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Redirect with error message
            return redirect()->route('verification.notice')->with('error', 'Unable to verify your email. Please try again or contact support.');
        }
    }
    
    /**
     * Redirect the user based on their role and profile status.
     */
    private function redirectBasedOnRole(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();
        $role = $user->role;
        
        if ($role === 'employer') {
            // If the employer has not completed their profile, redirect to profile creation
            $profile = $user->employeeProfile;
            if (!$profile || empty($profile->company_name) || empty($profile->company_size) || empty($profile->company_description)) {
                return redirect()->route('employee.profile.create')
                    ->with('success', 'Email verified successfully! Please complete your company profile to continue.');
            }
        } elseif ($role === 'job_seeker') {
            // If the job seeker has not completed their profile, redirect to profile creation
            $profile = $user->jobSeekerProfile;
            if (!$profile || empty($profile->location) || empty($profile->skills) || empty($profile->about)) {
                return redirect()->route('jobseeker.profile.create')
                    ->with('success', 'Email verified successfully! Please complete your profile to continue.');
            }
        }
        
        // Default redirect for admin/moderator or users with complete profiles
        return redirect()->route('home')->with('success', 'Email verified successfully!');
    }
}
