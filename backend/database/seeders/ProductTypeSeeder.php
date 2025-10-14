<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductType;

class ProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productTypes = [
            [
                'type_name' => 'Granos básicos',
                'description' => 'Productos alimenticios básicos como maíz, frijol, arroz'
            ],
            [
                'type_name' => 'Frutas',
                'description' => 'Frutas frescas de temporada'
            ],
            [
                'type_name' => 'Verduras',
                'description' => 'Verduras y hortalizas frescas'
            ],
            [
                'type_name' => 'Tubérculos',
                'description' => 'Raíces y tubérculos como papa, yuca'
            ],
            [
                'type_name' => 'Café y derivados',
                'description' => 'Café y productos relacionados'
            ]
        ];

        foreach ($productTypes as $type) {
            ProductType::create($type);
        }
    }
}
