<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'content',
        'status'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    const TYPES = [
        'career_resource' => 'Career Resource',
        'blog_post' => 'Blog Post',
        'faq' => 'FAQ'
    ];

    const STATUSES = [
        'draft' => 'Draft',
        'published' => 'Published'
    ];
} 