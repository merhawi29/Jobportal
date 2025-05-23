<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\Log;

class QueueWorker extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'queue:work:start 
                            {--timeout=60 : The number of seconds a job can run}
                            {--tries=3 : Number of times to attempt a job before logging it failed}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start a queue worker process in the background';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $timeout = $this->option('timeout');
        $tries = $this->option('tries');
        
        // Build the command to run the queue worker
        $command = [
            'php',
            'artisan',
            'queue:work',
            '--timeout='.$timeout,
            '--tries='.$tries,
            '--sleep=3',
            '--rest=0.5'
        ];
        
        $this->info('Starting queue worker with command: ' . implode(' ', $command));
        
        // Start the process
        $process = new Process($command);
        $process->disableOutput();
        $process->start();
        
        // Check if the process started successfully
        if ($process->isRunning()) {
            $pid = $process->getPid();
            $this->info("Queue worker started successfully with PID: $pid");
            Log::info("Queue worker started with PID: $pid");
            
            // Save the PID to a file for later management
            file_put_contents(storage_path('queue_worker.pid'), $pid);
        } else {
            $this->error('Failed to start queue worker');
        }
    }
}
