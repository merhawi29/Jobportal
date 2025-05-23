<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Notifications\EmployerDirectMessage;
use Illuminate\Support\Facades\DB;

class SeedNotificationsCommand extends Command
{
    protected $signature = 'notifications:seed';
    protected $description = 'Seed the database with test notifications';

    public function handle()
    {
        $this->info('Seeding notifications...');
        
        // Find job seekers
        $jobSeekers = User::where('role', 'job_seeker')->get();
        
        if ($jobSeekers->isEmpty()) {
            $this->warn('No job seekers found in database. Please create at least one job seeker first.');
            return 1;
        }
        
        $this->info('Found ' . $jobSeekers->count() . ' job seekers.');
        
        // Create a few different notifications per user
        $notificationCount = 0;
        
        foreach ($jobSeekers as $jobSeeker) {
            $this->info('Creating notifications for job seeker: ' . $jobSeeker->name);
            
            // Direct message notification
            $jobSeeker->notify(new EmployerDirectMessage(
                'Test Employer',
                'This is a test direct message for you. We would like to discuss a job opportunity.',
                null, 
                null
            ));
            $notificationCount++;
            
            // Try to create a notification directly in DB
            $uuid = \Illuminate\Support\Str::uuid()->toString();
            $now = now();
            DB::table('notifications')->insert([
                'id' => $uuid,
                'type' => 'App\\Notifications\\EmployerDirectMessage',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => $jobSeeker->id,
                'data' => json_encode([
                    'message' => 'This is another test message created directly in the database.',
                    'employer_name' => 'ABC Company',
                    'job_title' => 'Senior Developer',
                    'type' => 'employer_message'
                ]),
                'created_at' => $now,
                'updated_at' => $now
            ]);
            $notificationCount++;
        }
        
        $this->info('Successfully created ' . $notificationCount . ' notification(s).');
        
        // Count notifications in database
        $dbCount = DB::table('notifications')->count();
        $this->info('Total notifications in database: ' . $dbCount);
        
        return 0;
    }
} 