<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'photo',
        'company_name',
        'company_website',
        'company_size',
        'industry',
        'company_description',
        'location',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
