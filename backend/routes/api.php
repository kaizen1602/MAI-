<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PriceReferenceController;

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

// ==========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
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
});