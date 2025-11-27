<?php

namespace App\Services;

use App\Models\MarketPrice;
use App\Models\ProductCatalog;
use App\Models\Recommendation;
use Carbon\Carbon;

/**
 * PriceComparisonService
 *
 * Servicio para comparar precios de usuario con precios de mercado
 */
class PriceComparisonService
{
    // Recommendation thresholds (percentages)
    const THRESHOLD_VERY_LOW = -30;
    const THRESHOLD_LOW = -10;
    const THRESHOLD_HIGH = 10;
    const THRESHOLD_VERY_HIGH = 30;

    /**
     * Compare user price with market prices.
     *
     * @param int $productCatalogId
     * @param float $userPrice
     * @param int $days
     * @return array
     */
    public function comparePrice(int $productCatalogId, float $userPrice, int $days = 30, string $context = 'sell'): array
    {
        // Get market statistics
        $marketStats = $this->getMarketStatistics($productCatalogId, $days);

        if (!$marketStats || $marketStats['avg_price'] === null) {
            return [
                'has_data' => false,
                'recommendation_type' => Recommendation::TYPE_NO_DATA,
                'message' => 'No hay suficientes datos de mercado para este producto.'
            ];
        }

        // Calculate difference
        $avgPrice = $marketStats['avg_price'];
        $diffPercentage = (($userPrice - $avgPrice) / $avgPrice) * 100;

        // Generate recommendation
        $recommendation = $this->generateRecommendation(
            $userPrice,
            $avgPrice,
            $marketStats['min_price'],
            $marketStats['max_price'],
            $diffPercentage,
            $context
        );

        return [
            'has_data' => true,
            'user_price' => $userPrice,
            'market_avg_price' => round($avgPrice, 0),
            'market_min_price' => round($marketStats['min_price'], 0),
            'market_max_price' => round($marketStats['max_price'], 0),
            'difference_percentage' => round($diffPercentage, 2),
            'recommendation_type' => $recommendation['type'],
            'suggestion_text' => $recommendation['text'],
            'recommendation_color' => $recommendation['color'],
            'icon' => $recommendation['icon'],
            'data_points' => $marketStats['data_points'],
            'period_days' => $days
        ];
    }

    /**
     * Get market statistics for a product.
     *
     * @param int $productCatalogId
     * @param int $days
     * @return array|null
     */
    protected function getMarketStatistics(int $productCatalogId, int $days): ?array
    {
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        $stats = MarketPrice::where('product_catalog_id', $productCatalogId)
            ->where('date', '>=', $fromDate)
            ->selectRaw('
                AVG(price_unit) as avg_price,
                MIN(price_unit) as min_price,
                MAX(price_unit) as max_price,
                STDDEV(price_unit) as volatility,
                COUNT(*) as data_points
            ')
            ->first();

        if (!$stats || $stats->data_points === 0) {
            return null;
        }

        return [
            'avg_price' => (float) $stats->avg_price,
            'min_price' => (float) $stats->min_price,
            'max_price' => (float) $stats->max_price,
            'volatility' => (float) ($stats->volatility ?? 0),
            'data_points' => (int) $stats->data_points
        ];
    }

    /**
     * Generate recommendation based on price difference.
     *
     * @param float $userPrice
     * @param float $avgPrice
     * @param float $minPrice
     * @param float $maxPrice
     * @param float $diffPercentage
     * @return array
     */
    protected function generateRecommendation(
        float $userPrice,
        float $avgPrice,
        float $minPrice,
        float $maxPrice,
        float $diffPercentage,
        string $context = 'sell'
    ): array {
        $formattedAvg = number_format($avgPrice, 0, ',', '.');
        $formattedDiff = number_format(abs($diffPercentage), 1, ',', '.');
        $isBuying = $context === 'buy';

        if ($diffPercentage < self::THRESHOLD_VERY_LOW) {
            return [
                'type' => Recommendation::TYPE_VERY_LOW,
                'text' => $isBuying
                    ? "⚠️ Tu oferta está MUY por debajo del mercado (-{$formattedDiff}%). Será difícil que los proveedores la acepten. Considera ofertar cerca de \${$formattedAvg} para asegurar la compra."
                    : "⚠️ Tu precio está MUY por debajo del mercado (-{$formattedDiff}%). Podrías aumentarlo hasta \${$formattedAvg} sin perder competitividad y aumentar tus ganancias significativamente.",
                'color' => 'red',
                'icon' => '⚠️'
            ];
        }

        if ($diffPercentage < self::THRESHOLD_LOW) {
            return [
                'type' => Recommendation::TYPE_LOW,
                'text' => $isBuying
                    ? "⬇️ Tu oferta está algo baja (-{$formattedDiff}%). El promedio del mercado es \${$formattedAvg}. Podrías tardar más en conseguir vendedores si no ajustas tu presupuesto."
                    : "⬇️ Tu precio está algo bajo (-{$formattedDiff}%). El promedio del mercado es \${$formattedAvg}. Considera ajustarlo para mejorar tu margen.",
                'color' => 'orange',
                'icon' => '⬇️'
            ];
        }

        if ($diffPercentage >= self::THRESHOLD_LOW && $diffPercentage <= self::THRESHOLD_HIGH) {
            return [
                'type' => Recommendation::TYPE_IN_RANGE,
                'text' => $isBuying
                    ? "✅ Tu oferta está alineada con el mercado. Con un promedio de \${$formattedAvg}, tienes buenas probabilidades de concretar la compra."
                    : "✅ ¡Excelente! Tu precio está en el rango óptimo del mercado. Precio promedio: \${$formattedAvg}. Tu producto es competitivo.",
                'color' => 'green',
                'icon' => '✅'
            ];
        }

        if ($diffPercentage > self::THRESHOLD_VERY_HIGH) {
            return [
                'type' => Recommendation::TYPE_VERY_HIGH,
                'text' => $isBuying
                    ? "🔴 Tu oferta está MUY por encima del mercado (+{$formattedDiff}%). Estarías pagando de más. Negocia alrededor de \${$formattedAvg} para aprovechar mejores precios."
                    : "🔴 Tu precio está MUY por encima del mercado (+{$formattedDiff}%). Esto podría dificultar mucho la venta. Te recomendamos bajarlo cerca de \${$formattedAvg} para ser competitivo.",
                'color' => 'darkred',
                'icon' => '🔴'
            ];
        }

        // TYPE_HIGH
        return [
            'type' => Recommendation::TYPE_HIGH,
            'text' => $isBuying
                ? "⬆️ Tu oferta está algo alta (+{$formattedDiff}%). Promedio de mercado: \${$formattedAvg}. Podrías pagar de más si no negocias."
                : "⬆️ Tu precio está algo alto (+{$formattedDiff}%). Promedio de mercado: \${$formattedAvg}. Podrías tener dificultades para vender.",
            'color' => 'yellow',
            'icon' => '⬆️'
        ];
    }

    /**
     * Save recommendation to database.
     *
     * @param array $comparisonResult
     * @param int $userId
     * @param int $productCatalogId
     * @param int|null $postId
     * @return Recommendation
     */
    public function saveRecommendation(
        array $comparisonResult,
        int $userId,
        int $productCatalogId,
        ?int $postId = null
    ): Recommendation {
        return Recommendation::create([
            'post_id' => $postId,
            'user_id' => $userId,
            'product_catalog_id' => $productCatalogId,
            'user_price' => $comparisonResult['user_price'],
            'market_avg_price' => $comparisonResult['market_avg_price'],
            'market_min_price' => $comparisonResult['market_min_price'] ?? null,
            'market_max_price' => $comparisonResult['market_max_price'] ?? null,
            'recommendation_type' => $comparisonResult['recommendation_type'],
            'difference_percentage' => $comparisonResult['difference_percentage'] ?? null,
            'suggestion_text' => $comparisonResult['suggestion_text'],
        ]);
    }

    /**
     * Get historical recommendations for a user.
     *
     * @param int $userId
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserRecommendations(int $userId, int $limit = 20)
    {
        return Recommendation::where('user_id', $userId)
            ->with('productCatalog')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get acceptance rate of recommendations for a user.
     *
     * @param int $userId
     * @return array
     */
    public function getAcceptanceRate(int $userId): array
    {
        $total = Recommendation::where('user_id', $userId)
            ->whereNotNull('was_accepted')
            ->count();

        $accepted = Recommendation::where('user_id', $userId)
            ->where('was_accepted', true)
            ->count();

        $rate = $total > 0 ? ($accepted / $total) * 100 : 0;

        return [
            'total_recommendations' => $total,
            'accepted' => $accepted,
            'rejected' => $total - $accepted,
            'acceptance_rate' => round($rate, 2)
        ];
    }

    /**
     * Check if price is within market range.
     *
     * @param int $productCatalogId
     * @param float $userPrice
     * @param int $days
     * @return bool
     */
    public function isPriceInRange(int $productCatalogId, float $userPrice, int $days = 30): bool
    {
        $result = $this->comparePrice($productCatalogId, $userPrice, $days);

        return $result['has_data'] &&
               $result['recommendation_type'] === Recommendation::TYPE_IN_RANGE;
    }

    /**
     * Get recommended price for a product.
     *
     * @param int $productCatalogId
     * @param int $days
     * @return float|null
     */
    public function getRecommendedPrice(int $productCatalogId, int $days = 30): ?float
    {
        $stats = $this->getMarketStatistics($productCatalogId, $days);

        if (!$stats) {
            return null;
        }

        // Return average price as recommended
        return round($stats['avg_price'], -2); // Round to nearest 100
    }

    /**
     * Get price range for a product.
     *
     * @param int $productCatalogId
     * @param int $days
     * @return array|null
     */
    public function getPriceRange(int $productCatalogId, int $days = 30): ?array
    {
        $stats = $this->getMarketStatistics($productCatalogId, $days);

        if (!$stats) {
            return null;
        }

        return [
            'min' => round($stats['min_price'], 0),
            'max' => round($stats['max_price'], 0),
            'avg' => round($stats['avg_price'], 0),
            'range' => round($stats['max_price'] - $stats['min_price'], 0),
            'volatility' => round($stats['volatility'], 0)
        ];
    }

    /**
     * Get price trend analysis.
     *
     * @param int $productCatalogId
     * @param int $days
     * @return array
     */
    public function getPriceTrend(int $productCatalogId, int $days = 30): array
    {
        $fromDate = Carbon::now()->subDays($days);

        // Get recent average (last 7 days)
        $recentAvg = MarketPrice::where('product_catalog_id', $productCatalogId)
            ->where('date', '>=', Carbon::now()->subDays(7))
            ->avg('price_unit');

        // Get older average (7-30 days ago)
        $olderAvg = MarketPrice::where('product_catalog_id', $productCatalogId)
            ->where('date', '>=', $fromDate)
            ->where('date', '<', Carbon::now()->subDays(7))
            ->avg('price_unit');

        if (!$recentAvg || !$olderAvg) {
            return [
                'trend' => 'UNKNOWN',
                'change_percentage' => 0,
                'message' => 'Datos insuficientes para determinar tendencia'
            ];
        }

        $changePercentage = (($recentAvg - $olderAvg) / $olderAvg) * 100;

        $trend = 'STABLE';
        $message = 'El precio se mantiene estable';

        if ($changePercentage > 5) {
            $trend = 'UP';
            $message = sprintf(
                'El precio está subiendo (+%.1f%% en los últimos 7 días)',
                $changePercentage
            );
        } elseif ($changePercentage < -5) {
            $trend = 'DOWN';
            $message = sprintf(
                'El precio está bajando (%.1f%% en los últimos 7 días)',
                $changePercentage
            );
        }

        return [
            'trend' => $trend,
            'change_percentage' => round($changePercentage, 2),
            'recent_avg' => round($recentAvg, 0),
            'older_avg' => round($olderAvg, 0),
            'message' => $message
        ];
    }
}
