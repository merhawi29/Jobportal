<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        // Get or create employer users
        $employers = User::where('role', 'employer')->take(5)->get();
        if ($employers->count() < 5) {
            $employers = collect();
            for ($i = 0; $i < 5; $i++) {
                $email = "employer" . ($i + 1) . "@example.com";
                $employer = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'name' => "Employer " . ($i + 1),
                        'password' => bcrypt('password'),
            'role' => 'employer',
            'status' => 'active'
                    ]
                );
                $employers->push($employer);
            }
        }

        $techCompanies = [
            'TechEthiopia Solutions',
            'Digital Innovations Hub',
            'EthioTech Systems',
            'CodeMasters Ethiopia',
            'Addis Software',
            'Ethiopian Digital',
            'Tech Valley Ethiopia',
            'Innovation Labs AA',
            'ByteCraft Solutions',
            'Highland Tech'
        ];

        $locations = [
            'Addis Ababa, Ethiopia',
            'Dire Dawa, Ethiopia',
            'Hawassa, Ethiopia',
            'Bahir Dar, Ethiopia',
            'Adama, Ethiopia'
        ];

        $techCategories = [
            'Software Development',
            'Web Development',
            'Mobile Development',
            'Cloud Computing',
            'DevOps',
            'Data Science',
            'Artificial Intelligence',
            'Cybersecurity',
            'UI/UX Design',
            'IT Support'
        ];

        // Create 50 sample tech jobs
        foreach (range(1, 50) as $index) {
            $employer = $employers->random();
            $category = $techCategories[array_rand($techCategories)];
            $deadline = now()->addDays(rand(7, 60));
            
            Job::create([
                'user_id' => $employer->id,
                'title' => $this->getTechJobTitle($category),
                'company' => $techCompanies[array_rand($techCompanies)],
                'location' => $locations[array_rand($locations)],
                'type' => Job::JOB_TYPES[array_rand(Job::JOB_TYPES)],
                'sector' => 'Technology',
                'category' => $category,
                'salary_range' => $this->getSalaryRange(),
                'description' => $this->getTechDescription($category),
                'requirements' => $this->getTechRequirements($category),
                'benefits' => $this->getBenefits(),
                'deadline' => $deadline,
                'status' => Job::STATUS['ACTIVE'],
                'moderation_status' => Job::MODERATION_STATUS['APPROVED']
            ]);
        }
    }

    private function getTechJobTitle($category): string
    {
        $titles = [
            'Software Development' => [
                'Senior Software Engineer',
                'Full Stack Developer',
                'Backend Developer',
                'Frontend Developer',
                'Software Architect'
            ],
            'Web Development' => [
                'Senior Web Developer',
                'React Developer',
                'Laravel Developer',
                'WordPress Developer',
                'Vue.js Developer'
            ],
            'Mobile Development' => [
                'Senior Mobile Developer',
                'iOS Developer',
                'Android Developer',
                'React Native Developer',
                'Flutter Developer'
            ],
            'Cloud Computing' => [
                'Cloud Solutions Architect',
                'AWS Engineer',
                'Azure Cloud Engineer',
                'Cloud Infrastructure Engineer',
                'Cloud DevOps Engineer'
            ],
            'DevOps' => [
                'DevOps Engineer',
                'Site Reliability Engineer',
                'CI/CD Specialist',
                'Infrastructure Engineer',
                'Systems Engineer'
            ],
            'Data Science' => [
                'Data Scientist',
                'Machine Learning Engineer',
                'Data Analyst',
                'Business Intelligence Developer',
                'Data Engineer'
            ],
            'Artificial Intelligence' => [
                'AI Engineer',
                'Machine Learning Specialist',
                'NLP Engineer',
                'Computer Vision Engineer',
                'AI Research Scientist'
            ],
            'Cybersecurity' => [
                'Security Engineer',
                'Information Security Analyst',
                'Security Consultant',
                'Penetration Tester',
                'Security Architect'
            ],
            'UI/UX Design' => [
                'UI/UX Designer',
                'Product Designer',
                'Interaction Designer',
                'Visual Designer',
                'UX Researcher'
            ],
            'IT Support' => [
                'IT Support Specialist',
                'System Administrator',
                'Network Engineer',
                'Technical Support Engineer',
                'Help Desk Specialist'
            ]
        ];

        return $titles[$category][array_rand($titles[$category])];
    }

    private function getSalaryRange(): string
    {
        $ranges = [
            '15,000 - 25,000 ETB',
            '25,000 - 35,000 ETB',
            '35,000 - 45,000 ETB',
            '45,000 - 55,000 ETB',
            '55,000 - 65,000 ETB',
            '65,000 - 75,000 ETB',
            '75,000 - 85,000 ETB',
            '85,000 - 95,000 ETB',
            '95,000 - 120,000 ETB',
            'Above 120,000 ETB'
        ];

        return $ranges[array_rand($ranges)];
    }

    private function getTechDescription($category): string
    {
        $descriptions = [
            'Software Development' => "We are looking for an experienced software developer to join our dynamic development team. You will be responsible for developing high-quality software solutions, collaborating with cross-functional teams, and contributing to the full software development lifecycle.",
            'Web Development' => "We are seeking a talented web developer to create and maintain modern, responsive web applications. You will work on challenging projects using the latest web technologies and frameworks.",
            'Mobile Development' => "Join our mobile development team to build innovative mobile applications. You will be responsible for developing and maintaining mobile applications while ensuring the best possible performance, quality, and responsiveness.",
            'Cloud Computing' => "We are looking for a cloud expert to help design, implement and manage our cloud infrastructure. You will work with cutting-edge cloud technologies and help drive our cloud transformation initiatives.",
            'DevOps' => "Join our DevOps team to help build and maintain our CI/CD pipelines and infrastructure. You will be responsible for automating processes, improving deployment workflows, and maintaining system reliability.",
            'Data Science' => "We are seeking a data scientist to help transform our data into actionable insights. You will work with large datasets, develop machine learning models, and create data-driven solutions.",
            'Artificial Intelligence' => "Join our AI team to develop cutting-edge artificial intelligence solutions. You will work on challenging problems in machine learning, natural language processing, and computer vision.",
            'Cybersecurity' => "We are looking for a security expert to help protect our systems and data. You will be responsible for implementing security measures, conducting security assessments, and responding to security incidents.",
            'UI/UX Design' => "Join our design team to create beautiful and intuitive user interfaces. You will be responsible for the design of our products, ensuring excellent user experience and visual appeal.",
            'IT Support' => "We are seeking an IT support specialist to help maintain our technical infrastructure and support our team. You will be responsible for resolving technical issues and ensuring smooth operation of our systems."
        ];

        return $descriptions[$category];
    }

    private function getTechRequirements($category): string
    {
        $requirements = [
            'Software Development' => "- Bachelor's degree in Computer Science or related field\n- 3+ years of software development experience\n- Strong proficiency in multiple programming languages (e.g., Java, Python, JavaScript)\n- Experience with software design patterns and architecture\n- Strong problem-solving skills\n- Experience with agile development methodologies\n- Excellent communication and teamwork skills",
            'Web Development' => "- 3+ years of web development experience\n- Strong proficiency in HTML, CSS, and JavaScript\n- Experience with modern web frameworks (React, Vue.js, Laravel)\n- Understanding of web security best practices\n- Knowledge of responsive design principles\n- Experience with version control systems (Git)\n- Good communication skills",
            'Mobile Development' => "- 3+ years of mobile development experience\n- Strong knowledge of iOS/Android development\n- Experience with mobile frameworks (React Native, Flutter)\n- Understanding of mobile UI/UX principles\n- Knowledge of mobile security best practices\n- Experience with mobile app deployment\n- Strong problem-solving skills",
            'Cloud Computing' => "- 3+ years of cloud computing experience\n- Strong knowledge of cloud platforms (AWS, Azure, GCP)\n- Experience with cloud architecture and design\n- Understanding of cloud security principles\n- Knowledge of infrastructure as code\n- Experience with containerization\n- Strong analytical skills",
            'DevOps' => "- 3+ years of DevOps experience\n- Strong knowledge of CI/CD tools and practices\n- Experience with containerization and orchestration\n- Understanding of infrastructure as code\n- Knowledge of monitoring and logging tools\n- Strong scripting skills\n- Excellent problem-solving abilities",
            'Data Science' => "- Master's degree in Data Science, Statistics, or related field\n- Strong programming skills in Python or R\n- Experience with machine learning frameworks\n- Strong statistical and mathematical skills\n- Knowledge of data visualization tools\n- Experience with big data technologies\n- Strong analytical thinking",
            'Artificial Intelligence' => "- Master's/PhD in Computer Science, AI, or related field\n- Strong programming skills in Python\n- Experience with machine learning frameworks (TensorFlow, PyTorch)\n- Strong mathematical and statistical skills\n- Research experience in AI/ML\n- Published papers in AI/ML (preferred)\n- Strong problem-solving abilities",
            'Cybersecurity' => "- Bachelor's degree in Cybersecurity or related field\n- Security certifications (CEH, CISSP, etc.)\n- Experience with security tools and frameworks\n- Knowledge of security best practices\n- Understanding of network security\n- Experience with security auditing\n- Strong analytical skills",
            'UI/UX Design' => "- Bachelor's degree in Design or related field\n- 3+ years of UI/UX design experience\n- Proficiency in design tools (Figma, Adobe XD)\n- Strong portfolio of design work\n- Understanding of user-centered design\n- Knowledge of design systems\n- Excellent visual design skills",
            'IT Support' => "- Bachelor's degree in IT or related field\n- IT certifications (CompTIA, MCSA, etc.)\n- Experience with IT support and troubleshooting\n- Knowledge of network administration\n- Understanding of IT security\n- Strong customer service skills\n- Good communication abilities"
        ];

        return $requirements[$category];
    }

    private function getBenefits(): string
    {
        return "- Competitive salary package\n- Health insurance\n- Annual leave and sick leave\n- Professional development opportunities\n- Performance bonuses\n- Friendly work environment\n- Transportation allowance\n- Meal allowance\n- Work from home options\n- Latest tech equipment provided\n- Training and certification support\n- Internet allowance";
    }
}
