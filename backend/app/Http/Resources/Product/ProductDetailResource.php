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
        // Filtrar posts por tipo: oferta y demanda
        // Asumimos que 'oferta' tiene post_type_id = 1 y 'demanda' tiene post_type_id = 2
        $supplyPosts = $this->posts->where('post_type_id', 1);
        $demandPosts = $this->posts->where('post_type_id', 2);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'product_type' => new ProductTypeResource($this->whenLoaded('productType')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'stats' => [
                'supply' => [
                    'total_posts' => $supplyPosts->count(),
                    'total_quantity_kg' => $supplyPosts->sum('quantity_kg'),
                    'average_price_per_kg' => $supplyPosts->avg('price_per_kg'),
                    'last_3_posts' => $supplyPosts->take(3)->map(fn($post) => [
                        'title' => $post->title,
                        'quantity_kg' => $post->quantity_kg,
                        'price_per_kg' => $post->price_per_kg,
                        'created_at' => $post->created_at->toIso8601String(),
                    ]),
                ],
                'demand' => [
                    'total_posts' => $demandPosts->count(),
                    'total_quantity_kg' => $demandPosts->sum('quantity_kg'),
                    'average_price_per_kg' => $demandPosts->avg('price_per_kg'),
                    'last_3_posts' => $demandPosts->take(3)->map(fn($post) => [
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
