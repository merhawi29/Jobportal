<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\Traits\CausesActivity;

class Job extends Model
{
    use HasFactory, LogsActivity, CausesActivity;

    protected $fillable = [
        'user_id',
        'title',
        'company',
        'location',
        'type',
        'sector',
        'category',
        'subcategories',
        'salary_range',
        'description',
        'requirements',
        'benefits',
        'deadline',
        'status',
        'moderation_status',
        'moderation_reason'
    ];

    protected $casts = [
        'deadline' => 'date',
        'subcategories' => 'array'
    ];

    const MODERATION_STATUS = [
        'PENDING' => 'pending',
        'APPROVED' => 'approved',
        'REJECTED' => 'rejected'
    ];

    const STATUS = [
        'DRAFT' => 'draft',
        'ACTIVE' => 'active',
        'INACTIVE' => 'inactive',
        'CLOSED' => 'closed'
    ];

    const JOB_TYPES = [
        'Full-time',
        'Part-time',
        'Contract',
        'Freelance',
        'Internship',
        'Volunteer',
        'Remote'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'title',
                'company',
                'location',
                'type',
                'sector',
                'category',
                'subcategories',
                'salary_range',
                'description',
                'requirements',
                'benefits',
                'deadline',
                'status',
                'moderation_status',
                'moderation_reason'
            ])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function savedBy()
    {
        return $this->hasMany(SavedJob::class);
    }

    public function isPending()
    {
        return $this->moderation_status === self::MODERATION_STATUS['PENDING'];
    }

    public function isApproved()
    {
        return $this->moderation_status === self::MODERATION_STATUS['APPROVED'];
    }

    public function isRejected()
    {
        return $this->moderation_status === self::MODERATION_STATUS['REJECTED'];
    }

    public function scopeApproved($query)
    {
        return $query->where('moderation_status', self::MODERATION_STATUS['APPROVED']);
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS['ACTIVE']);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeBySector($query, $sector)
    {
        return $query->where('sector', $sector);
    }
}
