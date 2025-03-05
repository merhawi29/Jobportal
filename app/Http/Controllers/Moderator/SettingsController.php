<?php

namespace App\Http\Controllers\Moderator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = auth()->user()->moderator_settings ?? [
            'notifications' => [
                'email' => true,
                'browser' => true,
                'reports' => true,
                'jobs' => true,
                'warnings' => true
            ],
            'display' => [
                'items_per_page' => 10,
                'default_view' => 'list',
                'auto_refresh' => false
            ]
        ];

        return Inertia::render('Moderator/Settings', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'notifications.email' => 'boolean',
            'notifications.browser' => 'boolean',
            'notifications.reports' => 'boolean',
            'notifications.jobs' => 'boolean',
            'notifications.warnings' => 'boolean',
            'display.items_per_page' => 'integer|min:5|max:100',
            'display.default_view' => 'string|in:list,grid',
            'display.auto_refresh' => 'boolean'
        ]);

        auth()->user()->update([
            'moderator_settings' => $validated
        ]);

        return back()->with('success', 'Settings have been updated.');
    }
}
