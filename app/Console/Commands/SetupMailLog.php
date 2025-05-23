<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

class SetupMailLog extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:use-log 
                            {--reset : Reset to original mail configuration}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Configure the application to use the log driver for mail';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('reset')) {
            // Reset to original mail configuration
            $this->resetMailConfig();
        } else {
            // Set up log driver for mail
            $this->setupLogDriver();
        }
    }

    /**
     * Set up the log driver for mail.
     */
    protected function setupLogDriver()
    {
        // Store current configuration for potential reset
        $currentMailer = Config::get('mail.default');
        $this->info("Current mailer: $currentMailer");
        
        // Set mail driver to log
        Config::set('mail.default', 'log');
        
        // Configure log channel if needed
        Config::set('mail.mailers.log.channel', 'mail');
        
        $this->info('Mail configuration updated to use log driver.');
        $this->info('Mail will be logged to the mail log channel instead of being sent.');
        $this->info('This is useful for development or when mail server is not available.');
        $this->info('To reset this configuration, run: php artisan mail:use-log --reset');
        
        // Create a log entry about this change
        Log::info('Mail configuration changed to use log driver', [
            'previous_driver' => $currentMailer,
            'new_driver' => 'log',
            'reason' => 'Command executed',
            'by' => 'mail:use-log command'
        ]);
        
        // Save the current configuration to a file for potential reset
        file_put_contents(
            storage_path('mail_config_backup.json'), 
            json_encode(['default' => $currentMailer])
        );
    }

    /**
     * Reset mail configuration to original settings.
     */
    protected function resetMailConfig()
    {
        $backupFile = storage_path('mail_config_backup.json');
        
        if (file_exists($backupFile)) {
            $backup = json_decode(file_get_contents($backupFile), true);
            
            if (isset($backup['default'])) {
                Config::set('mail.default', $backup['default']);
                
                $this->info('Mail configuration reset to: ' . $backup['default']);
                Log::info('Mail configuration reset', [
                    'driver' => $backup['default']
                ]);
                
                unlink($backupFile);
                return;
            }
        }
        
        $this->warn('No mail configuration backup found. Unable to reset.');
    }
}
