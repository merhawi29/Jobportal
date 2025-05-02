<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Inertia\Inertia;

class ResourceController extends Controller
{
    public function careerResources()
    {
        $resources = Content::where('type', 'career_resource')
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Resources/CareerResources', [
            'resources' => $resources
        ]);
    }

    public function faqs()
    {
        $faqs = Content::where('type', 'faq')
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Resources/FAQs', [
            'faqs' => $faqs
        ]);
    }
} 