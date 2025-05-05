<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'banned_until',
        'ban_reason',
        'phone',
        'profile_picture',
        'resume',
        'company_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'banned_until' => 'datetime',
    ];

    const ROLES = [
        'admin' => 'admin',
        'moderator' => 'moderator',
        'employer' => 'employer',
        'job_seeker' => 'job_seeker'
    ];

    const STATUSES = [
        'active' => 'Active',
        'banned' => 'Banned',
        'suspended' => 'Suspended'
    ];

    public function hasRole($role)
    {
        return $this->role === $role;
    }

    public function isModerator()
    {
        return $this->role === self::ROLES['moderator'];
    }

    public function isAdmin()
    {
        return $this->role === self::ROLES['admin'];
    }

    public function isBanned()
    {
        return $this->status === self::STATUSES['banned'] &&
               ($this->banned_until === null || $this->banned_until->isFuture());
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'reported_id');
    }

    public function jobSeekerProfile()
    {
        return $this->hasOne(JobSeekerProfile::class);
    }

    /**
     * The employer's profile - using EmployeeProfile model
     * Note: Despite the name, this is for employer users and their company profiles
     */
    public function employeeProfile()
    {
        return $this->hasOne(EmployeeProfile::class);
    }

    /**
     * Alias for employeeProfile - used for compatibility
     */
    public function employerProfile()
    {
        return $this->employeeProfile();
    }

    public function jobAlerts()
    {
        return $this->hasMany(JobAlert::class);
    }

    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
