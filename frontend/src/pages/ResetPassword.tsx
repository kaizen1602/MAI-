import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../data/services";
import { FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success" | "info";
  } | null>(null);

  // Validar que el token existe en la URL
  useEffect(() => {
    if (!token) {
      setMessage({
        text: "Token inválido. Verifica el enlace de restablecimiento.",
        type: "error",
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones locales
    if (!email || !password || !passwordConfirm) {
      setMessage({
        text: "Por favor completa todos los campos",
        type: "error",
      });
      return;
    }

    if (password !== passwordConfirm) {
      setMessage({
        text: "Las contraseñas no coinciden",
        type: "error",
      });
      return;
    }

    if (password.length < 8) {
      setMessage({
        text: "La contraseña debe tener al menos 8 caracteres",
        type: "error",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({
        text: "Por favor ingresa un correo válido",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      // Llamar al servicio para restablecer contraseña
      const response = await authService.resetPassword({
        email,
        token: token || "",
        password,
        password_confirmation: passwordConfirm,
      });

      setMessage({
        text: response.message || "Contraseña restablecida exitosamente ✅",
        type: "success",
      });

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setMessage({
        text:
          error.response?.data?.message ||
          "Error al restablecer la contraseña. Verifica el token e intenta nuevamente.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/fondo-agro.jpg')" }}
      ></div>

      {/* Capa azul translúcida */}
      <div className="absolute inset-0 bg-blue-900/50"></div>

      {/* Contenedor principal */}      cd C:\Users\USUARIO\Desktop\MAI-\frontend
      $env:VITE_API_URL='http://localhost:8000'; npm run dev
      <div className="relative z-10 w-full max-w-md p-10 shadow-2xl bg-white/95 rounded-2xl backdrop-blur-md">
        <div className="mb-6 text-center">
          <FaLock className="mx-auto mb-4 text-5xl text-blue-600" />
          <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">
            Restablecer Contraseña
          </h1>
        </div>

        {/* Mensaje dinámico */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-semibold transition-all duration-500 transform flex items-center justify-center gap-2 ${
              message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-blue-100 text-blue-700 border border-blue-300"
            }`}
          >
            {message.type === "success" && (
              <FaCheckCircle className="text-lg" />
            )}
            {message.type === "error" && (
              <FaTimesCircle className="text-lg" />
            )}
            {message.text}
          </div>
        )}

        {/* Token en URL */}
        <div className="p-3 mb-6 text-xs text-gray-600 break-all bg-gray-100 rounded-lg">
          <strong>Token:</strong> {token || "No proporcionado"}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Nueva Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="Repite la contraseña"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              disabled={isLoading}
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Botón de reset */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-lg font-semibold text-white transition bg-blue-700 rounded-lg shadow-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Procesando..." : "Restablecer Contraseña"}
          </button>
        </form>

        {/* Enlace a login */}
        <p className="mt-6 text-center text-gray-600">
          ¿Recuerdas tu contraseña?{" "}
          <a
            href="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
