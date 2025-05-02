<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\InterviewInvitation;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Notifications\InterviewScheduled;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class FixNotificationsAndInvitations extends Command
{
    protected $signature = 'fix:notifications-invitations';
    protected $description = 'Diagnose and fix issues with interview invitations and notifications';

    public function handle()
    {
        $this->info('Starting diagnostic...');
        
        // Check database tables
        $this->checkDatabaseTables();
        
        // Check queued jobs
        $this->checkQueuedJobs();
        
        // Attempt to fix notifications
        $this->fixNotifications();
        
        $this->info('Diagnostic complete. Please check the logs for details.');
    }
    
    private function checkDatabaseTables()
    {
        $this->info('Checking database tables...');
        
        // Check if tables exist
        $tables = [
            'interview_invitations',
            'notifications',
            'jobs',
            'failed_jobs'
        ];
        
        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                $this->info("✓ Table {$table} exists");
                $count = DB::table($table)->count();
                $this->info("  - Contains {$count} records");
            } else {
                $this->error("✗ Table {$table} does not exist");
            }
        }
    }
    
    private function checkQueuedJobs()
    {
        $this->info('Checking queued jobs...');
        
        $pendingJobs = DB::table('jobs')->count();
        $failedJobs = DB::table('failed_jobs')->count();
        
        $this->info("Pending jobs: {$pendingJobs}");
        $this->info("Failed jobs: {$failedJobs}");
        
        if ($failedJobs > 0) {
            $this->warn("You have {$failedJobs} failed jobs. Run 'php artisan queue:failed' to view them.");
        }
    }
    
    private function fixNotifications()
    {
        $this->info('Attempting to fix notifications...');
        
        // Find interview invitations without notifications
        $interviews = InterviewInvitation::with('job_application.user')
            ->whereDoesntHave('job_application.user.notifications', function ($query) {
                $query->where('type', InterviewScheduled::class);
            })
            ->get();
            
        $this->info("Found {$interviews->count()} interviews without notifications.");
        
        if ($interviews->count() > 0) {
            $this->info("Attempting to send notifications...");
            
            foreach ($interviews as $interview) {
                try {
                    if ($interview->job_application && $interview->job_application->user) {
                        $user = $interview->job_application->user;
                        $user->notify(new InterviewScheduled($interview));
                        $this->info("Sent notification for interview #{$interview->id}");
                    } else {
                        $this->warn("Interview #{$interview->id} has missing job application or user");
                    }
                } catch (\Exception $e) {
                    $this->error("Failed to send notification for interview #{$interview->id}: " . $e->getMessage());
                    Log::error("Failed to send notification: " . $e->getMessage(), [
                        'interview_id' => $interview->id,
                        'exception' => $e
                    ]);
                }
            }
        }
    }
} 