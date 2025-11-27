<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PriceTrend;
use App\Models\ProductCatalog;
use App\Models\MarketPrice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * TrendController
 *
 * Análisis de tendencias de precios
 */
class TrendController extends Controller
{
    /**
     * Get market overview (general statistics).
     *
     * GET /api/trends/market-overview
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getMarketOverview(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        // Total products with prices
        $totalProducts = ProductCatalog::whereHas('marketPrices', function ($query) use ($fromDate) {
            $query->where('date', '>=', $fromDate);
        })->count();

        // Total price records
        $totalPrices = MarketPrice::where('date', '>=', $fromDate)->count();

        // Average price across all products
        $avgPrice = MarketPrice::where('date', '>=', $fromDate)->avg('price_unit');

        // Price variation distribution
        $priceVariationDist = MarketPrice::where('date', '>=', $fromDate)
            ->selectRaw('price_variation, COUNT(*) as count')
            ->groupBy('price_variation')
            ->get()
            ->pluck('count', 'price_variation');

        // Trend direction distribution
        $trendDist = PriceTrend::where('period_end', '>=', $fromDate)
            ->selectRaw('trend_direction, COUNT(*) as count')
            ->groupBy('trend_direction')
            ->get()
            ->pluck('count', 'trend_direction');

        // Category statistics
        $categoryStats = ProductCatalog::selectRaw('category, COUNT(DISTINCT products_catalog.id) as product_count')
            ->join('market_prices', 'products_catalog.id', '=', 'market_prices.product_catalog_id')
            ->where('market_prices.date', '>=', $fromDate)
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderBy('product_count', 'desc')
            ->get();

        // Latest ingestion date
        $latestDate = MarketPrice::max('date');

        return response()->json([
            'success' => true,
            'period_days' => $days,
            'from' => $fromDate,
            'to' => Carbon::now()->format('Y-m-d'),
            'latest_ingestion' => $latestDate,
            'overview' => [
                'total_products' => $totalProducts,
                'total_price_records' => $totalPrices,
                'average_price' => round($avgPrice ?? 0, 0),
                'price_variation_distribution' => $priceVariationDist,
                'trend_distribution' => $trendDist,
            ],
            'categories' => $categoryStats
        ]);
    }

    /**
     * Get trends for a specific product.
     *
     * GET /api/trends/product/{productId}
     *
     * @param int $productId
     * @param Request $request
     * @return JsonResponse
     */
    public function getProductTrend(int $productId, Request $request): JsonResponse
    {
        $product = ProductCatalog::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $days = $request->input('days', 30);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        // Get latest trend
        $latestTrend = PriceTrend::where('product_catalog_id', $productId)
            ->orderBy('period_end', 'desc')
            ->first();

        // Get historical trends
        $historicalTrends = PriceTrend::where('product_catalog_id', $productId)
            ->where('period_end', '>=', $fromDate)
            ->orderBy('period_end', 'asc')
            ->get();

        // Get daily prices
        $dailyPrices = MarketPrice::where('product_catalog_id', $productId)
            ->where('date', '>=', $fromDate)
            ->selectRaw('date, AVG(price_unit) as avg_price, MIN(price_unit) as min_price, MAX(price_unit) as max_price')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'product' => $product,
            'period_days' => $days,
            'latest_trend' => $latestTrend,
            'historical_trends' => $historicalTrends,
            'daily_prices' => $dailyPrices
        ]);
    }

    /**
     * Get trends by category.
     *
     * GET /api/trends/category/{category}
     *
     * @param string $category
     * @param Request $request
     * @return JsonResponse
     */
    public function getCategoryTrend(string $category, Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        // Get products in category
        $products = ProductCatalog::where('category', $category)
            ->whereHas('marketPrices', function ($query) use ($fromDate) {
                $query->where('date', '>=', $fromDate);
            })
            ->with(['priceTrends' => function ($query) use ($fromDate) {
                $query->where('period_end', '>=', $fromDate)
                    ->orderBy('period_end', 'desc')
                    ->limit(1);
            }])
            ->get();

        if ($products->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No products found in this category'
            ], 404);
        }

        // Calculate category aggregates
        $categoryAvgPrice = MarketPrice::join('products_catalog', 'market_prices.product_catalog_id', '=', 'products_catalog.id')
            ->where('products_catalog.category', $category)
            ->where('market_prices.date', '>=', $fromDate)
            ->avg('market_prices.price_unit');

        $categoryMinPrice = MarketPrice::join('products_catalog', 'market_prices.product_catalog_id', '=', 'products_catalog.id')
            ->where('products_catalog.category', $category)
            ->where('market_prices.date', '>=', $fromDate)
            ->min('market_prices.price_unit');

        $categoryMaxPrice = MarketPrice::join('products_catalog', 'market_prices.product_catalog_id', '=', 'products_catalog.id')
            ->where('products_catalog.category', $category)
            ->where('market_prices.date', '>=', $fromDate)
            ->max('market_prices.price_unit');

        return response()->json([
            'success' => true,
            'category' => $category,
            'period_days' => $days,
            'total_products' => $products->count(),
            'category_statistics' => [
                'avg_price' => round($categoryAvgPrice ?? 0, 0),
                'min_price' => round($categoryMinPrice ?? 0, 0),
                'max_price' => round($categoryMaxPrice ?? 0, 0),
            ],
            'products' => $products
        ]);
    }

    /**
     * Get volatile products (high price volatility).
     *
     * GET /api/trends/volatile-products
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getVolatileProducts(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $limit = $request->input('limit', 20);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        $volatileProducts = PriceTrend::where('period_end', '>=', $fromDate)
            ->whereNotNull('price_volatility')
            ->with('productCatalog')
            ->selectRaw('
                product_catalog_id,
                AVG(price_volatility) as avg_volatility,
                AVG(ABS(price_change_percentage)) as avg_change_percentage,
                MAX(price_volatility) as max_volatility,
                COUNT(*) as trend_records
            ')
            ->groupBy('product_catalog_id')
            ->having('avg_volatility', '>', 0)
            ->orderBy('avg_volatility', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'period_days' => $days,
            'total' => $volatileProducts->count(),
            'volatile_products' => $volatileProducts->map(function ($trend) {
                return [
                    'product' => $trend->productCatalog,
                    'avg_volatility' => round($trend->avg_volatility, 0),
                    'max_volatility' => round($trend->max_volatility, 0),
                    'avg_change_percentage' => round($trend->avg_change_percentage, 2),
                    'trend_records' => $trend->trend_records,
                ];
            })
        ]);
    }

    /**
     * Get stable products (low price volatility).
     *
     * GET /api/trends/stable-products
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getStableProducts(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $limit = $request->input('limit', 20);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        $stableProducts = PriceTrend::where('period_end', '>=', $fromDate)
            ->whereNotNull('price_volatility')
            ->with('productCatalog')
            ->selectRaw('
                product_catalog_id,
                AVG(price_volatility) as avg_volatility,
                AVG(ABS(price_change_percentage)) as avg_change_percentage,
                AVG(avg_price) as avg_price,
                COUNT(*) as trend_records
            ')
            ->groupBy('product_catalog_id')
            ->having('avg_volatility', '>', 0)
            ->orderBy('avg_volatility', 'asc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'period_days' => $days,
            'total' => $stableProducts->count(),
            'stable_products' => $stableProducts->map(function ($trend) {
                return [
                    'product' => $trend->productCatalog,
                    'avg_volatility' => round($trend->avg_volatility, 0),
                    'avg_change_percentage' => round($trend->avg_change_percentage, 2),
                    'avg_price' => round($trend->avg_price, 0),
                    'trend_records' => $trend->trend_records,
                ];
            })
        ]);
    }

    /**
     * Get products with increasing prices.
     *
     * GET /api/trends/increasing-prices
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getIncreasingPrices(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $limit = $request->input('limit', 20);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        $increasingProducts = PriceTrend::where('period_end', '>=', $fromDate)
            ->where('trend_direction', 'UP')
            ->with('productCatalog')
            ->selectRaw('
                product_catalog_id,
                AVG(price_change_percentage) as avg_increase,
                MAX(price_change_percentage) as max_increase,
                AVG(avg_price) as avg_price
            ')
            ->groupBy('product_catalog_id')
            ->orderBy('avg_increase', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'period_days' => $days,
            'total' => $increasingProducts->count(),
            'increasing_products' => $increasingProducts->map(function ($trend) {
                return [
                    'product' => $trend->productCatalog,
                    'avg_increase' => round($trend->avg_increase, 2) . '%',
                    'max_increase' => round($trend->max_increase, 2) . '%',
                    'avg_price' => round($trend->avg_price, 0),
                ];
            })
        ]);
    }

    /**
     * Get products with decreasing prices.
     *
     * GET /api/trends/decreasing-prices
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getDecreasingPrices(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $limit = $request->input('limit', 20);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        $decreasingProducts = PriceTrend::where('period_end', '>=', $fromDate)
            ->where('trend_direction', 'DOWN')
            ->with('productCatalog')
            ->selectRaw('
                product_catalog_id,
                AVG(price_change_percentage) as avg_decrease,
                MIN(price_change_percentage) as max_decrease,
                AVG(avg_price) as avg_price
            ')
            ->groupBy('product_catalog_id')
            ->orderBy('avg_decrease', 'asc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'period_days' => $days,
            'total' => $decreasingProducts->count(),
            'decreasing_products' => $decreasingProducts->map(function ($trend) {
                return [
                    'product' => $trend->productCatalog,
                    'avg_decrease' => round($trend->avg_decrease, 2) . '%',
                    'max_decrease' => round($trend->max_decrease, 2) . '%',
                    'avg_price' => round($trend->avg_price, 0),
                ];
            })
        ]);
    }

    /**
     * Get price comparison by date range.
     *
     * GET /api/trends/price-comparison
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getPriceComparison(Request $request): JsonResponse
    {
        $productId = $request->input('product_id');
        $date1 = $request->input('date1', Carbon::now()->subDays(30)->format('Y-m-d'));
        $date2 = $request->input('date2', Carbon::now()->format('Y-m-d'));

        if (!$productId) {
            return response()->json([
                'success' => false,
                'message' => 'product_id is required'
            ], 400);
        }

        $product = ProductCatalog::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Get price for date1
        $price1 = MarketPrice::where('product_catalog_id', $productId)
            ->whereDate('date', '<=', $date1)
            ->orderBy('date', 'desc')
            ->first();

        // Get price for date2
        $price2 = MarketPrice::where('product_catalog_id', $productId)
            ->whereDate('date', '<=', $date2)
            ->orderBy('date', 'desc')
            ->first();

        if (!$price1 || !$price2) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient data for comparison'
            ], 404);
        }

        $difference = $price2->price_unit - $price1->price_unit;
        $percentageChange = ($difference / $price1->price_unit) * 100;

        return response()->json([
            'success' => true,
            'product' => $product,
            'comparison' => [
                'date1' => $date1,
                'price1' => round($price1->price_unit, 0),
                'date2' => $date2,
                'price2' => round($price2->price_unit, 0),
                'difference' => round($difference, 0),
                'percentage_change' => round($percentageChange, 2),
                'trend' => $difference > 0 ? 'UP' : ($difference < 0 ? 'DOWN' : 'STABLE')
            ]
        ]);
    }
}
