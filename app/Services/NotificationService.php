<?php

namespace App\Services;

use App\Models\InterviewInvitation;
use App\Models\User;
use App\Notifications\InterviewScheduled;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Resend interview notifications
     * 
     * @param InterviewInvitation $invitation
     * @return bool
     */
    public static function resendInterviewNotification(InterviewInvitation $invitation): bool
    {
        try {
            // Get the user
            $user = $invitation->job_application->user;
            
            if (!$user) {
                Log::error('User not found for invitation', ['invitation_id' => $invitation->id]);
                return false;
            }
            
            // Force notification (bypass queue)
            $notification = new InterviewScheduled($invitation);
            $user->notify($notification);
            
            Log::info('Notification resent successfully', [
                'invitation_id' => $invitation->id,
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to resend notification', [
                'invitation_id' => $invitation->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return false;
        }
    }
    
    /**
     * Send direct email bypassing queue
     * 
     * @param User $user
     * @param InterviewInvitation $invitation
     * @return bool
     */
    public static function sendDirectEmail(User $user, InterviewInvitation $invitation): bool
    {
        try {
            $notification = new InterviewScheduled($invitation);
            $mailMessage = $notification->toMail($user);
            
            // Send directly using Mail facade
            Mail::send([], [], function ($message) use ($mailMessage, $user) {
                $message->to($user->email)
                    ->subject($mailMessage->subject)
                    ->html($mailMessage->render());
            });
            
            Log::info('Direct email sent successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send direct email', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }
    
    /**
     * Debug mail configuration
     * 
     * @return array
     */
    public static function debugMailConfig(): array
    {
        $config = [
            'driver' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
            'encryption' => config('mail.mailers.smtp.encryption'),
        ];
        
        // Add basic verification
        $issues = [];
        
        if (empty($config['host'])) {
            $issues[] = 'MAIL_HOST is not configured';
        }
        
        if (empty($config['from_address'])) {
            $issues[] = 'MAIL_FROM_ADDRESS is not configured';
        }
        
        if ($config['driver'] === 'smtp' && empty($config['port'])) {
            $issues[] = 'MAIL_PORT is not configured for SMTP driver';
        }
        
        return [
            'config' => $config,
            'issues' => $issues,
            'queue_driver' => config('queue.default'),
            'pending_jobs' => DB::table('jobs')->count(),
            'failed_jobs' => DB::table('failed_jobs')->count(),
        ];
    }
} 