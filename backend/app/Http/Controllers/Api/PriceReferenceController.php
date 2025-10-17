<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PriceReference;
use App\Traits\ApiResponse;
use App\Http\Requests\PriceReference\StorePriceReferenceRequest;
use App\Http\Requests\PriceReference\UpdatePriceReferenceRequest;
use App\Http\Requests\PriceReference\IndexPriceReferenceRequest;

class PriceReferenceController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(IndexPriceReferenceRequest $request)
    {
        // 1. OBTENER parámetros validados usando los métodos del FormRequest
        $filters = $request->getFilterParams();
        $sort = $request->getSortParams();

        // 2. CONSTRUIR la query base con eager loading optimizado
        $query = PriceReference::query()
            ->with([
                'product:id,name,description',
                'municipality:id,name'
            ]);

        // 3. APLICAR FILTROS ESPECÍFICOS
        // Filtro por producto
        if ($filters['product_id']) {
            $query->where('product_id', $filters['product_id']);
        }

        // Filtro por municipio
        if ($filters['municipality_id']) {
            $query->where('municipality_id', $filters['municipality_id']);
        }

        // Filtro por rango de fechas
        if ($filters['start_date']) {
            $query->where('date', '>=', $filters['start_date']);
        }

        if ($filters['end_date']) {
            $query->where('date', '<=', $filters['end_date']);
        }

        // 4. APLICAR ORDENAMIENTO
        $query->orderBy($sort['sort_by'], $sort['sort_order']);

        // CRÍTICO: Siempre agregar ordenamiento secundario por ID para consistencia
        if ($sort['sort_by'] !== 'id') {
            $query->orderBy('id', $sort['sort_order']);
        }

        // 5. EJECUTAR LA CONSULTA
        $priceReferences = $query->get();

        // 6. RETORNAR respuesta con datos adicionales
        return $this->successResponse(
            $priceReferences,
            'Referencias de precios obtenidas exitosamente',
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
    public function store(StorePriceReferenceRequest $request)
    {
        $priceReference = PriceReference::create($request->getPriceReferenceData());

        // Cargar relaciones para la respuesta
        $priceReference->load([
            'product:id,name',
            'municipality:id,name'
        ]);

        return $this->successResponse(
            $priceReference,
            'Referencia de precio creada exitosamente',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(PriceReference $priceReference)
    {
        $priceReference->load([
            'product:id,name,description',
            'municipality:id,name'
        ]);

        return $this->successResponse(
            $priceReference,
            'Detalles de la referencia de precio obtenidos exitosamente'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePriceReferenceRequest $request, PriceReference $priceReference)
    {
        $priceReference->update($request->getPriceReferenceData());

        // Cargar relaciones para la respuesta
        $priceReference->load([
            'product:id,name',
            'municipality:id,name'
        ]);

        return $this->successResponse(
            $priceReference,
            'Referencia de precio actualizada exitosamente'
        );
    }
}