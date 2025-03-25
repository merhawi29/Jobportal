<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobSeekerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'photo',
        'location',
        'about',
        'education',
        'experience',
        'skills',
        'linkedin_url',
        'github_url',
        'resume',
        'privacy_settings'
    ];

    protected $casts = [
        'education' => 'array',
        'experience' => 'array',
        'skills' => 'array',
        'privacy_settings' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected $attributes = [
        'privacy_settings' => '{
            "profile_visibility": "public",
            "show_email": false,
            "show_phone": false,
            "show_education": true,
            "show_experience": true
        }'
    ];
}
