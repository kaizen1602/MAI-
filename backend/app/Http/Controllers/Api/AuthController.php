<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
     /**
     * Maneja el intento de inicio de sesión.
     */
    public function login(Request $request)
    {
        // 1. Validar los datos
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Intentar autenticar
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401); // Unauthorized
        }

        // 3. Si es exitoso, obtener el usuario y crear un token
        $user = User::where('email', $request->email)->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Devolver la respuesta con el token
        return response()->json([
            'message' => '¡Hola ' . $user->name . '!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Obtiene el perfil del usuario autenticado.
     */
    public function profile(Request $request)
    {
        // Gracias a 'auth:sanctum', aquí ya tenemos acceso al usuario autenticado
        return response()->json($request->user());
    }

    /**
     * Cierra la sesión del usuario (revoca el token).
     */
    public function logout(Request $request)
    {
        // Revoca el token que se usó para la autenticación
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}
