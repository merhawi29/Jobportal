<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $blogPosts = Content::where('type', 'blog_post')
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Blog/Index', [
            'blogPosts' => $blogPosts
        ]);
    }

    public function show($id)
    {
        $blogPost = Content::where('type', 'blog_post')
            ->where('status', 'published')
            ->findOrFail($id);

        return Inertia::render('Blog/Show', [
            'blogPost' => $blogPost
        ]);
    }
} 