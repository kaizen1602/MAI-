<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Traits\ApiResponse;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Http\Requests\Review\IndexReviewRequest;

class ReviewController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(IndexReviewRequest $request)
    {
        // 1. OBTENER parámetros validados usando los métodos del FormRequest
        $filters = $request->getFilterParams();
        $sort = $request->getSortParams();

        // 2. CONSTRUIR la query base con eager loading optimizado
        $query = Review::query()
            ->with([
                'reviewer:id,name',
                'reviewed:id,name'
            ]);

        // 3. APLICAR FILTROS ESPECÍFICOS
        // Filtro por usuario que califica
        if ($filters['reviewer_id']) {
            $query->where('reviewer_id', $filters['reviewer_id']);
        }

        // Filtro por usuario calificado
        if ($filters['reviewed_id']) {
            $query->where('reviewed_id', $filters['reviewed_id']);
        }

        // 4. APLICAR ORDENAMIENTO
        $query->orderBy($sort['sort_by'], $sort['sort_order']);

        // CRÍTICO: Siempre agregar ordenamiento secundario por ID para consistencia
        if ($sort['sort_by'] !== 'id') {
            $query->orderBy('id', $sort['sort_order']);
        }

        // 5. EJECUTAR LA CONSULTA
        $reviews = $query->get();

        // 6. RETORNAR respuesta con datos adicionales
        return $this->successResponse(
            $reviews,
            'Reseñas obtenidas exitosamente',
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
    public function store(StoreReviewRequest $request)
    {
        // Verificar que el usuario no se esté calificando a sí mismo
        if ($request->user()->id === $request->validated()['reviewed_id']) {
            return $this->errorResponse('No puedes calificarte a ti mismo.', 422);
        }

        // Verificar que el usuario no haya calificado previamente al mismo usuario
        $existingReview = Review::where('reviewer_id', $request->user()->id)
            ->where('reviewed_id', $request->validated()['reviewed_id'])
            ->first();

        if ($existingReview) {
            return $this->errorResponse('Ya has calificado previamente a este usuario.', 422);
        }

        $review = Review::create($request->getReviewData());

        // Cargar relaciones para la respuesta
        $review->load([
            'reviewer:id,name',
            'reviewed:id,name'
        ]);

        return $this->successResponse(
            $review,
            'Reseña creada exitosamente',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        $review->load([
            'reviewer:id,name',
            'reviewed:id,name'
        ]);

        return $this->successResponse(
            $review,
            'Detalles de la reseña obtenidos exitosamente'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {
        // Verificar que el usuario autenticado sea quien creó la reseña
        if ($request->user()->id !== $review->reviewer_id) {
            return $this->errorResponse('No tienes permisos para actualizar esta reseña.', 403);
        }

        $review->update($request->getReviewData());

        // Cargar relaciones para la respuesta
        $review->load([
            'reviewer:id,name',
            'reviewed:id,name'
        ]);

        return $this->successResponse(
            $review,
            'Reseña actualizada exitosamente'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Review $review)
    {
        // Verificar que el usuario autenticado sea quien creó la reseña
        if ($request->user()->id !== $review->reviewer_id) {
            return $this->errorResponse('No tienes permisos para eliminar esta reseña.', 403);
        }

        $review->delete();

        return $this->successResponse(
            null,
            'Reseña eliminada exitosamente'
        );
    }
}