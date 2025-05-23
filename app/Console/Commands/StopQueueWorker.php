<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class StopQueueWorker extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'queue:work:stop';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Stop the running queue worker process';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pidFile = storage_path('queue_worker.pid');
        
        if (!file_exists($pidFile)) {
            $this->error('No queue worker PID file found. Worker might not be running.');
            return;
        }
        
        $pid = file_get_contents($pidFile);
        
        if (!$pid) {
            $this->error('Invalid PID file content.');
            unlink($pidFile);
            return;
        }
        
        // Try to stop the process gracefully
        $this->info("Stopping queue worker with PID: $pid");
        
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // Windows
            exec("taskkill /PID $pid /F", $output, $result);
            
            if ($result === 0) {
                $this->info("Queue worker process stopped successfully.");
                Log::info("Queue worker stopped with PID: $pid");
                unlink($pidFile);
            } else {
                $this->error("Failed to stop queue worker process. It might have already stopped.");
                unlink($pidFile);
            }
        } else {
            // Linux/Unix/MacOS
            if (posix_kill($pid, SIGTERM)) {
                $this->info("Queue worker process stopped successfully.");
                Log::info("Queue worker stopped with PID: $pid");
                unlink($pidFile);
            } else {
                $this->error("Failed to stop queue worker process. It might have already stopped.");
                unlink($pidFile);
            }
        }
    }
}
