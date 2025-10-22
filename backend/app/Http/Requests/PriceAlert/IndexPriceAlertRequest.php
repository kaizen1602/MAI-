<?php

namespace App\Http\Requests\PriceAlert;

use Illuminate\Foundation\Http\FormRequest;

class IndexPriceAlertRequest extends FormRequest
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
            // Filtros
            'product_id' => 'sometimes|integer|exists:products,id',
            'municipality_id' => 'sometimes|integer|exists:municipalities,id',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
            
            // Ordenamiento
            'sort_by' => 'sometimes|string|in:condition,threshold_price,status,created_at',
            'sort_order' => 'sometimes|string|in:asc,desc',
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
            'product_id.integer' => 'El ID del producto debe ser un número entero.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            
            'municipality_id.integer' => 'El ID del municipio debe ser un número entero.',
            'municipality_id.exists' => 'El municipio seleccionado no existe.',
            
            'status.in' => 'El estado debe ser: ACTIVE o INACTIVE.',
            
            'sort_by.in' => 'El campo de ordenamiento no es válido. Valores permitidos: condition, threshold_price, status, created_at.',
            'sort_order.in' => 'El orden debe ser: asc o desc.',
        ];
    }

    /**
     * Get the validated filter parameters.
     *
     * @return array
     */
    public function getFilterParams(): array
    {
        $validated = $this->validated();
        
        return [
            'product_id' => $validated['product_id'] ?? null,
            'municipality_id' => $validated['municipality_id'] ?? null,
            'status' => $validated['status'] ?? null,
        ];
    }

    /**
     * Get the validated sort parameters.
     *
     * @return array
     */
    public function getSortParams(): array
    {
        $validated = $this->validated();
        
        return [
            'sort_by' => $validated['sort_by'] ?? 'created_at',
            'sort_order' => $validated['sort_order'] ?? 'desc',
        ];
    }
}