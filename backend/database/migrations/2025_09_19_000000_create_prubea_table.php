<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prubea', function (Blueprint $table) {
            $table->id();
            $table->string('nombres', 120);
            $table->string('apellidos', 120);
            $table->string('email', 150)->unique();
            $table->string('telefono', 30)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prubea');
    }
};
