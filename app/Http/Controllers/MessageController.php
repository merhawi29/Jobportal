<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Display the messaging interface.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $conversations = $this->getConversations();
        
        return Inertia::render('Messages/Index', [
            'conversations' => $conversations
        ]);
    }
    
    /**
     * Get conversations for the authenticated user.
     *
     * @return array
     */
    public function getConversations()
    {
        $userId = Auth::id();
        
        // First get the basic conversation data without profile pictures
        $conversations = DB::select("
            SELECT 
                u.id as user_id,
                u.name,
                u.role,
                m.message as last_message,
                m.sent_at as last_message_time,
                (
                    SELECT COUNT(*) FROM messages 
                    WHERE sender_id = u.id 
                    AND receiver_id = ?
                    AND read_at IS NULL
                ) as unread_count
            FROM users u
            INNER JOIN (
                SELECT 
                    CASE 
                        WHEN sender_id = ? THEN receiver_id
                        ELSE sender_id
                    END as other_user_id,
                    MAX(sent_at) as max_sent_at
                FROM messages
                WHERE sender_id = ? OR receiver_id = ?
                GROUP BY other_user_id
            ) latest_m ON u.id = latest_m.other_user_id
            INNER JOIN messages m ON (
                (m.sender_id = ? AND m.receiver_id = u.id) OR
                (m.sender_id = u.id AND m.receiver_id = ?)
            ) AND m.sent_at = latest_m.max_sent_at
            ORDER BY m.sent_at DESC
        ", [$userId, $userId, $userId, $userId, $userId, $userId]);
        
        // Now add profile pictures by looking them up based on user role
        foreach ($conversations as $key => $conversation) {
            $user = User::with(['jobSeekerProfile', 'employeeProfile'])->find($conversation->user_id);
            
            if ($user) {
                if ($user->role === 'job_seeker' && $user->jobSeekerProfile) {
                    $conversations[$key]->profile_picture = $user->jobSeekerProfile->profile_picture;
                } elseif ($user->role === 'employer' && $user->employeeProfile) {
                    $conversations[$key]->profile_picture = $user->employeeProfile->photo;
                } else {
                    $conversations[$key]->profile_picture = null;
                }
            } else {
                $conversations[$key]->profile_picture = null;
            }
        }
        
        return $conversations;
    }
    
    /**
     * Get conversations for API access.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function apiGetConversations()
    {
        $conversations = $this->getConversations();
        
        return response()->json([
            'conversations' => $conversations
        ]);
    }
    
    /**
     * Get messages between the authenticated user and another user.
     *
     * @param  int  $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMessages($userId)
    {
        $currentUser = Auth::user();
        $otherUser = User::findOrFail($userId);
        
        $messages = Message::where(function($query) use ($currentUser, $userId) {
            $query->where('sender_id', $currentUser->id)
                    ->where('receiver_id', $userId);
        })->orWhere(function($query) use ($currentUser, $userId) {
            $query->where('sender_id', $userId)
                    ->where('receiver_id', $currentUser->id);
        })
        ->with(['sender'])
        ->orderBy('sent_at', 'asc')
        ->get();
        
        // Add profile picture to each message sender
        foreach ($messages as $message) {
            $sender = $message->sender;
            
            if ($sender->role === 'job_seeker') {
                $jobSeekerProfile = $sender->jobSeekerProfile;
                $message->sender->profile_picture = $jobSeekerProfile ? $jobSeekerProfile->profile_picture : null;
            } elseif ($sender->role === 'employer') {
                $employerProfile = $sender->employeeProfile;
                $message->sender->profile_picture = $employerProfile ? $employerProfile->photo : null;
            } else {
                $message->sender->profile_picture = null;
            }
        }
        
        return response()->json([
            'messages' => $messages
        ]);
    }
    
    /**
     * Send a new message.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);
        
        $message = new Message();
        $message->sender_id = Auth::id();
        $message->receiver_id = $validated['receiver_id'];
        $message->message = $validated['message'];
        $message->sent_at = now();
        $message->save();
        
        // Load sender data for the response
        $message->load(['sender']);
        
        // Add profile picture to the sender
        $sender = $message->sender;
        if ($sender->role === 'job_seeker') {
            $jobSeekerProfile = $sender->jobSeekerProfile;
            $message->sender->profile_picture = $jobSeekerProfile ? $jobSeekerProfile->profile_picture : null;
        } elseif ($sender->role === 'employer') {
            $employerProfile = $sender->employeeProfile;
            $message->sender->profile_picture = $employerProfile ? $employerProfile->photo : null;
        } else {
            $message->sender->profile_picture = null;
        }
        
        return response()->json([
            'message' => $message
        ]);
    }
    
    /**
     * Mark messages as read.
     *
     * @param  int  $senderId
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead($senderId)
    {
        $userId = Auth::id();
        
        // Mark all unread messages from this sender as read
        Message::where('sender_id', $senderId)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
            
        return response()->json(['success' => true]);
    }
    
    /**
     * Get unread message count for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUnreadCount()
    {
        $count = Message::where('receiver_id', Auth::id())
            ->whereNull('read_at')
            ->count();
            
        return response()->json(['count' => $count]);
    }
} 