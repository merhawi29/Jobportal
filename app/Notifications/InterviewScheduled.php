<?php

namespace App\Notifications;

use App\Models\InterviewInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InterviewScheduled extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private InterviewInvitation $interview)
    {
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $typeText = [
            'in_person' => 'In-Person Interview',
            'video' => 'Video Interview',
            'phone' => 'Phone Interview'
        ][$this->interview->type] ?? 'Interview';

        return (new MailMessage)
            ->subject("Interview Scheduled - {$this->interview->job_application->job->title}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Your {$typeText} has been scheduled for the position of {$this->interview->job_application->job->title} at {$this->interview->job_application->job->company}.")
            ->line("Date & Time: " . $this->interview->scheduled_at->format('F j, Y g:i A'))
            ->line("Location/Link: {$this->interview->location}")
            ->when($this->interview->notes, fn($message) => 
                $message->line("Additional Notes: {$this->interview->notes}")
            )
            ->action('View Interview Details', route('interviews.show', $this->interview->id))
            ->line('Please confirm your attendance by accepting or declining the invitation.');
    }

    public function toArray($notifiable): array
    {
        return [
            'user_id' => $notifiable->id,
            'interview_id' => $this->interview->id,
            'job_id' => $this->interview->job_application->joblists_id,
            'job_title' => $this->interview->job_application->job->title,
            'scheduled_at' => $this->interview->scheduled_at,
            'type' => $this->interview->type,
            'message' => "Your interview has been scheduled for {$this->interview->job_application->job->title} at {$this->interview->job_application->job->company}"
        ];
    }
} 