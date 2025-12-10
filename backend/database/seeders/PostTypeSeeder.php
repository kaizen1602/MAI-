<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PostType;

class PostTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PostType::updateOrCreate(['type_name' => 'Venta'], ['type_desc' => 'Publicación de un producto para la venta.']);
        PostType::updateOrCreate(['type_name' => 'Compra'], ['type_desc' => 'Publicación para buscar y comprar un producto.']);
    }
}
