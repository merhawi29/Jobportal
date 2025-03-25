<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InterviewCancelled extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private JobApplication $jobApplication,
        private array $interviewDetails
    ) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Interview Cancelled - ' . $this->interviewDetails['job_title'])
            ->greeting("Hello {$notifiable->name},")
            ->line("We regret to inform you that the interview scheduled for {$this->interviewDetails['interview_date']->format('F j, Y g:i A')} for the position of {$this->interviewDetails['job_title']} at {$this->interviewDetails['company']} has been cancelled.")
            ->line("You will be notified if a new interview is scheduled.")
            ->action('View Application', route('applications.show', $this->jobApplication->id));
    }

    public function toArray($notifiable): array
    {
        return [
            'job_application_id' => $this->jobApplication->id,
            'job_title' => $this->interviewDetails['job_title'],
            'interview_date' => $this->interviewDetails['interview_date'],
            'type' => 'interview_cancelled'
        ];
    }
} 