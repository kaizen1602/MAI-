<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string|max:1000',
            'image_url' => 'nullable|url|max:500',
            'product_type_id' => 'required|exists:products_type,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del producto es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'name.unique' => 'Ya existe un producto con este nombre.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
            'description.max' => 'La descripción no debe exceder los 1000 caracteres.',
            'image_url.url' => 'La URL de la imagen debe ser válida.',
            'image_url.max' => 'La URL de la imagen no debe exceder los 500 caracteres.',
            'product_type_id.required' => 'El tipo de producto es obligatorio.',
            'product_type_id.exists' => 'El tipo de producto seleccionado no es válido.',
        ];
    }

    public function getProductData(): array
    {
        return [
            'name' => $this->validated()['name'],
            'description' => $this->validated()['description'] ?? null,
            'image_url' => $this->validated()['image_url'] ?? null,
            'product_type_id' => $this->validated()['product_type_id'],
        ];
    }
}
