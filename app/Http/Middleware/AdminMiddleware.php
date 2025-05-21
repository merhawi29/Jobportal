<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Log authentication status
        Log::info('AdminMiddleware running', [
            'user_authenticated' => Auth::check(),
            'user_role' => Auth::check() ? Auth::user()->role : 'not_logged_in',
            'path' => $request->path()
        ]);
        
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            Log::warning('Unauthorized access attempt to admin area', [
                'user_id' => Auth::check() ? Auth::user()->id : null,
                'role' => Auth::check() ? Auth::user()->role : null,
                'path' => $request->path()
            ]);
            
            // If this is an API request
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized action.'], 403);
            }
            
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
} 