<?php

namespace App\Http\Controllers\Moderator;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', '!=', 'moderator')
            ->latest()
            ->paginate(10);

        return Inertia::render('Moderator/Users/Index', [
            'users' => $users
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Moderator/Users/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|string|in:user,employer',
            'status' => 'required|string|in:active,banned'
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function ban(User $user, Request $request)
    {
        $user->update([
            'status' => 'banned',
            'ban_reason' => $request->reason
        ]);

        // Log the action
        activity()
            ->performedOn($user)
            ->causedBy(auth()->user())
            ->withProperties(['reason' => $request->reason])
            ->log('user_banned');

        return back()->with('success', 'User has been banned.');
    }

    public function warn(User $user, Request $request)
    {
        // Send warning notification to user
        $user->notifications()->create([
            'type' => 'warning',
            'message' => $request->message,
            'data' => ['reason' => $request->reason]
        ]);

        // Log the action
        activity()
            ->performedOn($user)
            ->causedBy(auth()->user())
            ->withProperties(['reason' => $request->reason])
            ->log('user_warned');

        return back()->with('success', 'Warning has been sent to the user.');
    }

    public function unban(User $user)
    {
        $user->update(['status' => 'active']);

        // Log the action
        activity()
            ->performedOn($user)
            ->causedBy(auth()->user())
            ->log('user_unbanned');

        return back()->with('success', 'User has been unbanned.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        // Log the action
        activity()
            ->performedOn($user)
            ->causedBy(auth()->user())
            ->log('user_deleted');

        return back()->with('success', 'User has been deleted.');
    }
}
