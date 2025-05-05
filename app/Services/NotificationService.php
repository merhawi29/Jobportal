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
            
            // Send notification
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
    
    /**
     * Test email connection
     * 
     * @param string $email
     * @return array
     */
    public static function testEmailConnection(string $email): array
    {
        try {
            // Send a test email
            Mail::raw('This is a test email from your Job Portal application to verify email functionality.', function ($message) use ($email) {
                $message->to($email)
                        ->subject('Test Email from Job Portal');
            });
            
            return [
                'success' => true,
                'message' => 'Test email sent successfully',
                'config' => self::debugMailConfig(),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to send test email: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'config' => self::debugMailConfig(),
            ];
        }
    }
} 