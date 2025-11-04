import React, { useState } from "react";
import { FaTimes, FaEnvelope } from "react-icons/fa";
import { authService } from "../data/services";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetPassword: (email: string) => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onResetPassword,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Basic email validation
    if (!email) {
      setMessage({
        text: "Por favor ingresa tu correo electrónico",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({
        text: "Por favor ingresa un correo electrónico válido",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call the real API service
      const response = await authService.forgotPassword(email);

      setIsLoading(false);
      setMessage({
        text: response.message,
        type: "success",
      });

      // Close the modal after a delay
      setTimeout(() => {
        onClose();
        setEmail("");
        setMessage(null);
      }, 3000);
    } catch (error: any) {
      setIsLoading(false);
      setMessage({
        text:
          error.response?.data?.message ||
          "Error al enviar solicitud de restablecimiento",
        type: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="text-2xl" />
        </button>

        <h2 className="text-2xl font-bold text-blue-800 mb-2 text-center">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Ingresa tu correo electrónico y te enviaremos instrucciones para
          restablecer tu contraseña
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center text-sm ${
              message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-blue-100 text-blue-700 border border-blue-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              <FaEnvelope className="inline mr-2" /> Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@ejemplo.com"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                "Enviar Instrucciones"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
