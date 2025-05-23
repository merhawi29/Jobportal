<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Notifications\EmployerDirectMessage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TestNotificationCommand extends Command
{
    protected $signature = 'notifications:test-create';
    protected $description = 'Test creating a notification in the database';

    public function handle()
    {
        $this->info('Testing notification creation...');
        
        // First, we need a job seeker and an employer
        $jobSeeker = User::where('role', 'job_seeker')->first();
        
        if (!$jobSeeker) {
            $this->error('No job seeker found in database. Please create one first.');
            return 1;
        }
        
        $this->info("Found job seeker: ID {$jobSeeker->id}, Name: {$jobSeeker->name}");
        
        // Create and send test notification
        try {
            $this->info('Sending test notification...');
            
            $notification = new EmployerDirectMessage(
                'Test Employer',
                'This is a test direct message. If you see this, notifications are working correctly!',
                null,
                null
            );
            
            $jobSeeker->notify($notification);
            
            $this->info('Notification sent successfully.');
            
            // Check if it was saved to database
            $latestNotification = DB::table('notifications')
                ->latest()
                ->first();
                
            if ($latestNotification) {
                $this->info('✓ Notification found in database:');
                $this->line("ID: {$latestNotification->id}");
                $this->line("Type: {$latestNotification->type}");
                $this->line("Data: {$latestNotification->data}");
                $this->line("Created: {$latestNotification->created_at}");
                
                return 0;
            } else {
                $this->error('⚠ No notification found in database after sending.');
                $this->info('Checking notifications table structure...');
                
                // Run the check command
                $this->call('notifications:check-table');
                
                // Check notification table settings in config
                $this->info('Notification configuration:');
                $this->line('Default channel: ' . config('notification.default'));
                $this->line('Database channel: ' . var_export(config('notification.channels.database'), true));
                
                return 1;
            }
        } catch (\Exception $e) {
            $this->error('Error sending notification: ' . $e->getMessage());
            $this->line($e->getTraceAsString());
            return 1;
        }
    }
} 