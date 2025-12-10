<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Municipality;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:400',
            'quantity_kg' => 'sometimes|numeric|min:0.01|max:999999.99',
            'price_per_kg' => 'sometimes|numeric|min:0.01|max:999999.99',
            'post_type_id' => 'sometimes|integer|exists:post_types,id',
            'product_id' => 'sometimes|integer|exists:products,id',
            'municipality_id' => 'sometimes|integer|exists:municipalities,id',
            'department_id' => 'sometimes|integer|exists:departments,id',
            'location' => 'nullable|string|max:200',

            // Validación de imágenes como archivos (opcional)
            'images' => 'nullable|array|max:5',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB máximo
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.string' => 'El título debe ser una cadena de texto.',
            'title.max' => 'El título no debe exceder los 100 caracteres.',

            'description.string' => 'La descripción debe ser una cadena de texto.',
            'description.max' => 'La descripción no debe exceder los 400 caracteres.',

            'quantity_kg.numeric' => 'La cantidad debe ser un valor numérico.',
            'quantity_kg.min' => 'La cantidad debe ser mayor a 0.',
            'quantity_kg.max' => 'La cantidad no debe exceder 999999.99 kg.',

            'price_per_kg.numeric' => 'El precio debe ser un valor numérico.',
            'price_per_kg.min' => 'El precio debe ser mayor a 0.',
            'price_per_kg.max' => 'El precio no debe exceder 999999.99.',

            'post_type_id.integer' => 'El tipo de publicación debe ser un número entero.',
            'post_type_id.exists' => 'El tipo de publicación seleccionado no es válido.',

            'product_id.integer' => 'El ID del producto debe ser un número entero.',
            'product_id.exists' => 'El producto seleccionado no existe.',

            'municipality_id.integer' => 'El ID del municipio debe ser un número entero.',
            'municipality_id.exists' => 'El municipio seleccionado no existe.',
            'department_id.integer' => 'El ID del departamento debe ser un número entero.',
            'department_id.exists' => 'El departamento seleccionado no existe.',
            'location.string' => 'La ubicación debe ser una cadena de texto.',
            'location.max' => 'La ubicación no debe exceder los 200 caracteres.',

            // Mensajes para imágenes
            'images.array' => 'Las imágenes deben enviarse como un array.',
            'images.max' => 'No puedes subir más de 5 imágenes.',
            'images.*.image' => 'Cada archivo debe ser una imagen.',
            'images.*.mimes' => 'Las imágenes deben ser de tipo: jpeg, png, jpg o webp.',
            'images.*.max' => 'Cada imagen no debe exceder los 5MB.',
        ];
    }

    /**
     * Get the validated post data ready for update.
     *
     * @return array
     */
    public function getPostData(): array
    {
        $validated = $this->validated();
        // Solo devolver los campos presentes
        $data = array_filter([
            'title' => $validated['title'] ?? null,
            'description' => $validated['description'] ?? null,
            'quantity_kg' => $validated['quantity_kg'] ?? null,
            'price_per_kg' => $validated['price_per_kg'] ?? null,
            'post_type_id' => $validated['post_type_id'] ?? null,
            'product_id' => $validated['product_id'] ?? null,
            'municipality_id' => $validated['municipality_id'] ?? null,
            'location' => $validated['location'] ?? null,
        ], function ($value) {
            return !is_null($value);
        });

        // Agregar department_id derivado o explícito si está presente
        if (isset($validated['department_id'])) {
            $data['department_id'] = $validated['department_id'];
        } elseif (!empty($validated['municipality_id'])) {
            $municipality = Municipality::find($validated['municipality_id']);
            if ($municipality && $municipality->department_id) {
                $data['department_id'] = $municipality->department_id;
            }
        }

        return $data;
    }

    /**
     * Get the images array if provided.
     *
     * @return array|null
     */
    public function getImages(): ?array
    {
        return $this->file('images');
    }
}
