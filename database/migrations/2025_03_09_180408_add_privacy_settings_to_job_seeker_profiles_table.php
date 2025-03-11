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
            $table->boolean('show_email')->default(true);
            $table->boolean('show_phone')->default(true);
            $table->boolean('show_education')->default(true);
            $table->boolean('show_experience')->default(true);
            $table->boolean('show_skills')->default(true);
            $table->boolean('show_certifications')->default(true);
            $table->boolean('show_social_links')->default(true);
            $table->boolean('show_resume')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_seeker_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'show_email',
                'show_phone',
                'show_education',
                'show_experience',
                'show_skills',
                'show_certifications',
                'show_social_links',
                'show_resume'
            ]);
        });
    }
};
