<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeMessage extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        // No specific data needed for welcome message
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
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
    }

    public function toArray($notifiable): array
    {
        return [
            'user_id' => $notifiable->id,
            'message' => "Welcome to Job Portal! We're excited to have you join our community."
        ];
    }
} 