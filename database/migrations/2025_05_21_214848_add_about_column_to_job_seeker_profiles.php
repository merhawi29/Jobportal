<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_seeker_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('job_seeker_profiles', 'about')) {
                $table->text('about')->nullable();
            }
            if (!Schema::hasColumn('job_seeker_profiles', 'resume')) {
                $table->string('resume')->nullable();
            }
            if (!Schema::hasColumn('job_seeker_profiles', 'linkedin_url')) {
                $table->string('linkedin_url')->nullable();
            }
            if (!Schema::hasColumn('job_seeker_profiles', 'github_url')) {
                $table->string('github_url')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_seeker_profiles', function (Blueprint $table) {
            $table->dropColumn(['about', 'resume', 'linkedin_url', 'github_url']);
        });
    }
};
