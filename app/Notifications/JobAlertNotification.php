<?php

namespace App\Notifications;

use App\Models\Job;
use App\Models\JobAlert;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $jobAlert;
    protected $jobs;

    /**
     * Create a new notification instance.
     */
    public function __construct(JobAlert $jobAlert, array $jobs)
    {
        $this->jobAlert = $jobAlert;
        $this->jobs = $jobs;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = [];
        
        if ($this->jobAlert->notification_method === 'email' || $this->jobAlert->notification_method === 'both') {
            $channels[] = 'mail';
        }
        
        if ($this->jobAlert->notification_method === 'push' || $this->jobAlert->notification_method === 'both') {
            $channels[] = 'database';
        }
        
        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $jobCount = count($this->jobs);
        
        $message = (new MailMessage)
            ->subject("Job Alert: {$jobCount} new jobs matching \"{$this->jobAlert->title}\"")
            ->greeting("Hello {$notifiable->name}!")
            ->line("We've found {$jobCount} new job" . ($jobCount > 1 ? 's' : '') . " matching your \"{$this->jobAlert->title}\" alert criteria.");
            
        foreach ($this->jobs as $index => $job) {
            if ($index < 5) { // Show max 5 jobs in email
                $message->line("• {$job['title']} at {$job['company_name']} - {$job['location']}");
            }
        }
        
        if ($jobCount > 5) {
            $message->line("...and " . ($jobCount - 5) . " more jobs");
        }
        
        $message->action('View All Matching Jobs', url('/jobs/search?alert_id=' . $this->jobAlert->id))
            ->line('You can manage your job alerts in your account settings.');
            
        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $jobCount = count($this->jobs);
        
        return [
            'alert_id' => $this->jobAlert->id,
            'alert_title' => $this->jobAlert->title,
            'job_count' => $jobCount,
            'message' => "{$jobCount} new job" . ($jobCount > 1 ? 's' : '') . " matching your \"{$this->jobAlert->title}\" alert",
            'url' => '/jobs/search?alert_id=' . $this->jobAlert->id,
        ];
    }
} 