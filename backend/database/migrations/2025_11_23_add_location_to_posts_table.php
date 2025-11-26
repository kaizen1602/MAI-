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
        Schema::table('posts', function (Blueprint $table) {
            // Hacer municipality_id nullable ya que ahora usamos location como alternativa
            $table->foreignId('municipality_id')->nullable()->change();

            // Agregar campo location para almacenar "Ciudad, Departamento"
            $table->string('location', 200)->nullable()->after('municipality_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('location');
        });
    }
};
