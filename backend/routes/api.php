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

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
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
// RUTAS PROTEGIDAS (requieren autenticación)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/profile', [AuthController::class, 'updateProfile']); // Cambiado de PUT a POST
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    });

    //User
    // Perfil público de usuarios
    Route::get('/users/{user}', [UserController::class, 'show']);

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
});