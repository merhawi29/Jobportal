<?php

namespace App\Console\Commands;

use App\Services\JobAlertService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessJobAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'job-alerts:process {frequency? : The alert frequency to process (daily/weekly/immediate)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process job alerts and send notifications to users';

    /**
     * Execute the console command.
     */
    public function handle(JobAlertService $jobAlertService)
    {
        $frequency = $this->argument('frequency');
        
        if ($frequency && !in_array($frequency, ['daily', 'weekly', 'immediate'])) {
            $this->error("Invalid frequency '{$frequency}'. Must be daily, weekly, or immediate.");
            return 1;
        }
        
        $this->info("Processing {$frequency} job alerts...");
        
        try {
            $processed = $jobAlertService->processAlerts($frequency);
            $this->info("Successfully processed {$processed} job alerts");
            return 0;
        } catch (\Exception $e) {
            $this->error("Error processing job alerts: {$e->getMessage()}");
            Log::error("Job alert processing error: {$e->getMessage()}", [
                'trace' => $e->getTraceAsString(),
            ]);
            return 1;
        }
    }
} 