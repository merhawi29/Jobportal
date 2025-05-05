<?php

namespace App\Notifications;

use App\Models\InterviewInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class InterviewNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private InterviewInvitation $invitation)
    {
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Interview Invitation for ' . $this->invitation->application->job->title)
            ->line('You have been invited for an interview!')
            ->line('Job: ' . $this->invitation->application->job->title)
            ->line('Company: ' . $this->invitation->application->job->company)
            ->line('Type: ' . InterviewInvitation::TYPES[$this->invitation->type])
            ->line('Schedule: ' . $this->invitation->scheduled_at->format('F j, Y g:i A'))
            ->line('Location: ' . $this->invitation->location)
            ->action('View Details', url('/dashboard/applications/' . $this->invitation->application_id))
            ->line('Good luck with your interview!');
    }

    public function toArray($notifiable): array
    {
        return [
            'invitation_id' => $this->invitation->id,
            'job_id' => $this->invitation->application->joblists_id,
            'job_title' => $this->invitation->application->job->title,
            'scheduled_at' => $this->invitation->scheduled_at,
            'type' => $this->invitation->type
        ];
    }
} 