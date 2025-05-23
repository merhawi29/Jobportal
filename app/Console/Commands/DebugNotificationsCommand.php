<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Notifications\EmployerDirectMessage;

class DebugNotificationsCommand extends Command
{
    protected $signature = 'notifications:debug {user_id?}';
    protected $description = 'Debug notifications system with detailed output';

    public function handle()
    {
        $this->info('🔍 Notification System Debug Tool 🔍');
        $this->newLine();

        $userId = $this->argument('user_id');
        $user = null;

        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                $this->error("❌ User with ID {$userId} not found!");
                return 1;
            }
        } else {
            // Find a job seeker
            $user = User::where('role', 'job_seeker')->first();
            if (!$user) {
                $this->error("❌ No job seeker found in the system!");
                return 1;
            }
        }

        $this->info("👤 Working with user: {$user->name} (ID: {$user->id}, Role: {$user->role})");
        $this->newLine();

        // Check database connection
        $this->info("📊 Testing database connection...");
        try {
            DB::connection()->getPdo();
            $this->info("✅ Database connection successful: " . DB::connection()->getDatabaseName());
        } catch (\Exception $e) {
            $this->error("❌ Database connection failed: " . $e->getMessage());
            return 1;
        }
        $this->newLine();

        // Check notifications table
        $this->info("📋 Checking notifications table...");
        try {
            $columns = DB::select('DESCRIBE notifications');
            $this->info("✅ Notifications table exists with " . count($columns) . " columns");
            
            $requiredColumns = ['id', 'type', 'notifiable_type', 'notifiable_id', 'data', 'read_at', 'created_at', 'updated_at', 'user_id'];
            $missingColumns = [];
            
            $tableColumns = [];
            foreach ($columns as $column) {
                $tableColumns[] = $column->Field;
                $this->line("   - {$column->Field} ({$column->Type})");
            }
            
            foreach ($requiredColumns as $required) {
                if (!in_array($required, $tableColumns)) {
                    $missingColumns[] = $required;
                }
            }
            
            if (!empty($missingColumns)) {
                $this->warn("⚠️ Missing required columns: " . implode(', ', $missingColumns));
            } else {
                $this->info("✅ All required columns are present");
            }
        } catch (\Exception $e) {
            $this->error("❌ Error checking notifications table: " . $e->getMessage());
        }
        $this->newLine();

        // Check existing notifications for the user
        $this->info("🔔 Checking existing notifications for the user...");
        $notifications = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', get_class($user))
            ->orderBy('created_at', 'desc')
            ->get();

        if ($notifications->isEmpty()) {
            $this->warn("⚠️ No notifications found for this user");
        } else {
            $this->info("✅ Found " . count($notifications) . " notifications");
            
            $this->line("   Recent notifications:");
            foreach ($notifications->take(3) as $notification) {
                $this->line("   ---");
                $this->line("   ID: " . $notification->id);
                $this->line("   Type: " . $notification->type);
                $data = json_decode($notification->data, true);
                $this->line("   Data: " . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
                $this->line("   Read: " . ($notification->read_at ? '✓' : '✗'));
                $this->line("   Created: " . $notification->created_at);
            }
        }
        $this->newLine();

        // Create a test notification
        $this->info("📩 Creating a test notification...");
        try {
            $user->notify(new EmployerDirectMessage(
                'Debug Employer',
                'This is a test notification from the DEBUG command at ' . now()->format('Y-m-d H:i:s'),
                null,
                null
            ));
            
            $this->info("✅ Notification created successfully");
            
            // Check if the notification was stored
            $latest = DB::table('notifications')
                ->where('notifiable_id', $user->id)
                ->where('notifiable_type', get_class($user))
                ->orderBy('created_at', 'desc')
                ->first();
                
            if ($latest) {
                $this->info("✅ Notification found in database");
                $this->line("   ID: " . $latest->id);
                $data = json_decode($latest->data, true);
                $this->line("   Message: " . ($data['message'] ?? 'No message'));
            } else {
                $this->error("❌ Notification not found in database!");
            }
        } catch (\Exception $e) {
            $this->error("❌ Error creating notification: " . $e->getMessage());
            $this->line($e->getTraceAsString());
        }
        $this->newLine();

        // Test the API endpoint
        $this->info("🌐 Testing API endpoint simulation...");
        try {
            // Get latest notifications as they would appear in the API
            $latestNotifications = DB::table('notifications')
                ->where('notifiable_id', $user->id)
                ->where('notifiable_type', get_class($user))
                ->latest()
                ->limit(5)
                ->get();

            if ($latestNotifications->isEmpty()) {
                $this->warn("⚠️ No notifications to show in API");
            } else {
                $this->info("✅ API would return " . count($latestNotifications) . " notifications");
                
                $formatted = [];
                foreach ($latestNotifications as $notification) {
                    $data = json_decode($notification->data, true);
                    $formatted[] = [
                        'id' => $notification->id,
                        'type' => $notification->type,
                        'data' => $data,
                        'read_at' => $notification->read_at,
                        'created_at' => $notification->created_at,
                    ];
                }
                
                $this->line("   API response would be: ");
                $this->line(json_encode([
                    'notifications' => $formatted,
                    'unread_count' => DB::table('notifications')
                        ->where('notifiable_id', $user->id)
                        ->where('notifiable_type', get_class($user))
                        ->whereNull('read_at')
                        ->count()
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            }
        } catch (\Exception $e) {
            $this->error("❌ Error simulating API endpoint: " . $e->getMessage());
        }
        $this->newLine();

        $this->info("✅ Debug complete");
        return 0;
    }
} 