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
        Schema::table('wound_records', function (Blueprint $table) {
            $table->string('area_recovery_time')->nullable();
            $table->string('total_recovery_time')->nullable();
            $table->string('tissue_condition')->nullable();
            $table->json('recommendations')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wound_records', function (Blueprint $table) {
            $table->dropColumn([
                'area_recovery_time',
                'total_recovery_time',
                'tissue_condition',
                'recommendations'
            ]);
        });
    }
};
