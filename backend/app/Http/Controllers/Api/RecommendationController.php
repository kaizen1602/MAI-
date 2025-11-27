<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recommendation;
use App\Models\ProductCatalog;
use App\Services\PriceComparisonService;
use App\Services\ProductNormalizationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

/**
 * RecommendationController
 *
 * Gestión de recomendaciones de precios
 */
class RecommendationController extends Controller
{
    protected PriceComparisonService $comparisonService;
    protected ProductNormalizationService $normalizationService;

    public function __construct(
        PriceComparisonService $comparisonService,
        ProductNormalizationService $normalizationService
    ) {
        $this->comparisonService = $comparisonService;
        $this->normalizationService = $normalizationService;
    }

    /**
     * Check price and generate recommendation.
     *
     * POST /api/recommendations/check-price
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function checkPrice(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|string',
            'price_per_kg' => 'required|numeric|min:0',
            'user_id' => 'nullable|exists:users,user_id',
            'category' => 'nullable|string',
            'context' => 'nullable|in:sell,buy',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Normalize product name
        $normalized = $this->normalizationService->normalize(
            $request->product_name,
            $request->category
        );

        if (!$normalized['product']) {
            return response()->json([
                'success' => false,
                'recommendation_type' => Recommendation::TYPE_NO_DATA,
                'message' => 'No encontramos este producto en nuestro catálogo.',
                'raw_product_name' => $request->product_name,
                'suggestions' => $this->normalizationService->getSuggestions($request->product_name, 3)
            ]);
        }

        $context = $request->input('context', 'sell');

        // Compare price
        $comparison = $this->comparisonService->comparePrice(
            $normalized['product']->id,
            $request->price_per_kg,
            30,
            $context
        );

        // Add product info
        $comparison['product'] = [
            'id' => $normalized['product']->id,
            'name' => $normalized['product']->name,
            'category' => $normalized['product']->category,
        ];

        $comparison['normalization'] = [
            'confidence' => $normalized['confidence'],
            'matched_name' => $normalized['product']->name,
            'variation' => $normalized['variation']?->variation_name,
        ];

        // Save recommendation if user_id provided
        if ($request->user_id && $comparison['has_data']) {
            try {
                $recommendation = $this->comparisonService->saveRecommendation(
                    $comparison,
                    $request->user_id,
                    $normalized['product']->id
                );

                $comparison['recommendation_id'] = $recommendation->id;
            } catch (\Exception $e) {
                // Continue without saving
            }
        }

        $comparison['context'] = $context;

        return response()->json([
            'success' => true,
            ...$comparison
        ]);
    }

    /**
     * Get user's recommendation history.
     *
     * GET /api/recommendations/my-recommendations
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getMyRecommendations(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $limit = $request->input('limit', 20);
        $page = $request->input('page', 1);

        $recommendations = Recommendation::where('user_id', $user->user_id)
            ->with(['productCatalog', 'post'])
            ->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);

        // Calculate acceptance rate
        $acceptanceRate = $this->comparisonService->getAcceptanceRate($user->user_id);

        return response()->json([
            'success' => true,
            'user_id' => $user->user_id,
            'acceptance_rate' => $acceptanceRate,
            'recommendations' => $recommendations
        ]);
    }

    /**
     * Save a recommendation manually.
     *
     * POST /api/recommendations/save
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function saveRecommendation(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
            'product_catalog_id' => 'required|exists:products_catalog,id',
            'user_price' => 'required|numeric|min:0',
            'market_avg_price' => 'required|numeric|min:0',
            'market_min_price' => 'nullable|numeric|min:0',
            'market_max_price' => 'nullable|numeric|min:0',
            'recommendation_type' => 'required|in:MUY_POR_DEBAJO,POR_DEBAJO,EN_RANGO,POR_ENCIMA,MUY_POR_ENCIMA,NO_DATA',
            'difference_percentage' => 'nullable|numeric',
            'suggestion_text' => 'nullable|string',
            'post_id' => 'nullable|exists:posts,post_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $recommendation = Recommendation::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Recommendation saved successfully',
                'data' => $recommendation->load('productCatalog')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving recommendation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update recommendation (mark as accepted/rejected).
     *
     * PUT /api/recommendations/{id}
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function update(int $id, Request $request): JsonResponse
    {
        $recommendation = Recommendation::find($id);

        if (!$recommendation) {
            return response()->json([
                'success' => false,
                'message' => 'Recommendation not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'was_accepted' => 'nullable|boolean',
            'final_price' => 'nullable|numeric|min:0',
            'post_id' => 'nullable|exists:posts,post_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $recommendation->update($request->only(['was_accepted', 'final_price', 'post_id']));

        return response()->json([
            'success' => true,
            'message' => 'Recommendation updated successfully',
            'data' => $recommendation
        ]);
    }

    /**
     * Get recommendation statistics.
     *
     * GET /api/recommendations/stats
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getStats(Request $request): JsonResponse
    {
        $userId = $request->input('user_id');

        if (!$userId) {
            // Global stats
            $stats = [
                'total_recommendations' => Recommendation::count(),
                'by_type' => Recommendation::selectRaw('recommendation_type, COUNT(*) as count')
                    ->groupBy('recommendation_type')
                    ->get()
                    ->pluck('count', 'recommendation_type'),
                'acceptance_rate' => $this->getGlobalAcceptanceRate(),
            ];
        } else {
            // User-specific stats
            $stats = [
                'user_id' => $userId,
                'total_recommendations' => Recommendation::where('user_id', $userId)->count(),
                'by_type' => Recommendation::where('user_id', $userId)
                    ->selectRaw('recommendation_type, COUNT(*) as count')
                    ->groupBy('recommendation_type')
                    ->get()
                    ->pluck('count', 'recommendation_type'),
                'acceptance_rate' => $this->comparisonService->getAcceptanceRate($userId),
            ];
        }

        return response()->json([
            'success' => true,
            'stats' => $stats
        ]);
    }

    /**
     * Get global acceptance rate.
     *
     * @return array
     */
    protected function getGlobalAcceptanceRate(): array
    {
        $total = Recommendation::whereNotNull('was_accepted')->count();
        $accepted = Recommendation::where('was_accepted', true)->count();

        $rate = $total > 0 ? ($accepted / $total) * 100 : 0;

        return [
            'total_recommendations' => $total,
            'accepted' => $accepted,
            'rejected' => $total - $accepted,
            'acceptance_rate' => round($rate, 2)
        ];
    }

    /**
     * Get recommended price for a product.
     *
     * GET /api/recommendations/suggested-price
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getSuggestedPrice(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|string',
            'category' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Normalize product
        $normalized = $this->normalizationService->normalize(
            $request->product_name,
            $request->category
        );

        if (!$normalized['product']) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found in catalog',
                'suggestions' => $this->normalizationService->getSuggestions($request->product_name, 3)
            ], 404);
        }

        // Get recommended price
        $recommendedPrice = $this->comparisonService->getRecommendedPrice($normalized['product']->id);

        if ($recommendedPrice === null) {
            return response()->json([
                'success' => false,
                'message' => 'No market data available for this product'
            ], 404);
        }

        // Get price range
        $priceRange = $this->comparisonService->getPriceRange($normalized['product']->id);

        // Get trend
        $trend = $this->comparisonService->getPriceTrend($normalized['product']->id);

        return response()->json([
            'success' => true,
            'product' => [
                'id' => $normalized['product']->id,
                'name' => $normalized['product']->name,
                'category' => $normalized['product']->category,
            ],
            'recommended_price' => $recommendedPrice,
            'price_range' => $priceRange,
            'trend' => $trend,
            'normalization_confidence' => $normalized['confidence']
        ]);
    }
}
