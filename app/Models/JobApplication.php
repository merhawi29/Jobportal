<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobApplication extends Model
{
    protected $fillable = [
        'joblists_id',
        'user_id',
        'status',
        'cover_letter',
        'resume'
    ];

    // Display labels for statuses
    const STATUS_LABELS = [
        'pending' => 'Pending Review',
        'under_review' => 'Under Review',
        'interview_scheduled' => 'Interview Scheduled',
        'hired' => 'Hired',
        'rejected' => 'Not Selected'
    ];

    // Actual status values that match the database enum
    const STATUSES = [
        'PENDING' => 'pending',
        'UNDER_REVIEW' => 'under_review',
        'INTERVIEW_SCHEDULED' => 'interview_scheduled',
        'HIRED' => 'hired',
        'REJECTED' => 'rejected'
    ];

    public function getStatusLabelAttribute()
    {
        return self::STATUS_LABELS[$this->status] ?? $this->status;
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class, 'joblists_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(InterviewInvitation::class);
    }
}








