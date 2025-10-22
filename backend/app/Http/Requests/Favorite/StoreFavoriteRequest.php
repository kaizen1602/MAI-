<?php

namespace App\Http\Requests\Favorite;

use Illuminate\Foundation\Http\FormRequest;

class StoreFavoriteRequest extends FormRequest
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
            'post_id' => 'required|exists:posts,id',
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
            'post_id.required' => 'El ID de la publicación es obligatorio.',
            'post_id.exists' => 'La publicación seleccionada no existe.',
        ];
    }

    /**
     * Get the validated favorite data ready for creation.
     *
     * @return array
     */
    public function getFavoriteData(): array
    {
        $validated = $this->validated();

        return [
            'user_id' => $this->user()->id, // Usuario autenticado
            'post_id' => $validated['post_id'],
        ];
    }
}