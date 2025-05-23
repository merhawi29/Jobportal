<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\EmployeeProfile;
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
            EmployeeProfile::firstOrCreate(
                ['user_id' => $employer->id],
                [
                    'name' => $employer->name,
                    'email' => $employer->email,
                    'phone' => null,
                    'company_name' => "Company " . $employer->name,
                    'company_website' => "https://www." . strtolower(str_replace(' ', '', $employer->name)) . ".com",
                    'company_size' => collect(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])->random(),
                    'company_description' => "This is a sample company description for " . $employer->name,
                    'location' => collect(['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Adama'])->random()
                ]
            );
        }
    }
}
