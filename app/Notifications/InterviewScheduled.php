<?php

namespace App\Notifications;

use App\Models\InterviewInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class InterviewScheduled extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private InterviewInvitation $interview)
    {
        Log::info('InterviewScheduled notification constructed', [
            'interview_id' => $this->interview->id,
            'user_id' => $this->interview->job_application->user_id
        ]);
    }

    public function via($notifiable): array
    {
        Log::info('InterviewScheduled notification via method called', [
            'notifiable_id' => $notifiable->id,
            'channels' => ['mail', 'database']
        ]);
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        Log::info('InterviewScheduled notification preparing email', [
            'notifiable_id' => $notifiable->id,
            'interview_id' => $this->interview->id
        ]);

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
        try {
            Log::info('InterviewScheduled notification preparing database data', [
                'notifiable_id' => $notifiable->id,
                'interview_id' => $this->interview->id
            ]);

            $data = [
                'message' => "Your interview has been scheduled for {$this->interview->job_application->job->title} at {$this->interview->job_application->job->company}",
                'job_title' => $this->interview->job_application->job->title,
                'company' => $this->interview->job_application->job->company,
                'location' => $this->interview->location,
                'type' => $this->interview->type,
                'scheduled_at' => $this->interview->scheduled_at->format('Y-m-d H:i:s'),
                'interview_id' => $this->interview->id,
                'application_id' => $this->interview->job_application->id
            ];

            Log::info('Interview notification data prepared', [
                'user_id' => $notifiable->id,
                'interview_id' => $this->interview->id,
                'data' => $data
            ]);

            return $data;
        } catch (\Exception $e) {
            Log::error('Error creating interview notification data', [
                'error' => $e->getMessage(),
                'interview_id' => $this->interview->id,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
} 