<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\UserController;

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/ping', function() {
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

    // Productos (API Resource)
    //Route::apiResource('products', ProductController::class);
    
    // Categorías
    //Route::apiResource('categories', CategoryController::class);
    
    // Órdenes
    //Route::apiResource('orders', OrderController::class);
    
    // Rutas personalizadas si las necesitas
    //Route::get('products/{product}/related', [ProductController::class, 'related']);
    //Route::post('orders/{order}/confirm', [OrderController::class, 'confirm']);
});
