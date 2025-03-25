<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileIsComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->role === 'job_seeker') {
            $profile = auth()->user()->jobSeekerProfile;
            
            // Check if essential profile fields are filled
            if (!$profile || 
                empty($profile->location) || 
                empty($profile->education) || 
                empty($profile->experience) || 
                empty($profile->skills) || 
                empty($profile->about)) {
                
                // If we're not already on the profile creation page, redirect there
                if (!$request->routeIs('jobseeker.profile.*')) {
                    return redirect()->route('jobseeker.profile.create')
                        ->with('message', 'Please complete your profile to continue.');
                }
            }
        }

        return $next($request);
    }
} 