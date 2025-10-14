<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Municipality;

class DepartmentMunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $depts = [
            'Atlántida' => ['La Ceiba', 'Tela', 'Jutiapa'],
            'Colón' => ['Trujillo', 'Tocoa', 'Sonaguera'],
            'Comayagua' => ['Comayagua', 'Siguatepeque', 'La Libertad'],
            'Copán' => ['Santa Rosa de Copán', 'La Entrada', 'Copán Ruinas'],
            'Cortés' => ['San Pedro Sula', 'Choloma', 'Puerto Cortés'],
            'Choluteca' => ['Choluteca', 'San Marcos de Colón', 'El Triunfo'],
            'El Paraíso' => ['Yuscarán', 'Danlí', 'El Paraíso'],
            'Francisco Morazán' => ['Tegucigalpa', 'Comayagüela', 'Valle de Ángeles'],
            'Gracias a Dios' => ['Puerto Lempira', 'Brus Laguna', 'Ahuas'],
            'Intibucá' => ['La Esperanza', 'Intibucá', 'Yamaranguila'],
            'Islas de la Bahía' => ['Roatán', 'Utila', 'Guanaja'],
            'La Paz' => ['La Paz', 'Marcala', 'Cane'],
            'Lempira' => ['Gracias', 'La Iguala', 'Belén'],
            'Ocotepeque' => ['Ocotepeque', 'Sinuapa', 'La Labor'],
            'Olancho' => ['Juticalpa', 'Catacamas', 'Campamento'],
            'Santa Bárbara' => ['Santa Bárbara', 'Quimistán', 'Las Vegas'],
            'Valle' => ['Nacaome', 'San Lorenzo', 'Amapala'],
            'Yoro' => ['Yoro', 'El Progreso', 'Olanchito']
        ];

        foreach ($depts as $dept => $munis) {
            $department = Department::create(['name' => $dept]);
            foreach ($munis as $muni) {
                Municipality::create(['name' => $muni, 'department_id' => $department->id]);
            }
        }
    }
}
