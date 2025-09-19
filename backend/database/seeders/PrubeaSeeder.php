<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Prubea;

class PrubeaSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'nombres' => 'Juan Carlos',
                'apellidos' => 'Pérez Gómez',
                'email' => 'juan.perez@example.com',
                'telefono' => '+57 3001234567',
                'fecha_nacimiento' => '1990-05-10',
            ],
            [
                'nombres' => 'María Fernanda',
                'apellidos' => 'López Díaz',
                'email' => 'maria.lopez@example.com',
                'telefono' => '+57 3009876543',
                'fecha_nacimiento' => '1992-11-22',
            ],
            [
                'nombres' => 'Andrés',
                'apellidos' => 'García',
                'email' => 'andres.garcia@example.com',
                'telefono' => null,
                'fecha_nacimiento' => null,
            ],
        ];

        foreach ($rows as $data) {
            Prubea::firstOrCreate(['email' => $data['email']], $data);
        }
    }
}
