<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Post\IndexPostRequest;
use App\Models\Post;

use App\Http\Resources\Post\PostResource;
use App\Traits\ApiResponse;


class PostController extends Controller
{
    use ApiResponse;
    /**
     * Display a listing of the resource.
     */
    public function index(IndexPostRequest $request)
    {

        // 1. OBTENER parámetros validados usando los métodos del FormRequest
        $filters = $request->getFilterParams();
        $sort = $request->getSortParams();
        $perPage = $request->getPerPage();

        // 2. CONSTRUIR la query base con eager loading optimizado
        $query = Post::query()
            ->with([
                'postType:id,type_name,type_desc',
                'product:id,name,description,image_url,product_type_id',
                'product.productType:id,type_name,description', // Nested eager loading
                'user:id,name,email,phone_number,address_details,is_verified',
                'municipality:id,name',
                'images:id,post_id,image_url', // Cargar solo campos necesarios|
            ])
            // Aplicar filtro de estado (por defecto ACTIVE)
            ->where('status', $filters['status']);

        // 3. APLICAR FILTRO DE BÚSQUEDA
        if ($filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 4. APLICAR FILTROS ESPECÍFICOS
        // Filtro por producto
        if ($filters['product_id']) {
            $query->where('product_id', $filters['product_id']);
        }

        // Filtro por municipio
        if ($filters['municipality_id']) {
            $query->where('municipality_id', $filters['municipality_id']);
        }

        // Filtro por tipo de post (venta/compra)
        if ($filters['post_type_id']) {
            $query->where('post_type_id', $filters['post_type_id']);
        }

        // Filtro por usuario
        if ($filters['user_id']) {
            $query->where('user_id', $filters['user_id']);
        }

        // 5. APLICAR ORDENAMIENTO
        $query->orderBy($sort['sort_by'], $sort['sort_order']);

        // CRÍTICO: Siempre agregar ordenamiento secundario por ID para consistencia del cursor
        if ($sort['sort_by'] !== 'id') {
            $query->orderBy('id', $sort['sort_order']);
        }

        // 6. APLICAR PAGINACIÓN POR CURSOR
        // Laravel automáticamente lee el parámetro ?cursor=xxx de la URL
        $posts = $query->cursorPaginate($perPage);

        // 7. TRANSFORMAR con Resource
        $posts->setCollection(
            $posts->getCollection()->map(fn($post) => new PostResource($post))
        );

        // 8. RETORNAR respuesta con datos adicionales
        return $this->cursorPaginatedResponse(
            $posts,
            'Publicaciones obtenidas exitosamente',
            [
                'filters_applied' => $filters,
                'sort_applied' => $sort,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
