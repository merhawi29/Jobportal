<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user');
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('inactive');
            }
            if (!Schema::hasColumn('users', 'banned_until')) {
                $table->timestamp('banned_until')->nullable();
            }
            if (!Schema::hasColumn('users', 'ban_reason')) {
                $table->text('ban_reason')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'status', 'banned_until', 'ban_reason']);
        });
    }
};
