<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users', 'email')->ignore($this->user()->id),
            ],
            'password' => 'sometimes|string|min:8|confirmed',
            'phone_number' => 'sometimes|nullable|string|max:100',
            'address_details' => 'sometimes|nullable|string|max:300',
            'role_id' => 'sometimes|exists:roles,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'El campo nombre debe ser una cadena de texto.',
            'name.max' => 'El campo nombre no debe exceder los 255 caracteres.',
            'email.email' => 'El campo correo electrónico debe ser una dirección de correo válida.',
            'email.unique' => 'El correo electrónico ya está en uso.',
            'password.string' => 'El campo contraseña debe ser una cadena de texto.',
            'password.min' => 'El campo contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'La confirmación de la contraseña no coincide.',
            'phone_number.string' => 'El campo número de teléfono debe ser una cadena de texto.',
            'phone_number.max' => 'El campo número de teléfono no debe exceder los 100 caracteres.',
            'address_details.string' => 'El campo detalles de dirección debe ser una cadena de texto.',
            'address_details.max' => 'El campo detalles de dirección no debe exceder los 300 caracteres.',
            'role_id.exists' => 'El rol seleccionado no es válido.',
        ];
    }

    /**
     * Prepara los datos para la actualización del usuario
     */
    public function getUserData(): array
    {
        $data = $this->validated();

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        return $data;
    }
}
