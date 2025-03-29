<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityLog;
use App\Models\User;

class ActivityLogSeeder extends Seeder
{
    public function run()
    {
        $user = User::where('role', User::ROLES['admin'])->first();

        if ($user) {
            ActivityLog::create([
                'user_id' => $user->id,
                'log_name' => 'admin',
                'description' => 'Admin logged in',
                'event' => 'login',
                'properties' => ['ip' => '127.0.0.1']
            ]);

            ActivityLog::create([
                'user_id' => $user->id,
                'log_name' => 'admin',
                'description' => 'New job posted',
                'event' => 'job_created',
                'properties' => ['job_title' => 'Software Engineer']
            ]);

            ActivityLog::create([
                'user_id' => $user->id,
                'log_name' => 'admin',
                'description' => 'New employer registered',
                'event' => 'employer_registered',
                'properties' => ['company' => 'Tech Corp']
            ]);
        }
    }
} 