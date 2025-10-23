<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductType;
use App\Traits\ApiResponse;

class ProductTypeController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of product types
     */
    public function index()
    {
        $productTypes = ProductType::all()->map(function ($productType) {
            return [
                'id' => $productType->id,
                'name' => $productType->type_name,
                'description' => $productType->description,
            ];
        });

        return $this->successResponse(
            $productTypes,
            'Tipos de producto obtenidos exitosamente'
        );
    }
}
