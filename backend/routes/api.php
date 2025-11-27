<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PriceReferenceController;
use App\Http\Controllers\Api\PriceAlertController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\MunicipalityController;
use App\Http\Controllers\Api\PostTypeController;
use App\Http\Controllers\Api\ProductTypeController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\MarketPriceController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\TrendController;
use App\Http\Controllers\Api\ProductCatalogController;

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

Route::get('/ping', function () {
    return response()->json(['message' => 'API ON'], 200);
});

// Datos de soporte (públicos para facilitar formularios)
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/municipalities', [MunicipalityController::class, 'index']);
Route::get('/municipalities/department/{departmentId}', [MunicipalityController::class, 'byDepartment']);
Route::get('/post-types', [PostTypeController::class, 'index']);
Route::get('/product-types', [ProductTypeController::class, 'index']);

// ==========================================
// PRICING RECOMMENDATIONS (Público - no requiere autenticación)
// ==========================================
Route::prefix('recommendations')->group(function () {
    Route::post('/check-price', [RecommendationController::class, 'checkPrice']);
});

// ==========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/profile', [AuthController::class, 'updateProfile']); // Cambiado de PUT a POST
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    });

    //User
    // Perfil público de usuarios
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::get('/users/{user}/rating', [UserController::class, 'getUserRating']);

    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('/{product}', [ProductController::class, 'show']);

        // ✅ Rutas protegidas (solo administradores)
        Route::middleware('admin')->group(function () {
            Route::post('/', [ProductController::class, 'store']);
            Route::put('/{product}', [ProductController::class, 'update']);
            Route::delete('/{product}', [ProductController::class, 'destroy']);
        });
    });

    // Posts
    Route::prefix('posts')->group(function () {
        Route::get('/', [PostController::class, 'index']);
        Route::get('/{post}', [PostController::class, 'show']);
        Route::post('/', [PostController::class, 'store']);
        Route::put('/{post}', [PostController::class, 'update']);
        Route::delete('/{post}', [PostController::class, 'destroy']);
        Route::patch('/{post}/status', [PostController::class, 'updateStatus']);
        
        // Post Images
        Route::post('/{post}/images', [PostController::class, 'addImage']);
        Route::delete('/images/{image}', [PostController::class, 'deleteImage']);
    });

    // Price References
    Route::prefix('price-references')->group(function () {
        Route::get('/', [PriceReferenceController::class, 'index']);
        Route::get('/{priceReference}', [PriceReferenceController::class, 'show']);
        
        // ✅ Rutas protegidas (solo administradores)
        Route::middleware('admin')->group(function () {
            Route::post('/', [PriceReferenceController::class, 'store']);
            Route::put('/{priceReference}', [PriceReferenceController::class, 'update']);
        });
    });

    // Price Alerts
    Route::prefix('my-alerts')->group(function () {
        Route::get('/', [PriceAlertController::class, 'index']);
        Route::post('/', [PriceAlertController::class, 'store']);
        Route::get('/{priceAlert}', [PriceAlertController::class, 'show']);
        Route::put('/{priceAlert}', [PriceAlertController::class, 'update']);
        Route::delete('/{priceAlert}', [PriceAlertController::class, 'destroy']);
    });

    // Reviews
    Route::prefix('reviews')->group(function () {
        Route::get('/', [ReviewController::class, 'index']);
        Route::post('/', [ReviewController::class, 'store']);
        Route::get('/{review}', [ReviewController::class, 'show']);
        Route::put('/{review}', [ReviewController::class, 'update']);
        Route::delete('/{review}', [ReviewController::class, 'destroy']);
    });

    // Favorites
    Route::prefix('my-favorites')->group(function () {
        Route::get('/', [FavoriteController::class, 'index']);
        Route::post('/', [FavoriteController::class, 'store']);
        Route::delete('/{postId}', [FavoriteController::class, 'destroy']);
    });

    // Transactions
    Route::prefix('transactions')->group(function () {
        Route::get('/', [TransactionController::class, 'index']);
        Route::post('/', [TransactionController::class, 'store']);
        Route::get('/purchase-history', [TransactionController::class, 'purchaseHistory']);
        Route::get('/{transaction}', [TransactionController::class, 'show']);
        Route::put('/{transaction}', [TransactionController::class, 'update']);
        Route::delete('/{transaction}', [TransactionController::class, 'destroy']);
        Route::post('/{transaction}/review', [TransactionController::class, 'createReview']);
    });

    // ==========================================
    // INTELLIGENT PRICING MODULE ROUTES
    // ==========================================

    // Product Catalog (Normalized Products)
    Route::prefix('catalog')->group(function () {
        // Public catalog access
        Route::get('/products', [ProductCatalogController::class, 'index']);
        Route::get('/categories', [ProductCatalogController::class, 'getCategories']);
        Route::get('/products/{id}', [ProductCatalogController::class, 'show']);
        Route::get('/search', [ProductCatalogController::class, 'search']);
        Route::post('/normalize', [ProductCatalogController::class, 'normalize']);
        Route::get('/category/{category}', [ProductCatalogController::class, 'getByCategory']);
        Route::get('/products/{id}/variations', [ProductCatalogController::class, 'getVariations']);

        // Admin-only catalog management
        Route::middleware('admin')->group(function () {
            Route::post('/products', [ProductCatalogController::class, 'store']);
            Route::put('/products/{id}', [ProductCatalogController::class, 'update']);
            Route::delete('/products/{id}', [ProductCatalogController::class, 'destroy']);
            Route::post('/products/{id}/variations', [ProductCatalogController::class, 'storeVariation']);
            Route::post('/products/{id}/aliases', [ProductCatalogController::class, 'addAliases']);
        });
    });

    // Market Prices (Corabastos Data)
    Route::prefix('market-prices')->group(function () {
        // Public price data access
        Route::get('/product/{productId}', [MarketPriceController::class, 'getByProduct']);
        Route::get('/date/{date}', [MarketPriceController::class, 'getByDate']);
        Route::get('/latest', [MarketPriceController::class, 'getLatest']);
        Route::get('/history/{productId}', [MarketPriceController::class, 'getHistory']);

        // n8n integration (protected with API token in production)
        Route::post('/', [MarketPriceController::class, 'store']);
        Route::post('/calculate-trends', [MarketPriceController::class, 'calculateTrends']);

        // Admin-only management
        Route::middleware('admin')->group(function () {
            Route::put('/{id}', [MarketPriceController::class, 'update']);
            Route::delete('/{id}', [MarketPriceController::class, 'destroy']);
        });
    });

    // Price Recommendations (check-price es público, otros requieren auth)
    Route::prefix('recommendations')->group(function () {
        // Core recommendation endpoints
        Route::get('/suggested-price', [RecommendationController::class, 'getSuggestedPrice']);
        Route::get('/my-recommendations', [RecommendationController::class, 'getMyRecommendations']);
        Route::get('/stats', [RecommendationController::class, 'getStats']);

        // Recommendation management
        Route::post('/save', [RecommendationController::class, 'saveRecommendation']);
        Route::put('/{id}', [RecommendationController::class, 'update']);
    });

    // Market Trends & Analytics
    Route::prefix('trends')->group(function () {
        // Market overview and analytics
        Route::get('/market-overview', [TrendController::class, 'getMarketOverview']);
        Route::get('/product/{productId}', [TrendController::class, 'getProductTrend']);
        Route::get('/category/{category}', [TrendController::class, 'getCategoryTrend']);

        // Insights and discoveries
        Route::get('/volatile-products', [TrendController::class, 'getVolatileProducts']);
        Route::get('/stable-products', [TrendController::class, 'getStableProducts']);
        Route::get('/increasing-prices', [TrendController::class, 'getIncreasingPrices']);
        Route::get('/decreasing-prices', [TrendController::class, 'getDecreasingPrices']);
        Route::get('/price-comparison', [TrendController::class, 'getPriceComparison']);
    });
});