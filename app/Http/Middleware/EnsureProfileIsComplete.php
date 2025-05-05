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
        if (!auth()->check()) {
            return $next($request);
        }

        $user = auth()->user();
        
        if ($user->role === 'job_seeker') {
            $profile = $user->jobSeekerProfile;
            
            // Check if essential profile fields are filled for job seeker
            if (!$profile || 
                empty($profile->location) || 
                empty($profile->education) || 
                empty($profile->experience) || 
                empty($profile->skills) || 
                empty($profile->about)) {
                
                // Allow access to profile creation/edit routes
                if ($request->routeIs('jobseeker.profile.*')) {
                    return $next($request);
                }

                // Redirect to profile creation with message
                return redirect()->route('jobseeker.profile.create')
                    ->with('warning', 'Please complete your profile to access all features.');
            }
        } elseif ($user->role === 'employer') {
            $profile = $user->employeeProfile;
            
            // Check if essential profile fields are filled for employer
            if (!$profile || 
                empty($profile->company_name) || 
                empty($profile->industry) || 
                empty($profile->company_size) || 
                empty($profile->company_description)) {
                
                // Allow access to profile creation/edit routes
                if ($request->routeIs('employer.profile.*')) {
                    return $next($request);
                }

                // Redirect to profile creation with message
                return redirect()->route('employer.profile.create')
                    ->with('warning', 'Please complete your company profile to access all features.');
            }
        }

        return $next($request);
    }
} 