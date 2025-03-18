<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'department',
        'hire_date',
        'photo',
        'country',
        'company_name',
    ];

    protected $casts = [
        'name' => 'string',
        'email' => 'string',
        'phone' => 'string',
        'hire_date' => 'date',
        'salary' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


