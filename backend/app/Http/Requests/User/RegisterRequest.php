<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed', // Requiere password_confirmation
            'phone_number' => 'nullable|string|max:100',
            'address_details' => 'nullable|string|max:300',
            'role_id' => 'required|exists:roles,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo nombre es obligatorio.',
            'name.string' => 'El campo nombre debe ser una cadena de texto.',
            'name.max' => 'El campo nombre no debe exceder los 255 caracteres.',
            'email.required' => 'El campo correo electrónico es obligatorio.',
            'email.email' => 'El campo correo electrónico debe ser una dirección de correo válida.',
            'email.unique' => 'El correo electrónico ya está en uso.',
            'password.required' => 'El campo contraseña es obligatorio.',
            'password.string' => 'El campo contraseña debe ser una cadena de texto.',
            'password.min' => 'El campo contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'La confirmación de la contraseña no coincide.',
            'phone_number.string' => 'El campo número de teléfono debe ser una cadena de texto.',
            'phone_number.max' => 'El campo número de teléfono no debe exceder los 100 caracteres.',
            'address_details.string' => 'El campo detalles de dirección debe ser una cadena de texto.',
            'address_details.max' => 'El campo detalles de dirección no debe exceder los 300 caracteres.',
            'role_id.required' => 'El campo rol es obligatorio.',
            'role_id.exists' => 'El rol seleccionado no es válido.',
        ];
    }

     /**
     * Prepara los datos para la creación del usuario
     */
    public function getUserData(): array
    {
        $data = $this->validated();
        
        return [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'phone_number' => $data['phone_number'] ?? null,
            'address_details' => $data['address_details'] ?? null,
            'role_id' => $data['role_id'],
        ];
    }
}
