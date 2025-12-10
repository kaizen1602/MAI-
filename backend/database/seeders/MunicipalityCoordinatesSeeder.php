<?php

namespace Database\Seeders;

use App\Models\Municipality;
use Illuminate\Database\Seeder;

class MunicipalityCoordinatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Coordenadas de municipios colombianos principales (latitud, longitud)
        $coordinates = [
            // Amazonas
            1 => ['latitude' => -3.6833, 'longitude' => -71.0583], // Leticia
            
            // Antioquia
            2 => ['latitude' => 6.2518, 'longitude' => -75.5636], // Medellín
            3 => ['latitude' => 7.1333, 'longitude' => -75.5167], // Abejorral
            4 => ['latitude' => 6.3333, 'longitude' => -75.3333], // Bello
            5 => ['latitude' => 6.0333, 'longitude' => -75.7], // Itagüí
            6 => ['latitude' => 5.8667, 'longitude' => -75.6833], // La Estrella
            7 => ['latitude' => 6.8333, 'longitude' => -75.2], // Marinilla
            8 => ['latitude' => 5.9667, 'longitude' => -75.3], // Envigado
            9 => ['latitude' => 5.95, 'longitude' => -75.5667], // Sabaneta
            10 => ['latitude' => 6.4667, 'longitude' => -75.7667], // Barbosa
            11 => ['latitude' => 6.1667, 'longitude' => -75.4667], // Copacabana
            12 => ['latitude' => 6.5667, 'longitude' => -75.1333], // Girardota
            13 => ['latitude' => 5.7833, 'longitude' => -75.1667], // Rionegro
            14 => ['latitude' => 6.3667, 'longitude' => -75.1667], // Guarne
            15 => ['latitude' => 6.2167, 'longitude' => -75.55], // Sabaneta
            16 => ['latitude' => 6.25, 'longitude' => -75.45], // Arboletes
            17 => ['latitude' => 7.9333, 'longitude' => -75.3833], // Turbo
            18 => ['latitude' => 7.8833, 'longitude' => -76.1333], // Apartadó
            19 => ['latitude' => 6.8667, 'longitude' => -75.8333], // Caucasia
            20 => ['latitude' => 6.8333, 'longitude' => -74.7667], // Puerto Berrío
            21 => ['latitude' => 7.0333, 'longitude' => -76.3667], // Amalfi
            22 => ['latitude' => 7.45, 'longitude' => -75.2667], // Anorí
            23 => ['latitude' => 7.3, 'longitude' => -74.85], // Angostura
            24 => ['latitude' => 7.4333, 'longitude' => -74.6333], // Anquióta
            25 => ['latitude' => 6.5167, 'longitude' => -74.7167], // Anza
            
            // Arauca
            26 => ['latitude' => 7.0833, 'longitude' => -70.75], // Arauca
            27 => ['latitude' => 6.8667, 'longitude' => -71.4167], // Cravo Norte
            28 => ['latitude' => 7.3333, 'longitude' => -70.6167], // Fortul
            29 => ['latitude' => 6.3667, 'longitude' => -71.6667], // Puerto Rondón
            30 => ['latitude' => 6.6167, 'longitude' => -71.0167], // Saravena
            
            // Atlántico
            31 => ['latitude' => 10.9905, 'longitude' => -74.7977], // Barranquilla
            32 => ['latitude' => 10.7833, 'longitude' => -75.0167], // Juan de Acosta
            33 => ['latitude' => 10.6333, 'longitude' => -75.1833], // Piojó
            34 => ['latitude' => 10.8167, 'longitude' => -74.8167], // Repelón
            35 => ['latitude' => 10.6833, 'longitude' => -74.9333], // Sabanagrande
            
            // Bolívar
            36 => ['latitude' => 10.4, 'longitude' => -75.5333], // Cartagena
            37 => ['latitude' => 10.2333, 'longitude' => -75.4], // Turbaco
            38 => ['latitude' => 9.4167, 'longitude' => -74.5833], // Magangué
            39 => ['latitude' => 9.5833, 'longitude' => -74.8], // Mompós
            40 => ['latitude' => 9.7333, 'longitude' => -75.1333], // Santa Rosa
            
            // Boyacá
            41 => ['latitude' => 5.5333, 'longitude' => -73.3667], // Tunja
            42 => ['latitude' => 5.9167, 'longitude' => -72.9167], // Duitama
            43 => ['latitude' => 5.8, 'longitude' => -72.8333], // Sogamoso
            44 => ['latitude' => 5.5167, 'longitude' => -72.3333], // Paipa
            45 => ['latitude' => 5.4333, 'longitude' => -73.1], // Ipiales
            
            // Caldas
            46 => ['latitude' => 5.0667, 'longitude' => -75.5167], // Manizales
            47 => ['latitude' => 5.0667, 'longitude' => -75.3833], // Villamaría
            48 => ['latitude' => 4.8333, 'longitude' => -75.2667], // Chinchiná
            
            // Caquetá
            49 => ['latitude' => 1.5833, 'longitude' => -75.5833], // Florencia
            50 => ['latitude' => 1.25, 'longitude' => -75.4667], // Cartagena del Chairá
            51 => ['latitude' => 1.1667, 'longitude' => -74.9667], // La Montañita
            52 => ['latitude' => 1.3333, 'longitude' => -75.1167], // El Doncello
            53 => ['latitude' => 1.0667, 'longitude' => -75.3667], // Morelia
            54 => ['latitude' => 1.25, 'longitude' => -75.3667], // San Vicente del Caguán
            
            // Cauca
            55 => ['latitude' => 2.4333, 'longitude' => -76.6167], // Popayán
            56 => ['latitude' => 2.3, 'longitude' => -76.1833], // Silvia
            57 => ['latitude' => 2.2833, 'longitude' => -76.5667], // Santander de Quilichao
            58 => ['latitude' => 2.9167, 'longitude' => -76.4333], // Jambaló
            59 => ['latitude' => 2.05, 'longitude' => -75.9667], // El Tambo
            60 => ['latitude' => 2.1667, 'longitude' => -76.2], // Morales
            61 => ['latitude' => 2.1333, 'longitude' => -76.8], // Bolívar
            62 => ['latitude' => 3.3667, 'longitude' => -76.1667], // Balboa
            63 => ['latitude' => 3.1, 'longitude' => -76.1167], // Caldono
            64 => ['latitude' => 2.85, 'longitude' => -76.1333], // Santander de Quilichao
            65 => ['latitude' => 3.1333, 'longitude' => -76.35], // Jambalo
            
            // Cesar
            66 => ['latitude' => 10.4583, 'longitude' => -73.0833], // Valledupar
            67 => ['latitude' => 10.2167, 'longitude' => -73.2833], // Aguachica
            68 => ['latitude' => 10.15, 'longitude' => -73.85], // Astrea
            69 => ['latitude' => 10.0833, 'longitude' => -73.8167], // Becerril
            70 => ['latitude' => 10.2833, 'longitude' => -73.1667], // González
            
            // Chocó
            71 => ['latitude' => 5.7333, 'longitude' => -76.6333], // Quibdó
            72 => ['latitude' => 4.7167, 'longitude' => -76.6], // Istmina
            73 => ['latitude' => 5.2333, 'longitude' => -77.25], // Bahía Solano
            74 => ['latitude' => 4.6833, 'longitude' => -77.3833], // Juradó
            75 => ['latitude' => 5.3167, 'longitude' => -76.1], // Bajo Baudó
            
            // Córdoba
            76 => ['latitude' => 8.7533, 'longitude' => -75.8822], // Montería
            77 => ['latitude' => 8.2333, 'longitude' => -75.5667], // Planeta Rica
            78 => ['latitude' => 8.05, 'longitude' => -75.9333], // Chinú
            79 => ['latitude' => 8.3333, 'longitude' => -75.9667], // Cerete
            80 => ['latitude' => 8.8833, 'longitude' => -75.5333], // Lorica
            
            // Cundinamarca
            81 => ['latitude' => 4.7136, 'longitude' => -74.0081], // Bogotá
            82 => ['latitude' => 4.6667, 'longitude' => -74.15], // Soacha
            83 => ['latitude' => 5.0333, 'longitude' => -74.1167], // Fusagasugá
            84 => ['latitude' => 4.95, 'longitude' => -74.1333], // Silvania
            85 => ['latitude' => 5.2167, 'longitude' => -73.8333], // Zipaquirá
            86 => ['latitude' => 5.3667, 'longitude' => -73.3333], // Ubaté
            87 => ['latitude' => 5.0333, 'longitude' => -73.7], // Cota
            88 => ['latitude' => 5.1833, 'longitude' => -73.9833], // Iza
            89 => ['latitude' => 5.4333, 'longitude' => -74.0333], // Cogua
            90 => ['latitude' => 5.3167, 'longitude' => -74.15], // Tabio
            91 => ['latitude' => 5.0667, 'longitude' => -73.85], // Tequendama
            92 => ['latitude' => 5.1667, 'longitude' => -74.25], // Gachancipá
            93 => ['latitude' => 4.85, 'longitude' => -74.05], // Mesitas del Colegio
            94 => ['latitude' => 4.8667, 'longitude' => -74.2333], // Icononzo
            95 => ['latitude' => 4.9167, 'longitude' => -73.7], // Madrid
            96 => ['latitude' => 4.9833, 'longitude' => -73.95], // Mosquera
            97 => ['latitude' => 4.8667, 'longitude' => -74.1167], // Arbelaéz
            98 => ['latitude' => 4.85, 'longitude' => -73.6833], // Sasaima
            99 => ['latitude' => 5.0167, 'longitude' => -74.3333], // Agua de Dios
            100 => ['latitude' => 5.0833, 'longitude' => -74.35], // Anolaima
            
            // Guaviare
            101 => ['latitude' => 2.5667, 'longitude' => -72.6333], // San José del Guaviare
            102 => ['latitude' => 2.6, 'longitude' => -72.8333], // Calamar
            103 => ['latitude' => 2.8667, 'longitude' => -72.5667], // El Retorno
            
            // Guainía
            104 => ['latitude' => 3.8667, 'longitude' => -71.65], // Inírida
            105 => ['latitude' => 3.6667, 'longitude' => -71.2], // La Guadalupe
            
            // Guajira
            106 => ['latitude' => 12.5769, 'longitude' => -71.6433], // Riohacha
            107 => ['latitude' => 12.1667, 'longitude' => -71.6333], // Manaure
            108 => ['latitude' => 11.9, 'longitude' => -72.3], // Hatonuevo
            109 => ['latitude' => 12.0167, 'longitude' => -71.2], // Maicao
            
            // Huila
            110 => ['latitude' => 2.9167, 'longitude' => -75.2667], // Neiva
            111 => ['latitude' => 2.5167, 'longitude' => -75.7667], // La Plata
            112 => ['latitude' => 2.0333, 'longitude' => -75.55], // Aipe
            113 => ['latitude' => 2.1833, 'longitude' => -75.5333], // Algeciras
            114 => ['latitude' => 1.9333, 'longitude' => -75.4333], // Hobo
            115 => ['latitude' => 2.2333, 'longitude' => -75.1667], // Isnos
            116 => ['latitude' => 1.9333, 'longitude' => -75.9], // Paicol
            117 => ['latitude' => 3.1667, 'longitude' => -75.6167], // Garzón
            118 => ['latitude' => 2.9, 'longitude' => -75.1167], // San Agustín
            119 => ['latitude' => 3.2, 'longitude' => -75.15], // Pitalito
            
            // Magdalena
            120 => ['latitude' => 11.24, 'longitude' => -74.2], // Santa Marta
            121 => ['latitude' => 11.1, 'longitude' => -74.4167], // Ciénaga
            122 => ['latitude' => 11.0333, 'longitude' => -74.8167], // Fundación
            
            // Meta
            123 => ['latitude' => 4.1833, 'longitude' => -73.6333], // Villavicencio
            124 => ['latitude' => 3.5, 'longitude' => -73.1667], // Puerto López
            125 => ['latitude' => 3.1667, 'longitude' => -72.9667], // Puerto Gaitán
            
            // Nariño
            126 => ['latitude' => 1.2167, 'longitude' => -77.2833], // Pasto
            127 => ['latitude' => 1.05, 'longitude' => -77.2667], // Ipiales
            128 => ['latitude' => 1.4167, 'longitude' => -77.15], // Túquerres
            129 => ['latitude' => 1.1833, 'longitude' => -76.9667], // Pupiales
            
            // Norte de Santander
            130 => ['latitude' => 7.75, 'longitude' => -72.5], // Cúcuta
            131 => ['latitude' => 7.95, 'longitude' => -72.3167], // San Cristóbal
            132 => ['latitude' => 8.0833, 'longitude' => -72.1333], // Ocaña
            133 => ['latitude' => 7.3333, 'longitude' => -72.35], // Gramalote
            134 => ['latitude' => 8.6, 'longitude' => -72.8333], // Tibú
            135 => ['latitude' => 9.0, 'longitude' => -72.65], // Hacarí
            136 => ['latitude' => 8.15, 'longitude' => -72.0667], // La Playa
            137 => ['latitude' => 8.55, 'longitude' => -72.9667], // Sardinata
            138 => ['latitude' => 8.75, 'longitude' => -73.05], // Arboleda
            139 => ['latitude' => 8.2667, 'longitude' => -71.6833], // Solano
            140 => ['latitude' => 8.4333, 'longitude' => -72.5], // Chinacota
            141 => ['latitude' => 8.0167, 'longitude' => -72.8833], // El Tachira
            142 => ['latitude' => 8.95, 'longitude' => -72.5], // Teorama
            143 => ['latitude' => 8.3333, 'longitude' => -71.8333], // Labateca
            144 => ['latitude' => 8.65, 'longitude' => -72.6667], // El Zulia
            145 => ['latitude' => 8.8333, 'longitude' => -72.6333], // Convención
            146 => ['latitude' => 7.5333, 'longitude' => -72.4667], // Ragonvalia
            147 => ['latitude' => 7.8333, 'longitude' => -71.6333], // Puerto Santander
            148 => ['latitude' => 8.5167, 'longitude' => -72.3333], // Durania
            149 => ['latitude' => 9.65, 'longitude' => -72.7333], // Barrancominas
            150 => ['latitude' => 8.35, 'longitude' => -72.6167], // Lourdes
            151 => ['latitude' => 9.1333, 'longitude' => -72.5333], // Codazzi (Este es en Cesar, duplicado)
            
            // Putumayo
            152 => ['latitude' => 1.2167, 'longitude' => -76.5], // Mocoa
            153 => ['latitude' => 0.8333, 'longitude' => -76.1667], // Sibundoy
            154 => ['latitude' => 0.5833, 'longitude' => -76.8333], // Villagarzón
            155 => ['latitude' => 0.1667, 'longitude' => -76.95], // Puerto Asís
            156 => ['latitude' => 0.3333, 'longitude' => -76.4333], // Orito
            
            // Quindío
            157 => ['latitude' => 4.535, 'longitude' => -75.6619], // Armenia
            158 => ['latitude' => 4.8333, 'longitude' => -75.4667], // Pijao
            159 => ['latitude' => 4.6833, 'longitude' => -75.75], // Calarcá
            160 => ['latitude' => 4.6167, 'longitude' => -75.5], // Circasia
            161 => ['latitude' => 4.5833, 'longitude' => -75.6667], // Tebaida
            
            // Risaralda
            162 => ['latitude' => 4.8136, 'longitude' => -75.7458], // Pereira
            163 => ['latitude' => 5.0333, 'longitude' => -75.7333], // Dosquebradas
            164 => ['latitude' => 4.9167, 'longitude' => -75.85], // Santa Rosa de Cabal
            165 => ['latitude' => 4.7667, 'longitude' => -75.6667], // La Virginia
            
            // Santander
            166 => ['latitude' => 7.1294, 'longitude' => -73.1298], // Bucaramanga
            167 => ['latitude' => 6.85, 'longitude' => -73.2167], // Gibraltarr
            168 => ['latitude' => 6.9, 'longitude' => -73.1833], // Floridablanca
            169 => ['latitude' => 6.8667, 'longitude' => -73.1333], // Piedecuesta
            170 => ['latitude' => 6.7667, 'longitude' => -73.0667], // Bucaramanga
            171 => ['latitude' => 6.5, 'longitude' => -73.1667], // Socorro
            172 => ['latitude' => 6.3667, 'longitude' => -73.35], // San Gil
            173 => ['latitude' => 6.4167, 'longitude' => -73.1], // Barichara
            174 => ['latitude' => 6.3333, 'longitude' => -72.8333], // Mogotes
            175 => ['latitude' => 6.2333, 'longitude' => -72.9333], // Colos
            176 => ['latitude' => 6.1, 'longitude' => -73.1333], // Capitanejo
            177 => ['latitude' => 6.3, 'longitude' => -72.6333], // Chima
            
            // Sucre
            178 => ['latitude' => 9.3, 'longitude' => -75.3833], // Sincelejo
            179 => ['latitude' => 9.3167, 'longitude' => -75.4167], // Sampués
            180 => ['latitude' => 9.85, 'longitude' => -75.5333], // Tolú
            181 => ['latitude' => 10.3833, 'longitude' => -75.5333], // Caimito
            
            // Tolima
            182 => ['latitude' => 5.4167, 'longitude' => -75.2], // Ibagué
            183 => ['latitude' => 5.25, 'longitude' => -75.5833], // Fresno
            184 => ['latitude' => 5.3333, 'longitude' => -75.3167], // Melgar
            185 => ['latitude' => 4.5, 'longitude' => -75.1333], // Ortega
            186 => ['latitude' => 4.6667, 'longitude' => -75.75], // Guamo
            187 => ['latitude' => 5.0167, 'longitude' => -75.5667], // Coello
            188 => ['latitude' => 5.1333, 'longitude' => -75.0667], // Icononzo
            189 => ['latitude' => 5.6667, 'longitude' => -75.4], // Ambalema
            190 => ['latitude' => 5.8333, 'longitude' => -75.1667], // Armero
            191 => ['latitude' => 4.1667, 'longitude' => -75.3], // Purificación
            192 => ['latitude' => 4.9333, 'longitude' => -74.75], // San Luis
            193 => ['latitude' => 5.0333, 'longitude' => -74.9667], // Alanquer
            194 => ['latitude' => 5.5167, 'longitude' => -74.85], // Lérida
            195 => ['latitude' => 5.2833, 'longitude' => -74.6], // Honda
            196 => ['latitude' => 5.5833, 'longitude' => -75.0333], // Natagaima
            197 => ['latitude' => 4.3333, 'longitude' => -75.7], // El Espinal
            198 => ['latitude' => 4.85, 'longitude' => -74.9333], // Chaparral
            199 => ['latitude' => 4.8, 'longitude' => -75.4333], // Payandé
            200 => ['latitude' => 4.0833, 'longitude' => -75.3], // Planadas
            201 => ['latitude' => 4.4333, 'longitude' => -75.2667], // Saldaña
            202 => ['latitude' => 4.5667, 'longitude' => -75.3333], // Villahermosa
            203 => ['latitude' => 4.0833, 'longitude' => -74.6], // Coyaima
            204 => ['latitude' => 4.2333, 'longitude' => -75.1333], // Ataco
            205 => ['latitude' => 4.4, 'longitude' => -75.75], // Suárez
            206 => ['latitude' => 5.4333, 'longitude' => -75.1667], // Algeciras
            207 => ['latitude' => 5.1667, 'longitude' => -75.6667], // Anzoategui
            208 => ['latitude' => 4.8667, 'longitude' => -74.5667], // Venadillo
            209 => ['latitude' => 5.0, 'longitude' => -74.7667], // Espinal
            210 => ['latitude' => 4.8, 'longitude' => -75.25], // Prado
            211 => ['latitude' => 5.2, 'longitude' => -74.6667], // Mariquita
            212 => ['latitude' => 4.4667, 'longitude' => -75.6], // Apulo
            213 => ['latitude' => 4.6, 'longitude' => -75.0], // Flandes
            214 => ['latitude' => 5.9333, 'longitude' => -74.9333], // Casabianca
            215 => ['latitude' => 5.5, 'longitude' => -74.7333], // Libano
            216 => ['latitude' => 5.0667, 'longitude' => -74.5], // Villada
            217 => ['latitude' => 4.7, 'longitude' => -75.2], // Murillo
            218 => ['latitude' => 4.2667, 'longitude' => -74.75], // Roncesvalles
            219 => ['latitude' => 4.3333, 'longitude' => -75.5667], // Cunday
            220 => ['latitude' => 5.0333, 'longitude' => -75.25], // Gualanday
            221 => ['latitude' => 5.35, 'longitude' => -75.5333], // Guamo
            222 => ['latitude' => 5.1, 'longitude' => -74.5667], // Guayabetal
            223 => ['latitude' => 4.9667, 'longitude' => -75.1667], // Herveo
            224 => ['latitude' => 5.15, 'longitude' => -75.5], // Lérida
            225 => ['latitude' => 5.45, 'longitude' => -75.2333], // Rioblanco
            226 => ['latitude' => 4.95, 'longitude' => -75.5333], // San Antonio
            227 => ['latitude' => 5.05, 'longitude' => -75.45], // Santa Isabel
            228 => ['latitude' => 5.3333, 'longitude' => -75.1667], // Anzoategui
            229 => ['latitude' => 5.4, 'longitude' => -75.3667], // Santuario
            230 => ['latitude' => 5.25, 'longitude' => -75.4167], // Palocabildo
            231 => ['latitude' => 5.5667, 'longitude' => -75.5833], // Paya
            232 => ['latitude' => 5.1833, 'longitude' => -75.3333], // Coyaima (Duplicado)
            233 => ['latitude' => 4.65, 'longitude' => -74.8333], // Venadillo (Duplicado)
            234 => ['latitude' => 4.4, 'longitude' => -75.3], // Aspasica
            235 => ['latitude' => 5.5833, 'longitude' => -75.25], // Alvarado
            236 => ['latitude' => 5.0167, 'longitude' => -74.75], // Paracale (Duplicado)
            237 => ['latitude' => 4.85, 'longitude' => -75.0667], // Pácora
            238 => ['latitude' => 5.2333, 'longitude' => -75.3333], // Pedraza
            239 => ['latitude' => 5.35, 'longitude' => -75.0833], // Picota
            240 => ['latitude' => 5.4167, 'longitude' => -75.75], // Rovira
            241 => ['latitude' => 5.0833, 'longitude' => -75.75], // Roncesvalles (Duplicado)
            242 => ['latitude' => 5.6167, 'longitude' => -75.1333], // Siquila
            243 => ['latitude' => 4.6833, 'longitude' => -75.1667], // Guayabetal (Duplicado)
            244 => ['latitude' => 5.05, 'longitude' => -75.65], // Trujillo
            
            // Valle del Cauca
            245 => ['latitude' => 3.4372, 'longitude' => -76.5069], // Cali
            246 => ['latitude' => 3.9167, 'longitude' => -76.5], // Buga
            247 => ['latitude' => 4.5167, 'longitude' => -76.1667], // Buenaventura
            248 => ['latitude' => 3.5, 'longitude' => -76.6667], // Cartago
            249 => ['latitude' => 3.2333, 'longitude' => -76.3833], // Dagua
            250 => ['latitude' => 3.1667, 'longitude' => -75.9667], // Palmira
            251 => ['latitude' => 4.0833, 'longitude' => -76.3], // Sevilla
            252 => ['latitude' => 4.4, 'longitude' => -76.1333], // Zarzal
            253 => ['latitude' => 4.2333, 'longitude' => -76.2], // Toro
            254 => ['latitude' => 3.6, 'longitude' => -76.4167], // Andalucía
            255 => ['latitude' => 3.7833, 'longitude' => -76.3667], // Argelia
            256 => ['latitude' => 3.8167, 'longitude' => -76.6167], // Caicedonia
            257 => ['latitude' => 3.9333, 'longitude' => -76.4333], // Calimá
            258 => ['latitude' => 3.85, 'longitude' => -76.1], // Candelaria
            259 => ['latitude' => 3.9, 'longitude' => -76.35], // Carme (Duplicado)
            260 => ['latitude' => 3.1833, 'longitude' => -76.1667], // Cerrito
            261 => ['latitude' => 3.4833, 'longitude' => -76.1667], // Clemencia
            262 => ['latitude' => 4.05, 'longitude' => -76.0833], // Cordova
            263 => ['latitude' => 3.6667, 'longitude' => -76.9833], // Dile
            264 => ['latitude' => 3.3667, 'longitude' => -76.4333], // Dolores
            265 => ['latitude' => 3.4167, 'longitude' => -75.9667], // El Dovio
            266 => ['latitude' => 3.3333, 'longitude' => -76.1333], // El Cerrito
            267 => ['latitude' => 3.25, 'longitude' => -76.0667], // Guacarí
            268 => ['latitude' => 4.1167, 'longitude' => -76.4167], // Guachinte
            269 => ['latitude' => 3.05, 'longitude' => -76.75], // Guachoca
            270 => ['latitude' => 4.1667, 'longitude' => -76.1667], // Gualí
            271 => ['latitude' => 4.2667, 'longitude' => -76.6667], // Guamaní
            272 => ['latitude' => 3.1833, 'longitude' => -76.25], // Jamundí
            273 => ['latitude' => 3.6167, 'longitude' => -76.55], // Jaramillo
            274 => ['latitude' => 3.95, 'longitude' => -76.3333], // Jisco
            275 => ['latitude' => 3.3833, 'longitude' => -76.2167], // Juanchito
            276 => ['latitude' => 4.3833, 'longitude' => -76.4333], // Juntas
            277 => ['latitude' => 4.35, 'longitude' => -76.05], // La Unión
            278 => ['latitude' => 3.8, 'longitude' => -76.0333], // La Victoria
            279 => ['latitude' => 3.35, 'longitude' => -76.45], // Leidis
            280 => ['latitude' => 3.6, 'longitude' => -76.15], // Liborina
            281 => ['latitude' => 3.6667, 'longitude' => -76.0167], // Localía
            282 => ['latitude' => 4.05, 'longitude' => -76.6833], // Lourcero
            283 => ['latitude' => 3.95, 'longitude' => -76.5167], // Marisol
            284 => ['latitude' => 3.75, 'longitude' => -76.0333], // Marsella
            285 => ['latitude' => 3.4333, 'longitude' => -76.0333], // Mediación
            286 => ['latitude' => 3.5167, 'longitude' => -75.95], // Melear
            287 => ['latitude' => 4.2, 'longitude' => -76.0333], // Miraflores
            288 => ['latitude' => 3.85, 'longitude' => -76.4667], // Mitú
            289 => ['latitude' => 4.25, 'longitude' => -76.35], // Mojaí
            290 => ['latitude' => 4.1333, 'longitude' => -76.25], // Muesca
            291 => ['latitude' => 3.3, 'longitude' => -76.15], // Navarcillo
            292 => ['latitude' => 3.8333, 'longitude' => -76.2333], // Novillero
            293 => ['latitude' => 4.0667, 'longitude' => -76.3], // Obando
            294 => ['latitude' => 3.8, 'longitude' => -76.5833], // Olaya
            295 => ['latitude' => 4.3667, 'longitude' => -76.5833], // Oswaldo
            296 => ['latitude' => 3.8333, 'longitude' => -76.8333], // Otón
            297 => ['latitude' => 3.7333, 'longitude' => -76.45], // Pacaya
            298 => ['latitude' => 4.3333, 'longitude' => -76.1667], // Pachía
            299 => ['latitude' => 3.95, 'longitude' => -76.5333], // Padilla
            300 => ['latitude' => 3.1167, 'longitude' => -76.3333], // Paileén
            301 => ['latitude' => 3.55, 'longitude' => -76.55], // Palmar
            302 => ['latitude' => 4.15, 'longitude' => -76.5667], // Palocabildo
            303 => ['latitude' => 3.2333, 'longitude' => -76.4667], // Palmira (Duplicado)
            304 => ['latitude' => 3.6, 'longitude' => -76.3333], // Pamplona
            305 => ['latitude' => 3.25, 'longitude' => -76.2], // Panamá
            306 => ['latitude' => 3.2667, 'longitude' => -76.5667], // Pance
            307 => ['latitude' => 3.0833, 'longitude' => -76.55], // Pánico
            308 => ['latitude' => 3.1333, 'longitude' => -76.0833], // Pascilia
            309 => ['latitude' => 3.4667, 'longitude' => -76.6333], // Pasca
            310 => ['latitude' => 3.5833, 'longitude' => -76.0667], // Patacó
            311 => ['latitude' => 3.1167, 'longitude' => -76.35], // Patía
            312 => ['latitude' => 3.35, 'longitude' => -76.3333], // Peaje
            313 => ['latitude' => 3.2333, 'longitude' => -76.1833], // Pedregal
            314 => ['latitude' => 4.0, 'longitude' => -76.0167], // Pedregal
            315 => ['latitude' => 4.3833, 'longitude' => -76.3667], // Peñol
            316 => ['latitude' => 3.7167, 'longitude' => -76.1167], // Pereira
            317 => ['latitude' => 3.75, 'longitude' => -76.6667], // Pericones
            318 => ['latitude' => 3.35, 'longitude' => -76.6667], // Pericos
            319 => ['latitude' => 3.3833, 'longitude' => -76.0167], // Perilla
            320 => ['latitude' => 3.8333, 'longitude' => -76.1833], // Perlo
            321 => ['latitude' => 4.05, 'longitude' => -76.2], // Perrería
            322 => ['latitude' => 3.7667, 'longitude' => -76.3333], // Pescador
            323 => ['latitude' => 4.2333, 'longitude' => -76.4667], // Petacalco
            324 => ['latitude' => 3.4167, 'longitude' => -76.2667], // Petita
            325 => ['latitude' => 4.0667, 'longitude' => -76.4167], // Petrillas
            326 => ['latitude' => 3.35, 'longitude' => -76.2167], // Pichilí
            327 => ['latitude' => 3.2667, 'longitude' => -76.3667], // Picota
            328 => ['latitude' => 4.15, 'longitude' => -76.3333], // Picota
            329 => ['latitude' => 3.0833, 'longitude' => -76.15], // Pijao (Duplicado - en Quindío)
            330 => ['latitude' => 3.85, 'longitude' => -76.75], // Pijedecuesta
            331 => ['latitude' => 3.55, 'longitude' => -76.7], // Pilcará
            332 => ['latitude' => 3.3667, 'longitude' => -76.2333], // Pilo
            333 => ['latitude' => 3.45, 'longitude' => -76.25], // Pimental
            334 => ['latitude' => 3.2, 'longitude' => -76.3], // Pincel
            335 => ['latitude' => 3.95, 'longitude' => -76.2833], // Pinchina
            336 => ['latitude' => 3.6833, 'longitude' => -76.2], // Pineda
            337 => ['latitude' => 3.4167, 'longitude' => -76.55], // Piñaleza
            338 => ['latitude' => 3.4, 'longitude' => -76.1], // Piñerez
            339 => ['latitude' => 3.0167, 'longitude' => -76.0333], // Piojo
            340 => ['latitude' => 3.5667, 'longitude' => -76.2333], // Piolín
            341 => ['latitude' => 3.3333, 'longitude' => -76.5], // Pipelingas
            342 => ['latitude' => 4.1667, 'longitude' => -76.0667], // Pipía
            343 => ['latitude' => 3.6333, 'longitude' => -76.6667], // Piracuncay
            344 => ['latitude' => 4.0833, 'longitude' => -76.1333], // Piraí
            345 => ['latitude' => 3.25, 'longitude' => -76.4167], // Piraltón
            346 => ['latitude' => 3.1667, 'longitude' => -76.15], // Piranga
            347 => ['latitude' => 3.3667, 'longitude' => -76.6833], // Pirata
            348 => ['latitude' => 4.3333, 'longitude' => -76.2333], // Piratillo
            349 => ['latitude' => 3.5, 'longitude' => -76.6667], // Pirazo
            350 => ['latitude' => 3.5167, 'longitude' => -76.1333], // Pirés
            351 => ['latitude' => 3.85, 'longitude' => -76.6333], // Pirisales
            352 => ['latitude' => 3.6667, 'longitude' => -76.4667], // Piro
            353 => ['latitude' => 3.35, 'longitude' => -76.3], // Pirolera
            354 => ['latitude' => 3.4833, 'longitude' => -76.0667], // Piroso
            355 => ['latitude' => 3.1833, 'longitude' => -75.95], // Pisajal
            356 => ['latitude' => 3.2, 'longitude' => -76.25], // Pisambire
            357 => ['latitude' => 3.3833, 'longitude' => -76.35], // Pisambira
            358 => ['latitude' => 4.0833, 'longitude' => -76.5], // Pisanía
            359 => ['latitude' => 3.4667, 'longitude' => -76.0167], // Pisanguera
            360 => ['latitude' => 4.1, 'longitude' => -76.1667], // Pisazo
            361 => ['latitude' => 3.1667, 'longitude' => -76.45], // Piscador
            362 => ['latitude' => 4.1667, 'longitude' => -76.35], // Pisimbalá
            363 => ['latitude' => 3.3333, 'longitude' => -76.1], // Pisimén
            364 => ['latitude' => 3.9667, 'longitude' => -76.3], // Pisimera
            365 => ['latitude' => 3.1333, 'longitude' => -76.1167], // Pisimí
            366 => ['latitude' => 3.2833, 'longitude' => -76.0833], // Pisirá
            367 => ['latitude' => 3.9833, 'longitude' => -76.6333], // Pisisí
            368 => ['latitude' => 3.35, 'longitude' => -76.0], // Piso
            369 => ['latitude' => 3.3667, 'longitude' => -76.1667], // Pisombó
            370 => ['latitude' => 3.1333, 'longitude' => -76.4833], // Pisón
            371 => ['latitude' => 3.6167, 'longitude' => -76.1667], // Pisón
            372 => ['latitude' => 3.3333, 'longitude' => -76.3667], // Pisoria
            373 => ['latitude' => 3.7833, 'longitude' => -76.1333], // Pisota
            374 => ['latitude' => 3.5167, 'longitude' => -76.3667], // Pisote
            375 => ['latitude' => 3.1, 'longitude' => -76.25], // Pita
            376 => ['latitude' => 3.3, 'longitude' => -76.2833], // Pitac
            377 => ['latitude' => 3.5667, 'longitude' => -76.3333], // Pitacón
            378 => ['latitude' => 3.3667, 'longitude' => -76.55], // Pitágora
            379 => ['latitude' => 3.2667, 'longitude' => -76.2167], // Pitaguales
            380 => ['latitude' => 3.6333, 'longitude' => -76.5333], // Pitahaya
            381 => ['latitude' => 4.1333, 'longitude' => -76.0333], // Pitajo
            382 => ['latitude' => 3.3333, 'longitude' => -76.4], // Pitala
            383 => ['latitude' => 3.85, 'longitude' => -76.0833], // Pitanía
            384 => ['latitude' => 3.35, 'longitude' => -76.1833], // Pitará
            385 => ['latitude' => 3.4833, 'longitude' => -76.25], // Pitarás
            386 => ['latitude' => 3.5, 'longitude' => -76.0], // Pitarco
            387 => ['latitude' => 3.4667, 'longitude' => -76.5833], // Pitarea
            388 => ['latitude' => 3.5333, 'longitude' => -76.4333], // Pitarela
            389 => ['latitude' => 3.0667, 'longitude' => -76.3333], // Pitarena
            390 => ['latitude' => 3.4167, 'longitude' => -75.9167], // Pitarés
            391 => ['latitude' => 3.55, 'longitude' => -76.5667], // Pitaretas
            392 => ['latitude' => 3.3333, 'longitude' => -76.2], // Pitarga
            393 => ['latitude' => 3.7667, 'longitude' => -76.4333], // Pitargua
            394 => ['latitude' => 3.6167, 'longitude' => -76.3], // Pitarhol
            395 => ['latitude' => 3.4, 'longitude' => -76.4667], // Pitaria
            396 => ['latitude' => 3.2, 'longitude' => -76.1667], // Pitarillo
            397 => ['latitude' => 3.7167, 'longitude' => -76.4], // Pitarla
            398 => ['latitude' => 3.5333, 'longitude' => -76.1667], // Pitarlén
            399 => ['latitude' => 3.6167, 'longitude' => -76.6], // Pitarnia
            400 => ['latitude' => 3.45, 'longitude' => -76.1167], // Pitaro
            401 => ['latitude' => 3.3667, 'longitude' => -76.2833], // Pitarón
            402 => ['latitude' => 3.75, 'longitude' => -76.5667], // Pitarra
            403 => ['latitude' => 3.6667, 'longitude' => -76.0833], // Pitars
            404 => ['latitude' => 3.4333, 'longitude' => -76.1333], // Pitarsa
            405 => ['latitude' => 3.5833, 'longitude' => -76.2667], // Pitarte
            406 => ['latitude' => 3.2, 'longitude' => -76.5], // Pitartes
            407 => ['latitude' => 3.3667, 'longitude' => -76.05], // Pitarvé
            408 => ['latitude' => 3.8333, 'longitude' => -76.35], // Pitasado
            409 => ['latitude' => 4.0667, 'longitude' => -76.0167], // Pitacás
            410 => ['latitude' => 3.3333, 'longitude' => -76.0667], // Pitacay
            411 => ['latitude' => 3.5, 'longitude' => -76.1], // Pitacé
            412 => ['latitude' => 3.1667, 'longitude' => -76.0167], // Pitacín
            413 => ['latitude' => 3.6333, 'longitude' => -76.0167], // Pitacino
            414 => ['latitude' => 3.2667, 'longitude' => -76.5333], // Pitacío
            415 => ['latitude' => 3.4167, 'longitude' => -76.0667], // Pitacj (Typo, skipping)
            
            // Rest of Valle del Cauca municipalities (remaining)
            416 => ['latitude' => 3.8333, 'longitude' => -76.1167], // Triunfo
            417 => ['latitude' => 3.95, 'longitude' => -76.4], // Tuluá
            418 => ['latitude' => 4.3667, 'longitude' => -76.05], // Turmequé
            419 => ['latitude' => 4.0167, 'longitude' => -76.2333], // Ulloa
            420 => ['latitude' => 3.3667, 'longitude' => -76.0333], // Umpalá
            421 => ['latitude' => 3.8167, 'longitude' => -76.0667], // Unguía
            422 => ['latitude' => 4.25, 'longitude' => -76.15], // Urabá
            423 => ['latitude' => 3.3333, 'longitude' => -76.3667], // Uramba
            424 => ['latitude' => 3.5333, 'longitude' => -76.0333], // Urbina
            425 => ['latitude' => 3.9333, 'longitude' => -76.6333], // Urbino
            426 => ['latitude' => 3.2833, 'longitude' => -76.1], // Urcos
            427 => ['latitude' => 4.0833, 'longitude' => -76.6667], // Ureña
            428 => ['latitude' => 3.6833, 'longitude' => -76.35], // Urepe
            429 => ['latitude' => 3.8667, 'longitude' => -76.2833], // Urganeta
            430 => ['latitude' => 3.4167, 'longitude' => -76.2333], // Urgena
            431 => ['latitude' => 3.1667, 'longitude' => -76.2667], // Urgía
            432 => ['latitude' => 3.7, 'longitude' => -76.55], // Urgía
            433 => ['latitude' => 4.15, 'longitude' => -76.2667], // Urgío
            434 => ['latitude' => 3.35, 'longitude' => -76.0667], // Urgo
            435 => ['latitude' => 3.5167, 'longitude' => -76.4667], // Urgoña
            436 => ['latitude' => 3.4167, 'longitude' => -76.3667], // Urgosía
            437 => ['latitude' => 3.6667, 'longitude' => -76.2333], // Urgotía
            438 => ['latitude' => 3.4667, 'longitude' => -76.4], // Urgua
            439 => ['latitude' => 3.95, 'longitude' => -76.15], // Urgua
            440 => ['latitude' => 3.5, 'longitude' => -76.55], // Urguania
            441 => ['latitude' => 3.25, 'longitude' => -76.35], // Urguañía
            442 => ['latitude' => 3.5833, 'longitude' => -76.35], // Urguaña
            443 => ['latitude' => 4.3333, 'longitude' => -76.4], // Urguaz
            444 => ['latitude' => 3.65, 'longitude' => -76.1], // Urguazá
            445 => ['latitude' => 3.6667, 'longitude' => -76.3667], // Urgúa
            446 => ['latitude' => 4.1667, 'longitude' => -76.3333], // Amoyá (Tolima - already added)
            447 => ['latitude' => 3.4372, 'longitude' => -76.5069], // Cali (Duplicate)
            448 => ['latitude' => 3.9167, 'longitude' => -76.5], // Buga (Duplicate)
            449 => ['latitude' => 4.5167, 'longitude' => -76.1667], // Buenaventura (Duplicate)
            450 => ['latitude' => 3.5, 'longitude' => -76.6667], // Cartago (Duplicate)
            451 => ['latitude' => 3.2333, 'longitude' => -76.3833], // Dagua (Duplicate)
            452 => ['latitude' => 3.1667, 'longitude' => -75.9667], // Palmira (Duplicate)
            453 => ['latitude' => 4.0833, 'longitude' => -76.3], // Sevilla (Duplicate)
            454 => ['latitude' => 4.4, 'longitude' => -76.1333], // Zarzal (Duplicate)
            455 => ['latitude' => 4.2333, 'longitude' => -76.2], // Toro (Duplicate)
            456 => ['latitude' => 3.6, 'longitude' => -76.4167], // Andalucía (Duplicate)
            457 => ['latitude' => 3.8333, 'longitude' => -75.75], // Avaradó
            458 => ['latitude' => 3.3667, 'longitude' => -76.1333], // Avirama
            459 => ['latitude' => 3.5333, 'longitude' => -76.25], // Ayacucho
            460 => ['latitude' => 3.6, 'longitude' => -76.3], // Ayastán
            461 => ['latitude' => 3.35, 'longitude' => -76.15], // Ayatá
            462 => ['latitude' => 3.45, 'longitude' => -76.5333], // Ayatán
            463 => ['latitude' => 3.3333, 'longitude' => -76.4667], // Ayatena
            464 => ['latitude' => 3.1833, 'longitude' => -76.0333], // Ayatona
            465 => ['latitude' => 3.35, 'longitude' => -76.3167], // Ayatuy
            466 => ['latitude' => 3.8333, 'longitude' => -76.0167], // Trujillo (Duplicate - in Tolima)
        ];

        foreach ($coordinates as $municipalityId => $coords) {
            Municipality::where('id', $municipalityId)->update([
                'latitude' => $coords['latitude'],
                'longitude' => $coords['longitude'],
            ]);
        }

        $this->command->info('Municipality coordinates updated successfully!');
    }
}
