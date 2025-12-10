<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Municipality;
use App\Traits\ApiResponse;

class MunicipalityController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of municipalities
     */
    public function index()
    {
        $municipalities = Municipality::with('department:id,name')
            ->orderBy('name')
            ->get()
            ->map(function ($municipality) {
                return [
                    'id' => $municipality->id,
                    'name' => $municipality->name,
                    'latitude' => $municipality->latitude,
                    'longitude' => $municipality->longitude,
                    'department' => [
                        'id' => $municipality->department->id,
                        'name' => $municipality->department->name,
                    ],
                ];
            });

        return $this->successResponse(
            $municipalities,
            'Municipios obtenidos exitosamente'
        );
    }

    /**
     * Get municipalities by department
     */
    public function byDepartment($departmentId)
    {
        $municipalities = Municipality::where('department_id', $departmentId)
            ->orderBy('name')
            ->get()
            ->map(function ($municipality) {
                return [
                    'id' => $municipality->id,
                    'name' => $municipality->name,
                    'latitude' => $municipality->latitude,
                    'longitude' => $municipality->longitude,
                ];
            });

        return $this->successResponse(
            $municipalities,
            'Municipios del departamento obtenidos exitosamente'
        );
    }
}
