<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use App\Models\Product;
use App\Models\PostType;
use App\Models\Municipality;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendedores = User::whereHas('role', function ($query) {
            $query->where('role_name', 'Vendedor');
        })->get();

        $compradores = User::whereHas('role', function ($query) {
            $query->where('role_name', 'Comprador');
        })->get();

        $products = Product::all();
        $municipalities = Municipality::all();
        $ofertaType = PostType::where('type_name', 'Oferta')->first();
        $demandaType = PostType::where('type_name', 'Demanda')->first();

        // Seed Ofertas
        for ($i = 0; $i < 20; $i++) {
            Post::create([
                'title' => 'Vendo ' . $products->random()->name,
                'description' => 'Excelente calidad, listo para entregar.',
                'quantity_kg' => rand(50, 500),
                'price_per_kg' => rand(10, 100),
                'status' => 'ACTIVE',
                'post_type_id' => $ofertaType->id,
                'product_id' => $products->random()->id,
                'user_id' => $vendedores->random()->id,
                'municipality_id' => $municipalities->random()->id,
            ]);
        }

        // Seed Demandas
        for ($i = 0; $i < 15; $i++) {
            Post::create([
                'title' => 'Compro ' . $products->random()->name,
                'description' => 'Busco para compra inmediata.',
                'quantity_kg' => rand(100, 1000),
                'price_per_kg' => rand(8, 90),
                'status' => 'ACTIVE',
                'post_type_id' => $demandaType->id,
                'product_id' => $products->random()->id,
                'user_id' => $compradores->random()->id,
                'municipality_id' => $municipalities->random()->id,
            ]);
        }
    }
}
