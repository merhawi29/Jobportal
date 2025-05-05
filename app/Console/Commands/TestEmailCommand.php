<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Mail;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {email : The email address to send test mail to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify mail configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("Attempting to send test email to: {$email}");
        
        try {
            // Display mail configuration
            $config = NotificationService::debugMailConfig();
            
            $this->table(
                ['Config Key', 'Value'],
                collect($config['config'])->map(fn($value, $key) => [$key, $value ?: 'Not set'])
            );
            
            if (!empty($config['issues'])) {
                $this->warn('Configuration issues detected:');
                foreach ($config['issues'] as $issue) {
                    $this->warn("- {$issue}");
                }
                
                if (!$this->confirm('Configuration has issues. Continue anyway?', false)) {
                    return 1;
                }
            }
            
            $this->info('Queue configuration:');
            $this->line("Driver: {$config['queue_driver']}");
            $this->line("Pending jobs: {$config['pending_jobs']}");
            $this->line("Failed jobs: {$config['failed_jobs']}");
            
            // Send test email
            $result = NotificationService::testEmailConnection($email);
            
            if ($result['success']) {
                $this->info('✓ Test email sent successfully!');
                $this->info('If you do not receive the email, check:');
                $this->line('1. Your spam/junk folder');
                $this->line('2. Your SMTP server logs');
                $this->line('3. Run `php artisan queue:work` if using queue');
                return 0;
            } else {
                $this->error('✗ Failed to send test email!');
                $this->error("Error: {$result['message']}");
                $this->newLine();
                $this->error('Trace:');
                $this->line($result['trace']);
                return 1;
            }
        } catch (\Exception $e) {
            $this->error('An unexpected error occurred:');
            $this->error($e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }
    }
} 