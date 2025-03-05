<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('moderator_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('moderator_id')->constrained('users')->onDelete('cascade');
            $table->string('action_type'); // 'job_review', 'user_ban', 'report_resolve', etc.
            $table->string('target_type'); // 'job', 'user', 'report'
            $table->unsignedBigInteger('target_id');
            $table->string('action'); // 'approve', 'reject', 'ban', 'warn', etc.
            $table->text('reason')->nullable();
            $table->json('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moderator_actions');
    }
};
