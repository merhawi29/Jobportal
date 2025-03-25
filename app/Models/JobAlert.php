<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobAlert extends Model
{
    protected $fillable = [
        'job_title',
        'job_type',
        'location',
        'salary_min',
        'salary_max',
        'keywords',
        'notification_type',
        'frequency',
        'is_active'
    ];

    protected $casts = [
        'keywords' => 'array',
        'is_active' => 'boolean',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
