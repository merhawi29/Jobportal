<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobAlert extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'keywords',
        'location',
        'categories',
        'job_types',
        'min_salary',
        'max_salary',
        'frequency',
        'notification_method',
        'is_active'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'keywords' => 'array',
        'categories' => 'array',
        'job_types' => 'array',
        'min_salary' => 'decimal:2',
        'max_salary' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the job alert.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 