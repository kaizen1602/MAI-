<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductCatalog;

class ProductCatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Productos del catálogo basados en Corabastos
        $products = [
            // TUBÉRCULOS
            ['name' => 'PAPA CRIOLLA', 'category' => 'Tubérculos', 'aliases' => ['papa criolla lavada', 'papa criolla sucia', 'criolla'], 'description' => 'Papa criolla colombiana'],
            ['name' => 'PAPA PASTUSA', 'category' => 'Tubérculos', 'aliases' => ['pastusa', 'papa blanca'], 'description' => 'Papa pastusa de consumo común'],
            ['name' => 'PAPA R12', 'category' => 'Tubérculos', 'aliases' => ['papa r12 industrial', 'papa r12 negra', 'papa r12 roja', 'r12'], 'description' => 'Papa R12 variedad industrial'],
            ['name' => 'PAPA SABANERA', 'category' => 'Tubérculos', 'aliases' => ['sabanera'], 'description' => 'Papa sabanera'],
            ['name' => 'PAPA SUPREMA', 'category' => 'Tubérculos', 'aliases' => ['suprema'], 'description' => 'Papa suprema'],
            ['name' => 'PAPA TOCARRE', 'category' => 'Tubérculos', 'aliases' => ['tocarre'], 'description' => 'Papa tocarre'],
            ['name' => 'YUCA', 'category' => 'Tubérculos', 'aliases' => ['yuca armenia', 'yuca llanera', 'mandioca'], 'description' => 'Yuca o mandioca'],
            ['name' => 'ARRACACHA', 'category' => 'Tubérculos', 'aliases' => ['apio criollo', 'zanahoria blanca'], 'description' => 'Arracacha o apio'],
            
            // HORTALIZAS
            ['name' => 'TOMATE CHONTO', 'category' => 'Hortalizas', 'aliases' => ['tomate', 'chonto'], 'description' => 'Tomate chonto común'],
            ['name' => 'TOMATE LARGA VIDA', 'category' => 'Hortalizas', 'aliases' => ['tomate larga vida', 'larga vida'], 'description' => 'Tomate de larga duración'],
            ['name' => 'TOMATE MILANO', 'category' => 'Hortalizas', 'aliases' => ['tomate milano', 'milano'], 'description' => 'Tomate milano'],
            ['name' => 'CEBOLLA CABEZONA BLANCA', 'category' => 'Hortalizas', 'aliases' => ['cebolla blanca', 'cabezona blanca'], 'description' => 'Cebolla cabezona blanca'],
            ['name' => 'CEBOLLA CABEZONA ROJA', 'category' => 'Hortalizas', 'aliases' => ['cebolla roja', 'cabezona roja'], 'description' => 'Cebolla cabezona roja'],
            ['name' => 'CEBOLLA LARGA', 'category' => 'Hortalizas', 'aliases' => ['cebolla junca', 'cebolla de rama'], 'description' => 'Cebolla larga o junca'],
            ['name' => 'ZANAHORIA', 'category' => 'Hortalizas', 'aliases' => [], 'description' => 'Zanahoria'],
            ['name' => 'LECHUGA', 'category' => 'Hortalizas', 'aliases' => ['lechuga crespa', 'lechuga batavia'], 'description' => 'Lechuga'],
            ['name' => 'CILANTRO', 'category' => 'Hortalizas', 'aliases' => ['cilantro liso'], 'description' => 'Cilantro'],
            ['name' => 'AHUYAMA', 'category' => 'Hortalizas', 'aliases' => ['zapallo', 'calabaza'], 'description' => 'Ahuyama o calabaza'],
            ['name' => 'AJO', 'category' => 'Hortalizas', 'aliases' => ['ajo rosado', 'ajo blanco'], 'description' => 'Ajo'],
            ['name' => 'PIMENTON', 'category' => 'Hortalizas', 'aliases' => ['pimiento', 'pimentón'], 'description' => 'Pimentón'],
            
            // FRUTAS
            ['name' => 'BANANO CRIOLLO', 'category' => 'Frutas', 'aliases' => ['banano', 'guineo'], 'description' => 'Banano criollo'],
            ['name' => 'MANZANA', 'category' => 'Frutas', 'aliases' => ['manzana roja', 'manzana verde'], 'description' => 'Manzana'],
            ['name' => 'NARANJA', 'category' => 'Frutas', 'aliases' => ['naranja armenia', 'naranja grey', 'naranja ombligona', 'naranja valencia'], 'description' => 'Naranja'],
            ['name' => 'PAPAYA', 'category' => 'Frutas', 'aliases' => ['papaya hawaiana', 'papaya maradol', 'papaya melona', 'papaya redonda'], 'description' => 'Papaya'],
            ['name' => 'PATILLA', 'category' => 'Frutas', 'aliases' => ['sandía'], 'description' => 'Patilla o sandía'],
            ['name' => 'PINA', 'category' => 'Frutas', 'aliases' => ['piña', 'piña gold', 'piña perolera', 'ananá'], 'description' => 'Piña'],
            ['name' => 'LIMON COMUN', 'category' => 'Frutas', 'aliases' => ['limón', 'limón común'], 'description' => 'Limón común'],
            ['name' => 'MORA', 'category' => 'Frutas', 'aliases' => ['mora de castilla'], 'description' => 'Mora de Castilla'],
            ['name' => 'AGUACATE HASS', 'category' => 'Frutas', 'aliases' => ['aguacate', 'hass'], 'description' => 'Aguacate variedad Hass'],
            ['name' => 'AGUACATE PIELES VERDES', 'category' => 'Frutas', 'aliases' => ['aguacate papelillo', 'aguacate común'], 'description' => 'Aguacate pieles verdes'],
            
            // GRANOS Y PROCESADOS
            ['name' => 'ARROZ CORRIENTE', 'category' => 'Granos y Procesados', 'aliases' => ['arroz'], 'description' => 'Arroz corriente'],
            ['name' => 'FRIJOL', 'category' => 'Granos y Procesados', 'aliases' => ['fríjol nima calima', 'fríjol radical'], 'description' => 'Fríjol'],
            ['name' => 'MAIZ', 'category' => 'Granos y Procesados', 'aliases' => ['maíz amarillo', 'maíz blanco', 'maíz trillado'], 'description' => 'Maíz'],
            ['name' => 'CAFE', 'category' => 'Granos y Procesados', 'aliases' => ['café'], 'description' => 'Café'],
        ];

        foreach ($products as $product) {
            ProductCatalog::updateOrCreate(
                ['name' => $product['name']],
                [
                    'category' => $product['category'],
                    'aliases' => $product['aliases'],
                    'description' => $product['description'],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('✅ Catálogo de productos poblado exitosamente: ' . count($products) . ' productos');
    }
}
