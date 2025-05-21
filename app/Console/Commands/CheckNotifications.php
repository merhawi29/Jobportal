<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class CheckNotifications extends Command
{
    protected $signature = 'notifications:check';
    protected $description = 'Check notifications in the database';

    public function handle()
    {
        try {
            // Check if table exists
            $tableExists = Schema::hasTable('notifications');
            $this->info('Notifications table exists: ' . ($tableExists ? 'Yes' : 'No'));

            if ($tableExists) {
                // Get notification count
                $count = DB::table('notifications')->count();
                $this->info('Total notifications: ' . $count);

                // Get latest notifications
                $notifications = DB::table('notifications')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get();

                $this->info("\nLatest notifications:");
                foreach ($notifications as $notification) {
                    $this->info("\nID: " . $notification->id);
                    $this->info("Type: " . $notification->type);
                    $this->info("Notifiable ID: " . $notification->notifiable_id);
                    $this->info("Data: " . json_encode($notification->data));
                    $this->info("Created: " . $notification->created_at);
                    $this->info("Read: " . ($notification->read_at ? 'Yes' : 'No'));
                }
            }
        } catch (\Exception $e) {
            $this->error('Error checking notifications: ' . $e->getMessage());
            Log::error('Error checking notifications', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
} 