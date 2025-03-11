<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Register default gates for user roles
        Gate::define('access-admin', function ($user) {
            return $user->role === 'admin';
        });

        Gate::define('access-moderator', function ($user) {
            return in_array($user->role, ['admin', 'moderator']);
        });

        Gate::define('post-job', function ($user) {
            return in_array($user->role, ['employer', 'admin', 'moderator']);
        });

        Gate::define('manage-jobs', function ($user) {
            return in_array($user->role, ['admin', 'moderator']);
        });
    }
}
