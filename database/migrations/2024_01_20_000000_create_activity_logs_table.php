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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('moderator_id')->constrained('users')->onDelete('cascade');
            $table->string('action_type');  // e.g., 'job_approved', 'user_banned', 'report_resolved'
            $table->string('target_type');  // For polymorphic relation (e.g., 'App\Models\Job')
            $table->unsignedBigInteger('target_id');  // For polymorphic relation
            $table->string('reason')->nullable();
            $table->json('details')->nullable();  // Additional context about the action
            $table->timestamps();

            // Index for polymorphic relation
            $table->index(['target_type', 'target_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
