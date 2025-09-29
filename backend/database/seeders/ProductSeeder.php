<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Maíz', 'description' => 'Maíz blanco para consumo humano y animal.'],
            ['name' => 'Frijol', 'description' => 'Frijol rojo de seda, de alta calidad.'],
            ['name' => 'Café', 'description' => 'Café de altura, tipo arábica.'],
            ['name' => 'Plátano', 'description' => 'Plátano maduro y verde.'],
            ['name' => 'Naranja', 'description' => 'Naranja de jugo, dulce y fresca.'],
            ['name' => 'Tomate', 'description' => 'Tomate manzano para ensaladas y salsas.'],
            ['name' => 'Cebolla', 'description' => 'Cebolla roja y blanca.'],
            ['name' => 'Chile', 'description' => 'Chile dulce y picante.'],
            ['name' => 'Papa', 'description' => 'Papa blanca para freír y cocinar.'],
            ['name' => 'Yuca', 'description' => 'Yuca fresca para sancocho y frita.'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
