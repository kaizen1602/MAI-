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
        Schema::create('market_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_catalog_id')->constrained('products_catalog')->onDelete('cascade');
            $table->foreignId('product_variation_id')->nullable()->constrained('product_variations')->onDelete('set null');
            $table->foreignId('measurement_unit_id')->constrained('measurement_units')->onDelete('cascade');
            $table->decimal('quantity', 10, 2); // Cantidad vendida
            $table->decimal('price_extra', 10, 2)->nullable(); // Precio calidad EXTRA
            $table->decimal('price_first', 10, 2)->nullable(); // Precio calidad PRIMERA
            $table->decimal('price_unit', 10, 2); // Precio por unidad
            $table->string('price_variation')->default('ESTABLE'); // SUBIO, BAJO, ESTABLE
            $table->date('date'); // Fecha del precio
            $table->string('source')->default('SIPSA'); // Fuente: CORABASTOS, SIPSA, etc.
            $table->string('raw_name')->nullable(); // Nombre original del producto
            $table->decimal('extraction_confidence', 5, 2)->default(100.00); // Confianza en la extracción
            $table->timestamps();

            // Indexes para búsquedas rápidas
            $table->index(['product_catalog_id', 'date']);
            $table->index('date');
            $table->index('source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_prices');
    }
};
