import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface Purchase {
  id: number;
  title: string;
  sellerName: string;
  date: string;
  price: number;
  imageUrl: string;
  rating?: number;
}

interface ProfilePurchasesProps {
  purchases?: Purchase[];
}

export default function ProfilePurchases({ purchases = [] }: ProfilePurchasesProps) {
  // Use passed purchases or default data
  const defaultPurchases = [
    {
      id: 1,
      title: "Tomates Orgánicos",
      sellerName: "Finca Verde",
      date: "2025-09-28",
      price: 12000,
      imageUrl: "https://picsum.photos/300?random=100",
    },
    {
      id: 2,
      title: "Lechugas Hidropónicas",
      sellerName: "EcoHuerta",
      date: "2025-09-25",
      price: 8000,
      imageUrl: "https://picsum.photos/300?random=101",
    },
    {
      id: 3,
      title: "Huevos de Campo",
      sellerName: "Granja San Luis",
      date: "2025-09-20",
      price: 15000,
      imageUrl: "https://picsum.photos/300?random=102",
    },
  ];

  const purchasesData = purchases.length > 0 ? purchases : defaultPurchases;
  
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleRateClick = (id: number) => {
    setSelectedId(id);
    setSelectedRating(0);
    setShowRatingModal(true);
  };

  const handleConfirmRating = () => {
    if (selectedId !== null) {
      setRatings((prev) => ({ ...prev, [selectedId]: selectedRating }));
    }
    setShowRatingModal(false);
    setShowConfirmModal(true);
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800 rounded-3xl shadow-md p-8 animate-fadeIn">
      <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-8 text-center">
        Compras Realizadas
      </h3>

      {/* GRID DE TARJETAS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {purchasesData.map((purchase) => (
          <div
            key={purchase.id}
            className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={purchase.imageUrl}
              alt={purchase.title}
              className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {purchase.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-medium">Vendedor:</span> {purchase.sellerName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Fecha:</span> {purchase.date}
                </p>
                <p className="text-green-700 dark:text-green-300 font-bold text-lg mt-2">
                  ${purchase.price.toLocaleString()}
                </p>
              </div>

              <div className="mt-4">
                {ratings[purchase.id] > 0 ? (
                  <div className="flex items-center gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={
                          star <= ratings[purchase.id]
                            ? "text-yellow-500 drop-shadow-sm"
                            : "text-gray-300 dark:text-gray-600"
                        }
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {ratings[purchase.id]}/5
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRateClick(purchase.id)}
                    className="w-full py-2 mt-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md"
                  >
                    Calificar Vendedor
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CALIFICACIÓN */}
      {showRatingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-lg text-center">
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Califica al vendedor
            </h4>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className={`cursor-pointer text-2xl ${
                    star <= selectedRating ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRating}
                disabled={selectedRating === 0}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedRating === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-md"
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-72 shadow-lg text-center">
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              ¡Gracias por tu calificación! 🌟
            </h4>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}