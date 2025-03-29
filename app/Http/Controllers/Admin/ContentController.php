<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Content;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ContentController extends Controller
{
    public function index()
    {
        try {
            $contents = Content::orderBy('created_at', 'desc')->get();
            return Inertia::render('Admin/Content/Index', [
                'contents' => $contents
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching content: ' . $e->getMessage());
            return Inertia::render('Admin/Content/Index', [
                'error' => 'Failed to fetch content'
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'type' => 'required|in:career_resource,blog_post,faq',
                'content' => 'required|string',
                'status' => 'required|in:draft,published'
            ]);

            $content = Content::create($validated);

            return response()->json([
                'message' => 'Content created successfully',
                'content' => $content
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating content: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create content'], 500);
        }
    }

    public function update(Request $request, Content $content)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'status' => 'required|in:draft,published'
            ]);

            $content->update($validated);

            return response()->json([
                'message' => 'Content updated successfully',
                'content' => $content
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating content: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update content'], 500);
        }
    }

    public function updateStatus(Request $request, Content $content)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:draft,published'
            ]);

            $content->update($validated);

            return response()->json([
                'message' => 'Content status updated successfully',
                'content' => $content
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating content status: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update content status'], 500);
        }
    }

    public function destroy(Content $content)
    {
        try {
            $content->delete();

            return response()->json([
                'message' => 'Content deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting content: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete content'], 500);
        }
    }

    public function create($type)
    {
        return inertia('Admin/Content/Create', [
            'type' => $type
        ]);
    }

    public function edit(Content $content)
    {
        return inertia('Admin/Content/Edit', [
            'content' => $content
        ]);
    }
} 