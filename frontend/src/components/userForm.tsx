import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaHome,
  FaUserTag,
} from "react-icons/fa";

interface UserFormData {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  address_details: string;
  role: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    address_details: "",
    role: "",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const validate = () => {
    const newErrors: Partial<UserFormData> = {};
    if (!formData.full_name.trim())
      newErrors.full_name = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido";
    if (!formData.password.trim())
      newErrors.password = "La contraseña es requerida";
    else if (formData.password.length < 6)
      newErrors.password = "Debe tener al menos 6 caracteres";
    if (!formData.phone_number.trim())
      newErrors.phone_number = "El teléfono es requerido";
    if (!formData.address_details.trim())
      newErrors.address_details = "La dirección es requerida";
    if (!formData.role.trim()) newErrors.role = "El rol es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Formulario válido ✅ (datos quemados por ahora)");
      console.log(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-4xl font-bold text-center text-green-700">
          Registro de Usuario
        </h2>

        {/* Nombre */}
        <div>
          <label className="block font-medium mb-1">Nombre completo</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full outline-none text-lg"
              placeholder="Ej: Juan Pérez"
            />
          </div>
          {errors.full_name && (
            <p className="text-red-500 text-sm">{errors.full_name}</p>
          )}
        </div>

        

        {/* Rol */}
        <div>
          <label className="block font-medium mb-1">Rol</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
            <FaUserTag className="text-gray-400 mr-2" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full outline-none text-lg bg-transparent"
            >
              <option value="">Seleccione un rol</option>
              <option value="1">Usuario</option>
              <option value="2">Administrador</option>
            </select>
          </div>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Correo electrónico</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none text-lg"
              placeholder="nombre@ejemplo.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block font-medium mb-1">Contraseña</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none text-lg"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* confirmacion de Contraseña */}
        <div>
          <label className="block font-medium mb-1">Ingrese de nuevo contraseña</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none text-lg"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
