import React from "react";
import { FaDollarSign } from "react-icons/fa";
import { PriceStats } from "../data/services/StatisticsService";

interface PriceChartProps {
  priceStats: PriceStats[];
  formatPrice: (price: number) => string;
}

const PriceChart: React.FC<PriceChartProps> = ({ priceStats, formatPrice }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-blue-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl shadow-md">
        <FaDollarSign className="mr-3 text-white" />
        Análisis de Precios por Producto
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-8 bg-white/70 dark:bg-gray-800/70 p-4 rounded-xl shadow-sm italic border-l-4 border-blue-500">
        Esta sección muestra el análisis de precios para diferentes productos en el mercado agrícola, basado en las publicaciones de compra y venta registradas en nuestra plataforma. Incluye el precio mínimo, máximo y promedio registrado para cada producto. Esta información te ayuda a entender las tendencias de precios actuales, identificar oportunidades de compra o venta competitivas, y tomar decisiones informadas sobre tus transacciones agrícolas.
      </p>
      {priceStats.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">
            No hay datos de precios disponibles
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {priceStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-blue-100 dark:border-gray-700">
                {stat.product_name}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Precio Mínimo:
                  </span>
                  <span className="font-bold text-blue-600 text-lg">
                    {formatPrice(stat.min_price)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Precio Máximo:
                  </span>
                  <span className="font-bold text-indigo-600 text-lg">
                    {formatPrice(stat.max_price)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-sky-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Precio Promedio:
                  </span>
                  <span className="font-bold text-sky-600 text-lg">
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

export default PriceChart;