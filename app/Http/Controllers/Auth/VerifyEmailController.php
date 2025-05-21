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
                return redirect()->intended(route('home', absolute: false) . '?verified=1');
            }

            if ($request->user()->markEmailAsVerified()) {
                // Log successful verification
                Log::info('User successfully verified email', ['user_id' => $request->user()->id]);
                
                event(new Verified($request->user()));
            }

            return redirect()->intended(route('home', absolute: false) . '?verified=1');
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
}
