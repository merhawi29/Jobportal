<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Search for users by name or email
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $query = $request->input('q');
        $currentUserId = Auth::id();

        // Don't allow empty searches
        if (!$query || strlen($query) < 2) {
            return response()->json([
                'users' => []
            ]);
        }

        $users = User::where('id', '!=', $currentUserId) // Don't include current user
            ->where(function($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('email', 'LIKE', "%{$query}%");
            })
            ->select('id', 'name', 'email', 'role')
            ->limit(10)
            ->get();
            
        // Add profile picture data from the appropriate related model
        foreach ($users as $user) {
            if ($user->role === 'job_seeker') {
                $profile = $user->jobSeekerProfile;
                $user->profile_picture = $profile ? $profile->profile_picture : null;
            } elseif ($user->role === 'employer') {
                $profile = $user->employeeProfile;
                $user->profile_picture = $profile ? $profile->photo : null;
            } else {
                $user->profile_picture = null;
            }
        }

        return response()->json([
            'users' => $users
        ]);
    }
} 