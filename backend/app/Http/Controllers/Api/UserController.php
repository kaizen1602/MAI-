<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Traits\ApiResponse;

use App\Http\Resources\User\PublicUserResource;
class UserController extends Controller
{
    use ApiResponse;
    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load([
            'role',
            'reviewsReceived' // Para calcular el rating promedio
        ]);
        //

        return $this->successResponse(
            [
                'user' => new PublicUserResource($user),
            ],
            'Perfil público obtenido correctamente'
        );
    }

    /**
     * Get user's average rating
     */
    public function getUserRating(User $user)
    {
        $reviews = $user->reviewsReceived;
        
        if ($reviews->isEmpty()) {
            return $this->successResponse([
                'average_rating' => 0,
                'total_reviews' => 0,
                'rating_breakdown' => [
                    '5_stars' => 0,
                    '4_stars' => 0,
                    '3_stars' => 0,
                    '2_stars' => 0,
                    '1_star' => 0
                ]
            ], 'Calificación obtenida correctamente');
        }

        $totalReviews = $reviews->count();
        $averageRating = $reviews->avg('rating');
        
        // Calcular distribución de calificaciones
        $ratingBreakdown = [
            '5_stars' => $reviews->where('rating', 5)->count(),
            '4_stars' => $reviews->where('rating', 4)->count(),
            '3_stars' => $reviews->where('rating', 3)->count(),
            '2_stars' => $reviews->where('rating', 2)->count(),
            '1_star' => $reviews->where('rating', 1)->count()
        ];

        return $this->successResponse([
            'average_rating' => round($averageRating, 1),
            'total_reviews' => $totalReviews,
            'rating_breakdown' => $ratingBreakdown
        ], 'Calificación obtenida correctamente');
    }
}
