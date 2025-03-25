<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InterviewInvitation;
use App\Models\JobApplication;
use Carbon\Carbon;

class InterviewInvitationSeeder extends Seeder
{
    public function run()
    {
        // Get all job applications
        $jobApplications = JobApplication::all();

        // Interview types and statuses
        $types = ['in_person', 'video', 'phone'];
        $statuses = ['pending', 'accepted', 'declined', 'rescheduled'];
        
        // Sample locations
        $locations = [
            'in_person' => [
                'Company HQ - 123 Business Street, Floor 5',
                'Downtown Office - 456 Corporate Avenue',
                'Branch Office - 789 Enterprise Road',
            ],
            'video' => [
                'Google Meet - Link will be sent via email',
                'Zoom Meeting - Check calendar invite',
                'Microsoft Teams - Join via calendar link',
            ],
            'phone' => [
                'We will call you at your provided number',
                'Please call us at (555) 123-4567',
                'HR will contact you at the scheduled time',
            ],
        ];

        // Sample notes
        $notes = [
            'Please bring your portfolio and any relevant work samples.',
            'Be prepared to discuss your previous projects and experience.',
            'This will be a technical interview with the development team.',
            'You will meet with the department head and team leads.',
            'Please arrive 15 minutes early for security check-in.',
        ];

        foreach ($jobApplications as $application) {
            // Create 1-3 interviews for each application
            $numInterviews = rand(1, 3);
            
            for ($i = 0; $i < $numInterviews; $i++) {
                $type = $types[array_rand($types)];
                $status = $statuses[array_rand($statuses)];
                
                // Create a random date within next 30 days
                $scheduledAt = Carbon::now()->addDays(rand(1, 30))
                    ->setHour(rand(9, 17))
                    ->setMinute(0)
                    ->setSecond(0);

                InterviewInvitation::create([
                    'job_application_id' => $application->id,
                    'scheduled_at' => $scheduledAt,
                    'location' => $locations[$type][array_rand($locations[$type])],
                    'type' => $type,
                    'status' => $status,
                    'notes' => $notes[array_rand($notes)],
                ]);

                // Update the job application status
                $application->update(['status' => 'interview_scheduled']);
            }
        }
    }
} 