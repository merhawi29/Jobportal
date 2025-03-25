<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employer extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'company_website',
        'company_size',
        'industry',
        'company_description',
        'location',
        'position',
        'department',
        'hire_date',
        'photo',
        'country',
        'status'
    ];

    protected $casts = [
        'hire_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
