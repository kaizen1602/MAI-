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
            $table->foreignId('department_id')->nullable()->after('address_details')->constrained('departments')->onDelete('set null');
            $table->foreignId('municipality_id')->nullable()->after('department_id')->constrained('municipalities')->onDelete('set null');
            $table->text('bio')->nullable()->after('municipality_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['municipality_id']);
            $table->dropColumn(['department_id', 'municipality_id', 'bio']);
        });
    }
};
