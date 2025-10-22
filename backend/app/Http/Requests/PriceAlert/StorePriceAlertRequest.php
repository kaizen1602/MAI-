<?php

namespace App\Http\Requests\PriceAlert;

use Illuminate\Foundation\Http\FormRequest;

class StorePriceAlertRequest extends FormRequest
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
            'condition' => 'required|in:ABOVE,BELOW',
            'threshold_price' => 'required|numeric|min:0.01|max:999999.99',
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
            'condition.required' => 'La condición es obligatoria.',
            'condition.in' => 'La condición debe ser ABOVE o BELOW.',
            'threshold_price.required' => 'El precio límite es obligatorio.',
            'threshold_price.numeric' => 'El precio límite debe ser un valor numérico.',
            'threshold_price.min' => 'El precio límite debe ser mayor a 0.',
            'threshold_price.max' => 'El precio límite no debe exceder 999999.99.',
            'product_id.required' => 'El producto es obligatorio.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            'municipality_id.required' => 'El municipio es obligatorio.',
            'municipality_id.exists' => 'El municipio seleccionado no existe.',
        ];
    }

    /**
     * Get the validated price alert data ready for creation.
     *
     * @return array
     */
    public function getPriceAlertData(): array
    {
        $validated = $this->validated();

        return [
            'condition' => $validated['condition'],
            'threshold_price' => $validated['threshold_price'],
            'status' => 'INACTIVE', // Por defecto INACTIVE
            'product_id' => $validated['product_id'],
            'municipality_id' => $validated['municipality_id'],
            'user_id' => $this->user()->id, // Usuario autenticado
        ];
    }
}