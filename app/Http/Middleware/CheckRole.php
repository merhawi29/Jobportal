<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || !$request->user()->hasRole($role)) {
            return redirect('/')->with('error', 'You do not have permission to access this area.');
        }

        if ($request->user()->isBanned()) {
            return redirect('/')->with('error', 'Your account is currently banned.');
        }

        return $next($request);
    }
}
