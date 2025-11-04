import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/context/AuthContext";
import { authService } from "../data/services";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage({
        text: "Por favor completa todos los campos ✍️",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      await login({ email, password });

      setMessage({
        text: "¡Inicio de sesión exitoso! 🎉 Bienvenido 💙",
        type: "success",
      });

      setTimeout(() => {
        navigate("/wall");
      }, 1000);
    } catch (error: any) {
      console.error("Error en login:", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "Credenciales incorrectas ❌ Inténtalo de nuevo.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      const response = await authService.forgotPassword(email);
      console.log("Mensaje:", response.message);
      // El reset_token puede no estar presente en la respuesta
      if (response.reset_token) {
        console.log("Token de restablecimiento:", response.reset_token);
      }
    } catch (error: any) {
      console.error("Error en restablecimiento de contraseña:", error);
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center min-h-screen">
        {/* Fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/fondo-agro.jpg')" }}
        ></div>

        {/* Capa azul translúcida */}
        <div className="absolute inset-0 bg-blue-900/50"></div>

        {/* Contenedor principal */}
        <div className="relative z-10 bg-white/95 p-10 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center drop-shadow-sm">
            Iniciar Sesión
          </h1>

          {/* Mensaje dinámico */}
          {message && (
            <div
              className={`mb-4 p-4 rounded-lg text-center font-semibold transition-all duration-500 transform ${
                message.type === "error"
                  ? "bg-red-100 text-red-700 border border-red-300 animate-shake"
                  : "bg-blue-100 text-blue-700 border border-blue-300 animate-fadeIn"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Olvidó contraseña */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm text-blue-600 hover:underline font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition text-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Cargando..." : "Entrar"}
            </button>
          </form>

          {/* Registro */}
          <p className="text-center text-gray-600 mt-6">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Crear cuenta
            </a>
          </p>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onResetPassword={handleResetPassword}
      />
    </>
  );
}

export default Login;
