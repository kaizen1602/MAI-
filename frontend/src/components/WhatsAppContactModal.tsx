import React from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";

interface WhatsAppContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  productName: string;
  onContact: () => void;
}

function WhatsAppContactModal({
  isOpen,
  onClose,
  sellerName,
  productName,
  onContact,
}: WhatsAppContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <FaTimes className="text-2xl" />
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center">
              <FaWhatsapp className="text-blue-500 text-3xl" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4">
            Contactar al Vendedor
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Estás interesado en:
          </p>
          <p className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-6">
            {productName}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-2">Vendedor:</p>
          <p className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-6">
            {sellerName}
          </p>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Al presionar el botón, serás redirigido a WhatsApp para contactar al
            vendedor.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onContact}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <FaWhatsapp className="mr-2 text-xl" /> Contactar por WhatsApp
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppContactModal;
