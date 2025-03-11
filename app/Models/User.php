<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
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
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'banned_until' => 'datetime',
        ];
    }

    const ROLES = [
        'USER' => 'user',
        'MODERATOR' => 'moderator',
        'ADMIN' => 'admin'
    ];

    const STATUS = [
        'ACTIVE' => 'active',
        'BANNED' => 'banned',
        'SUSPENDED' => 'suspended'
    ];

    public function hasRole($role)
    {
        return $this->role === $role;
    }

    public function isModerator()
    {
        return $this->role === self::ROLES['MODERATOR'];
    }

    public function isAdmin()
    {
        return $this->role === self::ROLES['ADMIN'];
    }

    public function isBanned()
    {
        return $this->status === self::STATUS['BANNED'] &&
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
}
