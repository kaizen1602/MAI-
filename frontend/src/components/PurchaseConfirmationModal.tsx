import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimes, FaStar } from "react-icons/fa";

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  sellerName: string;
  isPurchase: boolean; // New prop to determine if it's a purchase or sale
  onConfirm: (rating?: number) => void;
  onRateLater: () => void;
}

function PurchaseConfirmationModal({
  isOpen,
  onClose,
  productName,
  sellerName,
  isPurchase,
  onConfirm,
  onRateLater,
}: PurchaseConfirmationModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setHover(0);
      setShowSuccessMessage(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isPurchase) {
      onConfirm(rating);
      // Show success message if a rating was provided
      if (rating > 0) {
        setShowSuccessMessage(true);
        // Hide success message after 2 seconds and close modal
        setTimeout(() => {
          setShowSuccessMessage(false);
          onClose();
        }, 2000);
        return;
      }
    } else {
      onConfirm();
    }
    onClose();
  };

  const handleRateLater = () => {
    onRateLater();
    onClose();
  };

  // If showing success message, render a simple success view
  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center">
                <FaCheckCircle className="text-green-500 text-3xl" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
              ¡Calificación Guardada!
            </h3>

            <p className="text-gray-700 dark:text-gray-300">
              Gracias por calificar tu experiencia con {sellerName}.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center">
              <FaCheckCircle className="text-green-500 text-3xl" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
            ¡Felicidades!
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {isPurchase
              ? `Tu compra de ${productName} con ${sellerName} ha sido confirmada.`
              : `Tu oferta de ${productName} a ${sellerName} ha sido enviada.`}
          </p>

          {isPurchase && (
            <div className="bg-green-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                ¿Te gustaría calificar tu experiencia con el vendedor{" "}
                {sellerName}?
              </p>
            </div>
          )}

          {isPurchase && (
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    className="text-2xl focus:outline-none"
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <FaStar
                      className={
                        ratingValue <= (hover || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {isPurchase ? "Confirmar y Calificar" : "Aceptar"}
            </button>
            {isPurchase && (
              <button
                onClick={handleRateLater}
                className="px-4 py-3 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Calificar Después
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseConfirmationModal;
