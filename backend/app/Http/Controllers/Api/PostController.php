<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Post\IndexPostRequest;
use App\Models\Post;
use App\Models\PostImage;
use App\Services\ImageService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Http\Resources\Post\PostResource;
use App\Traits\ApiResponse;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Requests\Post\AddImageRequest;

class PostController extends Controller
{
    use ApiResponse;
    /**
     * Display a listing of the resource.
     */
    protected ImageService $imageService;
    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }



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
    public function store(StorePostRequest  $request)
    {

        try {
            DB::beginTransaction();

            // 1. Crear el post
            $post = Post::create($request->getPostData());

            // 2. Procesar y subir imágenes si existen
            $imageFiles = $request->getImages();

            if ($imageFiles && count($imageFiles) > 0) {


                foreach ($imageFiles as $index => $imageFile) {
                    // Subir imagen al storage
                    $imageUrl = $this->imageService->uploadImage(
                        $imageFile,
                        'posts/' . $post->id // Directorio específico para este post
                    );

                    // Crear registro en la base de datos
                    $post->images()->create([
                        'image_url' => $imageUrl
                    ]);
                }
            }

            // 3. Cargar las relaciones
            $post->load([
                'postType:id,type_name,type_desc',
                'product:id,name,description,image_url,product_type_id',
                'product.productType:id,type_name',
                'user:id,name,email,phone_number,address_details,is_verified',
                'municipality:id,name',
                'images:id,post_id,image_url',
            ]);

            DB::commit();

            return $this->successResponse(
                new PostResource($post),
                'Publicación creada exitosamente',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();

            // Si hubo error, eliminar las imágenes que se subieron
            if (isset($post) && $post->images()->exists()) {
                $imageUrls = $post->images()->pluck('image_url')->toArray();
                $this->imageService->deleteMultipleImages($imageUrls);
            }

            return $this->errorResponse(
                'Error al crear la publicación. Por favor, intenta nuevamente.',
                500
            );
        }
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load([
            'postType:id,type_name,type_desc',
            'product:id,name,description,image_url,product_type_id',
            'product.productType:id,type_name',
            'user:id,name,email,phone_number,address_details,is_verified',
            'municipality:id,name',
            'images:id,post_id,image_url',
        ]);

        return $this->successResponse(
            new PostResource($post),
            'Detalles de la publicación obtenidos exitosamente'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        // Solo el dueño puede editar
        if ($request->user()->id !== $post->user_id) {
            return $this->errorResponse('No tienes permisos para editar esta publicación.', 403);
        }

        $post->update($request->getPostData());

        

        // Procesar imágenes si se envían
        if ($imageFiles = $request->getImages()) {
            foreach ($imageFiles as $imageFile) {
                $imageUrl = $this->imageService->uploadImage(
                    $imageFile,
                    'posts/' . $post->id
                );
                $post->images()->create([
                    'image_url' => $imageUrl
                ]);
            }
        }

        $post->load([
            'postType:id,type_name,type_desc',
            'product:id,name,description,image_url,product_type_id',
            'product.productType:id,type_name',
            'user:id,name,email,phone_number,address_details,is_verified',
            'municipality:id,name',
            'images:id,post_id,image_url',
        ]);

        return $this->successResponse(
            new PostResource($post),
            'Publicación actualizada exitosamente 444'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Post $post)
    {
        // Verificar que el usuario autenticado sea el dueño del post
        if ($request->user()->id !== $post->user_id) {
            return $this->errorResponse('No tienes permisos para eliminar esta publicación.', 403);
        }

        try {
            DB::beginTransaction();

            // Obtener las URLs de las imágenes antes de eliminarlas
            $imageUrls = $post->images()->pluck('image_url')->toArray();

            // Eliminar las imágenes del storage
            if (!empty($imageUrls)) {
                $this->imageService->deleteMultipleImages($imageUrls);
            }

            // Eliminar registros de imágenes de la base de datos
            $post->images()->delete();

            // Eliminar el post
            $post->delete();

            DB::commit();

            return $this->successResponse(
                null,
                'Publicación eliminada exitosamente',
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->errorResponse(
                'Error al eliminar la publicación. Por favor, intenta nuevamente.',
                500
            );
        }
    }

    /**
     * Add an image to the specified post.
     */
    public function addImage(AddImageRequest $request, Post $post)
    {
        // Verificar que el usuario autenticado sea el dueño del post
        if ($request->user()->id !== $post->user_id) {
            return $this->errorResponse('No tienes permisos para añadir imágenes a esta publicación.', 403);
        }

        try {
            // Verificar que el post no tenga ya 5 imágenes
            if ($post->images()->count() >= 5) {
                return $this->errorResponse('No puedes añadir más de 5 imágenes a una publicación.', 422);
            }

            // Subir imagen al storage
            $imageUrl = $this->imageService->uploadImage(
                $request->getImage(),
                'posts/' . $post->id
            );

            // Crear registro en la base de datos
            $postImage = $post->images()->create([
                'image_url' => $imageUrl
            ]);

            return $this->successResponse(
                $postImage,
                'Imagen añadida exitosamente',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Error al añadir la imagen. Por favor, intenta nuevamente.',
                500
            );
        }
    }

    /**
     * Remove the specified image from storage.
     */
    public function deleteImage(Request $request, PostImage $image)
    {
        // Verificar que el usuario autenticado sea el dueño del post al que pertenece la imagen
        if ($request->user()->id !== $image->post->user_id) {
            return $this->errorResponse('No tienes permisos para eliminar esta imagen.', 403);
        }

        try {
            // Eliminar la imagen del storage
            $this->imageService->deleteImage($image->image_url);

            // Eliminar el registro de la base de datos
            $image->delete();

            return $this->successResponse(
                null,
                'Imagen eliminada exitosamente',
                200
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Error al eliminar la imagen. Por favor, intenta nuevamente.',
                500
            );
        }
    }
}
