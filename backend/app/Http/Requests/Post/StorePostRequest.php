<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
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
            'title' => 'required|string|max:100',
            'description' => 'nullable|string|max:400',
            'quantity_kg' => 'required|numeric|min:0.01|max:999999.99',
            'price_per_kg' => 'required|numeric|min:0.01|max:999999.99',
            'post_type_id' => 'required|integer|exists:post_types,id',
            'product_id' => 'required|integer|exists:products,id',
            'municipality_id' => 'required|integer|exists:municipalities,id',

            // Validación de imágenes como archivos
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
            // Title
            'title.required' => 'El título de la publicación es obligatorio.',
            'title.string' => 'El título debe ser una cadena de texto.',
            'title.max' => 'El título no debe exceder los 100 caracteres.',

            // Description
            'description.string' => 'La descripción debe ser una cadena de texto.',
            'description.max' => 'La descripción no debe exceder los 400 caracteres.',

            // Quantity
            'quantity_kg.required' => 'La cantidad en kilogramos es obligatoria.',
            'quantity_kg.numeric' => 'La cantidad debe ser un valor numérico.',
            'quantity_kg.min' => 'La cantidad debe ser mayor a 0.',
            'quantity_kg.max' => 'La cantidad no debe exceder 999999.99 kg.',

            // Price
            'price_per_kg.required' => 'El precio por kilogramo es obligatorio.',
            'price_per_kg.numeric' => 'El precio debe ser un valor numérico.',
            'price_per_kg.min' => 'El precio debe ser mayor a 0.',
            'price_per_kg.max' => 'El precio no debe exceder 999999.99.',

            // Post Type
            'post_type_id.required' => 'El tipo de publicación es obligatorio.',
            'post_type_id.integer' => 'El tipo de publicación debe ser un número entero.',
            'post_type_id.exists' => 'El tipo de publicación seleccionado no es válido.',

            // Product
            'product_id.required' => 'El producto es obligatorio.',
            'product_id.integer' => 'El ID del producto debe ser un número entero.',
            'product_id.exists' => 'El producto seleccionado no existe.',

            // Municipality
            'municipality_id.required' => 'El municipio es obligatorio.',
            'municipality_id.integer' => 'El ID del municipio debe ser un número entero.',
            'municipality_id.exists' => 'El municipio seleccionado no existe.',

            // Mensajes para imágenes
            'images.array' => 'Las imágenes deben enviarse como un array.',
            'images.max' => 'No puedes subir más de 5 imágenes.',
            'images.*.image' => 'Cada archivo debe ser una imagen.',
            'images.*.mimes' => 'Las imágenes deben ser de tipo: jpeg, png, jpg o webp.',
            'images.*.max' => 'Cada imagen no debe exceder los 5MB.',

        ];
    }

    /**
     * Get the validated post data ready for creation.
     *
     * @return array
     */
    public function getPostData(): array
    {
        $validated = $this->validated();

        return [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'quantity_kg' => $validated['quantity_kg'],
            'price_per_kg' => $validated['price_per_kg'],
            'status' => 'ACTIVE', // Siempre ACTIVE al crear
            'post_type_id' => $validated['post_type_id'],
            'product_id' => $validated['product_id'],
            'municipality_id' => $validated['municipality_id'],
            'user_id' => $this->user()->id, // Usuario autenticado
        ];
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
