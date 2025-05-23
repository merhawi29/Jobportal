<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\FixNotificationsAndInvitations;
use App\Console\Commands\TestEmailCommand;
use App\Console\Commands\CheckNotificationsTable;
use App\Console\Commands\TestNotificationCommand;
use App\Console\Commands\SeedNotificationsCommand;
use App\Console\Commands\SendInterviewReminders;
use App\Console\Commands\TestCreateNotification;
use App\Console\Commands\DebugNotificationsCommand;
use App\Console\Commands\SetupQueueSync;
use App\Console\Commands\SendVerificationEmail;
use App\Console\Commands\RegisterUserEvent;
use App\Console\Commands\ListUsers;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        FixNotificationsAndInvitations::class,
        TestEmailCommand::class,
        CheckNotificationsTable::class,
        TestNotificationCommand::class,
        SeedNotificationsCommand::class,
        SendInterviewReminders::class,
        TestCreateNotification::class,
        DebugNotificationsCommand::class,
        SetupQueueSync::class,
        SendVerificationEmail::class,
        RegisterUserEvent::class,
        ListUsers::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        
        // Run the queue worker regularly to ensure emails are sent
        $schedule->command('queue:work --stop-when-empty')->everyFifteenMinutes();
        
        // Process immediate job alerts every 15 minutes
        $schedule->command('job-alerts:process immediate')->everyFifteenMinutes();
        
        // Process daily job alerts every day at 8 AM
        $schedule->command('job-alerts:process daily')->dailyAt('8:00');
        
        // Process weekly job alerts every Monday at 8 AM
        $schedule->command('job-alerts:process weekly')->weeklyOn(1, '8:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
} 