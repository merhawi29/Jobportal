<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModeratorAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'moderator_id',
        'action_type',
        'target_type',
        'target_id',
        'action',
        'reason',
        'details'
    ];

    protected $casts = [
        'details' => 'array'
    ];

    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderator_id');
    }
}
