<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Product\ProductTypeResource;

class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Filtrar posts por tipo: venta y compra
        // Asumimos que 'venta' tiene post_type_id = 1 y 'compra' tiene post_type_id = 2
        $salePosts = $this->posts->where('post_type_id', 1);
        $purchasePosts = $this->posts->where('post_type_id', 2);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'product_type' => new ProductTypeResource($this->whenLoaded('productType')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'stats' => [
                'sales' => [
                    'total_posts' => $salePosts->count(),
                    'total_quantity_kg' => $salePosts->sum('quantity_kg'),
                    'average_price_per_kg' => $salePosts->avg('price_per_kg'),
                    'last_3_posts' => $salePosts->take(3)->map(fn($post) => [
                        'title' => $post->title,
                        'quantity_kg' => $post->quantity_kg,
                        'price_per_kg' => $post->price_per_kg,
                        'created_at' => $post->created_at->toIso8601String(),
                    ]),
                ],
                'purchases' => [
                    'total_posts' => $purchasePosts->count(),
                    'total_quantity_kg' => $purchasePosts->sum('quantity_kg'),
                    'average_price_per_kg' => $purchasePosts->avg('price_per_kg'),
                    'last_3_posts' => $purchasePosts->take(3)->map(fn($post) => [
                        'title' => $post->title,
                        'quantity_kg' => $post->quantity_kg,
                        'price_per_kg' => $post->price_per_kg,
                        'created_at' => $post->created_at->toIso8601String(),
                    ]),
                ],
            ],
        ];
    }
}
