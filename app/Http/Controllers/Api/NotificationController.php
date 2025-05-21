<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $notifications = auth()->user()->notifications()
            ->latest()
            ->paginate(10);

        return response()->json([
            'notifications' => $notifications->items(),
            'current_page' => $notifications->currentPage(),
            'last_page' => $notifications->lastPage(),
            'total' => $notifications->total(),
        ]);
    }

    /**
     * Store a new notification
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|string',
            'data' => 'required|array',
        ]);

        $notification = auth()->user()->notifications()->create($request->all());

        return response()->json(['notification' => $notification], 201);
    }

    /**
     * Mark a notification as read
     *
     * @param string $id
     * @return JsonResponse
     */
    public function markAsRead(string $id): JsonResponse
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Delete a notification
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Get latest notifications for the authenticated user
     *
     * @return JsonResponse
     */
    public function getLatestNotifications(): JsonResponse
    {
        $notifications = auth()->user()->notifications()
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => auth()->user()->unreadNotifications()->count()
        ]);
    }

    /**
     * Get unread notification count for the authenticated user
     *
     * @return JsonResponse
     */
    public function getUnreadCount(): JsonResponse
    {
        $count = auth()->user()->unreadNotifications()->count();
        return response()->json(['count' => $count]);
    }

    /**
     * Mark all notifications as read
     *
     * @return JsonResponse
     */
    public function markAllAsRead(): JsonResponse
    {
        auth()->user()->unreadNotifications()->update(['read_at' => now()]);
        return response()->json(['success' => true]);
    }
} 