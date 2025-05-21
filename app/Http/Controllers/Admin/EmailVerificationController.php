<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EmailVerificationController extends Controller
{
    public function index()
    {
        try {
            return Inertia::render('Admin/EmailVerifications/Index');
        } catch (\Exception $e) {
            Log::error('Error loading email verifications page: ' . $e->getMessage());
            return back()->with('error', 'Failed to load email verifications page');
        }
    }

    public function getUsers()
    {
        try {
            $users = User::select('id', 'name', 'email', 'email_verified_at', 'role', 'status', 'created_at')
                ->orderBy('email_verified_at', 'asc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'status' => $user->status,
                        'verified' => !is_null($user->email_verified_at),
                        'verification_date' => $user->email_verified_at ? $user->email_verified_at->format('Y-m-d H:i:s') : null,
                        'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error fetching email verifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch email verifications'], 500);
        }
    }

    public function verify(User $user)
    {
        try {
            if ($user->email_verified_at) {
                return response()->json(['message' => 'Email is already verified'], 400);
            }

            $user->email_verified_at = now();
            $user->save();

            return response()->json(['message' => 'Email verified successfully']);
        } catch (\Exception $e) {
            Log::error('Error verifying email: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to verify email'], 500);
        }
    }

    public function unverify(User $user)
    {
        try {
            if (!$user->email_verified_at) {
                return response()->json(['message' => 'Email is already unverified'], 400);
            }

            $user->email_verified_at = null;
            $user->save();

            return response()->json(['message' => 'Email verification removed successfully']);
        } catch (\Exception $e) {
            Log::error('Error unverifying email: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to unverify email'], 500);
        }
    }

    public function resend(User $user)
    {
        try {
            if ($user->email_verified_at) {
                return response()->json(['message' => 'Email is already verified'], 400);
            }

            $user->sendEmailVerificationNotification();

            return response()->json(['message' => 'Verification email sent successfully']);
        } catch (\Exception $e) {
            Log::error('Error sending verification email: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send verification email'], 500);
        }
    }

    public function destroy(User $user)
    {
        try {
            // Check if the user is verified - optionally we can restrict deletion to unverified users only
            if ($user->email_verified_at) {
                return response()->json(['message' => 'Cannot delete verified users from this interface'], 400);
            }

            // Get user name for logging
            $userName = $user->name;
            $userEmail = $user->email;

            // Delete the user
            $user->delete();

            // Log the action
            Log::info('Admin deleted unverified user', [
                'admin_id' => auth()->id(),
                'deleted_user_name' => $userName,
                'deleted_user_email' => $userEmail
            ]);

            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete user'], 500);
        }
    }
} 