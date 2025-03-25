<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            // $table->foreignId('reported_id')->constrained('users')->onDelete('cascade');
            $table->string('type'); // 'user', 'job', 'comment', etc.
            $table->string('reason');
            $table->enum('status', ['pending', 'resolved', 'dismissed'])->default('pending');
            $table->json('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
