<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->id,
            'name' => $this->name,
            'created_at' => $this->created_at,
            
            // ✅ Rol del usuario (opcional)
            'role' => $this->whenLoaded('role', function () {
                return [
                    'id' => $this->role->id,
                    'name' => $this->role->role_name,
                ];
            }),
            
            // ✅ Calificación promedio calculada
            'average_rating' => $this->whenLoaded('reviewsReceived', function () {
                $avg = $this->reviewsReceived->avg('rating');
                return $avg ? round($avg, 2) : null;
            }),
            
            // ✅ Total de reseñas recibidas
            'reviews_count' => $this->whenLoaded('reviewsReceived', function () {
                return $this->reviewsReceived->count();
            }),
            
            // ✅ Fecha de registro (miembro desde...)
            'member_since' => $this->created_at->format('Y-m-d'),
        ];
    }
}
