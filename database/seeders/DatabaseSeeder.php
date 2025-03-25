<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\JobApplication;
use App\Models\SavedJob;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\InterviewInvitationSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            EmployerSeeder::class,
            JobSeeder::class,
            InterviewInvitationSeeder::class,
        ]);

        // Create job seekers
        $jobSeekers = User::factory(5)->create([
            'role' => 'job_seeker',
            'status' => 'active',
            'email_verified_at' => now()
        ]);

        // Get all jobs
        $jobs = \App\Models\Job::all();

        // For each job seeker, randomly apply to jobs and save jobs
        foreach ($jobSeekers as $jobSeeker) {
            // Randomly apply to 2-4 jobs
            $jobsToApply = $jobs->random(rand(2, 4));
            foreach ($jobsToApply as $job) {
                JobApplication::create([
                    'user_id' => $jobSeeker->id,
                    'joblists_id' => $job->id,
                    'status' => JobApplication::STATUSES['PENDING'],
                    'cover_letter' => "I am excited to apply for the {$job->title} position at {$job->company}. With my relevant experience and skills, I believe I would be a great addition to your team.",
                    'resume' => 'resumes/default-resume.pdf'
                ]);
            }

            // Randomly save 3-5 jobs (different from applied ones)
            $jobsToSave = $jobs->diff($jobsToApply)->random(min(rand(3, 5), $jobs->count() - $jobsToApply->count()));
            foreach ($jobsToSave as $job) {
                SavedJob::create([
                    'user_id' => $jobSeeker->id,
                    'joblists_id' => $job->id
                ]);
            }
        }
    }
}
