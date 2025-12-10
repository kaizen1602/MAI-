import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaUserEdit, FaStore } from "react-icons/fa";

interface WelcomeModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, userName, onClose }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para la animación
      setTimeout(() => setShow(true), 100);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCompleteProfile = () => {
    onClose();
    // Redirigir al perfil con el parámetro para abrir el modal de completar
    navigate("/profile?complete=true");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl bg-gradient-to-br from-white via-blue-50 to-green-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Confetti decorativo */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"></div>

        {/* Header con animación */}
        <div className="relative pt-8 pb-6 px-8 text-center">
          {/* Icono de éxito animado */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4 animate-bounce-slow shadow-lg">
            <FaCheckCircle className="text-white text-4xl" />
          </div>

          {/* Título */}
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-2">
            ¡Bienvenido a MAI! 🎉
          </h2>

          <p className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {userName}
          </p>
        </div>

        {/* Contenido */}
        <div className="px-8 pb-8">
          {/* Mensaje principal */}
          <div className="bg-white/80 dark:bg-gray-700/80 rounded-2xl p-6 mb-6 shadow-md">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 text-center leading-relaxed">
              Tu cuenta ha sido creada exitosamente. Para aprovechar al máximo nuestra plataforma
              y que otros usuarios puedan ver tus publicaciones, es importante que{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                completes tu perfil
              </span>
              .
            </p>
          </div>

          {/* Beneficios cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaUserEdit className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    Perfil Completo
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Agrega tu ubicación, biografía e imagen de perfil
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/40 rounded-xl p-4 border-2 border-green-200 dark:border-green-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaStore className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                    Publicaciones Visibles
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Los compradores podrán conocerte y confiar en ti
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info importante */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
              <span className="font-semibold">⚠️ Importante:</span> Sin un perfil completo,
              tus publicaciones no serán visibles para otros usuarios
            </p>
          </div>

          {/* Botón de acción */}
          <div className="flex justify-center">
            <button
              onClick={handleCompleteProfile}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaUserEdit className="text-xl" />
              <span className="text-lg">Completar Perfil Ahora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
