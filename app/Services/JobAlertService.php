<?php

namespace App\Services;

use App\Models\Job;
use App\Models\JobAlert;
use App\Notifications\JobAlertNotification;
use Illuminate\Support\Collection;

class JobAlertService
{
    /**
     * Process a new job and send notifications to matching job seekers
     */
    public function processNewJob(Job $job): void
    {
        // Get all active job alerts
        $matchingAlerts = $this->findMatchingAlerts($job);

        foreach ($matchingAlerts as $alert) {
            $this->sendJobAlert($job, $alert);
        }
    }

    /**
     * Find all job alerts that match the given job
     */
    protected function findMatchingAlerts(Job $job): Collection
    {
        return JobAlert::query()
            ->where('is_active', true)
            ->where(function ($query) use ($job) {
                $query->where(function ($q) use ($job) {
                    // Match job title if specified
                    $q->whereNull('job_title')
                        ->orWhere('job_title', 'like', '%' . $job->title . '%');
                })
                ->where(function ($q) use ($job) {
                    // Match job type if specified
                    $q->whereNull('job_type')
                        ->orWhere('job_type', $job->type);
                })
                ->where(function ($q) use ($job) {
                    // Match location if specified
                    $q->whereNull('location')
                        ->orWhere('location', 'like', '%' . $job->location . '%');
                })
                ->where(function ($q) use ($job) {
                    // Match salary range if specified
                    $q->where(function ($salary) use ($job) {
                        $salary->whereNull('salary_min')
                            ->whereNull('salary_max')
                            ->orWhere(function ($range) use ($job) {
                                // Check if job salary falls within the alert range
                                $range->where(function ($min) use ($job) {
                                    $min->whereNull('salary_min')
                                        ->orWhere('salary_min', '<=', $job->salary_max);
                                })
                                ->where(function ($max) use ($job) {
                                    $max->whereNull('salary_max')
                                        ->orWhere('salary_max', '>=', $job->salary_min);
                                });
                            });
                    });
                });
            })
            ->with('user') // Eager load user relationship
            ->get();
    }

    /**
     * Send job alert notification to the user
     */
    protected function sendJobAlert(Job $job, JobAlert $alert): void
    {
        $alert->user->notify(new JobAlertNotification($job, [
            'notification_type' => $alert->notification_type,
            'matched_criteria' => [
                'job_title' => $alert->job_title,
                'job_type' => $alert->job_type,
                'location' => $alert->location,
                'salary_min' => $alert->salary_min,
                'salary_max' => $alert->salary_max,
                'keywords' => $alert->keywords,
            ]
        ]));
    }
} 