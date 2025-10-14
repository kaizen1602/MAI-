<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticado. Token requerido.',
                ], 401);
            }
        });
        // Manejo de modelo no encontrado
        $exceptions->render(function (ModelNotFoundException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Recurso no encontrado',
                ], 404);
            }
        });

        // Manejo de ruta no encontrada
        $exceptions->render(function (NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Endpoint no encontrado',
                ], 404);
            }
        });

        // Manejo de excepciones generales para API
        $exceptions->render(function (\Throwable $e, $request) {
            if (
                $request->is('api/*') &&
                !($e instanceof ValidationException) &&
                !($e instanceof AuthenticationException) &&
                !($e instanceof ModelNotFoundException) &&
                !($e instanceof NotFoundHttpException)
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => config('app.debug') ? $e->getMessage() : null,
                ], 500);
            }
        });
        //
    })->create();
