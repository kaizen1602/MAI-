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
        // Asegurarnos de que los roles existen (idempotente)
        $vendedorRole = Role::firstOrCreate([
            'role_name' => 'Vendedor'
        ]);
        $compradorRole = Role::firstOrCreate([
            'role_name' => 'Comprador'
        ]);

        User::updateOrCreate(
            ['email' => 'vendedor@test.com'],
            [
                'name' => 'Juan Vendedor',
                'password' => Hash::make('password'),
                'phone_number' => '12345678',
                'address_details' => 'San Pedro Sula',
                'is_verified' => true,
                'role_id' => $vendedorRole->id,
            ]
        );

        User::updateOrCreate(
            ['email' => 'comprador@test.com'],
            [
                'name' => 'Maria Compradora',
                'password' => Hash::make('password'),
                'phone_number' => '87654321',
                'address_details' => 'Tegucigalpa',
                'is_verified' => true,
                'role_id' => $compradorRole->id,
            ]
        );

        // Crear usuarios de prueba con emails únicos para evitar colisiones
        try {
            for ($i = 0; $i < 10; $i++) {
                User::factory()->create([
                    'role_id' => $vendedorRole->id,
                    'email' => 'user_v_' . $i . '_' . bin2hex(random_bytes(4)) . '@test.com',
                ]);
            }

            for ($i = 0; $i < 10; $i++) {
                User::factory()->create([
                    'role_id' => $compradorRole->id,
                    'email' => 'user_c_' . $i . '_' . bin2hex(random_bytes(4)) . '@test.com',
                ]);
            }
        } catch (\Exception $e) {
            // No detener la ejecución si hay errores de seed; los errores se registran
            \Log::warning('UserSeeder: error creating factory users: ' . $e->getMessage());
        }
    }
}
