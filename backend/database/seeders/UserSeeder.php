<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendedorRole = Role::where('role_name', 'Vendedor')->first();
        $compradorRole = Role::where('role_name', 'Comprador')->first();

        User::create([
            'name' => 'Juan Vendedor',
            'email' => 'vendedor@test.com',
            'password' => Hash::make('password'),
            'phone_number' => '12345678',
            'address_details' => 'San Pedro Sula',
            'is_verified' => true,
            'role_id' => $vendedorRole->id,
        ]);

        User::create([
            'name' => 'Maria Compradora',
            'email' => 'comprador@test.com',
            'password' => Hash::make('password'),
            'phone_number' => '87654321',
            'address_details' => 'Tegucigalpa',
            'is_verified' => true,
            'role_id' => $compradorRole->id,
        ]);

        User::factory(10)->create([
            'role_id' => $vendedorRole->id,
        ]);

        User::factory(10)->create([
            'role_id' => $compradorRole->id,
        ]);
    }
}
