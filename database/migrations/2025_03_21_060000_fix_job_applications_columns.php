<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            // Drop the resume_path column if it exists
            if (Schema::hasColumn('job_applications', 'resume_path')) {
                $table->dropColumn('resume_path');
            }
            
            // Add the resume column if it doesn't exist
            if (!Schema::hasColumn('job_applications', 'resume')) {
                $table->string('resume')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            if (Schema::hasColumn('job_applications', 'resume')) {
                $table->dropColumn('resume');
            }
            $table->string('resume_path')->nullable();
        });
    }
}; 