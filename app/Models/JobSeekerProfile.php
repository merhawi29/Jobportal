<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSeekerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'location',
        'education',
        'experience',
        'skills',
        'certifications',
        'about',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'resume',
        'is_public',
        'show_email',
        'show_phone',
        'show_education',
        'show_experience',
        'show_skills',
        'show_certifications',
        'show_social_links',
        'show_resume'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'education' => 'array',
        'experience' => 'array',
        'skills' => 'array',
        'certifications' => 'array',
        'show_email' => 'boolean',
        'show_phone' => 'boolean',
        'show_education' => 'boolean',
        'show_experience' => 'boolean',
        'show_skills' => 'boolean',
        'show_certifications' => 'boolean',
        'show_social_links' => 'boolean',
        'show_resume' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
