/**
 * Market Insights Dashboard
 *
 * Comprehensive dashboard showing:
 * - Market overview statistics
 * - Trending products (up/down)
 * - Volatile and stable products
 * - Category trends
 * - Price history charts
 */

import React, { useState, useEffect } from 'react';
import PricingService from '../data/services/PricingService';
import {
  MarketOverviewResponse,
  TrendingProduct,
  VolatileProduct,
  CategorySummary,
  TrendDirection,
  formatCOP,
  getTrendArrow,
} from '../data/types/pricing.types';

interface MarketInsightsDashboardProps {
  className?: string;
}

const MarketInsightsDashboard: React.FC<MarketInsightsDashboardProps> = ({
  className = '',
}) => {
  const [overview, setOverview] = useState<MarketOverviewResponse | null>(null);
  const [increasingPrices, setIncreasingPrices] = useState<TrendingProduct[]>([]);
  const [decreasingPrices, setDecreasingPrices] = useState<TrendingProduct[]>([]);
  const [volatileProducts, setVolatileProducts] = useState<VolatileProduct[]>([]);
  const [stableProducts, setStableProducts] = useState<VolatileProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trends' | 'volatility' | 'categories'>(
    'trends'
  );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load all data in parallel
      const [overviewData, increasing, decreasing, volatile, stable] =
        await Promise.all([
          PricingService.getMarketOverview(30),
          PricingService.getIncreasingPrices({ days: 30, limit: 10 }),
          PricingService.getDecreasingPrices({ days: 30, limit: 10 }),
          PricingService.getVolatileProducts({ days: 30, limit: 10 }),
          PricingService.getStableProducts({ days: 30, limit: 10 }),
        ]);

      setOverview(overviewData);
      setIncreasingPrices(increasing.increasing_products);
      setDecreasingPrices(decreasing.decreasing_products);
      setVolatileProducts(volatile.volatile_products);
      setStableProducts(stable.stable_products);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-12 ${className}`}>
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando insights del mercado...</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-6 ${className}`}>
        <p className="text-red-800">Error al cargar datos del mercado</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">
          📊 Insights del Mercado Agropecuario
        </h1>
        <p className="text-purple-100">
          Análisis basado en datos de Corabastos - Últimos{' '}
          {overview.period_days} días
        </p>
        <p className="mt-1 text-sm text-purple-200">
          Última actualización: {new Date(overview.latest_ingestion).toLocaleDateString('es-CO')}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="📦"
          title="Productos"
          value={overview.overview.total_products.toLocaleString()}
          subtitle="en el catálogo"
          color="bg-blue-500"
        />
        <StatCard
          icon="📈"
          title="Registros"
          value={overview.overview.total_price_records.toLocaleString()}
          subtitle="precios registrados"
          color="bg-green-500"
        />
        <StatCard
          icon="💰"
          title="Precio Promedio"
          value={formatCOP(overview.overview.average_price)}
          subtitle="precio promedio"
          color="bg-purple-500"
        />
        <StatCard
          icon="📊"
          title="Tendencias"
          value={`${overview.overview.trend_distribution.UP} ↗️ | ${overview.overview.trend_distribution.DOWN} ↘️`}
          subtitle="subiendo | bajando"
          color="bg-orange-500"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4">
          <TabButton
            active={activeTab === 'trends'}
            onClick={() => setActiveTab('trends')}
            icon="📈"
            label="Tendencias de Precio"
          />
          <TabButton
            active={activeTab === 'volatility'}
            onClick={() => setActiveTab('volatility')}
            icon="⚡"
            label="Volatilidad"
          />
          <TabButton
            active={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
            icon="🏷️"
            label="Categorías"
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'trends' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Increasing Prices */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
              <span className="mr-2 text-2xl">↗️</span>
              Precios en Alza
            </h3>
            <div className="space-y-3">
              {increasingPrices.length > 0 ? (
                increasingPrices.map((product, index) => (
                  <TrendingProductCard
                    key={index}
                    product={product}
                    direction="up"
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No hay productos con precios en alza
                </p>
              )}
            </div>
          </div>

          {/* Decreasing Prices */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
              <span className="mr-2 text-2xl">↘️</span>
              Precios a la Baja
            </h3>
            <div className="space-y-3">
              {decreasingPrices.length > 0 ? (
                decreasingPrices.map((product, index) => (
                  <TrendingProductCard
                    key={index}
                    product={product}
                    direction="down"
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No hay productos con precios a la baja
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'volatility' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Volatile Products */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
              <span className="mr-2 text-2xl">⚡</span>
              Mayor Volatilidad
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Productos con mayores fluctuaciones de precio
            </p>
            <div className="space-y-3">
              {volatileProducts.length > 0 ? (
                volatileProducts.map((product, index) => (
                  <VolatileProductCard key={index} product={product} />
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay datos disponibles</p>
              )}
            </div>
          </div>

          {/* Stable Products */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
              <span className="mr-2 text-2xl">🔒</span>
              Precios Estables
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Productos con menores fluctuaciones de precio
            </p>
            <div className="space-y-3">
              {stableProducts.length > 0 ? (
                stableProducts.map((product, index) => (
                  <VolatileProductCard key={index} product={product} isStable />
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay datos disponibles</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">
            Distribución por Categorías
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {overview.categories.map((category, index) => (
              <CategoryCard
                key={index}
                category={category}
                isSelected={selectedCategory === category.category}
                onClick={() => setSelectedCategory(category.category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Variation Distribution */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-800">
          Distribución de Variación de Precios
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <VariationCard
            label="Estable"
            count={overview.overview.price_variation_distribution.Estable}
            color="bg-blue-500"
            icon="→"
          />
          <VariationCard
            label="Bajó"
            count={overview.overview.price_variation_distribution.Bajo}
            color="bg-green-500"
            icon="↘️"
          />
          <VariationCard
            label="Subió"
            count={overview.overview.price_variation_distribution.Subio}
            color="bg-red-500"
            icon="↗️"
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components

const StatCard: React.FC<{
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}> = ({ icon, title, value, subtitle, color }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-800">{value}</p>
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className={`rounded-full ${color} p-3`}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </div>
);

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
      active
        ? 'border-purple-600 text-purple-600'
        : 'border-transparent text-gray-600 hover:text-gray-800'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

const TrendingProductCard: React.FC<{
  product: TrendingProduct;
  direction: 'up' | 'down';
}> = ({ product, direction }) => (
  <div className="flex items-center justify-between rounded border border-gray-100 p-3 hover:bg-gray-50">
    <div className="flex-1">
      <p className="font-medium text-gray-800">{product.product.name}</p>
      <p className="text-xs text-gray-500">{product.product.category}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-gray-800">
        {formatCOP(product.avg_price)}
      </p>
      <p
        className={`text-xs font-semibold ${direction === 'up' ? 'text-red-600' : 'text-green-600'}`}
      >
        {direction === 'up' ? product.avg_increase : product.avg_decrease}
      </p>
    </div>
  </div>
);

const VolatileProductCard: React.FC<{
  product: VolatileProduct;
  isStable?: boolean;
}> = ({ product, isStable = false }) => (
  <div className="flex items-center justify-between rounded border border-gray-100 p-3 hover:bg-gray-50">
    <div className="flex-1">
      <p className="font-medium text-gray-800">{product.product.name}</p>
      <p className="text-xs text-gray-500">{product.product.category}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-gray-800">
        {formatCOP(product.avg_volatility)}
      </p>
      <p className={`text-xs ${isStable ? 'text-green-600' : 'text-orange-600'}`}>
        {product.avg_change_percentage.toFixed(1)}% cambio
      </p>
    </div>
  </div>
);

const CategoryCard: React.FC<{
  category: CategorySummary;
  isSelected: boolean;
  onClick: () => void;
}> = ({ category, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-lg border-2 p-4 text-left transition-all ${
      isSelected
        ? 'border-purple-600 bg-purple-50'
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}
  >
    <p className="font-bold text-gray-800">{category.category}</p>
    <p className="mt-1 text-2xl font-bold text-purple-600">
      {category.product_count}
    </p>
    <p className="text-xs text-gray-500">productos</p>
  </button>
);

const VariationCard: React.FC<{
  label: string;
  count: number;
  color: string;
  icon: string;
}> = ({ label, count, color, icon }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-800">
          {count.toLocaleString()}
        </p>
      </div>
      <div className={`rounded-full ${color} px-3 py-1`}>
        <span className="text-xl text-white">{icon}</span>
      </div>
    </div>
  </div>
);

export default MarketInsightsDashboard;
