import React, { useState } from 'react';
import { LocationStats, ProductStats } from '../data/services/StatisticsService';
import PriceChart from './PriceChart';
import ProductChart from './ProductChart';
import LocationChart from './LocationChart';
import MapChart from './MapChart';
import { formatNumber } from '../utils/formatters';

interface ChartTabsProps {
  priceStats: any[];
  productStats: ProductStats[];
  locationStats: LocationStats[];
  formatPrice: (amount: number) => string;
}

const ChartTabs: React.FC<ChartTabsProps> = ({
  priceStats,
  productStats,
  locationStats,
  formatPrice
}) => {
  const [activeTab, setActiveTab] = useState('prices');

  // Definir las pestañas disponibles
  const tabs = [
    { id: 'prices', label: 'Precios', icon: '💰' },
    { id: 'products', label: 'Productos', icon: '🍎' },
    { id: 'locations', label: 'Ubicaciones', icon: '📍' },
    { id: 'locations-map', label: 'Mapa', icon: '🗺️' }
  ];

  // Agregar console.log para depuración
  console.log('Datos recibidos en ChartTabs:', { priceStats, productStats, locationStats });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur rounded-3xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
      <div className="text-center mb-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-4 shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center drop-shadow-lg">
          📊 Estadísticas del Mercado
        </h1>
        <p className="text-blue-100 text-lg font-medium">
          Análisis de precios y estadísticas del mercado agrícola
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 w-full mt-6">
        {/* Columna izquierda - Navegación de pestañas (estática) */}
        <div className="lg:w-1/5 w-full">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-5 sticky top-24 shadow-lg border border-blue-100 dark:border-gray-700">

            <div className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-4 py-4 rounded-xl font-semibold transition-all text-left transform hover:scale-[1.02] ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow'
                  }`}
                >
                  <span className="mr-3 text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Contenido seleccionado */}
        <div className="lg:w-4/5 w-full">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-gray-700">
            {activeTab === 'prices' && (
              <PriceChart priceStats={priceStats} formatPrice={formatPrice} />
            )}
            
            {activeTab === 'products' && (
              <ProductChart productStats={productStats} formatPrice={formatPrice} formatNumber={formatNumber} />
            )}
            
            {activeTab === 'locations' && (
              <LocationChart locationStats={locationStats} formatPrice={formatPrice} />
            )}
            
            {activeTab === 'locations-map' && (
              <MapChart locationStats={locationStats} formatPrice={formatPrice} />
            )}
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartTabs;