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
        // First, check if the notifications table exists
        if (!Schema::hasTable('notifications')) {
            // Create the standard Laravel notifications table
            Schema::create('notifications', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('type');
                $table->morphs('notifiable');
                $table->text('data');
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
            });
        } else {
            // Ensure all required columns exist
            Schema::table('notifications', function (Blueprint $table) {
                if (!Schema::hasColumn('notifications', 'id')) {
                    $table->uuid('id')->primary();
                }
                
                if (!Schema::hasColumn('notifications', 'type')) {
                    $table->string('type');
                }
                
                if (!Schema::hasColumn('notifications', 'notifiable_type')) {
                    $table->string('notifiable_type');
                }
                
                if (!Schema::hasColumn('notifications', 'notifiable_id')) {
                    $table->unsignedBigInteger('notifiable_id');
                    $table->index(['notifiable_type', 'notifiable_id']);
                }
                
                if (!Schema::hasColumn('notifications', 'data')) {
                    $table->text('data');
                }
                
                if (!Schema::hasColumn('notifications', 'read_at')) {
                    $table->timestamp('read_at')->nullable();
                }
                
                if (!Schema::hasColumn('notifications', 'created_at')) {
                    $table->timestamps();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't drop the table here as it might be used by other parts of Laravel
    }
};
