<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Traits\ApiResponse;
use App\Http\Resources\Product\ProductResource;
use App\Http\Resources\Product\ProductDetailResource;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;


class ProductController extends Controller
{
    use ApiResponse;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('productType');

        // Búsqueda por nombre
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtro por tipo de producto
        if ($request->has('product_type_id') && $request->product_type_id) {
            $query->where('product_type_id', $request->product_type_id);
        }

        // Ordenamiento
        $sortBy = $request->input('sort_by', 'name');
        $sortOrder = $request->input('sort_order', 'asc');

        if (in_array($sortBy, ['name', 'created_at', 'updated_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Paginación
        $perPage = $request->input('per_page', 15);
        $perPage = min(max((int) $perPage, 1), 100); // Limitar entre 1 y 100

        $products = $query->paginate($perPage);

        return $this->paginatedResponse(
            $products->setCollection(
                $products->getCollection()->map(fn($product) => new ProductResource($product))
            ),
            'Productos obtenidos exitosamente'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->getProductData());
        $product->load('productType');

        return $this->successResponse(
            new ProductResource($product),
            'Producto creado exitosamente',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['productType', 'posts' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return $this->successResponse(
            new ProductDetailResource($product),
            'Detalles del producto obtenidos exitosamente'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->getProductData());
        $product->load('productType');

        return $this->successResponse(
            new ProductResource($product),
            'Producto actualizado exitosamente'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Verificar si tiene posts asociados
        if ($product->posts()->exists()) {
            return $this->errorResponse(
                'No se puede eliminar el producto porque tiene publicaciones asociadas',
                409
            );
        }

        $product->delete();

        return $this->successResponse(
            null,
            'Producto eliminado exitosamente'
        );
    }
}
