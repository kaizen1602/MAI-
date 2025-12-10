<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Municipality;

class DepartmentMunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $depts = [
            'Amazonas' => ['Leticia', 'Puerto Nariño'],
            'Antioquia' => ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Sabaneta', 'La Estrella', 'Caldas', 'Rionegro', 'Guarne', 'La Ceja', 'Retiro', 'Sonsón', 'Andes', 'Jericó', 'Abejorral', 'Marinilla', 'El Santuario', 'Amagá', 'Amalfi', 'Anza', 'Arboletes', 'Argelia', 'Barbosa', 'Belmira', 'Betania', 'Betulia', 'Bolívar', 'Briceño', 'Buriticá', 'Carepa', 'Carolina', 'Caucasia', 'Chigorodó', 'Chinchiná', 'Cocora', 'Concepción', 'Condoto', 'Copacabana', 'Coromoro', 'Corrales'],
            'Arauca' => ['Arauca', 'Arauquita', 'Cravo Norte', 'Fortul', 'Puerto Rondón', 'Saravena', 'Tame'],
            'Atlántico' => ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia', 'Galapa', 'Juan de Acosta', 'Luruaco', 'Piojó', 'Polonuevo', 'Ponedera', 'Sabanalarga', 'Santa Lucía', 'Santo Tomás', 'Suán', 'Tubará', 'Usiacurí'],
            'Bolívar' => ['Cartagena', 'Turbaco', 'Arjona', 'Clemencia', 'Magangué', 'Mompos', 'San Jacinto', 'Talaigua Nuevo', 'Tiquisio', 'Villanueva', 'Achí', 'Alcalá', 'Arenal', 'Bolívar', 'Calamar', 'Cantagallo', 'Cicuco', 'Córdoba', 'El Guamo', 'El Peñol'],
            'Boyacá' => ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Puerto Boyacá', 'Ramiriquí', 'Santa Rosa de Viterbo', 'Ventaquemada', 'Otanche', 'Tenza', 'Umbita', 'Zetaquira', 'Aquitania', 'Belén', 'Berbeo', 'Betéitiva', 'Boavita', 'Buenavista', 'Busbanzá'],
            'Caldas' => ['Manizales', 'Chinchiná', 'Villamaría', 'Neira', 'Palestina', 'Aguadas', 'Aránzazu', 'Marmato', 'Marquetalia', 'Marulanda', 'Riosucio', 'Salamina', 'Supía'],
            'Caquetá' => ['Florencia', 'La Montañita', 'Cartagena del Chairá', 'El Doncello', 'El Paujil', 'Milán', 'Morelia', 'Puerto Rico', 'San Filemón', 'San Vicente del Caguán', 'Solano', 'Valparaíso'],
            'Cauca' => ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Piendamó', 'Totoró', 'Caloto', 'Miranda', 'Jambaló', 'Páez', 'Silvia', 'Bolívar', 'Balboa', 'Buenos Aires', 'Cajibío', 'Caldono', 'Corinto', 'El Tambo', 'Guachené', 'Guapi', 'Inzá', 'Ipiales', 'Jambalo'],
            'Cesar' => ['Valledupar', 'Aguachica', 'Agustín Codazzi', 'Astrea', 'Becerril', 'Bosconia', 'Chimichagua', 'Chiriguana', 'Curumaní', 'El Copey', 'Gamarra', 'González', 'La Jagua de Ibirico', 'Manaure', 'Pailitas', 'Pelaya', 'Pueblo Bello', 'Rectora', 'La Paz', 'San Alberto'],
            'Chocó' => ['Quibdó', 'Acandí', 'Atrato', 'Bagadó', 'Bahía', 'Bajo Baudó', 'Bellaluz', 'Bojaya', 'Cantón de San Pablo', 'Capurganá', 'Cárcamo', 'Certegui', 'Condoto', 'El Carmen de Atrato', 'Istmina', 'Juradó', 'Lloró', 'Medio Atrato', 'Medio Baudó', 'Nóvita'],
            'Córdoba' => ['Montería', 'Cereté', 'Lorica', 'Chinú', 'Puerto Escondido', 'Planeta Rica', 'Tierralta', 'Ayapel', 'Buenavista', 'Canalete', 'Carrillo', 'Chima', 'Cotorra', 'La Apartada', 'Montelíbano', 'Moñitos', 'Mutatá', 'Purísima', 'Sahagún', 'San Andrés de Sotavento'],
            'Cundinamarca' => ['Bogotá D.C.', 'Soacha', 'Zipaquirá', 'Facatativá', 'Girardot', 'Fusagasugá', 'Villavicencio', 'Chía', 'Mosquera', 'Cota', 'Tabio', 'Tenjo', 'Tocancipá', 'Ubaté', 'Tena', 'El Colegio', 'Nariño', 'Silvania', 'Une', 'Arbeláez'],
            'Guaviare' => ['San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores'],
            'Guainía' => ['Inírida', 'Barranco Minas', 'Maicao', 'Puerto Colombia', 'San Felipe'],
            'Huila' => ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Palermo', 'Hobo', 'Aipe', 'Algeciras', 'Altamira', 'Baraya', 'Campoalegre', 'Colombia', 'Elías', 'Guadalupe', 'Iquira', 'Isnos', 'Nataga', 'Oporapa', 'Paicol', 'Palestina'],
            'La Guajira' => ['Riohacha', 'Maicao', 'Uribia', 'Hatonuevo', 'Dibulla', 'Fonseca', 'Distracción', 'El Molino', 'González', 'Barrancas', 'Villanueva', 'Manaure', 'Urumita', 'San Juan del Cesar', 'Albania'],
            'Magdalena' => ['Santa Marta', 'Ciénaga', 'Fundación', 'Aracataca', 'Pueblo Viejo', 'Ariguaní', 'Algarrobo', 'Amaranto', 'Astrea', 'Augura', 'Bañada', 'Baranoa', 'Barranquilla', 'Bayunca', 'Belén', 'Bendición'],
            'Meta' => ['Villavicencio', 'Acacías', 'Restrepo', 'Granada', 'Guamal', 'Cumaral', 'La Uribe', 'Mapiripán', 'Castilla la Nueva', 'Fuentedeoro', 'Lejanías', 'Puerto Lleras', 'Puerto López', 'Mesetas', 'El Calvario', 'La Macarena'],
            'Nariño' => ['Pasto', 'Ipiales', 'Tumaco', 'Buesaco', 'Cumbal', 'Pupiales', 'Tangua', 'Potosí', 'Córdoba', 'Guaitarilla', 'Guachucal', 'Guanacas', 'La Llanada', 'La Cruz', 'La Tola', 'Linares', 'Los Andes', 'Magui', 'Mallama', 'Milagros'],
            'Norte de Santander' => ['Cúcuta', 'Los Patios', 'Villa del Rosario', 'Pamplona', 'Ocaña', 'Teorama', 'Ábrego', 'Arboledas', 'Bojacá', 'Bucaramanga', 'Cácota', 'Caicara', 'Calamar', 'Calderas', 'Cali', 'Calima', 'Capacho Nuevo', 'Colón', 'Convención', 'Cucutilla'],
            'Putumayo' => ['Mocoa', 'Sibundoy', 'Puerto Asís', 'Puerto Caicedo', 'Orito', 'Valle del Guamuez', 'San Miguel', 'Leguízamo', 'Villagarzón', 'Colón', 'Santiago', 'Tesalia'],
            'Quindío' => ['Armenia', 'Pereira', 'Circasia', 'Cordobía', 'Filandia', 'Génova', 'La Tebaida', 'Montenegro', 'Pijao', 'Quimbaya', 'Salento', 'Tebaida'],
            'Risaralda' => ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'Mistrató', 'Apia', 'Balboa', 'Belén de Umbría', 'Guática', 'La Celia', 'La Virginia', 'Marsella', 'Otú', 'Quinchía', 'Santuario'],
            'Santander' => ['Bucaramanga', 'Girón', 'Floridablanca', 'Piedecuesta', 'Socorro', 'San Gil', 'Barichara', 'Málaga', 'Barbosa', 'Barrancabermeja', 'Cabrera', 'Capitanejo', 'Carcasí', 'Charala', 'Charta', 'Chima', 'Chipata', 'Ciénaga', 'Colosó', 'Concepción'],
            'Sucre' => ['Sincelejo', 'Corozal', 'Tolú', 'Coveñas', 'Palmito', 'Sampués', 'Sincé', 'Toluvejillo', 'Arboleda', 'Betulia', 'Buenavista', 'Caimito', 'Carrillo', 'Chalán', 'Chima', 'Chinchorros', 'Colosó', 'Coveñas', 'El Roble', 'Galeras'],
            'Tolima' => ['Ibagué', 'Espinal', 'Melgar', 'Mariquita', 'Honda', 'Armero-Guayabetá', 'Alvarado', 'Alpujarra', 'Ambalema', 'Amoyá', 'Anzoátegui', 'Apia', 'Arcabuco', 'Arenaza', 'Argelia', 'Armadillo', 'Armero', 'Arturo', 'Aserradero', 'Aspasica'],
            'Valle del Cauca' => ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Buga', 'Cartago', 'Yumbo', 'Jamundí', 'Candelaria', 'Ginebra', 'Guacari', 'La Cumbre', 'La Unión', 'Obando', 'Pradera', 'Riofrío', 'Roldanillo', 'San Pedro', 'Sevilla', 'Trujillo'],
            'Vaupés' => ['Mitú', 'Caruru'],
            'Vichada' => ['Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo']
        ];

        foreach ($depts as $dept => $munis) {
            $department = Department::updateOrCreate(['name' => $dept], []);
            foreach ($munis as $muni) {
                Municipality::updateOrCreate(
                    ['name' => $muni, 'department_id' => $department->id],
                    []
                );
            }
        }
    }
}
