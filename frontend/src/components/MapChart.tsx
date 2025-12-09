import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { LocationStats } from '../data/services/StatisticsService';


// Solucionar problema de iconos por defecto en Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapChartProps {
  locationStats: LocationStats[];
  formatPrice: (amount: number) => string;
}

const MapChart: React.FC<MapChartProps> = ({ locationStats, formatPrice }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([4.5709, -74.2973]); // Centro de Colombia
  const [mapZoom, setMapZoom] = useState<number>(5);

  // Calcular centro del mapa basado en las coordenadas promedio
  useEffect(() => {
    console.log('LocationStats recibidos:', locationStats);
    if (locationStats.length > 0) {
      const validLocations = locationStats.filter(stat => 
        stat.latitude !== undefined && stat.longitude !== undefined && stat.latitude !== null && stat.longitude !== null
      );
      console.log('Ubicaciones válidas:', validLocations);
      
      if (validLocations.length > 0) {
        const avgLat = validLocations.reduce((sum, stat) => sum + (stat.latitude || 0), 0) / validLocations.length;
        const avgLng = validLocations.reduce((sum, stat) => sum + (stat.longitude || 0), 0) / validLocations.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(6);
      }
    }
  }, [locationStats]);

  // Filtrar ubicaciones con coordenadas válidas
  const validLocations = locationStats.filter(stat => 
    stat.latitude !== undefined && stat.longitude !== undefined && stat.latitude !== null && stat.longitude !== null
  );

  // Filtrar ubicaciones sin coordenadas
  const locationsWithoutCoordinates = locationStats.filter(stat => 
    stat.latitude === undefined || stat.longitude === undefined || stat.latitude === null || stat.longitude === null
  );

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-teal-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-xl shadow-md">
        <FaMapMarkedAlt className="mr-3 text-white" />
        Estadísticas por Ubicación en el Mapa
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-8 bg-white/70 dark:bg-gray-800/70 p-4 rounded-xl shadow-sm italic border-l-4 border-teal-500">
        Esta sección muestra un mapa interactivo con las ubicaciones geográficas de las publicaciones de compra y venta registradas en nuestra plataforma. Los marcadores indican la posición de cada municipio con el número de publicaciones y precio promedio. Esta información te ayuda a visualizar la distribución geográfica del comercio agrícola y tomar decisiones estratégicas basadas en la ubicación.
      </p>
      
      {validLocations.length === 0 && locationsWithoutCoordinates.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">
            No hay datos de ubicaciones disponibles
          </p>
        </div>
      ) : (
        <>
          {validLocations.length > 0 ? (
            <div className="h-96 rounded-2xl overflow-hidden shadow-lg border-2 border-teal-200 dark:border-gray-700">
              <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                style={{ height: '100%', width: '100%' }}
                className="rounded-xl"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {validLocations.map((stat, index) => {
                  console.log('Renderizando marcador:', stat);
                  // Validar que las coordenadas sean números válidos
                  const lat = stat.latitude !== undefined && stat.latitude !== null ? 
                    parseFloat(stat.latitude.toString()) : null;
                  const lng = stat.longitude !== undefined && stat.longitude !== null ? 
                    parseFloat(stat.longitude.toString()) : null;
                  
                  // Verificar que las coordenadas sean válidas
                  if (lat === null || lng === null || isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
                    console.warn('Coordenadas inválidas para marcador:', stat);
                    return null;
                  }
                  
                  // Verificar que las coordenadas estén dentro de rangos razonables para Colombia
                  if (lat < -4.2 || lat > 12.5 || lng < -81.7 || lng > -66.8) {
                    console.warn('Coordenadas fuera de rango para Colombia:', { lat, lng, stat });
                    return null;
                  }
                  
                  try {
                    return (
                      <Marker 
                        key={`marker-${index}`} 
                        position={[lat, lng]}
                      >
                        <Popup>
                          <div className="font-medium text-gray-800 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-teal-700 dark:text-teal-300">{stat.municipality}</h3>
                            <p className="text-gray-600 font-medium">{stat.department}</p>
                            <div className="mt-2 space-y-1 bg-teal-50 dark:bg-gray-700 p-2 rounded">
                              <p className="text-sm">
                                <span className="font-semibold text-teal-600">Publicaciones:</span> <span className="font-bold">{stat.total_posts}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-semibold text-cyan-600">Precio promedio:</span> <span className="font-bold">{formatPrice(stat.avg_price)}</span>
                              </p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  } catch (error) {
                    console.error('Error al renderizar marcador:', error, stat);
                    return null;
                  }
                })}
              </MapContainer>
            </div>
          ) : (
            <div className="text-center py-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                No hay ubicaciones con coordenadas disponibles para mostrar en el mapa
              </p>
            </div>
          )}

          {/* Mostrar lista de ubicaciones sin coordenadas */}
          {locationsWithoutCoordinates.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-2 rounded-lg shadow-md">
                Ubicaciones sin coordenadas disponibles:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {locationsWithoutCoordinates.map((stat, index) => (
                  <div key={`missing-${index}`} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border border-yellow-200 dark:border-orange-800 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-800 dark:text-white">{stat.municipality}</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{stat.department}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapChart;