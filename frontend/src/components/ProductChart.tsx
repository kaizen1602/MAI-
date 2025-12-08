import React from "react";
import { FaSeedling } from "react-icons/fa";
import { ProductStats } from "../data/services/StatisticsService";

interface ProductChartProps {
  productStats: ProductStats[];
  formatPrice: (price: number) => string;
  formatNumber: (num: number) => string;
}

const ProductChart: React.FC<ProductChartProps> = ({ productStats, formatPrice, formatNumber }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-green-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl shadow-md">
        <FaSeedling className="mr-3 text-white" />
        Estadísticas por Tipo de Producto
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-8 bg-white/70 dark:bg-gray-800/70 p-4 rounded-xl shadow-sm italic border-l-4 border-green-500">
        Esta sección muestra estadísticas detalladas por tipo de producto basadas en las publicaciones de compra y venta registradas en nuestra plataforma. Incluye el total de publicaciones, cantidad total comercializada y precio promedio para cada tipo de producto. Esta información te ayuda a entender la demanda y oferta de diferentes productos en el mercado agrícola.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productStats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100 dark:border-gray-700"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-green-200 dark:border-gray-700">
              {stat.product_type}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Total Publicaciones:
                </span>
                <span className="font-bold text-green-600 text-lg">
                  {stat.total_posts}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Cantidad Total (kg):
                </span>
                <span className="font-bold text-emerald-600 text-lg">
                  {formatNumber(stat.total_quantity)}
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
    </div>
  );
};

export default ProductChart;