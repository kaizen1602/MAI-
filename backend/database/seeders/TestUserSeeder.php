<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first role (should exist from RoleSeeder)
        $roleId = \DB::table('roles')->first()?->id ?? 1;

        // Create test user for password reset testing
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password123'),
                'role_id' => $roleId,
                'is_admin' => false,
            ]
        );

        echo "✅ Test user created: test@example.com / password123\n";
    }
}
