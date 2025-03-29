<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Job;

class JobAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $job;
    protected $alertCriteria;

    /**
     * Create a new notification instance.
     */
    public function __construct(Job $job, array $alertCriteria)
    {
        $this->job = $job;
        $this->alertCriteria = $alertCriteria;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // Check the user's preferred notification type from job_alerts table
        return match($this->alertCriteria['notification_type']) {
            'email' => ['mail', 'database'],
            'push' => ['database'],
            'both' => ['mail', 'database'],
            default => ['database'],
        };
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Job Match: ' . $this->job->title)
            ->line('A new job matching your alert criteria has been posted!')
            ->line('Job Title: ' . $this->job->title)
            ->line('Company: ' . $this->job->company)
            ->line('Location: ' . $this->job->location)
            ->line('Salary: ' . $this->formatSalary($this->job->salary_min, $this->job->salary_max))
            ->action('View Job', url('/jobs/' . $this->job->id))
            ->line('You received this alert based on your job preferences.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'job_id' => $this->job->id,
            'title' => $this->job->title,
            'company' => $this->job->company,
            'location' => $this->job->location,
            'salary_min' => $this->job->salary_min,
            'salary_max' => $this->job->salary_max,
            'matched_criteria' => $this->alertCriteria,
            'notification_type' => 'job_alert'
        ];
    }

    /**
     * Get the notification's database type.
     */
    public function databaseType(object $notifiable): string
    {
        return 'job-alert';
    }

    /**
     * Format salary range for display
     */
    protected function formatSalary(?float $min, ?float $max): string
    {
        if (!$min && !$max) {
            return 'Salary not specified';
        }

        if ($min && $max) {
            return '$' . number_format($min) . ' - $' . number_format($max);
        }

        if ($min) {
            return 'From $' . number_format($min);
        }

        return 'Up to $' . number_format($max);
    }
} 