<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog;
use App\Models\ProductVariation;
use App\Services\ProductNormalizationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

/**
 * ProductCatalogController
 *
 * Gestión del catálogo de productos normalizado
 */
class ProductCatalogController extends Controller
{
    protected ProductNormalizationService $normalizationService;

    public function __construct(ProductNormalizationService $normalizationService)
    {
        $this->normalizationService = $normalizationService;
    }

    /**
     * List all products in catalog.
     *
     * GET /api/catalog/products
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->input('category');
        $isActive = $request->input('is_active', true);
        $limit = $request->input('limit', 50);
        $page = $request->input('page', 1);

        $query = ProductCatalog::query();

        if ($category) {
            $query->where('category', $category);
        }

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        $query->orderBy('category')->orderBy('name');

        $products = $query->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'total' => $products->total(),
            'per_page' => $products->perPage(),
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'products' => $products->items()
        ]);
    }

    /**
     * Get all categories.
     *
     * GET /api/catalog/categories
     *
     * @return JsonResponse
     */
    public function getCategories(): JsonResponse
    {
        $categories = ProductCatalog::select('category')
            ->selectRaw('COUNT(*) as product_count')
            ->groupBy('category')
            ->orderBy('category')
            ->get();

        return response()->json([
            'success' => true,
            'total' => $categories->count(),
            'categories' => $categories
        ]);
    }

    /**
     * Get a specific product by ID.
     *
     * GET /api/catalog/products/{id}
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $product = ProductCatalog::with(['variations', 'marketPrices' => function ($query) {
            $query->orderBy('date', 'desc')->limit(10);
        }])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Get latest price
        $latestPrice = $product->marketPrices->first();

        // Get price statistics
        $priceStats = DB::table('market_prices')
            ->where('product_catalog_id', $id)
            ->selectRaw('
                AVG(price_unit) as avg_price,
                MIN(price_unit) as min_price,
                MAX(price_unit) as max_price,
                COUNT(*) as data_points
            ')
            ->first();

        return response()->json([
            'success' => true,
            'product' => $product,
            'latest_price' => $latestPrice,
            'price_statistics' => $priceStats
        ]);
    }

    /**
     * Search products by name (fuzzy search).
     *
     * GET /api/catalog/search
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $category = $request->input('category');
        $limit = $request->input('limit', 20);

        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Query parameter is required'
            ], 400);
        }

        // Get suggestions using normalization service
        $suggestions = $this->normalizationService->getSuggestions($query, $limit);

        // Filter by category if provided
        if ($category) {
            $suggestions = array_filter($suggestions, function ($suggestion) use ($category) {
                return $suggestion['product']->category === $category;
            });
            $suggestions = array_values($suggestions); // Re-index
        }

        return response()->json([
            'success' => true,
            'query' => $query,
            'total' => count($suggestions),
            'results' => array_map(function ($suggestion) {
                return [
                    'product' => $suggestion['product'],
                    'similarity' => round($suggestion['similarity'] * 100, 2) . '%',
                    'confidence' => $suggestion['similarity']
                ];
            }, $suggestions)
        ]);
    }

    /**
     * Normalize a product name (map user input to catalog).
     *
     * POST /api/catalog/normalize
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function normalize(Request $request): JsonResponse
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

        $normalized = $this->normalizationService->normalize(
            $request->product_name,
            $request->category
        );

        if (!$normalized['product']) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found in catalog',
                'raw_name' => $request->product_name,
                'suggestions' => $this->normalizationService->getSuggestions($request->product_name, 5)
            ], 404);
        }

        return response()->json([
            'success' => true,
            'raw_name' => $request->product_name,
            'normalized' => [
                'product' => $normalized['product'],
                'variation' => $normalized['variation'],
                'confidence' => round($normalized['confidence'] * 100, 2) . '%',
                'confidence_score' => $normalized['confidence']
            ]
        ]);
    }

    /**
     * Create a new product in catalog (admin).
     *
     * POST /api/catalog/products
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:products_catalog,name',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'aliases' => 'nullable|array',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = ProductCatalog::create([
                'name' => strtoupper(trim($request->name)),
                'category' => $request->category,
                'description' => $request->description,
                'aliases' => $request->aliases ?? [],
                'is_active' => $request->is_active ?? true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a product in catalog (admin).
     *
     * PUT /api/catalog/products/{id}
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function update(int $id, Request $request): JsonResponse
    {
        $product = ProductCatalog::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|unique:products_catalog,name,' . $id,
            'category' => 'nullable|string',
            'description' => 'nullable|string',
            'aliases' => 'nullable|array',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = [];

            if ($request->has('name')) {
                $updateData['name'] = strtoupper(trim($request->name));
            }

            if ($request->has('category')) {
                $updateData['category'] = $request->category;
            }

            if ($request->has('description')) {
                $updateData['description'] = $request->description;
            }

            if ($request->has('aliases')) {
                $updateData['aliases'] = $request->aliases;
            }

            if ($request->has('is_active')) {
                $updateData['is_active'] = $request->is_active;
            }

            $product->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a product from catalog (admin).
     *
     * DELETE /api/catalog/products/{id}
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $product = ProductCatalog::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Check if product has associated data
        $hasPrices = $product->marketPrices()->exists();

        if ($hasPrices) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete product with associated market prices. Consider deactivating instead.'
            ], 400);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Get variations for a product.
     *
     * GET /api/catalog/products/{id}/variations
     *
     * @param int $id
     * @return JsonResponse
     */
    public function getVariations(int $id): JsonResponse
    {
        $product = ProductCatalog::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $variations = $product->variations()
            ->orderBy('variation_name')
            ->get();

        return response()->json([
            'success' => true,
            'product' => $product,
            'total' => $variations->count(),
            'variations' => $variations
        ]);
    }

    /**
     * Create a variation for a product.
     *
     * POST /api/catalog/products/{id}/variations
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function storeVariation(int $id, Request $request): JsonResponse
    {
        $product = ProductCatalog::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'variation_name' => 'required|string',
            'price_modifier' => 'nullable|numeric|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $variation = ProductVariation::create([
                'product_catalog_id' => $id,
                'variation_name' => strtoupper(trim($request->variation_name)),
                'price_modifier' => $request->price_modifier ?? 1.0,
                'is_active' => $request->is_active ?? true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Variation created successfully',
                'data' => $variation
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating variation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add aliases to a product.
     *
     * POST /api/catalog/products/{id}/aliases
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function addAliases(int $id, Request $request): JsonResponse
    {
        $product = ProductCatalog::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'aliases' => 'required|array|min:1',
            'aliases.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $currentAliases = $product->aliases ?? [];
            $newAliases = array_map('strtoupper', array_map('trim', $request->aliases));

            // Merge and deduplicate
            $mergedAliases = array_unique(array_merge($currentAliases, $newAliases));

            $product->update(['aliases' => array_values($mergedAliases)]);

            return response()->json([
                'success' => true,
                'message' => 'Aliases added successfully',
                'data' => [
                    'product' => $product,
                    'aliases_added' => count($newAliases),
                    'total_aliases' => count($mergedAliases)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error adding aliases',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products by category with statistics.
     *
     * GET /api/catalog/category/{category}
     *
     * @param string $category
     * @return JsonResponse
     */
    public function getByCategory(string $category): JsonResponse
    {
        $products = ProductCatalog::where('category', $category)
            ->with(['variations'])
            ->orderBy('name')
            ->get();

        if ($products->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No products found in this category'
            ], 404);
        }

        // Get category statistics
        $stats = DB::table('market_prices')
            ->join('products_catalog', 'market_prices.product_catalog_id', '=', 'products_catalog.id')
            ->where('products_catalog.category', $category)
            ->selectRaw('
                COUNT(DISTINCT market_prices.product_catalog_id) as products_with_prices,
                AVG(market_prices.price_unit) as avg_price,
                MIN(market_prices.price_unit) as min_price,
                MAX(market_prices.price_unit) as max_price
            ')
            ->first();

        return response()->json([
            'success' => true,
            'category' => $category,
            'total_products' => $products->count(),
            'products' => $products,
            'statistics' => [
                'products_with_prices' => $stats->products_with_prices ?? 0,
                'avg_price' => round($stats->avg_price ?? 0, 0),
                'min_price' => round($stats->min_price ?? 0, 0),
                'max_price' => round($stats->max_price ?? 0, 0),
            ]
        ]);
    }
}
