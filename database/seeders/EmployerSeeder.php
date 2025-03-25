<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employers = User::where('role', 'employer')->get();

        foreach ($employers as $employer) {
            Employer::firstOrCreate(
                ['user_id' => $employer->id],
                [
                    'company_name' => "Company " . $employer->name,
                    'company_website' => "https://www." . strtolower(str_replace(' ', '', $employer->name)) . ".com",
                    'company_size' => collect(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])->random(),
                    'industry' => collect(['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail'])->random(),
                    'company_description' => "This is a sample company description for " . $employer->name,
                    'location' => collect(['New York', 'San Francisco', 'London', 'Tokyo', 'Singapore'])->random(),
                    'position' => 'HR Manager',
                    'department' => 'Human Resources',
                    'hire_date' => now()->subYears(rand(1, 5))->format('Y-m-d'),
                    'country' => collect(['USA', 'UK', 'Japan', 'Singapore', 'Australia'])->random(),
                    'status' => 'active'
                ]
            );
        }
    }
}
