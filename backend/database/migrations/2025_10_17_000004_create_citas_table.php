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
        Schema::create('citas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes')->onDelete('cascade');
            $table->foreignId('entidad_medica_id')->constrained('entidades_medicas')->onDelete('cascade');
            $table->string('especialidad', 50);
            $table->date('fecha_sugerida');
            $table->enum('estado', ['PENDIENTE', 'CONFIRMADA', 'FINALIZADA', 'CANCELADA'])->default('PENDIENTE');
            $table->string('telefono', 20)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};
