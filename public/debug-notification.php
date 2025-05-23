<?php
// Debug script for notifications

// Basic header
header('Content-Type: text/plain');
echo "Notification Debug Tool\n";
echo "======================\n\n";

// Include Laravel's autoloader
require __DIR__ . '/../vendor/autoload.php';

// Load the environment file
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Import DB facade
use Illuminate\Support\Facades\DB;

// Check database connection
echo "Testing Database Connection...\n";
try {
    $pdo = DB::connection()->getPdo();
    echo "✓ Database connected successfully: " . DB::connection()->getDatabaseName() . "\n\n";
} catch (\Exception $e) {
    echo "✗ Failed to connect to database: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Check notifications table structure
echo "Checking Notifications Table Structure...\n";
try {
    $columns = DB::select('DESCRIBE notifications');
    echo "✓ Notifications table exists\n";
    echo "Table columns:\n";
    foreach ($columns as $column) {
        echo "- $column->Field: $column->Type " . ($column->Null === 'YES' ? '(Nullable)' : '(Required)') . "\n";
    }
    echo "\n";
} catch (\Exception $e) {
    echo "✗ Failed to check notifications table: " . $e->getMessage() . "\n\n";
}

// Check notification count
echo "Checking Notification Count...\n";
try {
    $count = DB::table('notifications')->count();
    echo "Total notifications: $count\n\n";
    
    if ($count > 0) {
        $notifications = DB::table('notifications')->orderBy('created_at', 'desc')->limit(3)->get();
        echo "Latest notifications:\n";
        foreach ($notifications as $notification) {
            echo "-----------------------------------\n";
            echo "ID: $notification->id\n";
            echo "Type: $notification->type\n";
            echo "Data: $notification->data\n";
            echo "Created: $notification->created_at\n";
        }
        echo "\n";
    }
} catch (\Exception $e) {
    echo "✗ Failed to check notification count: " . $e->getMessage() . "\n\n";
}

// Try creating a manual notification
echo "Testing Manual Notification Creation...\n";
try {
    // Find a user
    $users = DB::table('users')->where('role', 'job_seeker')->limit(1)->get();
    if (count($users) === 0) {
        echo "No job seeker found, can't test notification creation\n\n";
    } else {
        $user = $users[0];
        echo "Found user: ID $user->id ($user->name)\n";
        
        // Try to create a notification
        $uuid = \Illuminate\Support\Str::uuid()->toString();
        $now = date('Y-m-d H:i:s');
        $inserted = DB::table('notifications')->insert([
            'id' => $uuid,
            'type' => 'App\\Notifications\\TestNotification',
            'notifiable_type' => 'App\\Models\\User',
            'notifiable_id' => $user->id,
            'data' => json_encode([
                'message' => 'This is a test notification created directly in the database',
                'employer_name' => 'Debug Script',
                'type' => 'debug_notification'
            ]),
            'created_at' => $now,
            'updated_at' => $now
        ]);
        
        if ($inserted) {
            echo "✓ Test notification created successfully: $uuid\n\n";
        } else {
            echo "✗ Failed to create test notification\n\n";
        }
    }
} catch (\Exception $e) {
    echo "✗ Failed to create test notification: " . $e->getMessage() . "\n\n";
}

// Check Laravel notification configuration
echo "Laravel Notification Configuration...\n";
echo "Default Driver: " . config('notification.driver') . "\n";
echo "Mail Driver: " . config('mail.driver') . "\n";
echo "Queue Connection: " . config('queue.default') . "\n\n";

// Simulate API request for a user if one is available
echo "Simulating API request for latest notifications...\n";
try {
    $users = DB::table('users')->where('role', 'job_seeker')->limit(1)->get();
    if (count($users) === 0) {
        echo "No users found to test API endpoint\n\n";
    } else {
        $user = $users[0];
        echo "Using user: ID $user->id ($user->name)\n";
        
        // Get user's notifications
        $notifications = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', 'App\\Models\\User')
            ->latest('created_at')
            ->limit(5)
            ->get();
            
        if ($notifications->isEmpty()) {
            echo "No notifications found for this user\n\n";
        } else {
            echo "Found " . $notifications->count() . " notifications\n";
            
            // Format them like the API would
            $formattedNotifications = [];
            foreach ($notifications as $notification) {
                // Ensure proper JSON decoding
                $decodedData = json_decode($notification->data, true);
                echo "Raw data: " . $notification->data . "\n";
                echo "Decoded data: " . print_r($decodedData, true) . "\n";
                
                $formattedNotifications[] = [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'data' => $decodedData,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            }
            
            $response = [
                'notifications' => $formattedNotifications,
                'unread_count' => DB::table('notifications')
                    ->where('notifiable_id', $user->id)
                    ->where('notifiable_type', 'App\\Models\\User')
                    ->whereNull('read_at')
                    ->count()
            ];
            
            echo "API response would look like:\n";
            print_r($response);
            echo "\n\n";
        }
    }
} catch (\Exception $e) {
    echo "✗ Failed to simulate API request: " . $e->getMessage() . "\n\n";
}

echo "Debug complete.\n"; 