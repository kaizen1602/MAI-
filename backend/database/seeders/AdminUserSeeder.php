<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si ya existe un admin
        $adminExists = User::where('is_admin', true)->exists();

        if ($adminExists) {
            $this->command->info('Ya existe un usuario administrador.');
            return;
        }

        // Crear usuario admin
        $admin = User::create([
            'name' => 'Administrador Principal',
            'email' => 'admin@agrored.com',
            'password' => Hash::make('Admin123!'), // ⚠️ Cambiar en producción
            'role_id' => 1, // Ajustar según tu tabla de roles
            'email_verified_at' => now(),
        ]);

        // Asignación directa del campo is_admin
        // Esta es la ÚNICA forma segura de modificarlo
        $admin->is_admin = true;
        $admin->save();

        $this->command->info('✅ Usuario administrador creado exitosamente.');
        $this->command->info('📧 Email: admin@agrored.com');
        $this->command->info('🔑 Password: Admin123!');
        $this->command->warn('⚠️  IMPORTANTE: Cambiar la contraseña en producción.');
    }
}
