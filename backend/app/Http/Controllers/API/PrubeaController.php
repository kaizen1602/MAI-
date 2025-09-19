<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Prubea;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class PrubeaController extends Controller
{
    public function index()
    {
        return response()->json(Prubea::orderBy('id', 'desc')->get());
    }

    public function show(Prubea $prubea)
    {
        return response()->json($prubea);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombres' => ['required','string','max:120'],
            'apellidos' => ['required','string','max:120'],
            'email' => ['required','email','max:150','unique:prubea,email'],
            'telefono' => ['nullable','string','max:30'],
            'fecha_nacimiento' => ['nullable','date'],
        ]);

        $model = Prubea::create($data);
        return response()->json($model, Response::HTTP_CREATED);
    }

    public function update(Request $request, Prubea $prubea)
    {
        $data = $request->validate([
            'nombres' => ['sometimes','required','string','max:120'],
            'apellidos' => ['sometimes','required','string','max:120'],
            'email' => ['sometimes','required','email','max:150', Rule::unique('prubea','email')->ignore($prubea->id)],
            'telefono' => ['nullable','string','max:30'],
            'fecha_nacimiento' => ['nullable','date'],
        ]);

        $prubea->update($data);
        return response()->json($prubea);
    }

    public function destroy(Prubea $prubea)
    {
        $prubea->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
