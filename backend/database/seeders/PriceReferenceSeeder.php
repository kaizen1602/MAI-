<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PriceReference;
use App\Models\Product;
use App\Models\Municipality;
use Carbon\Carbon;

class PriceReferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $municipalities = Municipality::all();

        foreach ($products as $product) {
            foreach ($municipalities->random(5) as $municipality) {
                for ($i = 0; $i < 10; $i++) {
                    PriceReference::create([
                        'price_per_kg' => rand(8, 120),
                        'date' => Carbon::now()->subDays(rand(1, 365)),
                        'source' => 'Mercado Local',
                        'product_id' => $product->id,
                        'municipality_id' => $municipality->id,
                    ]);
                }
            }
        }
    }
}
