<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\InterviewInvitation;
use App\Notifications\InterviewScheduled;
use Illuminate\Support\Facades\Log;

class TestNotifications extends Command
{
    protected $signature = 'test:notifications';
    protected $description = 'Test the notification system by creating a sample interview invitation';

    public function handle()
    {
        try {
            // Get a job seeker and employer
            $user = User::where('role', 'job_seeker')->first();
            $employer = User::where('role', 'employer')->first();

            if (!$user || !$employer) {
                $this->error('Could not find required users. Please run the seeders first.');
                return;
            }

            // Get a job
            $job = Job::where('user_id', $employer->id)->first();
            if (!$job) {
                $this->error('Could not find a job. Please run the seeders first.');
                return;
            }

            // Create a job application
            $application = JobApplication::create([
                'user_id' => $user->id,
                'joblists_id' => $job->id,
                'status' => 'under_review',
                'cover_letter' => 'Test application',
                'resume' => 'resumes/default-resume.pdf'
            ]);

            $this->info('Created job application: ' . $application->id);

            // Create an interview invitation
            $interview = InterviewInvitation::create([
                'job_application_id' => $application->id,
                'scheduled_at' => now()->addDays(2),
                'location' => 'Test Location',
                'type' => 'video',
                'status' => 'pending'
            ]);

            $this->info('Created interview invitation: ' . $interview->id);

            // Send notification
            $user->notify(new InterviewScheduled($interview));
            $this->info('Sent notification to user: ' . $user->id);

            // Check notifications
            $notificationCount = $user->notifications()->count();
            $this->info('Total notifications for user: ' . $notificationCount);

            // Show latest notification
            $latestNotification = $user->notifications()->latest()->first();
            if ($latestNotification) {
                $this->info('Latest notification data:');
                $this->info(json_encode($latestNotification->data, JSON_PRETTY_PRINT));
            }

        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            Log::error('Error testing notifications', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
} 