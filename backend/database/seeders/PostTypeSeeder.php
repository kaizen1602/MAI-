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
        PostType::create(['type_name' => 'Oferta', 'type_desc' => 'Publicación de un producto para la venta.']);
        PostType::create(['type_name' => 'Demanda', 'type_desc' => 'Publicación para buscar y comprar un producto.']);
    }
}
