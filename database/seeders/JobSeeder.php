<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a company user if not exists
        $employer = User::create([
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'employer',
            'status' => 'active'
        ]);

        $jobs = [
            [
                'title' => 'Senior Software Engineer',
                'company' => 'TechCorp Solutions',
                'description' => 'We are looking for an experienced software engineer with strong expertise in backend development and distributed systems.',
                'location' => 'New York, NY',
                'salary_range' => '$120,000 - $180,000',
                'type' => 'Full-time',
                'category' => 'Technology',
                'subcategories' => ['Software Development', 'Backend Development'],
                'requirements' => '- 5+ years experience in software development\n- Strong expertise in distributed systems\n- Experience with cloud platforms (AWS/GCP)\n- Excellent problem-solving skills',
                'benefits' => '- Health insurance\n- 401k matching\n- Remote work options\n- Professional development budget\n- Flexible PTO',
                'deadline' => now()->addDays(30),
                'status' => 'active',
                'user_id' => $employer->id,
            ],
            [
                'title' => 'Frontend Developer',
                'company' => 'TechCorp Solutions',
                'description' => 'Join our frontend team to build beautiful and responsive web applications using modern JavaScript frameworks.',
                'location' => 'Remote',
                'salary_range' => '$80,000 - $120,000',
                'type' => 'Full-time',
                'category' => 'Technology',
                'subcategories' => ['Software Development', 'Frontend Development'],
                'requirements' => '- 3+ years experience with React/Vue.js\n- Strong HTML/CSS skills\n- Experience with modern build tools\n- Understanding of web accessibility',
                'benefits' => '- Health insurance\n- 401k matching\n- Remote work\n- Learning stipend\n- Flexible hours',
                'deadline' => now()->addDays(45),
                'status' => 'active',
                'user_id' => $employer->id,
            ],
            [
                'title' => 'UX/UI Designer',
                'company' => 'TechCorp Solutions',
                'description' => 'Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications.',
                'location' => 'San Francisco, CA',
                'type' => 'Full-time',
                'salary_range' => '$80,000 - $120,000',
                'requirements' => "- 3+ years of UX/UI design experience\n- Proficiency in Figma and Adobe Creative Suite\n- Strong portfolio demonstrating UI design skills\n- Experience with user research and testing",
                'benefits' => "- Flexible work hours\n- Health and dental insurance\n- Stock options\n- Creative workspace\n- Team events",
                'deadline' => '2024-05-15',
                'status' => 'active',
                'user_id' => $employer->id
            ],
            [
                'title' => 'DevOps Engineer',
                'company' => 'TechCorp Solutions',
                'description' => 'Looking for a skilled DevOps Engineer to help us build and maintain our cloud infrastructure.',
                'location' => 'Remote',
                'type' => 'Remote',
                'salary_range' => '$90,000 - $140,000',
                'requirements' => "- 4+ years of DevOps experience\n- AWS/Azure certification\n- Experience with Docker and Kubernetes\n- Strong scripting skills (Python, Bash)\n- CI/CD pipeline experience",
                'benefits' => "- Full remote work\n- Flexible hours\n- Health insurance\n- Learning budget\n- Home office stipend",
                'deadline' => '2024-06-15',
                'status' => 'active',
                'user_id' => $employer->id
            ],
            [
                'title' => 'Marketing Manager',
                'company' => 'TechCorp Solutions',
                'description' => 'We are looking for a Marketing Manager to lead our digital marketing initiatives and drive growth.',
                'location' => 'Chicago, IL',
                'type' => 'Full-time',
                'salary_range' => '$70,000 - $100,000',
                'requirements' => "- 5+ years of digital marketing experience\n- Experience with SEO, SEM, and social media marketing\n- Strong analytical skills\n- Project management experience",
                'benefits' => "- Competitive base salary\n- Performance bonuses\n- Health benefits\n- Work from home options\n- Professional development",
                'deadline' => '2024-05-20',
                'status' => 'active',
                'user_id' => $employer->id
            ],
            [
                'title' => 'Data Scientist',
                'company' => 'TechCorp Solutions',
                'description' => 'Seeking a Data Scientist to help us derive insights from complex datasets and build predictive models.',
                'location' => 'Boston, MA',
                'type' => 'Full-time',
                'salary_range' => '$95,000 - $145,000',
                'requirements' => "- MS/PhD in Data Science, Statistics, or related field\n- Experience with Python, R, and SQL\n- Machine learning expertise\n- Strong mathematical background",
                'benefits' => "- Competitive salary\n- Research budget\n- Conference attendance\n- Health benefits\n- Flexible schedule",
                'deadline' => '2024-06-01',
                'status' => 'active',
                'user_id' => $employer->id
            ],
            [
                'title' => 'Mobile App Developer',
                'company' => 'TechCorp Solutions',
                'description' => 'Join our mobile development team to create innovative iOS and Android applications.',
                'location' => 'Austin, TX',
                'type' => 'Full-time',
                'salary_range' => '$85,000 - $130,000',
                'requirements' => "- 3+ years mobile development experience\n- Proficiency in Swift and Kotlin\n- Experience with mobile UI/UX principles\n- Knowledge of mobile app security",
                'benefits' => "- Competitive pay\n- Health insurance\n- Stock options\n- Gym membership\n- Team building events",
                'deadline' => '2024-05-25',
                'status' => 'active',
                'user_id' => $employer->id
            ],
            [
                'title' => 'Product Manager',
                'company' => 'TechCorp Solutions',
                'description' => 'We are seeking an experienced Product Manager to lead product strategy and development.',
                'location' => 'Seattle, WA',
                'type' => 'Full-time',
                'salary_range' => '$100,000 - $160,000',
                'requirements' => "- 5+ years product management experience\n- Strong technical background\n- Experience with Agile methodologies\n- Excellent communication skills",
                'benefits' => "- Competitive salary\n- Equity package\n- Health and dental\n- 401(k) matching\n- Remote work options",
                'deadline' => '2024-06-10',
                'status' => 'active',
                'user_id' => $employer->id
            ],
            [
                'title' => 'IT Security Specialist',
                'company' => 'TechCorp Solutions',
                'description' => 'Join our cybersecurity team to protect our systems and infrastructure from security threats.',
                'location' => 'Washington, DC',
                'type' => 'Full-time',
                'salary_range' => '$90,000 - $140,000',
                'requirements' => "- 5+ years IT security experience\n- Security certifications (CISSP, CEH)\n- Experience with security tools and frameworks\n- Incident response experience",
                'benefits' => "- Competitive pay\n- Health insurance\n- Certification support\n- Remote work options\n- Professional development",
                'deadline' => '2024-06-05',
                'status' => 'active',
                'user_id' => $employer->id
            ],
            [
                'title' => 'Quality Assurance Engineer',
                'company' => 'TechCorp Solutions',
                'description' => 'Seeking a QA Engineer to ensure the quality and reliability of our software products.',
                'location' => 'Portland, OR',
                'type' => 'Full-time',
                'salary_range' => '$70,000 - $110,000',
                'requirements' => "- 3+ years QA experience\n- Experience with automated testing\n- Knowledge of testing frameworks\n- Strong analytical skills",
                'benefits' => "- Competitive salary\n- Health and dental\n- 401(k) plan\n- Flexible schedule\n- Professional training",
                'deadline' => '2024-05-22',
                'status' => 'active',
                'user_id' => $employer->id
            ]
        ];

        foreach ($jobs as $job) {
            Job::create($job);
        }
    }
}
