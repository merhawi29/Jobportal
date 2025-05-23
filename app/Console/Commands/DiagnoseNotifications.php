<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DiagnoseNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'diagnose:notifications {user_id? : Optional specific user ID to diagnose}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Diagnose notification issues and provide detailed information';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting notification system diagnosis...');
        
        // 1. Check notifications table structure
        $this->checkNotificationsTable();
        
        // 2. Check notification settings
        $this->checkNotificationSettings();
        
        // 3. Test creating a notification
        $userId = $this->argument('user_id');
        if ($userId) {
            $this->testUserNotification($userId);
        } else {
            $this->info('No user_id provided. Skipping test notification.');
        }
        
        $this->info('Notification diagnosis complete.');
    }
    
    private function checkNotificationsTable()
    {
        $this->info('Checking notifications table structure...');
        
        try {
            if (!Schema::hasTable('notifications')) {
                $this->error('CRITICAL ERROR: The notifications table does not exist!');
                return;
            }
            
            $this->info('Notifications table exists.');
            
            // Check columns
            $columns = Schema::getColumnListing('notifications');
            $requiredColumns = ['id', 'type', 'notifiable_type', 'notifiable_id', 'data', 'read_at', 'created_at', 'updated_at'];
            
            $this->info('Columns found: ' . implode(', ', $columns));
            
            $missingColumns = array_diff($requiredColumns, $columns);
            if (!empty($missingColumns)) {
                $this->error('Missing required columns: ' . implode(', ', $missingColumns));
            } else {
                $this->info('All required columns present.');
            }
            
            // Count notifications
            $count = DB::table('notifications')->count();
            $this->info("Total notifications in database: {$count}");
            
        } catch (\Exception $e) {
            $this->error('Error checking notifications table: ' . $e->getMessage());
            Log::error('Error in DiagnoseNotifications command', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    private function checkNotificationSettings()
    {
        $this->info('Checking notification settings...');
        
        // Check if queue is configured
        $queueConnection = config('queue.default');
        $this->info("Queue connection: {$queueConnection}");
        
        // Check mail settings
        $mailDriver = config('mail.default');
        $this->info("Mail driver: {$mailDriver}");
        
        // Check if the notifications are configured to use database
        if (app()->environment('production')) {
            $this->comment('Note: In production, we cannot check notification channel settings directly.');
        } else {
            $this->info('Environment allows for deep inspection of notification channels.');
        }
    }
    
    private function testUserNotification($userId)
    {
        $this->info("Testing notification for user ID: {$userId}");
        
        try {
            $user = User::findOrFail($userId);
            $this->info("User found: {$user->name} ({$user->email})");
            
            // Create a test notification
            $testNotification = new \Illuminate\Notifications\DatabaseNotification([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'type' => 'App\\Notifications\\TestNotification',
                'notifiable_type' => get_class($user),
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'message' => 'This is a test notification from diagnosis tool',
                    'created_at' => now()->toIsoString()
                ]),
                'read_at' => null
            ]);
            
            $success = $testNotification->save();
            
            if ($success) {
                $this->info('Test notification created successfully!');
                
                // Retrieve to confirm
                $savedNotification = \Illuminate\Notifications\DatabaseNotification::find($testNotification->id);
                if ($savedNotification) {
                    $this->info('Test notification retrieved successfully from database.');
                } else {
                    $this->error('Could not retrieve the test notification from database!');
                }
            } else {
                $this->error('Failed to save test notification!');
            }
            
        } catch (\Exception $e) {
            $this->error('Error testing notification: ' . $e->getMessage());
            Log::error('Error in DiagnoseNotifications command', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $userId
            ]);
        }
    }
}
