<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\User\LoginRequest;
use App\Http\Requests\User\RegisterRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Http\Resources\User\UserResource;
use App\Traits\ApiResponse;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Maneja el inicio de sesión
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // Validación usando Request Validation (más simple)
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return $this->errorResponse('Credenciales inválidas', 401);
        }

        $user = Auth::user()->load('role'); // Cargar relación role
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => new UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 'Inicio de sesión exitoso');
    }

    /**
     * Registra un nuevo usuario
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->getUserData());
        $user->load('role'); // Cargar relación role
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => new UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 'Usuario registrado exitosamente', 201);
    }

    /**
     * Obtiene el perfil del usuario autenticado
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user()->load('role'); // Cargar relación role

        return $this->successResponse([
            'user' => new UserResource($user),
        ], 'Datos del perfil obtenidos correctamente');
    }

    public function updateProfile(UpdateRequest $request): JsonResponse
    {
        $user = Auth::user();

        // 2. Validar y traer data lista (con bcrypt si el request lo hace en getUserData)
        $data = $request->getUserData();

        // 3. Actualizar
        $user->update($data);
        $user->load('role'); // Cargar relación role


        return $this->successResponse([
            'user' => new UserResource($user),
        ], 'Perfil actualizado correctamente');
    }

    /**
     * Cierra la sesión (revoca el token actual)
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse(null, 'Sesión cerrada exitosamente');
    }

    /**
     * Revoca todos los tokens del usuario
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();
        return $this->successResponse(null, 'Todas las sesiones cerradas exitosamente');
    }
}
