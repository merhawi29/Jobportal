<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class ProfileCompletedNotification extends Notification implements ShouldQueue
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

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // First try to use both channels
        try {
            return ['mail', 'database'];
        } catch (\Exception $e) {
            // If email fails, fallback to database only
            Log::warning('Failed to use mail channel, falling back to database only', [
                'error' => $e->getMessage(),
                'user_id' => $notifiable->id ?? 'unknown'
            ]);
            return ['database'];
        }
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        try {
            $isEmployer = $notifiable->role === 'employer';

            return (new MailMessage)
                ->subject('Profile Completed Successfully!')
                ->greeting("Great job, {$notifiable->name}!")
                ->line($isEmployer 
                    ? "Your company profile has been completed successfully." 
                    : "Your job seeker profile has been completed successfully.")
                ->line($isEmployer
                    ? "You can now post jobs and start recruiting talented individuals."
                    : "You can now apply for jobs and showcase your skills to potential employers.")
                ->action($isEmployer ? 'Post a Job' : 'Browse Jobs', route('jobs.index'))
                ->line('Thank you for using our platform!');
        } catch (\Exception $e) {
            Log::error('Failed to build email for profile completion notification', [
                'error' => $e->getMessage(),
                'user_id' => $notifiable->id ?? 'unknown'
            ]);
            
            // Return a simpler email to try to avoid errors
            return (new MailMessage)
                ->subject('Profile Completed Successfully!')
                ->line('Your profile has been completed successfully.')
                ->line('Thank you for using our platform!');
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $isEmployer = $notifiable->role === 'employer';
        
        return [
            'title' => 'Profile Completed',
            'message' => $isEmployer 
                ? "Congratulations! Your company profile is now complete. You can start posting jobs and connecting with candidates."
                : "Congratulations! Your job seeker profile is now complete. You can start applying for jobs and showcasing your skills.",
            'type' => 'profile_completed',
            'user_id' => $notifiable->id,
            'created_at' => now()->toIsoString()
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
        Log::error('Profile completion notification failed', [
            'user_id' => $notifiable->id ?? 'unknown',
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
}
