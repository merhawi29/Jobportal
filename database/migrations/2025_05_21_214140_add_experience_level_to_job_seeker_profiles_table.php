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
            if (!Schema::hasColumn('job_seeker_profiles', 'experience_level')) {
                $table->string('experience_level')->nullable()->after('experience');
            }
            if (!Schema::hasColumn('job_seeker_profiles', 'experience_years')) {
                $table->integer('experience_years')->nullable()->after('experience_level');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_seeker_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('job_seeker_profiles', 'experience_level')) {
                $table->dropColumn('experience_level');
            }
            if (Schema::hasColumn('job_seeker_profiles', 'experience_years')) {
                $table->dropColumn('experience_years');
            }
        });
    }
};
