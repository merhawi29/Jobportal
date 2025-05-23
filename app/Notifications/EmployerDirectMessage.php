<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class EmployerDirectMessage extends Notification implements ShouldQueue
{
    use Queueable;

    protected $employerName;
    protected $message;
    protected $jobId;
    protected $jobTitle;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $employerName, string $message, ?int $jobId = null, ?string $jobTitle = null)
    {
        $this->employerName = $employerName;
        $this->message = $message;
        $this->jobId = $jobId;
        $this->jobTitle = $jobTitle;
        
        // Log notification creation
        Log::info('EmployerDirectMessage notification created', [
            'employer_name' => $employerName,
            'message_length' => strlen($message),
            'job_id' => $jobId,
            'job_title' => $jobTitle
        ]);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // Explicitly log the channels
        $channels = ['mail', 'database'];
        Log::info('Using notification channels', [
            'channels' => $channels,
            'notifiable_id' => $notifiable->id,
            'notifiable_type' => get_class($notifiable)
        ]);
        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject("Message from {$this->employerName}")
            ->greeting("Hello {$notifiable->name},")
            ->line("You have received a message from {$this->employerName}:")
            ->line($this->message);

        if ($this->jobTitle && $this->jobId) {
            $mail->action('View Job Details', route('jobs.show', $this->jobId));
        }

        $mail->line('Thank you for using our application!');
        
        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $data = [
            'employer_name' => $this->employerName,
            'message' => $this->message,
            'job_id' => $this->jobId,
            'job_title' => $this->jobTitle,
            'type' => 'employer_message'
        ];
        
        // Log the data being stored
        Log::info('EmployerDirectMessage toArray data', $data);
        
        return $data;
    }

    /**
     * Override the create method to include user_id in the notification record.
     */
    protected function buildPayload($notifiable)
    {
        $payload = parent::buildPayload($notifiable);
        
        // Add user_id field which is required by our custom notifications table
        $payload['user_id'] = $notifiable->id;
        
        Log::info('Built notification payload with user_id', [
            'user_id' => $notifiable->id,
            'notification_id' => $payload['id']
        ]);
        
        return $payload;
    }
} 