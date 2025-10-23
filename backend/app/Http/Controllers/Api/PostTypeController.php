<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PostType;
use App\Traits\ApiResponse;

class PostTypeController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of post types
     */
    public function index()
    {
        $postTypes = PostType::all()->map(function ($postType) {
            return [
                'id' => $postType->id,
                'name' => $postType->type_name,
                'description' => $postType->type_desc,
            ];
        });

        return $this->successResponse(
            $postTypes,
            'Tipos de publicación obtenidos exitosamente'
        );
    }
}
