<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Traits\ApiResponse;

class DepartmentController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of departments
     */
    public function index()
    {
        $departments = Department::orderBy('name')
            ->get()
            ->map(function ($department) {
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                ];
            });

        return $this->successResponse(
            $departments,
            'Departamentos obtenidos exitosamente'
        );
    }
}
