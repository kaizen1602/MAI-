<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Municipality;

class StorePostRequest extends FormRequest
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
            'title' => 'required|string|max:100',
            'description' => 'nullable|string|max:400',
            'quantity_kg' => 'required|numeric|min:0.01|max:999999.99',
            'price_per_kg' => 'required|numeric|min:0.01|max:999999.99',
            'post_type_id' => 'required|integer|exists:post_types,id',
            'product_id' => 'required|integer|exists:products,id',
            'municipality_id' => 'nullable|integer|exists:municipalities,id',
            'department_id' => 'nullable|integer|exists:departments,id',
            'location' => 'nullable|string|max:200', // Ubicación como texto (Ciudad, Departamento)

            // Opcional: Si permites subir imágenes en el mismo request
            'images' => 'nullable|array|max:5',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Aceptar archivos de imagen
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar que al menos uno de municipality_id o location esté presente
            if (!$this->municipality_id && !$this->location) {
                $validator->errors()->add('location', 'Debes seleccionar una ubicación (departamento y ciudad).');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Title
            'title.required' => 'El título de la publicación es obligatorio.',
            'title.string' => 'El título debe ser una cadena de texto.',
            'title.max' => 'El título no debe exceder los 100 caracteres.',
            
            // Description
            'description.string' => 'La descripción debe ser una cadena de texto.',
            'description.max' => 'La descripción no debe exceder los 400 caracteres.',
            
            // Quantity
            'quantity_kg.required' => 'La cantidad en kilogramos es obligatoria.',
            'quantity_kg.numeric' => 'La cantidad debe ser un valor numérico.',
            'quantity_kg.min' => 'La cantidad debe ser mayor a 0.',
            'quantity_kg.max' => 'La cantidad no debe exceder 999999.99 kg.',
            
            // Price
            'price_per_kg.required' => 'El precio por kilogramo es obligatorio.',
            'price_per_kg.numeric' => 'El precio debe ser un valor numérico.',
            'price_per_kg.min' => 'El precio debe ser mayor a 0.',
            'price_per_kg.max' => 'El precio no debe exceder 999999.99.',
            
            // Post Type
            'post_type_id.required' => 'El tipo de publicación es obligatorio.',
            'post_type_id.integer' => 'El tipo de publicación debe ser un número entero.',
            'post_type_id.exists' => 'El tipo de publicación seleccionado no es válido.',
            
            // Product
            'product_id.required' => 'El producto es obligatorio.',
            'product_id.integer' => 'El ID del producto debe ser un número entero.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            
            // Municipality
            'municipality_id.integer' => 'El ID del municipio debe ser un número entero.',
            'municipality_id.exists' => 'El municipio seleccionado no existe.',
            'department_id.integer' => 'El ID del departamento debe ser un número entero.',
            'department_id.exists' => 'El departamento seleccionado no existe.',

            // Location
            'location.string' => 'La ubicación debe ser una cadena de texto.',
            'location.max' => 'La ubicación no debe exceder los 200 caracteres.',
            
            // Images (opcional)
            'images.array' => 'Las imágenes deben enviarse como un array.',
            'images.max' => 'No puedes subir más de 5 imágenes por publicación.',
            'images.*.image' => 'Cada elemento debe ser un archivo de imagen.',
            'images.*.mimes' => 'Las imágenes deben ser de tipo JPEG, PNG, JPG, GIF o SVG.',
            'images.*.max' => 'Cada imagen no debe exceder los 2MB de tamaño.',
        ];
    }

    /**
     * Get the validated post data ready for creation.
     *
     * @return array
     */
    public function getPostData(): array
    {
        $validated = $this->validated();

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'quantity_kg' => $validated['quantity_kg'],
            'price_per_kg' => $validated['price_per_kg'],
            'status' => 'ACTIVE', // Siempre ACTIVE al crear
            'post_type_id' => $validated['post_type_id'],
            'product_id' => $validated['product_id'],
            'user_id' => $this->user()->id, // Usuario autenticado
        ];

        // Agregar municipality_id si está presente
        if (!empty($validated['municipality_id'])) {
            $data['municipality_id'] = $validated['municipality_id'];
        }

        // Determinar y agregar department_id:
        // - Si se envía explícitamente, se usa.
        // - Si no, y se envió municipality_id, se deriva desde el municipio.
        if (!empty($validated['department_id'])) {
            $data['department_id'] = $validated['department_id'];
        } elseif (!empty($validated['municipality_id'])) {
            $municipality = Municipality::find($validated['municipality_id']);
            if ($municipality && $municipality->department_id) {
                $data['department_id'] = $municipality->department_id;
            }
        }

        // Agregar location si está presente
        if (!empty($validated['location'])) {
            $data['location'] = $validated['location'];
        }

        return $data;
    }

    /**
     * Get the images array if provided.
     *
     * @return array|null
     */
    public function getImages(): ?array
    {
        return $this->file('images');
    }
}
