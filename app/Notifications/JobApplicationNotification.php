<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobApplicationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $jobTitle;
    protected $status;
    protected $message;

    /**
     * Create a new notification instance.
     */
    public function __construct($jobTitle, $status, $message)
    {
        $this->jobTitle = $jobTitle;
        $this->status = $status;
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Update on your job application for {$this->jobTitle}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Your application for {$this->jobTitle} has been {$this->status}.")
            ->line($this->message)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'job_title' => $this->jobTitle,
            'status' => $this->status,
            'message' => $this->message
        ];
    }
} 