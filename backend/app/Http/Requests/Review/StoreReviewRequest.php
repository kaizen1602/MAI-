<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
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
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:400',
            'reviewed_id' => 'required|exists:users,id',
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
            'rating.required' => 'La calificación es obligatoria.',
            'rating.integer' => 'La calificación debe ser un número entero.',
            'rating.min' => 'La calificación mínima es 1.',
            'rating.max' => 'La calificación máxima es 5.',
            'comment.string' => 'El comentario debe ser una cadena de texto.',
            'comment.max' => 'El comentario no debe exceder los 400 caracteres.',
            'reviewed_id.required' => 'El usuario a calificar es obligatorio.',
            'reviewed_id.exists' => 'El usuario seleccionado no existe.',
        ];
    }

    /**
     * Get the validated review data ready for creation.
     *
     * @return array
     */
    public function getReviewData(): array
    {
        $validated = $this->validated();

        return [
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'reviewer_id' => $this->user()->id, // Usuario autenticado
            'reviewed_id' => $validated['reviewed_id'],
        ];
    }
}