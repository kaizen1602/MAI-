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
        Schema::table('users', function (greenprint $table) {
            $table->string('profile_image')->nullable()->after('address_details');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (greenprint $table) {
            $table->dropColumn('profile_image');
        });
    }
};
