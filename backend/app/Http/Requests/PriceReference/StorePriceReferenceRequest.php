<?php

namespace App\Http\Requests\PriceReference;

use Illuminate\Foundation\Http\FormRequest;

class StorePriceReferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only admins can create price references
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
            'price_per_kg' => 'required|numeric|min:0.01|max:999999.99',
            'date' => 'required|date',
            'source' => 'nullable|string|max:200',
            'product_id' => 'required|exists:products,id',
            'municipality_id' => 'required|exists:municipalities,id',
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
            'price_per_kg.required' => 'El precio por kilogramo es obligatorio.',
            'price_per_kg.numeric' => 'El precio debe ser un valor numérico.',
            'price_per_kg.min' => 'El precio debe ser mayor a 0.',
            'price_per_kg.max' => 'El precio no debe exceder 999999.99.',
            'date.required' => 'La fecha es obligatoria.',
            'date.date' => 'La fecha debe ser una fecha válida.',
            'source.string' => 'La fuente debe ser una cadena de texto.',
            'source.max' => 'La fuente no debe exceder los 200 caracteres.',
            'product_id.required' => 'El producto es obligatorio.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            'municipality_id.required' => 'El municipio es obligatorio.',
            'municipality_id.exists' => 'El municipio seleccionado no existe.',
        ];
    }

    /**
     * Get the validated price reference data ready for creation.
     *
     * @return array
     */
    public function getPriceReferenceData(): array
    {
        $validated = $this->validated();

        return [
            'price_per_kg' => $validated['price_per_kg'],
            'date' => $validated['date'],
            'source' => $validated['source'] ?? null,
            'product_id' => $validated['product_id'],
            'municipality_id' => $validated['municipality_id'],
        ];
    }
}