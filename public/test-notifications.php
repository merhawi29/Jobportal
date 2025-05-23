<?php

// Debug script for notifications
require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;

echo "=== Notification System Debug Tool ===\n\n";

try {
    // Find a job seeker user
    $jobSeeker = User::where('role', 'job_seeker')->first();
    
    if (!$jobSeeker) {
        echo "No job seeker found. Please create a job seeker user first.\n";
        exit(1);
    }
    
    echo "Testing with job seeker: " . $jobSeeker->name . " (ID: " . $jobSeeker->id . ")\n\n";

    // Check notifications table structure
    echo "Checking Notifications Table Structure...\n";
    try {
        $columns = DB::select('DESCRIBE notifications');
        echo "✓ Notifications table exists\n";
        
        echo "Columns:\n";
        foreach ($columns as $column) {
            echo "- " . $column->Field . " (" . $column->Type . ")\n";
        }
    } catch (\Exception $e) {
        echo "✗ Failed to check notifications table: " . $e->getMessage() . "\n\n";
    }
    
    echo "\n";
    
    // Check existing notifications
    $count = DB::table('notifications')->count();
    echo "Total notifications: $count\n\n";
    
    // Display some recent notifications
    $notifications = DB::table('notifications')->orderBy('created_at', 'desc')->limit(3)->get();
    echo "Latest notifications:\n";
    foreach ($notifications as $notification) {
        echo "---\n";
        echo "ID: " . $notification->id . "\n";
        echo "Type: " . $notification->type . "\n";
        echo "Notifiable ID: " . $notification->notifiable_id . "\n";
        echo "User ID: " . ($notification->user_id ?? 'NULL') . "\n";
        echo "Read At: " . ($notification->read_at ?? 'NULL') . "\n";
        echo "Data: " . substr($notification->data, 0, 100) . (strlen($notification->data) > 100 ? '...' : '') . "\n";
        echo "Created: " . $notification->created_at . "\n";
    }
    
    echo "\n";
    
    // Create a test notification directly in the database
    echo "Creating a test notification...\n";
    
    $now = date('Y-m-d H:i:s');
    $notificationId = \Illuminate\Support\Str::uuid()->toString();
    
    $inserted = DB::table('notifications')->insert([
        'id' => $notificationId,
        'type' => 'App\\Notifications\\TestNotification',
        'notifiable_type' => get_class($jobSeeker),
        'notifiable_id' => $jobSeeker->id,
        'user_id' => $jobSeeker->id, // This is important for your custom table structure
        'data' => json_encode([
            'message' => 'This is a test notification created via the debug script',
            'employer_name' => 'Test Employer',
            'created_at' => $now,
        ]),
        'read_at' => null,
        'created_at' => $now,
        'updated_at' => $now
    ]);
    
    if ($inserted) {
        echo "✓ Test notification created with ID: $notificationId\n";
    } else {
        echo "✗ Failed to create test notification\n";
    }
    
    echo "\n";
    
    // Test the notifications API endpoints
    echo "Simulating API request for latest notifications...\n";

    // Login as the job seeker user
    Auth::login($jobSeeker);
    
    // Mock the request to the notifications API
    $request = Request::create('/api/notifications/latest', 'GET');
    $request->setUserResolver(function () use ($jobSeeker) {
        return $jobSeeker;
    });
    
    // Get user's notifications
    $notifications = DB::table('notifications')
        ->where('notifiable_id', $jobSeeker->id)
        ->where('notifiable_type', get_class($jobSeeker))
        ->latest()
        ->limit(5)
        ->get();
    
    if ($notifications->isEmpty()) {
        echo "No notifications found for this user\n\n";
    } else {
        echo "Found " . $notifications->count() . " notifications\n";
        
        // Format them as they would appear in the API
        $formattedNotifications = [];
        foreach ($notifications as $notification) {
            $data = json_decode($notification->data, true);
            
            $formattedNotifications[] = [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $data,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ];
        }
        
        echo "API response would be:\n";
        echo json_encode([
            'notifications' => $formattedNotifications,
            'unread_count' => DB::table('notifications')
                ->where('notifiable_id', $jobSeeker->id)
                ->where('notifiable_type', get_class($jobSeeker))
                ->whereNull('read_at')
                ->count()
        ], JSON_PRETTY_PRINT);
    }
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
} 