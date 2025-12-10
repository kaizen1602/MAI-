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
        Schema::create('product_variations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_catalog_id')->constrained('products_catalog')->onDelete('cascade');
            $table->string('variation_name'); // CRIOLLA LAVADA, CRIOLLA SUCIA, etc.
            $table->string('quality')->nullable(); // EXTRA, PRIMERA, SEGUNDA
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['product_catalog_id', 'variation_name']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variations');
    }
};
