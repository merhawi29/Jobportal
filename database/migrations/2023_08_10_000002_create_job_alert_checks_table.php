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
        Schema::create('job_alert_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_alert_id')->constrained()->onDelete('cascade');
            $table->timestamp('checked_at');
            $table->timestamps();
            
            // Create an index on job_alert_id
            $table->index('job_alert_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_alert_checks');
    }
}; 