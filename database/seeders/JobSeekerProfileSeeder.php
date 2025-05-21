<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\JobSeekerProfile;

class JobSeekerProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all job seeker users
        $jobSeekers = User::where('role', 'job_seeker')->get();

        foreach ($jobSeekers as $jobSeeker) {
            // Skip if user already has a profile
            if ($jobSeeker->jobSeekerProfile) {
                // Update existing profiles to use the new experience_level field
                $this->updateExistingProfile($jobSeeker->jobSeekerProfile);
                continue;
            }

            // Create sample skills
            $skillSets = [
                ['PHP', 'Laravel', 'MySQL', 'REST API', 'JavaScript', 'Vue.js'],
                ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'],
                ['Python', 'Django', 'Flask', 'PostgreSQL', 'Docker', 'AWS'],
                ['Java', 'Spring Boot', 'Hibernate', 'Oracle', 'Microservices'],
                ['C#', '.NET Core', 'SQL Server', 'Azure', 'Entity Framework'],
                ['HTML', 'CSS', 'JavaScript', 'UI/UX Design', 'Figma', 'Adobe XD'],
                ['Data Analysis', 'Python', 'R', 'SQL', 'Tableau', 'Machine Learning'],
                ['Project Management', 'Agile', 'Scrum', 'JIRA', 'Confluence']
            ];

            // Randomly select experience level
            $experienceLevels = ['entry', 'mid', 'senior', 'expert'];
            $experienceLevel = $experienceLevels[array_rand($experienceLevels)];

            // Create education data
            $education = [
                [
                    'institution' => 'University of Technology',
                    'degree' => 'Bachelor of Science in Computer Science'
                ],
                [
                    'institution' => 'Community College',
                    'degree' => 'Associate Degree in Web Development'
                ]
            ];

            // Create profile
            JobSeekerProfile::create([
                'user_id' => $jobSeeker->id,
                'title' => $this->getJobTitle($experienceLevel),
                'location' => $this->getRandomLocation(),
                'about' => 'Dedicated professional with experience in ' . implode(', ', array_slice($skillSets[array_rand($skillSets)], 0, 3)),
                'skills' => $skillSets[array_rand($skillSets)],
                'education' => $education,
                'experience_level' => $experienceLevel,
                'experience_years' => $this->getExperienceYears($experienceLevel),
                'privacy_settings' => [
                    'profile_visibility' => 'public',
                    'show_email' => false,
                    'show_phone' => false, 
                    'show_education' => true,
                    'show_experience' => true
                ],
                'is_public' => true
            ]);
        }
    }

    /**
     * Update existing profiles to use the new experience fields
     */
    private function updateExistingProfile(JobSeekerProfile $profile)
    {
        // Skip if already has experience_level set
        if ($profile->experience_level) {
            return;
        }

        // Determine experience level based on existing data
        $experienceLevel = 'entry';
        
        // Try to extract from experience array if it exists
        if (!empty($profile->experience) && is_array($profile->experience)) {
            // Count number of experiences as a simple metric
            $count = count($profile->experience);
            
            if ($count >= 4) {
                $experienceLevel = 'expert';
            } else if ($count >= 2) {
                $experienceLevel = 'senior';
            } else if ($count >= 1) {
                $experienceLevel = 'mid';
            }
        }

        // Update profile with new fields
        $profile->update([
            'experience_level' => $experienceLevel,
            'experience_years' => $this->getExperienceYears($experienceLevel)
        ]);
    }

    /**
     * Get experience years from level
     */
    private function getExperienceYears($level)
    {
        switch ($level) {
            case 'entry':
                return rand(0, 2);
            case 'mid':
                return rand(3, 5);
            case 'senior':
                return rand(6, 10);
            case 'expert':
                return rand(11, 20);
            default:
                return 0;
        }
    }

    /**
     * Get a job title based on experience level
     */
    private function getJobTitle($level)
    {
        $titles = [
            'entry' => [
                'Junior Developer',
                'Entry Level Engineer',
                'Associate Designer',
                'Assistant Project Coordinator',
                'Intern'
            ],
            'mid' => [
                'Software Developer',
                'Web Designer',
                'Project Manager',
                'System Administrator',
                'Data Analyst'
            ],
            'senior' => [
                'Senior Developer',
                'Lead Designer',
                'Project Lead',
                'DevOps Engineer',
                'Database Administrator'
            ],
            'expert' => [
                'Technical Architect',
                'Chief Technology Officer',
                'Solution Architect',
                'Engineering Manager',
                'Director of Engineering'
            ]
        ];

        return $titles[$level][array_rand($titles[$level])];
    }

    /**
     * Get a random location
     */
    private function getRandomLocation()
    {
        $locations = [
            'New York, USA',
            'San Francisco, USA',
            'London, UK',
            'Berlin, Germany',
            'Tokyo, Japan',
            'Sydney, Australia',
            'Toronto, Canada',
            'Singapore',
            'Paris, France',
            'Remote'
        ];

        return $locations[array_rand($locations)];
    }
}
