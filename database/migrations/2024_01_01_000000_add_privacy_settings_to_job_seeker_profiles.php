<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('job_seeker_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('job_seeker_profiles', 'privacy_settings')) {
                $table->json('privacy_settings')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('job_seeker_profiles', function (Blueprint $table) {
            $table->dropColumn('privacy_settings');
        });
    }
}; 