import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AdBanner from "../components/AdBanner";
import statisticsService, {
  PriceStats,
  ProductStats,
  LocationStats,
} from "../data/services/StatisticsService";
import ChartTabs from "../components/ChartTabs";
import debugPostsData from "../debugPosts";

function Charts() {
  const [priceStats, setPriceStats] = useState<PriceStats[]>([]);
  const [productStats, setProductStats] = useState<ProductStats[]>([]);
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
    // Ejecutar la función de depuración
    debugPostsData();
  }, []);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const [priceData, productData, locationData] =
        await Promise.allSettled([
          statisticsService.getPriceStatistics(),
          statisticsService.getProductStatistics(),
          statisticsService.getLocationStatistics(),
        ]);

      setPriceStats(priceData.status === "fulfilled" ? priceData.value : []);
      setProductStats(
        productData.status === "fulfilled" ? productData.value : []
      );
      setLocationStats(
        locationData.status === "fulfilled" ? locationData.value : []
      );
    } catch (error) {
      console.error("Error loading statistics:", error);
      setPriceStats([]);
      setProductStats([]);
      setLocationStats([]);

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

      <div className="flex justify-center p-0 w-full">
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full">
          <div className="lg:w-3/4 w-full flex flex-col">
            <ChartTabs
              priceStats={priceStats}
              productStats={productStats}
              locationStats={locationStats}

              formatPrice={formatPrice}
            />
          </div>

          <aside className="hidden lg:block lg:w-1/4 w-full sticky top-24 h-fit max-h-screen overflow-hidden">
            <AdBanner />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Charts;