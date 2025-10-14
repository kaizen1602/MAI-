<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;

class IndexPostRequest extends FormRequest
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
            'search' => 'sometimes|string|max:255',
            'product_id' => 'sometimes|integer|exists:products,id',
            'municipality_id' => 'sometimes|integer|exists:municipalities,id',
            'post_type_id' => 'sometimes|integer|exists:post_types,id',
            'user_id' => 'sometimes|integer|exists:users,id',
            'status' => 'sometimes|string|in:ACTIVE,CLOSED,EXPIRED',
            
            // Ordenamiento
            'sort_by' => 'sometimes|string|in:created_at,price_per_kg,quantity_kg,title,updated_at',
            'sort_order' => 'sometimes|string|in:asc,desc',
            
            // Paginación
            'per_page' => 'sometimes|integer|min:1|max:100',
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
            'search.string' => 'El término de búsqueda debe ser una cadena de texto.',
            'search.max' => 'El término de búsqueda no debe exceder los 255 caracteres.',
            
            'product_id.integer' => 'El ID del producto debe ser un número entero.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            
            'municipality_id.integer' => 'El ID del municipio debe ser un número entero.',
            'municipality_id.exists' => 'El municipio seleccionado no existe.',
            
            'post_type_id.integer' => 'El ID del tipo de publicación debe ser un número entero.',
            'post_type_id.exists' => 'El tipo de publicación seleccionado no existe.',
            
            'user_id.integer' => 'El ID del usuario debe ser un número entero.',
            'user_id.exists' => 'El usuario seleccionado no existe.',
            
            'status.in' => 'El estado debe ser: ACTIVE, CLOSED o EXPIRED.',
            
            'sort_by.in' => 'El campo de ordenamiento no es válido. Valores permitidos: created_at, price_per_kg, quantity_kg, title, updated_at.',
            'sort_order.in' => 'El orden debe ser: asc o desc.',
            
            'per_page.integer' => 'El número de items por página debe ser un número entero.',
            'per_page.min' => 'Debe solicitar al menos 1 item por página.',
            'per_page.max' => 'No puede solicitar más de 100 items por página.',
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
            'search' => $validated['search'] ?? null,
            'product_id' => $validated['product_id'] ?? null,
            'municipality_id' => $validated['municipality_id'] ?? null,
            'post_type_id' => $validated['post_type_id'] ?? null,
            'user_id' => $validated['user_id'] ?? null,
            'status' => $validated['status'] ?? 'ACTIVE', // Por defecto ACTIVE
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

    /**
     * Get the validated pagination parameters.
     *
     * @return int
     */
    public function getPerPage(): int
    {
        $validated = $this->validated();
        $perPage = $validated['per_page'] ?? 15;
        
        // Asegurar que esté entre 1 y 100
        return min(max((int) $perPage, 1), 100);
    }
}
