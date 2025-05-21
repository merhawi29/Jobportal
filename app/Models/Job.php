<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\Traits\CausesActivity;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Job extends Model
{
    use HasFactory, LogsActivity, CausesActivity;

    protected $table = 'joblists';

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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class, 'joblists_id');
    }

    public function savedBy()
    {
        return $this->hasMany(SavedJob::class, 'joblists_id');
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

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('title', 'like', '%' . $search . '%')
                    ->orWhere('company', 'like', '%' . $search . '%')
                    ->orWhere('location', 'like', '%' . $search . '%');
            });
        });

        $query->when($filters['name'] ?? null, function ($query, $name) {
            $query->where(function ($query) use ($name) {
                $query->where('title', 'like', '%' . $name . '%')
                    ->orWhere('company', 'like', '%' . $name . '%');
            });
        });

        $query->when($filters['skills'] ?? null, function ($query, $skills) {
            $skillsArray = explode(',', $skills);
            $query->where(function ($query) use ($skillsArray) {
                foreach ($skillsArray as $skill) {
                    $skill = trim($skill);
                    if (!empty($skill)) {
                        $query->orWhere('requirements', 'like', '%' . $skill . '%')
                              ->orWhere('description', 'like', '%' . $skill . '%');
                    }
                }
            });
        });

        $query->when($filters['experience'] ?? null, function ($query, $experience) {
            switch($experience) {
                case 'entry':
                    $query->where(function ($query) {
                        $query->where('requirements', 'like', '%entry%')
                            ->orWhere('requirements', 'like', '%junior%')
                            ->orWhere('requirements', 'like', '%0-2 years%');
                    });
                    break;
                case 'mid':
                    $query->where(function ($query) {
                        $query->where('requirements', 'like', '%mid%')
                            ->orWhere('requirements', 'like', '%3-5 years%');
                    });
                    break;
                case 'senior':
                    $query->where(function ($query) {
                        $query->where('requirements', 'like', '%senior%')
                            ->orWhere('requirements', 'like', '%lead%')
                            ->orWhere('requirements', 'like', '%5+ years%');
                    });
                    break;
                case 'expert':
                    $query->where(function ($query) {
                        $query->where('requirements', 'like', '%expert%')
                            ->orWhere('requirements', 'like', '%principal%')
                            ->orWhere('requirements', 'like', '%10+ years%');
                    });
                    break;
            }
        });

        $query->when($filters['location'] ?? null, function ($query, $location) {
            $query->where('location', 'like', '%' . $location . '%');
        });

        $query->when($filters['type'] ?? null, function ($query, $type) {
            $types = explode(',', $type);
            $query->whereIn('type', $types);
        });
    }
}
