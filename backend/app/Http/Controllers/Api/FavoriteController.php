<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\UserPublicationFavorite;
use App\Traits\ApiResponse;
use App\Http\Requests\Favorite\StoreFavoriteRequest;
use App\Http\Resources\Post\PostResource;

class FavoriteController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Obtener las publicaciones favoritas del usuario autenticado
        $posts = Post::whereHas('favoritedBy', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
        ->with([
            'postType:id,type_name,type_desc',
            'product:id,name,description,image_url,product_type_id',
            'product.productType:id,type_name,description',
            'user:id,name,email,phone_number,address_details,is_verified',
            'municipality:id,name',
            'images:id,post_id,image_url',
        ])
        ->get();

        // Transformar las publicaciones usando PostResource
        $posts = $posts->map(function ($post) {
            return new PostResource($post);
        });

        return $this->successResponse(
            $posts,
            'Lista de publicaciones favoritas obtenida exitosamente'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFavoriteRequest $request)
    {
        $favoriteData = $request->getFavoriteData();

        // Verificar si ya existe la relación
        $existingFavorite = UserPublicationFavorite::where('user_id', $favoriteData['user_id'])
            ->where('post_id', $favoriteData['post_id'])
            ->first();

        if ($existingFavorite) {
            return $this->successResponse(
                null,
                'La publicación ya está en tus favoritos',
                200
            );
        }

        // Crear la relación de favorito
        $favorite = UserPublicationFavorite::create([
            'user_id' => $favoriteData['user_id'],
            'post_id' => $favoriteData['post_id'],
            'date' => now(),
        ]);

        return $this->successResponse(
            $favorite,
            'Publicación añadida a favoritos exitosamente',
            201
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $postId)
    {
        // Verificar que la publicación exista
        $post = Post::find($postId);
        if (!$post) {
            return $this->errorResponse('La publicación no existe.', 404);
        }

        // Eliminar la relación de favorito
        $deleted = UserPublicationFavorite::where('user_id', $request->user()->id)
            ->where('post_id', $postId)
            ->delete();

        if (!$deleted) {
            return $this->errorResponse('La publicación no está en tus favoritos.', 404);
        }

        return $this->successResponse(
            null,
            'Publicación eliminada de favoritos exitosamente',
            200
        );
    }
}