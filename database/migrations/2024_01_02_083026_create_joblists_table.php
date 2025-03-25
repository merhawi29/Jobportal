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
        Schema::create('joblists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('company');
            $table->string('location');
            $table->string('type');
            $table->string('category')->nullable();
            $table->json('subcategories')->nullable();
            $table->string('sector')->nullable();
            $table->string('salary_range');
            $table->text('description');
            $table->boolean('is_active')->default(true);
            $table->text('requirements');
            $table->text('benefits');
            $table->date('deadline');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('joblists');
    }
};
