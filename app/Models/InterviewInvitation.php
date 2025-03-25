<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterviewInvitation extends Model
{
    protected $fillable = [
        'job_application_id',
        'scheduled_at',
        'location',
        'notes',
        'type',
        'status'
    ];

    protected $casts = [
        'scheduled_at' => 'datetime'
    ];

    const TYPES = [
        'in_person' => 'In Person',
        'video' => 'Video Call',
        'phone' => 'Phone Call'
    ];

    public function job_application(): BelongsTo
    {
        return $this->belongsTo(JobApplication::class, 'job_application_id');
    }
} 