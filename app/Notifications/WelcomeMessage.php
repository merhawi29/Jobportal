<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class WelcomeMessage extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 10;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     *
     * @var int
     */
    public $maxExceptions = 3;

    public function __construct()
    {
        // No specific data needed for welcome message
    }

    public function via($notifiable): array
    {
        // First try to use both channels
        try {
            return ['mail', 'database'];
        } catch (\Exception $e) {
            // If email fails, fallback to database only
            Log::warning('Failed to use mail channel for welcome message, falling back to database only', [
                'error' => $e->getMessage(),
                'user_id' => $notifiable->id ?? 'unknown'
            ]);
            return ['database'];
        }
    }

    public function toMail($notifiable): MailMessage
    {
        try {
            return (new MailMessage)
                ->subject('Welcome to Job Portal!')
                ->greeting("Hello {$notifiable->name},")
                ->line("Thank you for registering with Job Portal. We're excited to have you join our community!")
                ->line("Your account has been created successfully.")
                ->when($notifiable->role === 'job_seeker', function ($message) {
                    return $message->line("Start exploring job opportunities and complete your profile to increase your chances of getting hired.");
                })
                ->when($notifiable->role === 'employer', function ($message) {
                    return $message->line("Start posting job opportunities and complete your company profile to attract the best candidates.");
                })
                ->action('Complete Your Profile', route($notifiable->role === 'employer' ? 'employee.profile.create' : 'jobseeker.profile.create'))
                ->line('If you have any questions, feel free to contact our support team.');
        } catch (\Exception $e) {
            Log::error('Failed to build welcome email', [
                'error' => $e->getMessage(),
                'user_id' => $notifiable->id ?? 'unknown'
            ]);
            
            // Return a simpler email to try to avoid errors
            return (new MailMessage)
                ->subject('Welcome to Job Portal!')
                ->line('Your account has been created successfully.')
                ->line('Thank you for registering with us!');
        }
    }

    public function toArray($notifiable): array
    {
        return [
            'user_id' => $notifiable->id,
            'message' => "Welcome to Job Portal! We're excited to have you join our community."
        ];
    }
    
    /**
     * Handle a notification failure.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function failed($notifiable, \Throwable $exception)
    {
        Log::error('Welcome notification failed', [
            'user_id' => $notifiable->id ?? 'unknown',
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
} 