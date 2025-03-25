<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireEmployerProfile
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'employer') {
            $employer = $user->employer;

            // Check if employer profile is incomplete
            if (!$employer || !$employer->company_name || !$employer->industry || !$employer->company_size) {
                return redirect()->route('employee.profile.create')
                    ->with('message', 'Please complete your company profile to access this feature.');
            }
        }

        return $next($request);
    }
} 