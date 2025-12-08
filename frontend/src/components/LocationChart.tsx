import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LocationStats } from "../data/services/StatisticsService";

interface LocationChartProps {
  locationStats: LocationStats[];
  formatPrice: (price: number) => string;
}

const LocationChart: React.FC<LocationChartProps> = ({
  locationStats,
  formatPrice,
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-purple-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3 rounded-xl shadow-md">
        <FaMapMarkerAlt className="mr-3 text-white" />
        Estadísticas por Ubicación
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-8 bg-white/70 dark:bg-gray-800/70 p-4 rounded-xl shadow-sm italic border-l-4 border-purple-500">
        Esta sección muestra estadísticas por ubicación geográfica basadas en las publicaciones de compra y venta registradas en nuestra plataforma. Incluye el total de publicaciones y precio promedio para cada municipio y departamento. Esta información te ayuda a identificar las zonas con mayor actividad comercial y entender las variaciones de precios por región.
      </p>
      
      {locationStats.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">
            No hay datos de ubicaciones disponibles
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locationStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 pb-2 border-b border-purple-200 dark:border-gray-700">
                {stat.municipality}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium bg-purple-50 dark:bg-gray-700 p-2 rounded-lg">{stat.department}</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Total Publicaciones:
                  </span>
                  <span className="font-bold text-purple-600 text-lg">
                    {stat.total_posts}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Precio Promedio:
                  </span>
                  <span className="font-bold text-indigo-600 text-lg">
                    {formatPrice(stat.avg_price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationChart;