<?php

namespace App\Services;

use App\Models\Job;
use App\Models\JobAlert;
use App\Models\User;
use App\Notifications\JobAlertNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class JobAlertService
{
    /**
     * Process job alerts based on frequency (daily, weekly, immediate)
     */
    public function processAlerts(string $frequency = null): int
    {
        $processedCount = 0;
        
        try {
            // Get active alerts of specified frequency (or all frequencies if null)
            $query = JobAlert::where('is_active', true);
            
            if ($frequency) {
                $query->where('frequency', $frequency);
            }
            
            $alerts = $query->get();
            Log::info("Processing " . $alerts->count() . " job alerts");
            
            foreach ($alerts as $alert) {
                $matchingJobs = $this->findMatchingJobs($alert);
                
                if (!empty($matchingJobs)) {
                    $user = User::find($alert->user_id);
                    
                    if ($user) {
                        $user->notify(new JobAlertNotification($alert, $matchingJobs));
                        $processedCount++;
                    }
                }
            }
            
            return $processedCount;
        } catch (\Exception $e) {
            Log::error("Error processing job alerts: " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Find jobs matching the criteria in a job alert
     */
    protected function findMatchingJobs(JobAlert $alert): array
    {
        // Get the last time we checked for this alert
        $lastChecked = DB::table('job_alert_checks')
            ->where('job_alert_id', $alert->id)
            ->value('checked_at') ?? Carbon::now()->subDays(30);
        
        $query = Job::query();
        
        // Only consider jobs posted since last check
        $query->where('created_at', '>', $lastChecked);
        
        // Apply filters based on alert criteria
        if (!empty($alert->keywords)) {
            $query->where(function ($q) use ($alert) {
                foreach ($alert->keywords as $keyword) {
                    $q->orWhere('title', 'like', "%{$keyword}%")
                      ->orWhere('description', 'like', "%{$keyword}%");
                }
            });
        }
        
        if ($alert->location) {
            $query->where('location', 'like', "%{$alert->location}%");
        }
        
        if (!empty($alert->categories)) {
            $query->whereIn('job_category_id', $alert->categories);
        }
        
        if (!empty($alert->job_types)) {
            $query->whereIn('job_type_id', $alert->job_types);
        }
        
        if ($alert->min_salary) {
            $query->where('salary_min', '>=', $alert->min_salary);
        }
        
        if ($alert->max_salary) {
            $query->where('salary_max', '<=', $alert->max_salary);
        }
        
        // Get matching jobs
        $jobs = $query->get()->map(function ($job) {
            return [
                'id' => $job->id,
                'title' => $job->title,
                'company_name' => $job->company_name,
                'location' => $job->location,
                'url' => route('jobs.show', $job->id)
            ];
        })->toArray();
        
        // Update the last checked time
        DB::table('job_alert_checks')->updateOrInsert(
            ['job_alert_id' => $alert->id],
            ['checked_at' => Carbon::now()]
        );
        
        return $jobs;
    }
} 