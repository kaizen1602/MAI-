<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'address_details' => $this->address_details,
            'is_verified' => $this->is_verified,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // ✅ Relaciones incluidas
           'role' => $this->whenLoaded('role', fn() => [
                'id' => $this->role->id,
                'name' => $this->role->role_name,
            ]),

            // Incluir otras relaciones solo si están cargadas
            'posts_count' => $this->whenLoaded('posts', fn() => $this->posts->count()),
            'favorites_count' => $this->whenLoaded('favorites', fn() => $this->favorites->count()),
        ];
    }
}
