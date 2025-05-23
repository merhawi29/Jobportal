<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\EmployerDirectMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Send direct message to a job seeker
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $userId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendMessage(Request $request, $userId)
    {
        // Validate request
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'job_id' => 'nullable|exists:joblists,id',
            'job_title' => 'nullable|string|max:255',
        ]);

        try {
            // Get the job seeker
            $jobSeeker = User::where('id', $userId)
                ->where('role', 'job_seeker')
                ->firstOrFail();
                
            // Get employer info
            $employer = auth()->user();
            
            // Send notification
            $notification = new EmployerDirectMessage(
                $employer->name,
                $validated['message'],
                $validated['job_id'] ?? null,
                $validated['job_title'] ?? null
            );
            
            // Check if database channel is configured properly
            Log::info('Notification channels available:', [
                'channels' => $notification->via($jobSeeker)
            ]);
            
            $jobSeeker->notify($notification);
            
            // Check database for the notification
            try {
                $storedNotification = DB::table('notifications')
                    ->where('type', 'App\\Notifications\\EmployerDirectMessage')
                    ->latest()
                    ->first();
                    
                if ($storedNotification) {
                    Log::info('Notification stored in database', [
                        'id' => $storedNotification->id,
                        'type' => $storedNotification->type,
                        'data' => $storedNotification->data
                    ]);
                } else {
                    Log::warning('Notification not found in database after sending');
                    
                    // Check if notifications table exists and has records
                    $notificationsExist = DB::table('notifications')->exists();
                    $notificationsCount = DB::table('notifications')->count();
                    Log::info('Notifications table status:', [
                        'table_has_records' => $notificationsExist,
                        'total_count' => $notificationsCount
                    ]);
                    
                    // Try getting the exact class name used
                    Log::info('Notification class name:', [
                        'class' => get_class($notification),
                        'expected_in_db' => get_class($notification)
                    ]);
                }
            } catch (\Exception $dbException) {
                Log::error('Error checking notification in database', [
                    'error' => $dbException->getMessage()
                ]);
            }
            
            // Log the action
            Log::info('Employer message sent', [
                'employer_id' => $employer->id,
                'job_seeker_id' => $jobSeeker->id
            ]);
            
            return back()->with('success', 'Message sent successfully.');
            
        } catch (\Exception $e) {
            Log::error('Failed to send employer message', [
                'error' => $e->getMessage(),
                'user_id' => $userId
            ]);
            
            return back()->with('error', 'Failed to send message. Please try again.');
        }
    }
} 