<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $counter = 0;
        $counter++;

        $products = [
            'Manzana', 'Pera', 'Naranja', 'Limón', 'Papaya', 'Piña',
            'Banano', 'Fresa', 'Mora', 'Lulo', 'Guayaba', 'Maracuyá',
            'Tomate', 'Cebolla', 'Papa', 'Zanahoria', 'Lechuga', 'Cilantro',
            'Aguacate', 'Mango', 'Sandía', 'Melón', 'Uvas', 'Durazno'
        ];

        $productName = $products[array_rand($products)] . ' ' . Str::random(3) . ' ' . $counter;

        return [
            'name' => $productName,
            'description' => 'Producto agrícola de alta calidad - ' . $counter,
            'product_type_id' => rand(1, 5), // Asumiendo 5 tipos de productos
        ];
    }
}
