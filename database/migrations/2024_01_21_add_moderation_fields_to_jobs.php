<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            if (!Schema::hasColumn('jobs', 'moderation_status')) {
                $table->string('moderation_status')->default('pending');
            }
            if (!Schema::hasColumn('jobs', 'moderation_reason')) {
                $table->text('moderation_reason')->nullable();
            }
        });

        // Update existing jobs to be approved
        DB::table('jobs')->update(['moderation_status' => 'approved']);
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['moderation_status', 'moderation_reason']);
        });
    }
};