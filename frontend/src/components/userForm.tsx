import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/context/AuthContext";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const validate = () => {
    const newErrors: Partial<UserFormData> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido";
    if (!formData.password.trim())
      newErrors.password = "La contraseña es requerida";
    else if (formData.password.length < 8)
      newErrors.password = "Debe tener al menos 8 caracteres";
    if (!formData.password_confirmation.trim())
      newErrors.password_confirmation = "Debes confirmar la contraseña";
    else if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "Las contraseñas no coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setIsLoading(true);
        setMessage(null);

        const registerData = {
          ...formData,
          phone_number: "+502 0000 0000",
          address_details: "Por definir",
          role_id: 1,
        };

        await register(registerData);
        setMessage({
          text: "¡Registro exitoso! 🎉 Redirigiendo...",
          type: "success",
        });
        setTimeout(() => navigate("/wall"), 1000);
      } catch (error: any) {
        console.error("Error en registro:", error);
        setMessage({
          text:
            error.response?.data?.message ||
            "Error al registrarse. Inténtalo de nuevo.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    // ❗ No se modifica el fondo del componente
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-4xl font-bold text-center text-blue-700">
          Registro de Usuario
        </h2>

        {/* Mensaje dinámico */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg text-center font-semibold transition-all duration-500 transform
            ${
              message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300 animate-shake"
                : "bg-blue-100 text-blue-700 border border-blue-300 animate-fadeIn"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Nombre */}
        <div>
          <label className="block font-medium mb-1">Nombre completo</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full outline-none text-lg"
              placeholder="Ej: Juan Pérez"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Correo electrónico</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
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
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none text-lg"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirmación */}
        <div>
          <label className="block font-medium mb-1">Confirmar contraseña</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full outline-none text-lg"
              placeholder="Confirma tu contraseña"
            />
          </div>
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="text-center text-gray-600 mt-4">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
