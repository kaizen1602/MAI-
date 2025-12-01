import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaMapMarkerAlt,
  FaDollarSign,
  FaSeedling,
  FaUsers,
  FaBox,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import AdBanner from "../components/AdBanner";
import ColombiaMap from "../components/ColombiaMap";
import statisticsService, {
  PriceStats,
  ProductStats,
  LocationStats,
  MarketTrends,
} from "../data/services/StatisticsService";

function Charts() {
  const [priceStats, setPriceStats] = useState<PriceStats[]>([]);
  const [productStats, setProductStats] = useState<ProductStats[]>([]);
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrends[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("prices");

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const [priceData, productData, locationData, trendsData] =
        await Promise.allSettled([
          statisticsService.getPriceStatistics(),
          statisticsService.getProductStatistics(),
          statisticsService.getLocationStatistics(),
          statisticsService.getMarketTrends(),
        ]);

      setPriceStats(priceData.status === "fulfilled" ? priceData.value : []);
      setProductStats(
        productData.status === "fulfilled" ? productData.value : []
      );
      setLocationStats(
        locationData.status === "fulfilled" ? locationData.value : []
      );
      setMarketTrends(
        trendsData.status === "fulfilled" ? trendsData.value : []
      );
    } catch (error) {
      console.error("Error loading statistics:", error);
      setPriceStats([]);
      setProductStats([]);
      setLocationStats([]);
      setMarketTrends([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("es-CO").format(num);

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300 dark:bg-gray-900"
        style={{ backgroundImage: "url('/fondoMuro.jpg')" }}
      >
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="flex justify-center p-4 lg:p-6 w-full">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl">
            <div className="lg:w-2/3 w-full flex flex-col">
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-blue-700 text-lg">
                    Cargando estadísticas...
                  </p>
                </div>
              </div>
            </div>
            <aside className="hidden lg:block lg:w-1/3 w-full">
              <AdBanner />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300 dark:bg-gray-900"
      style={{ backgroundImage: "url('/fondoMuro.jpg')" }}
    >
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex justify-center p-4 lg:p-6 w-full">
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl">
          <div className="lg:w-2/3 w-full flex flex-col">
            <div className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-md p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center justify-center">
                  <FaChartLine className="mr-3" />
                  Estadísticas del Mercado
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Análisis de precios y tendencias del mercado agrícola
                </p>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap justify-center mb-8">
                {[
                  { id: "prices", label: "Precios", icon: FaDollarSign },
                  { id: "products", label: "Productos", icon: FaSeedling },
                  {
                    id: "locations",
                    label: "Ubicaciones",
                    icon: FaMapMarkerAlt,
                  },
                  { id: "trends", label: "Tendencias", icon: FaChartLine },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 m-2 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    <tab.icon className="mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Resumen eliminado por solicitud */}

              {/* Prices */}
              {activeTab === "prices" && (
                <div className="bg-blue-50 dark:bg-gray-700 rounded-xl shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                    <FaDollarSign className="mr-3 text-blue-600" />
                    Análisis de Precios por Producto
                  </h2>
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
                          className="bg-white dark:bg-gray-800 rounded-lg p-6"
                        >
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            {stat.product_name}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Precio Mínimo:
                              </span>
                              <span className="font-semibold text-blue-600">
                                {formatPrice(stat.min_price)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Precio Máximo:
                              </span>
                              <span className="font-semibold text-indigo-600">
                                {formatPrice(stat.max_price)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Precio Promedio:
                              </span>
                              <span className="font-semibold text-sky-600">
                                {formatPrice(stat.avg_price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Products */}
              {activeTab === "products" && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaSeedling className="mr-3 text-blue-600" />
                    Estadísticas por Tipo de Producto
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productStats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6"
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                          {stat.product_type}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total Publicaciones:
                            </span>
                            <span className="font-semibold text-blue-600">
                              {stat.total_posts}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Cantidad Total (kg):
                            </span>
                            <span className="font-semibold text-indigo-600">
                              {formatNumber(stat.total_quantity)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Precio Promedio:
                            </span>
                            <span className="font-semibold text-sky-600">
                              {formatPrice(stat.avg_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations - Choropleth Map */}
              {activeTab === "locations" && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaMapMarkerAlt className="mr-3 text-blue-600" />
                    Estadísticas por Ubicación
                  </h2>

                  {locationStats.length > 0 ? (
                    <div className="flex flex-col items-center">
                      <ColombiaMap
                        data={locationStats}
                        valueKey="avg_price"
                        onClickDepartment={(dept) => {
                          console.log('Departamento clicado:', dept);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-600">No hay datos de ubicación disponibles</p>
                    </div>
                  )}
                </div>
              )}

              {/* Trends */}
              {activeTab === "trends" && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaChartLine className="mr-3 text-blue-600" />
                    Tendencias del Mercado
                  </h2>
                  <div className="space-y-4">
                    {marketTrends.map((trend, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-4"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {new Date(trend.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-blue-600">
                              {trend.total_posts}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Publicaciones
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-sky-600">
                              {formatPrice(trend.avg_price)}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Precio Promedio
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-indigo-600">
                              {formatNumber(trend.total_quantity)}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Cantidad (kg)
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="hidden lg:block lg:w-1/3 w-full">
            <AdBanner />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Charts;
