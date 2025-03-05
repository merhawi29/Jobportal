<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'moderator_id',
        'action_type',
        'target_type',
        'target_id',
        'reason',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    /**
     * Get the moderator who performed the action.
     */
    public function moderator()
    {
        return $this->belongsTo(User::class, 'moderator_id');
    }

    /**
     * Get the target of the action (polymorphic).
     */
    public function target()
    {
        return $this->morphTo();
    }
}
