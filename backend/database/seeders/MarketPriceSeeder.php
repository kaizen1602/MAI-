<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketPrice;
use App\Models\ProductCatalog;
use App\Models\Municipality;
use Carbon\Carbon;

class MarketPriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "🌾 Generando precios históricos de mercado...\n";

        // Obtener productos del catálogo
        $products = ProductCatalog::active()->limit(10)->get();

        // Obtener unidad de medida KILO (debe existir después del MeasurementUnitSeeder)
        $kiloUnit = \App\Models\MeasurementUnit::where('unit_name', 'KILO')->first();

        if ($products->isEmpty() || !$kiloUnit) {
            echo "⚠️  No hay productos o unidad KILO disponible. Asegúrate de ejecutar MeasurementUnitSeeder primero.\n";
            return;
        }

        $totalPrices = 0;
        $priceVariations = ['SUBIO', 'BAJO', 'ESTABLE'];

        // Generar precios históricos para los últimos 60 días
        foreach ($products as $product) {
            // Precio base según el tipo de producto
            $basePrice = $this->getBasePrice($product->name);

            // Generar precios para los últimos 60 días
            for ($i = 60; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);

                // Variación diaria (±10%)
                $dailyFactor = 1 + (rand(-10, 10) / 100);

                // Tendencia semanal (simular fluctuaciones de mercado)
                $weekFactor = 1 + (sin($i / 7) * 0.05);

                // Calcular precio final
                $priceUnit = round($basePrice * $dailyFactor * $weekFactor, 2);
                $priceFirst = round($priceUnit * 0.9, 2); // 10% menos para primera
                $priceExtra = round($priceUnit * 1.15, 2); // 15% más para extra

                MarketPrice::create([
                    'product_catalog_id' => $product->id,
                    'product_variation_id' => null,
                    'measurement_unit_id' => $kiloUnit->id,
                    'quantity' => 1.0,
                    'price_extra' => $priceExtra,
                    'price_first' => $priceFirst,
                    'price_unit' => $priceUnit,
                    'price_variation' => $priceVariations[array_rand($priceVariations)],
                    'date' => $date->format('Y-m-d'),
                    'source' => 'SIPSA',
                    'raw_name' => $product->name,
                    'extraction_confidence' => 100.00,
                ]);

                $totalPrices++;
            }
        }

        echo "✅ Precios de mercado generados exitosamente: {$totalPrices} registros\n";
    }

    /**
     * Obtener precio base según el tipo de producto
     */
    private function getBasePrice(string $productName): float
    {
        $productName = strtoupper($productName);

        // Precios base aproximados por kg en Colombia (en COP)
        $basePrices = [
            'PAPA' => 2500,
            'TOMATE' => 3000,
            'CEBOLLA' => 2800,
            'ZANAHORIA' => 2200,
            'YUCA' => 1800,
            'ARRACACHA' => 2500,
            'LECHUGA' => 3500,
            'CILANTRO' => 4000,
            'AHUYAMA' => 1500,
            'AJO' => 15000,
            'PIMENTON' => 8000,
            'BANANO' => 2000,
            'MANZANA' => 6000,
            'NARANJA' => 3000,
            'PAPAYA' => 2500,
            'PATILLA' => 1200,
            'PINA' => 3500,
            'LIMON' => 4000,
            'MORA' => 8000,
            'AGUACATE' => 7000,
        ];

        // Buscar coincidencia en el nombre del producto
        foreach ($basePrices as $key => $price) {
            if (str_contains($productName, $key)) {
                return $price;
            }
        }

        // Precio por defecto si no se encuentra
        return 3000;
    }
}
