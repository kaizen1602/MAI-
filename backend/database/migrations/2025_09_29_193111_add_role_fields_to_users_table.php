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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number', 100)->nullable()->after('email');
            $table->string('address_details', 300)->nullable()->after('phone_number');
            $table->boolean('is_verified')->default(false)->after('address_details');
            $table->foreignId('role_id')->constrained('roles')->after('is_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn([
                'phone_number',
                'address_details',
                'is_verified',
                'role_id'
            ]);
        });
    }
};
