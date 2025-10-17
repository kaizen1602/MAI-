<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class IndexReviewRequest extends FormRequest
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
            'reviewer_id' => 'sometimes|integer|exists:users,id',
            'reviewed_id' => 'required|integer|exists:users,id',
            
            // Ordenamiento
            'sort_by' => 'sometimes|string|in:rating,created_at,updated_at',
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
            'reviewer_id.integer' => 'El ID del usuario que califica debe ser un número entero.',
            'reviewer_id.exists' => 'El usuario que califica no existe.',
            
            'reviewed_id.integer' => 'El ID del usuario calificado debe ser un número entero.',
            'reviewed_id.exists' => 'El usuario calificado no existe.',
            'reviewed_id.required' => 'El ID del usuario calificado es obligatorio.',
            
            'sort_by.in' => 'El campo de ordenamiento no es válido. Valores permitidos: rating, created_at, updated_at.',
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
            'reviewer_id' => $validated['reviewer_id'] ?? null,
            'reviewed_id' => $validated['reviewed_id'] ?? null,
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