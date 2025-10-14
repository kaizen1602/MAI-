<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Obtener el usuario autenticado
        $user = $request->user();

        // Verificar si no hay usuario autenticado
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No estás autenticado.',
            ], 401);
        }

        // Verificar si el usuario NO es administrador
        if (!$user->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción. Solo administradores.',
            ], 403);
        }

        // Si todo está bien, continuar con la petición
        return $next($request);
    }
}
