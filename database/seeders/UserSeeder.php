<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder

{
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active'
            ]
        );

        // Create moderator user
        User::firstOrCreate(
            ['email' => 'moderator@example.com'],
            [
                'name' => 'Moderator User',
                'password' => Hash::make('password'),
                'role' => 'moderator',
                'status' => 'active'
            ]
        );

        // Create employer users
        foreach (range(1, 10) as $index) {
            User::firstOrCreate(
                ['email' => "employer{$index}@example.com"],
                [
                    'name' => "Employer $index",
                    'password' => Hash::make('password'),
                    'role' => 'employer',
                    'status' => 'active'
                ]
            );
        }

        // Create job seeker users
        foreach (range(1, 20) as $index) {
            User::firstOrCreate(
                ['email' => "jobseeker{$index}@example.com"],
                [
                    'name' => "Job Seeker $index",
                    'password' => Hash::make('password'),
                    'role' => 'job_seeker',
                    'status' => 'active'
                ]
            );
        }
    }
} 