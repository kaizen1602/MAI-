import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Hook personalizado para invalidar el tamaño del mapa
const MapInvalidateSize: React.FC = () => {
  const map = useMap();
  
  useEffect(() => {
    // Pequeño delay para permitir que el DOM se renderice completamente
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [map]);
  
  return null;
};

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
        stat.latitude !== undefined && stat.longitude !== undefined && stat.latitude !== null && stat.longitude !== null &&
        !isNaN(parseFloat(stat.latitude.toString())) && !isNaN(parseFloat(stat.longitude.toString()))
      );
      console.log('Ubicaciones válidas:', validLocations);
      
      if (validLocations.length > 0) {
        const avgLat = validLocations.reduce((sum, stat) => sum + (stat.latitude ? parseFloat(stat.latitude.toString()) : 0), 0) / validLocations.length;
        const avgLng = validLocations.reduce((sum, stat) => sum + (stat.longitude ? parseFloat(stat.longitude.toString()) : 0), 0) / validLocations.length;
        
        // Validar que las coordenadas promedio sean números válidos
        if (!isNaN(avgLat) && !isNaN(avgLng) && isFinite(avgLat) && isFinite(avgLng)) {
          // Ampliar rangos razonables para América Latina
          if (avgLat >= -55 && avgLat <= 35 && avgLng >= -120 && avgLng <= -30) {
            setMapCenter([avgLat, avgLng]);
            setMapZoom(5);
          }
        }
      }
    }
  }, [locationStats]);

  // Filtrar ubicaciones con coordenadas válidas y dentro de rangos ampliados
  const validLocations = locationStats.filter(stat => {
    if (stat.latitude === undefined || stat.longitude === undefined || 
        stat.latitude === null || stat.longitude === null) {
      return false;
    }
    
    const lat = parseFloat(stat.latitude.toString());
    const lng = parseFloat(stat.longitude.toString());
    
    // Verificar que sean números válidos
    if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
      return false;
    }
    
    // Ampliar rangos para América Latina (más permisivo)
    return lat >= -55 && lat <= 35 && lng >= -120 && lng <= -30;
  });

  // Filtrar ubicaciones sin coordenadas o con coordenadas inválidas
  const locationsWithoutCoordinates = locationStats.filter(stat => {
    if (stat.latitude === undefined || stat.longitude === undefined || 
        stat.latitude === null || stat.longitude === null) {
      return true;
    }
    
    const lat = parseFloat(stat.latitude.toString());
    const lng = parseFloat(stat.longitude.toString());
    
    // Considerar inválidas si no son números o están fuera de rangos ampliados
    return isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng) ||
           lat < -55 || lat > 35 || lng < -120 || lng > -30;
  });

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-teal-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-xl shadow-md">
        <FaMapMarkedAlt className="mr-3 text-white" />
        Estadísticas por Ubicación en el Mapa
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-8 bg-white/70 dark:bg-gray-800/70 p-4 rounded-xl shadow-sm italic border-l-4 border-teal-500">
        Esta sección muestra un mapa interactivo con las ubicaciones geográficas de las publicaciones de compra y venta registradas en nuestra plataforma. Los marcadores indican la posición de cada municipio con el número de publicaciones y precio promedio. Esta información te ayuda a visualizar la distribución geográfica del comercio agrícola y tomar decisiones estratégicas basadas en la ubicación.
      </p>
      
      {validLocations.length === 0 && locationsWithoutCoordinates.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200 dark:border-gray-700">
          <div className="inline-block p-4 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4">
            <FaMapMarkedAlt className="text-4xl text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No hay datos de ubicaciones</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Actualmente no hay suficientes datos geográficos disponibles para mostrar en el mapa. 
            Publique productos con ubicaciones válidas para verlos aquí.
          </p>
        </div>
      ) : (
        <>
          {validLocations.length > 0 ? (
            <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-teal-200 dark:border-gray-700" style={{ height: '500px', width: '100%' }}>
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                className="rounded-xl"
                scrollWheelZoom={true}
                zoomControl={true}
              >
                <MapInvalidateSize />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {validLocations.map((stat, index) => {
                  console.log('Renderizando marcador:', stat);
                  // Validar que las coordenadas sean números válidos
                  let lat = null;
                  let lng = null;
                  
                  // Manejar diferentes formatos de coordenadas
                  if (stat.latitude !== undefined && stat.latitude !== null) {
                    if (typeof stat.latitude === 'number') {
                      lat = stat.latitude;
                    } else if (typeof stat.latitude === 'string') {
                      const parsed = parseFloat(stat.latitude);
                      if (!isNaN(parsed)) lat = parsed;
                    }
                  }
                  
                  if (stat.longitude !== undefined && stat.longitude !== null) {
                    if (typeof stat.longitude === 'number') {
                      lng = stat.longitude;
                    } else if (typeof stat.longitude === 'string') {
                      const parsed = parseFloat(stat.longitude);
                      if (!isNaN(parsed)) lng = parsed;
                    }
                  }
                  
                  // Verificar que las coordenadas sean válidas
                  if (lat === null || lng === null || isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
                    console.warn('Coordenadas inválidas para marcador:', stat);
                    return null;
                  }
                  
                  // Verificar que las coordenadas estén dentro de rangos ampliados para América Latina
                  if (lat < -55 || lat > 35 || lng < -120 || lng > -30) {
                    console.warn('Coordenadas fuera de rango para América Latina:', { lat, lng, stat });
                    return null;
                  }
                  
                  try {
                    return (
                      <Marker 
                        key={`marker-${index}`} 
                        position={[lat, lng]}
                      >
                        <Popup>
                          <div className="font-medium text-gray-800 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-64">
                            <h3 className="text-lg font-bold text-teal-700 dark:text-teal-300 mb-2">{stat.municipality}</h3>
                            <p className="text-gray-600 font-medium mb-3">{stat.department || 'Sin departamento'}</p>
                            <div className="space-y-2 bg-teal-50 dark:bg-gray-700 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-teal-600">Publicaciones:</span>
                                <span className="font-bold text-lg">{stat.total_posts}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-cyan-600">Precio promedio:</span>
                                <span className="font-bold text-lg">{formatPrice(stat.avg_price)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-indigo-600">Coordenadas:</span>
                                <span className="font-mono text-sm">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                              </div>
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
            <div className="text-center py-12 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-yellow-200 dark:border-orange-700">
              <div className="inline-block p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/50 mb-4">
                <FaMapMarkedAlt className="text-4xl text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Sin ubicaciones geográficas</h3>
              <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-4">
                No se encontraron ubicaciones con coordenadas válidas para mostrar en el mapa.
              </p>
              <div className="inline-flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm font-medium">
                <span className="mr-2">⚠️</span>
                Verifique las ubicaciones sin coordenadas abajo
              </div>
            </div>
          )}

          {/* Mostrar lista de ubicaciones sin coordenadas */}
          {locationsWithoutCoordinates.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-lg shadow-md">
                  Ubicaciones sin coordenadas disponibles:
                </h3>
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                  {locationsWithoutCoordinates.length} ubicaciones
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {locationsWithoutCoordinates.map((stat, index) => (
                  <div key={`missing-${index}`} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border border-yellow-200 dark:border-orange-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white">{stat.municipality}</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{stat.department || 'Sin departamento'}</p>
                      </div>
                      <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                        {stat.total_posts} publicaciones
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <p>Razón: {
                        stat.latitude === undefined || stat.latitude === null ? 
                        'Falta latitud' : 
                        stat.longitude === undefined || stat.longitude === null ? 
                        'Falta longitud' : 
                        'Coordenadas inválidas'
                      }</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <span className="font-semibold">ℹ️ Información:</span> Las ubicaciones sin coordenadas válidas no pueden mostrarse en el mapa. 
                  Esto puede deberse a que los datos geográficos no están completamente configurados en el sistema.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapChart;