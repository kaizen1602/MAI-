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
}
