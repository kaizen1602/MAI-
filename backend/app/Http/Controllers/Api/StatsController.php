<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Municipality;
use App\Traits\ApiResponse;

class StatsController extends Controller
{
    use ApiResponse;

    /**
     * Get location statistics with coordinates for map visualization.
     * Public endpoint for frontend map charts.
     */
    public function getLocationStats()
    {
        try {
            // Get all ACTIVE posts with municipality and coordinates
            $posts = Post::where('status', 'ACTIVE')
                ->with(['municipality:id,name,latitude,longitude,department_id', 'municipality.department:id,name'])
                ->get();

            // Aggregate by municipality and include coordinates
            $locationStats = $posts->groupBy('municipality_id')
                ->map(function ($postsInMunicipality) {
                    $municipality = $postsInMunicipality->first()->municipality;
                    
                    if (!$municipality) {
                        return null;
                    }

                    return [
                        'id' => $municipality->id,
                        'name' => $municipality->name,
                        'latitude' => (float) $municipality->latitude,
                        'longitude' => (float) $municipality->longitude,
                        'department' => $municipality->department ? [
                            'id' => $municipality->department->id,
                            'name' => $municipality->department->name,
                        ] : null,
                        'post_count' => $postsInMunicipality->count(),
                        'posts' => $postsInMunicipality->map(function ($post) {
                            return [
                                'id' => $post->id,
                                'title' => $post->title,
                            ];
                        })->toArray(),
                    ];
                })
                ->filter() // Remove null entries
                ->values();

            return $this->successResponse(
                $locationStats,
                'Estadísticas de ubicación obtenidas exitosamente'
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Error al obtener estadísticas de ubicación.',
                500
            );
        }
    }
}
