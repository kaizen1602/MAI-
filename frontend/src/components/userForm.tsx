import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import SupportDataService from "../data/services/SupportDataService";
import type { Department, Municipality } from "../data/types/product.types";

interface UserFormData {
  name: string;
  email: string;
  phone_number: string;
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
    phone_number: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [municipalityId, setMunicipalityId] = useState<number | null>(null);

  const validate = () => {
    const newErrors: Partial<UserFormData> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido";
    if (!formData.phone_number.trim())
      newErrors.phone_number = "El número de teléfono es requerido";
    else if (formData.phone_number.replace(/[\s\-\(\)]/g, "").length < 10)
      newErrors.phone_number = "El teléfono debe tener al menos 10 dígitos";
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

  const handleDepartmentChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = Number(e.target.value) || null;
    setDepartmentId(id);
    setMunicipalityId(null);
    setMunicipalities([]);
    if (id) {
      try {
        const muns = await SupportDataService.getMunicipalitiesByDepartment(id);
        setMunicipalities(muns);
      } catch (err) {
        console.error("Error loading municipalities:", err);
      }
    }
  };

  const handleMunicipalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value) || null;
    setMunicipalityId(id);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const deps = await SupportDataService.getDepartments();
        if (mounted) setDepartments(deps);
      } catch (err) {
        console.error("Error loading departments:", err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setIsLoading(true);
        setMessage(null);

        const registerData = {
          ...formData,
          address_details: "Por definir",
          role_id: 1,
          department_id: departmentId,
          municipality_id: municipalityId,
        };

        await register(registerData);
        setMessage({
          text: "¡Registro exitoso! 🎉 Redirigiendo...",
          type: "success",
        });
        // Guardar flag en sessionStorage para mostrar modal en perfil
        sessionStorage.setItem('showProfileCompletionPrompt', 'true');
        setTimeout(() => navigate("/profile"), 1000);
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

        {/* Teléfono */}
        <div>
          <label className="block font-medium mb-1">Número de teléfono (WhatsApp) *</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaPhone className="text-gray-400 mr-2" />
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full outline-none text-lg"
              placeholder="Ej: 3001234567"
            />
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Este número se usará para que los compradores te contacten por WhatsApp
          </p>
          {errors.phone_number && (
            <p className="text-red-500 text-sm">{errors.phone_number}</p>
          )}
        </div>

        {/* Departamento y Ciudad */}
        <div>
          <label className="block font-medium mb-1">Departamento</label>
          <div className="border rounded-lg px-3 py-2">
            <select
              value={departmentId ?? ""}
              onChange={handleDepartmentChange}
              className="w-full outline-none text-lg bg-transparent"
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Ciudad / Municipio</label>
          <div className="border rounded-lg px-3 py-2">
            <select
              value={municipalityId ?? ""}
              onChange={handleMunicipalityChange}
              className="w-full outline-none text-lg bg-transparent"
              disabled={municipalities.length === 0}
            >
              <option value="">Selecciona una ciudad</option>
              {municipalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
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
