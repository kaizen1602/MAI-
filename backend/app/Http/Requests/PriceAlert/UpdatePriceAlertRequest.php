<?php

namespace App\Http\Requests\PriceAlert;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePriceAlertRequest extends FormRequest
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
            'condition' => 'sometimes|in:ABOVE,BELOW',
            'threshold_price' => 'sometimes|numeric|min:0.01|max:999999.99',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
            'product_id' => 'sometimes|exists:products,id',
            'municipality_id' => 'sometimes|exists:municipalities,id',
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
            'condition.in' => 'La condición debe ser ABOVE o BELOW.',
            'threshold_price.numeric' => 'El precio límite debe ser un valor numérico.',
            'threshold_price.min' => 'El precio límite debe ser mayor a 0.',
            'threshold_price.max' => 'El precio límite no debe exceder 999999.99.',
            'status.in' => 'El estado debe ser ACTIVE o INACTIVE.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            'municipality_id.exists' => 'El municipio seleccionado no existe.',
        ];
    }

    /**
     * Get the validated price alert data ready for update.
     *
     * @return array
     */
    public function getPriceAlertData(): array
    {
        $validated = $this->validated();
        
        // Only return fields that are present in the request
        return array_filter([
            'condition' => $validated['condition'] ?? null,
            'threshold_price' => $validated['threshold_price'] ?? null,
            'status' => $validated['status'] ?? null,
            'product_id' => $validated['product_id'] ?? null,
            'municipality_id' => $validated['municipality_id'] ?? null,
        ], function ($value) {
            return !is_null($value);
        });
    }
}