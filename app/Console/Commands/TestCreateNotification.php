<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Notifications\EmployerDirectMessage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TestCreateNotification extends Command
{
    protected $signature = 'notification:test-create';
    protected $description = 'Create a test notification for debugging';

    public function handle()
    {
        $this->info('Creating test notification...');
        
        // Find a job seeker
        $jobSeeker = User::where('role', 'job_seeker')->first();
        
        if (!$jobSeeker) {
            $this->error('No job seeker found!');
            return 1;
        }
        
        $this->info("Using job seeker: {$jobSeeker->name} (ID: {$jobSeeker->id})");
        
        try {
            // Create direct notification
            $jobSeeker->notify(new EmployerDirectMessage(
                'Test Employer',
                'This is a test notification from the console command! If you see this in your panel, the notification system is working.',
                null,
                null
            ));
            
            $this->info('✓ Notification sent successfully!');
            
            // Verify in the database
            $latestNotification = DB::table('notifications')
                ->where('notifiable_id', $jobSeeker->id)
                ->where('notifiable_type', get_class($jobSeeker))
                ->orderBy('created_at', 'desc')
                ->first();
                
            if ($latestNotification) {
                $this->info('Notification stored in database:');
                $this->info("ID: {$latestNotification->id}");
                $this->info("Type: {$latestNotification->type}");
                $this->line("Data: " . substr($latestNotification->data, 0, 100) . (strlen($latestNotification->data) > 100 ? '...' : ''));
            } else {
                $this->error('Could not find the notification in the database!');
                
                // Check the structure of the notifications table
                $this->info('Checking notifications table structure...');
                
                // Run the check command
                $this->call('notifications:check-table');
            }
            
            return 0;
        } catch (\Exception $e) {
            $this->error("Error creating notification: {$e->getMessage()}");
            $this->line($e->getTraceAsString());
            return 1;
        }
    }
} 