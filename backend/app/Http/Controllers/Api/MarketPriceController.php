<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketPrice;
use App\Models\ProductCatalog;
use App\Models\PriceTrend;
use App\Services\ProductNormalizationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

/**
 * MarketPriceController
 *
 * Gestión de precios de mercado (Corabastos)
 */
class MarketPriceController extends Controller
{
    protected ProductNormalizationService $normalizationService;

    public function __construct(ProductNormalizationService $normalizationService)
    {
        $this->normalizationService = $normalizationService;
    }

    /**
     * Get market prices by product.
     *
     * GET /api/market-prices/product/{productId}
     *
     * @param int $productId
     * @param Request $request
     * @return JsonResponse
     */
    public function getByProduct(int $productId, Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $limit = $request->input('limit', 30);

        $product = ProductCatalog::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        $prices = MarketPrice::where('product_catalog_id', $productId)
            ->where('date', '>=', $fromDate)
            ->with(['productCatalog', 'measurementUnit', 'productVariation'])
            ->orderBy('date', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'product' => $product,
            'period_days' => $days,
            'total' => $prices->count(),
            'prices' => $prices
        ]);
    }

    /**
     * Get market prices by date.
     *
     * GET /api/market-prices/date/{date}
     *
     * @param string $date
     * @return JsonResponse
     */
    public function getByDate(string $date): JsonResponse
    {
        try {
            $carbonDate = Carbon::parse($date);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid date format. Use YYYY-MM-DD'
            ], 400);
        }

        $prices = MarketPrice::whereDate('date', $carbonDate)
            ->with(['productCatalog', 'measurementUnit', 'productVariation'])
            ->orderBy('product_catalog_id')
            ->get();

        return response()->json([
            'success' => true,
            'date' => $carbonDate->format('Y-m-d'),
            'total' => $prices->count(),
            'prices' => $prices
        ]);
    }

    /**
     * Get latest market prices (last 7 days).
     *
     * GET /api/market-prices/latest
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getLatest(Request $request): JsonResponse
    {
        $days = $request->input('days', 7);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        $prices = MarketPrice::where('date', '>=', $fromDate)
            ->with(['productCatalog', 'measurementUnit'])
            ->orderBy('date', 'desc')
            ->orderBy('product_catalog_id')
            ->get();

        // Group by product
        $groupedPrices = $prices->groupBy('product_catalog_id')->map(function ($group) {
            return [
                'product' => $group->first()->productCatalog,
                'latest_price' => $group->first(),
                'price_history' => $group->take(10)
            ];
        })->values();

        return response()->json([
            'success' => true,
            'period' => "{$days} days",
            'from' => $fromDate,
            'to' => Carbon::now()->format('Y-m-d'),
            'total_products' => $groupedPrices->count(),
            'products' => $groupedPrices
        ]);
    }

    /**
     * Get price history for a product.
     *
     * GET /api/market-prices/history/{productId}
     *
     * @param int $productId
     * @param Request $request
     * @return JsonResponse
     */
    public function getHistory(int $productId, Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');

        $product = ProductCatalog::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Get daily aggregated prices
        $history = MarketPrice::where('product_catalog_id', $productId)
            ->where('date', '>=', $fromDate)
            ->select(
                'date',
                DB::raw('AVG(price_unit) as avg_price'),
                DB::raw('MIN(price_unit) as min_price'),
                DB::raw('MAX(price_unit) as max_price'),
                DB::raw('COUNT(*) as data_points')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'product' => $product,
            'period_days' => $days,
            'from' => $fromDate,
            'to' => Carbon::now()->format('Y-m-d'),
            'data_points' => $history->count(),
            'history' => $history
        ]);
    }

    /**
     * Store new market price (from n8n).
     *
     * POST /api/market-prices
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|string',
            'category' => 'nullable|string',
            'measurement_unit_name' => 'required|string',
            'quantity' => 'required|numeric|min:0',
            'price_extra' => 'nullable|numeric|min:0',
            'price_first' => 'nullable|numeric|min:0',
            'price_unit' => 'required|numeric|min:0',
            'price_variation' => 'required|in:Estable,Bajo,Subio',
            'date' => 'required|date',
            'source' => 'nullable|string',
            'raw_name' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Normalize product
        $normalizedProduct = $this->normalizationService->normalize(
            $request->product_name,
            $request->category
        );

        if (!$normalizedProduct['product']) {
            return response()->json([
                'success' => false,
                'message' => 'Product could not be normalized',
                'raw_name' => $request->product_name,
                'suggestions' => $this->normalizationService->getSuggestions($request->product_name)
            ], 400);
        }

        // Normalize measurement unit
        $measurementUnit = $this->normalizationService->normalizeMeasurementUnit(
            $request->measurement_unit_name
        );

        if (!$measurementUnit) {
            return response()->json([
                'success' => false,
                'message' => 'Measurement unit could not be normalized',
                'raw_unit' => $request->measurement_unit_name
            ], 400);
        }

        // Create market price
        try {
            $marketPrice = MarketPrice::create([
                'product_catalog_id' => $normalizedProduct['product']->id,
                'product_variation_id' => $normalizedProduct['variation']?->id,
                'measurement_unit_id' => $measurementUnit->id,
                'quantity' => $request->quantity,
                'price_extra' => $request->price_extra,
                'price_first' => $request->price_first,
                'price_unit' => $request->price_unit,
                'price_variation' => $request->price_variation,
                'date' => $request->date,
                'source' => $request->source ?? 'Corabastos',
                'raw_name' => $request->raw_name ?? $request->product_name,
                'extraction_confidence' => $normalizedProduct['confidence'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Market price created successfully',
                'data' => $marketPrice->load(['productCatalog', 'measurementUnit', 'productVariation']),
                'normalization' => [
                    'confidence' => $normalizedProduct['confidence'],
                    'product_id' => $normalizedProduct['product']->id,
                    'product_name' => $normalizedProduct['product']->name,
                    'variation' => $normalizedProduct['variation']?->variation_name,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating market price',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update market price.
     *
     * PUT /api/market-prices/{id}
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function update(int $id, Request $request): JsonResponse
    {
        $marketPrice = MarketPrice::find($id);

        if (!$marketPrice) {
            return response()->json([
                'success' => false,
                'message' => 'Market price not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'price_extra' => 'nullable|numeric|min:0',
            'price_first' => 'nullable|numeric|min:0',
            'price_unit' => 'nullable|numeric|min:0',
            'price_variation' => 'nullable|in:Estable,Bajo,Subio',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $marketPrice->update($request->only([
            'price_extra',
            'price_first',
            'price_unit',
            'price_variation',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Market price updated successfully',
            'data' => $marketPrice
        ]);
    }

    /**
     * Delete market price.
     *
     * DELETE /api/market-prices/{id}
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $marketPrice = MarketPrice::find($id);

        if (!$marketPrice) {
            return response()->json([
                'success' => false,
                'message' => 'Market price not found'
            ], 404);
        }

        $marketPrice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Market price deleted successfully'
        ]);
    }

    /**
     * Calculate price trends for all products.
     *
     * POST /api/market-prices/calculate-trends
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function calculateTrends(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $fromDate = Carbon::now()->subDays($days)->format('Y-m-d');
        $toDate = Carbon::now()->format('Y-m-d');

        // Get all products with recent prices
        $products = ProductCatalog::whereHas('marketPrices', function ($query) use ($fromDate) {
            $query->where('date', '>=', $fromDate);
        })->get();

        $trendsCreated = 0;
        $trendsUpdated = 0;
        $errors = [];

        foreach ($products as $product) {
            try {
                // Get price statistics
                $stats = MarketPrice::where('product_catalog_id', $product->id)
                    ->where('date', '>=', $fromDate)
                    ->selectRaw('
                        AVG(price_unit) as avg_price,
                        MIN(price_unit) as min_price,
                        MAX(price_unit) as max_price,
                        STDDEV(price_unit) as price_volatility,
                        COUNT(*) as data_points
                    ')
                    ->first();

                if (!$stats || !$stats->avg_price) {
                    continue;
                }

                // Calculate trend direction
                $recentAvg = MarketPrice::where('product_catalog_id', $product->id)
                    ->where('date', '>=', Carbon::now()->subDays(7))
                    ->avg('price_unit');

                $olderAvg = MarketPrice::where('product_catalog_id', $product->id)
                    ->where('date', '>=', $fromDate)
                    ->where('date', '<', Carbon::now()->subDays(7))
                    ->avg('price_unit');

                $trendDirection = 'STABLE';
                $changePercentage = 0;

                if ($recentAvg && $olderAvg && $olderAvg > 0) {
                    $changePercentage = (($recentAvg - $olderAvg) / $olderAvg) * 100;

                    if ($changePercentage > 5) {
                        $trendDirection = 'UP';
                    } elseif ($changePercentage < -5) {
                        $trendDirection = 'DOWN';
                    }
                }

                // Create or update trend
                $trend = PriceTrend::updateOrCreate(
                    [
                        'product_catalog_id' => $product->id,
                        'period_start' => $fromDate,
                        'period_end' => $toDate,
                    ],
                    [
                        'avg_price' => $stats->avg_price,
                        'min_price' => $stats->min_price,
                        'max_price' => $stats->max_price,
                        'price_volatility' => $stats->price_volatility ?? 0,
                        'trend_direction' => $trendDirection,
                        'price_change_percentage' => $changePercentage,
                        'data_points' => $stats->data_points,
                    ]
                );

                if ($trend->wasRecentlyCreated) {
                    $trendsCreated++;
                } else {
                    $trendsUpdated++;
                }

            } catch (\Exception $e) {
                $errors[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'error' => $e->getMessage()
                ];
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Price trends calculated successfully',
            'period_days' => $days,
            'from' => $fromDate,
            'to' => $toDate,
            'products_processed' => $products->count(),
            'trends_created' => $trendsCreated,
            'trends_updated' => $trendsUpdated,
            'errors_count' => count($errors),
            'errors' => $errors
        ]);
    }
}
