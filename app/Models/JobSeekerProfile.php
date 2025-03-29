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
        'title',
        'summary',
        'location',
        'phone',
        'profile_picture',
        'skills',
        'experience',
        'education',
        'certifications',
        'languages',
        'privacy_settings',
        'is_public',
    ];

    protected $casts = [
        'skills' => 'array',
        'experience' => 'array',
        'education' => 'array',
        'certifications' => 'array',
        'languages' => 'array',
        'privacy_settings' => 'array',
        'is_public' => 'boolean',
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
