<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

        try {
            // 1. Obtener datos del usuario
            $data = $request->getUserData();

            // 2. Manejar imagen de perfil si se proporciona
            if ($request->hasFile('profile_image')) {
                $imageService = app(\App\Services\ImageService::class);
                
                // Eliminar imagen anterior si existe
                if ($user->profile_image) {
                    $imageService->deleteImage($user->profile_image);
                }
                
                // Subir nueva imagen
                $imageUrl = $imageService->uploadImage(
                    $request->getProfileImage(),
                    'profiles/' . $user->id
                );
                
                $data['profile_image'] = $imageUrl;
            }

            // 3. Actualizar usuario
            $user->update($data);
            $user->load('role');

            return $this->successResponse([
                'user' => new UserResource($user),
            ], 'Perfil actualizado correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Error al actualizar el perfil. Por favor, intenta nuevamente.',
                500
            );
        }
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

    /**
     * Envía email para restablecer contraseña
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $request->email)->first();
        
        // Generar token de restablecimiento (simple para este ejemplo)
        $resetToken = bin2hex(random_bytes(32));
        
        // Guardar token en la base de datos (en un campo temporal)
        $user->update([
            'remember_token' => $resetToken
        ]);

        // En una aplicación real, aquí enviarías el email
        // Por ahora, solo logueamos el token para desarrollo
        \Log::info("Token de restablecimiento para {$user->email}: {$resetToken}");

        return $this->successResponse([
            'reset_token' => $resetToken, // Solo para desarrollo
            'message' => 'Si tu correo está registrado, recibirás instrucciones para restablecer tu contraseña'
        ], 'Instrucciones enviadas');
    }

    /**
     * Restablece la contraseña usando el token
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::where('email', $request->email)
                   ->where('remember_token', $request->token)
                   ->first();

        if (!$user) {
            return $this->errorResponse('Token inválido o expirado', 400);
        }

        // Actualizar contraseña
        $user->update([
            'password' => bcrypt($request->password),
            'remember_token' => null // Limpiar token
        ]);

        return $this->successResponse(null, 'Contraseña restablecida exitosamente');
    }

    /**
     * Cambia la contraseña del usuario autenticado
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed'
        ]);

        $user = $request->user();

        // Verificar contraseña actual
        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse('La contraseña actual es incorrecta', 400);
        }

        // Actualizar contraseña
        $user->update([
            'password' => bcrypt($request->new_password)
        ]);

        return $this->successResponse(null, 'Contraseña cambiada exitosamente');
    }
}
