<?php

namespace App\Http\Resources\Post;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'quantity_kg' => (float) $this->quantity_kg,
            'price_per_kg' => (float) $this->price_per_kg,
            'total_price' => (float) ($this->quantity_kg * $this->price_per_kg),
            'status' => $this->status,

            // Relación: PostType (ajustado a type_name y type_desc)
            'post_type' => $this->when($this->relationLoaded('postType'), function () {
                return [
                    'id' => $this->postType->id,
                    'name' => $this->postType->type_name,
                    'description' => $this->postType->type_desc,
                ];
            }),

            // Relación: Product (ajustado con image_url)
            'product' => $this->when($this->relationLoaded('product'), function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'description' => $this->product->description,
                    'image_url' => $this->product->image_url,
                    'product_type' => $this->when($this->product->relationLoaded('productType'), function () {
                        return [
                            'id' => $this->product->productType->id,
                            'name' => $this->product->productType->type_name,
                            'description' => $this->product->productType->description,
                        ];
                    }),
                ];
            }),

            // Relación: User
            'user' => $this->when($this->relationLoaded('user'), function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'phone_number' => $this->user->phone_number,
                    'address_details' => $this->user->address_details,
                    'is_verified' => $this->user->is_verified,
                    // NO incluir password, remember_token, etc.
                ];
            }),

            // Relación: Municipality
            'municipality' => $this->when($this->relationLoaded('municipality'), function () {
                return [
                    'id' => $this->municipality->id,
                    'name' => $this->municipality->name,
                    // Agrega department si existe en tu modelo Municipality
                ];
            }),

            // Relación: Images
            'images' => $this->when($this->relationLoaded('images'), function () {
                return $this->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => $image->url,
                    ];
                });
            }),

            // Contador de favoritos
            'favorites_count' => $this->when(
                $this->relationLoaded('favoritedBy'),
                fn() => $this->favoritedBy->count(),
                0
            ),

            // Verificar si el usuario actual lo tiene en favoritos
            'is_favorited' => $this->when(
                $request->user(),
                fn() => $this->favoritedBy()
                    ->where('user_id', $request->user()->id)
                    ->exists(),
                false
            ),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
