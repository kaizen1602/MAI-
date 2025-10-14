<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\CursorPaginator;

trait ApiResponse
{
    /**
     * Respuesta exitosa
     */
    protected function successResponse($data, string $message, int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Respuesta de error
     */
    protected function errorResponse(string $message, int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Respuesta de paginación
     */
    protected function paginatedResponse($data, string $message): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data->items(),
            'pagination' => [
                'total' => $data->total(),
                'per_page' => $data->perPage(),
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'prev_page' => $data->currentPage() > 1 ? $data->currentPage() - 1 : null,
                'next_page' => $data->hasMorePages() ? $data->currentPage() + 1 : null,
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
                'prev_page_url' => $data->previousPageUrl(),
                'next_page_url' => $data->nextPageUrl(),
                'first_page_url' => $data->url(1),
                'last_page_url' => $data->url($data->lastPage()),
            ],
        ], 200);
    }
    /**
     * Respuesta exitosa con datos paginados (cursor).
     *
     * @param CursorPaginator $paginator
     * @param string $message
     * @param array $additionalData
     * @return JsonResponse
     */
    protected function cursorPaginatedResponse(
        CursorPaginator $paginator,
        string $message = 'Datos obtenidos exitosamente',
        array $additionalData = []
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'pagination' => [
                'per_page' => $paginator->perPage(),
                'next_cursor' => $paginator->nextCursor()?->encode(),
                'prev_cursor' => $paginator->previousCursor()?->encode(),
                'next_page_url' => $paginator->nextPageUrl(),
                'prev_page_url' => $paginator->previousPageUrl(),
                'has_more_pages' => $paginator->hasMorePages(),
            ],
            ...$additionalData,
        ], 200);
    }
    /**
     * Respuesta no encontrado
     */
    protected function notFoundResponse(string $message = 'Recurso no encontrado'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }
}
