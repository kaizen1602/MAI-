<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PriceAlert;
use App\Traits\ApiResponse;
use App\Http\Requests\PriceAlert\StorePriceAlertRequest;
use App\Http\Requests\PriceAlert\UpdatePriceAlertRequest;
use App\Http\Requests\PriceAlert\IndexPriceAlertRequest;

class PriceAlertController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(IndexPriceAlertRequest $request)
    {
        // 1. OBTENER parámetros validados usando los métodos del FormRequest
        $filters = $request->getFilterParams();
        $sort = $request->getSortParams();

        // 2. CONSTRUIR la query base con eager loading optimizado
        $query = PriceAlert::query()
            ->with([
                'product:id,name,description',
                'municipality:id,name'
            ])
            ->where('user_id', $request->user()->id); // Solo alertas del usuario autenticado

        // 3. APLICAR FILTROS ESPECÍFICOS
        // Filtro por producto
        if ($filters['product_id']) {
            $query->where('product_id', $filters['product_id']);
        }

        // Filtro por municipio
        if ($filters['municipality_id']) {
            $query->where('municipality_id', $filters['municipality_id']);
        }

        // Filtro por estado
        if ($filters['status']) {
            $query->where('status', $filters['status']);
        }

        // 4. APLICAR ORDENAMIENTO
        $query->orderBy($sort['sort_by'], $sort['sort_order']);

        // CRÍTICO: Siempre agregar ordenamiento secundario por ID para consistencia
        if ($sort['sort_by'] !== 'id') {
            $query->orderBy('id', $sort['sort_order']);
        }

        // 5. EJECUTAR LA CONSULTA
        $priceAlerts = $query->get();

        // 6. RETORNAR respuesta con datos adicionales
        return $this->successResponse(
            $priceAlerts,
            'Alertas de precios obtenidas exitosamente',
            200,
            [
                'filters_applied' => $filters,
                'sort_applied' => $sort,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePriceAlertRequest $request)
    {
        $priceAlert = PriceAlert::create($request->getPriceAlertData());

        // Cargar relaciones para la respuesta
        $priceAlert->load([
            'product:id,name',
            'municipality:id,name'
        ]);

        return $this->successResponse(
            $priceAlert,
            'Alerta de precio creada exitosamente',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, PriceAlert $priceAlert)
    {
        // Verificar que el usuario autenticado sea el dueño de la alerta
        if ($request->user()->id !== $priceAlert->user_id) {
            return $this->errorResponse('Alerta no encontrada.', 404);
        }

        $priceAlert->load([
            'product:id,name,description',
            'municipality:id,name'
        ]);

        return $this->successResponse(
            $priceAlert,
            'Detalles de la alerta de precio obtenidos exitosamente'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePriceAlertRequest $request, PriceAlert $priceAlert)
    {
        // Verificar que el usuario autenticado sea el dueño de la alerta
        if ($request->user()->id !== $priceAlert->user_id) {
            return $this->errorResponse('No tienes permisos para actualizar esta alerta de precio.', 403);
        }

        $priceAlert->update($request->getPriceAlertData());

        // Cargar relaciones para la respuesta
        $priceAlert->load([
            'product:id,name',
            'municipality:id,name'
        ]);

        return $this->successResponse(
            $priceAlert,
            'Alerta de precio actualizada exitosamente'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, PriceAlert $priceAlert)
    {
        // Verificar que el usuario autenticado sea el dueño de la alerta
        if ($request->user()->id !== $priceAlert->user_id) {
            return $this->errorResponse('No tienes permisos para eliminar esta alerta de precio.', 403);
        }

        $priceAlert->delete();

        return $this->successResponse(
            null,
            'Alerta de precio eliminada exitosamente'
        );
    }
}