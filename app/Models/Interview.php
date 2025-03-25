<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    protected $fillable = [
        'scheduled_at',
        'location',
        'type',
        'notes',
        'status'
    ];

    protected $casts = [
        'scheduled_at' => 'datetime'
    ];
} 