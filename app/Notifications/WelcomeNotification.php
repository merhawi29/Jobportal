<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

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
        try {
            return ['mail', 'database'];
        } catch (\Exception $e) {
            Log::error('Failed to set up notification channels', [
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
        return (new MailMessage)
            ->subject('Welcome to Job Portal!')
            ->greeting("Hello {$notifiable->name}!")
            ->line('Welcome to our Job Portal! We\'re excited to have you join our community.')
            ->line('Our platform connects talented individuals with great opportunities.')
            ->action('Complete Your Profile', url('/profile'))
            ->line('Thank you for choosing our platform!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Welcome to Job Portal',
            'message' => 'Welcome to our platform! Complete your profile to get started.',
            'type' => 'welcome',
            'user_id' => $notifiable->id,
            'created_at' => now()->toIsoString()
        ];
    }

    /**
     * Handle a notification failure.
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