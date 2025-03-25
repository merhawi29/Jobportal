<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            // $table->string('category')->nullable()->after('type');
            // $table->json('subcategories')->nullable()->after('category');
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            // $table->dropColumn(['category', 'subcategories']);
        });
    }
};
