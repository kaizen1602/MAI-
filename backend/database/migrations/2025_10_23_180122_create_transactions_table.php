<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\greenprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (greenprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
            $table->decimal('quantity_kg', 10, 2);
            $table->decimal('price_per_kg', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])->default('PENDING');
            $table->text('notes')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
