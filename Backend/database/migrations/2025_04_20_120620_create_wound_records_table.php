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
        Schema::create('wound_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('original_image', 255);
            $table->string('segmentation_image', 255);
            $table->decimal('area_cm2', 8, 2);
            $table->decimal('confidence', 5, 2)->nullable();
            $table->text('note')->nullable();
            $table->dateTime('analyzed_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wound_records');
    }
};
