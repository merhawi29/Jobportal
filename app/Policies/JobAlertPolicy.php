<?php

namespace App\Policies;

use App\Models\JobAlert;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class JobAlertPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'job_seeker';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, JobAlert $jobAlert): bool
    {
        return $user->id === $jobAlert->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'job_seeker';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, JobAlert $jobAlert): bool
    {
        return $user->id === $jobAlert->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, JobAlert $jobAlert): bool
    {
        return $user->id === $jobAlert->user_id;
    }
} 