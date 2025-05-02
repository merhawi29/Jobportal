<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'company_website',
        'industry',
        'company_size',
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
        'hire_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 