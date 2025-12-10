<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MeasurementUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            ['unit_name' => 'KILO', 'abbreviation' => 'kg', 'kg_equivalent' => 1.0, 'description' => 'Kilogramo'],
            ['unit_name' => 'LIBRA', 'abbreviation' => 'lb', 'kg_equivalent' => 0.45359237, 'description' => 'Libra (unidad de peso)'],
            ['unit_name' => 'BULTO', 'abbreviation' => 'bto', 'kg_equivalent' => 50.0, 'description' => 'Bulto estándar (50 kg aprox)'],
            ['unit_name' => 'CARGA', 'abbreviation' => 'crg', 'kg_equivalent' => 125.0, 'description' => 'Carga estándar (125 kg aprox)'],
            ['unit_name' => 'ARROBA', 'abbreviation' => '@', 'kg_equivalent' => 12.5, 'description' => 'Arroba (12.5 kg aprox)'],
            ['unit_name' => 'CANASTILLA', 'abbreviation' => 'cnt', 'kg_equivalent' => 25.0, 'description' => 'Canastilla estándar'],
            ['unit_name' => 'UNIDAD', 'abbreviation' => 'und', 'kg_equivalent' => null, 'description' => 'Unidad individual'],
            ['unit_name' => 'DOCENA', 'abbreviation' => 'doc', 'kg_equivalent' => null, 'description' => 'Docena (12 unidades)'],
        ];

        foreach ($units as $unit) {
            DB::table('measurement_units')->updateOrInsert(
                ['unit_name' => $unit['unit_name']],
                [
                    'abbreviation' => $unit['abbreviation'],
                    'kg_equivalent' => $unit['kg_equivalent'],
                    'description' => $unit['description'],
                    'is_active' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        echo "✅ Unidades de medida sembradas o actualizadas exitosamente: " . count($units) . " unidades\n";
    }
}
