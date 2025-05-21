<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()->notifications()
            ->latest()
            ->paginate(10);

        // Transform the notifications to match the frontend structure
        $formattedNotifications = $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ];
        });

        return Inertia::render('JobSeeker/Notifications/Index', [
            'alerts' => [
                'data' => $formattedNotifications,
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'total' => $notifications->total(),
            ]
        ]);
    }

    public function markAsRead($id)
    {
        try {
            $notification = auth()->user()->notifications()->findOrFail($id);
            $notification->markAsRead();
            
            Log::info('Notification marked as read', [
                'notification_id' => $id,
                'user_id' => auth()->id()
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to mark notification as read', [
                'notification_id' => $id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['success' => false, 'message' => 'Failed to mark notification as read'], 500);
        }
    }
    
    public function getUnreadCount(): JsonResponse
    {
        $count = auth()->user()->unreadNotifications()->count();
        return response()->json(['count' => $count]);
    }
    
    public function getLatestNotifications(): JsonResponse
    {
        $notifications = auth()->user()->notifications()
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            });
            
        return response()->json([
            'notifications' => $notifications,
            'unread_count' => auth()->user()->unreadNotifications()->count()
        ]);
    }
    
    public function markAllAsRead(): JsonResponse
    {
        try {
            auth()->user()->unreadNotifications->markAsRead();
            Log::info('All notifications marked as read', ['user_id' => auth()->id()]);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to mark all notifications as read', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);
            return response()->json(['success' => false, 'message' => 'Failed to mark all notifications as read'], 500);
        }
    }
}
