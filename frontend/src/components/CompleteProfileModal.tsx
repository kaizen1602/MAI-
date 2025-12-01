import React from "react";
import { FaTimes } from "react-icons/fa";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function CompleteProfileModal({ isOpen, onClose, onComplete }: CompleteProfileModalProps) {
  if (!isOpen) return null;

  const handleComplete = () => {
    onClose();
    onComplete();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Perfil incompleto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Para aprovechar todas las funciones, debes completar tu perfil. ¿Deseas hacerlo ahora?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-700">Más tarde</button>
          <button onClick={handleComplete} className="px-4 py-2 bg-blue-600 text-white rounded">Completar perfil</button>
        </div>
      </div>
    </div>
  );
}
