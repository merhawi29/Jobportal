<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Storage;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();
        $profilePicture = null;

        if ($user) {
            if ($user->role === 'job_seeker') {
                $profilePicture = $user->jobSeekerProfile?->profile_picture;
            } elseif ($user->role === 'employer') {
                // Get the photo from the employee profile
                $profilePicture = $user->employeeProfile?->photo;
                
                // If the photo exists, ensure it's a full URL
                if ($profilePicture) {
                    // Check if it's already a full URL
                    if (!filter_var($profilePicture, FILTER_VALIDATE_URL)) {
                        // If it's just a path, prepend the storage URL
                        $profilePicture = Storage::url($profilePicture);
                    }
                }
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->role === 'employer' ? ($user->employeeProfile?->name ?? $user->name) : $user->name,
                    'email' => $user->role === 'employer' ? ($user->employeeProfile?->email ?? $user->email) : $user->email,
                    'role' => $user->role,
                    'profile_picture' => $profilePicture
                ] : null,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ],
            'error' => session('error')
        ];
    }
}
