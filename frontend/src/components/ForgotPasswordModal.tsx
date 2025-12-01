import React, { useState } from "react";
import { FaTimes, FaEnvelope, FaCopy, FaCheckCircle } from "react-icons/fa";
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
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

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
      
      // Si el backend devuelve el token (en desarrollo)
      if (response.reset_token) {
        setResetToken(response.reset_token);
        const link = `${window.location.origin}/reset-password/${response.reset_token}`;
        setResetLink(link);
        setMessage({
          text: "✅ Link de restablecimiento generado. Cópialo o comparte el enlace.",
          type: "success",
        });
      } else {
        // Si no devuelve token, mostrar modal de "Revisa tu correo" (en producción con Mailtrap)
        setShowEmailConfirmation(true);
      }
    } catch (error: any) {
      setIsLoading(false);
      
      // Extraer mensaje de error
      let errorMessage = "Error al enviar solicitud de restablecimiento";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Manejo de errores de validación (422)
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0] as string;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({
        text: errorMessage,
        type: "error",
      });
      
      console.error('Forgot Password Error:', error);
    }
  };

  // Si se envió el email exitosamente, mostrar vista de confirmación
  if (showEmailConfirmation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
          <button
            onClick={() => {
              onClose();
              setEmail("");
              setMessage(null);
              setShowEmailConfirmation(false);
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-2xl" />
          </button>

          <div className="text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              Revisa tu correo
            </h2>
            <p className="text-gray-600 mb-4">
              Hemos enviado instrucciones para restablecer tu contraseña a:
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-6 break-all">
              {email}
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-gray-700 mb-2">
                <strong>📝 Pasos a seguir:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Abre tu correo electrónico</li>
                <li>Busca el email de MAI</li>
                <li>Haz clic en el enlace para restablecer tu contraseña</li>
                <li>Sigue las instrucciones para crear una nueva contraseña</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg mb-6 border border-yellow-200">
              <p className="text-xs text-yellow-800">
                ⏰ <strong>El enlace expira en 60 minutos.</strong> Si no recibes el email, revisa la carpeta de spam.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                setEmail("");
                setMessage(null);
                setShowEmailConfirmation(false);
              }}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Mostrar link copiable si hay token */}
        {resetLink && (
          <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-300">
            <p className="text-sm text-gray-700 mb-2 font-semibold">
              🔗 Link de Restablecimiento:
            </p>
            <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-200">
              <input
                type="text"
                value={resetLink}
                readOnly
                className="flex-1 text-xs overflow-x-auto bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resetLink);
                  setCopiedToClipboard(true);
                  setTimeout(() => setCopiedToClipboard(false), 2000);
                }}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm flex items-center gap-1 whitespace-nowrap"
              >
                {copiedToClipboard ? (
                  <>
                    <FaCheckCircle /> Copiado
                  </>
                ) : (
                  <>
                    <FaCopy /> Copiar
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              💡 Comparte este enlace con el usuario o abre en tu navegador.
            </p>
          </div>
        )}

        {!resetLink && (
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
        )}

        {/* Botón para cerrar después de copiar */}
        {resetLink && (
          <button
            onClick={() => {
              onClose();
              setEmail("");
              setMessage(null);
              setResetToken(null);
              setResetLink(null);
            }}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-4"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}
