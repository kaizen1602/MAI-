import React from "react";
import { FaStar, FaUserCheck } from "react-icons/fa";

interface SellerInfoProps {
  user: {
    user_id: number;
    name: string;
    profile_image?: string;
  };
  rating?: {
    average_rating: number;
    total_reviews: number;
  };
}

function SellerInfo({ user, rating }: SellerInfoProps) {
  const renderStars = (averageRating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar key="half" className="text-yellow-400 text-sm opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(averageRating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} className="text-gray-300 text-sm" />
      );
    }

    return stars;
  };

  return (
    <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl border border-yellow-200 dark:border-yellow-800 shadow-sm">
      <div className="flex items-center justify-center mb-3">
        <FaStar className="text-yellow-500 mr-2 text-xl" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
          Información del vendedor
        </h3>
      </div>
      <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-lg">
        <div className="bg-blue-200 dark:bg-blue-600 rounded-full w-20 h-20 flex items-center justify-center mb-3 overflow-hidden">
          {user?.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-bold text-blue-800 dark:text-white text-2xl">
              {user?.name?.charAt(0) || "?"}
            </span>
          )}
        </div>
        <div className="text-center w-full">
          <h4 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-4">
            {user?.name || "Usuario desconocido"}
          </h4>

          {/* Calificación promedio */}
          {rating && rating.total_reviews > 0 ? (
            <div className="mt-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                {renderStars(rating.average_rating)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">
                  {rating.average_rating.toFixed(1)}
                </span>
                <span className="ml-1">
                  ({rating.total_reviews}{" "}
                  {rating.total_reviews === 1 ? "reseña" : "reseñas"})
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                {renderStars(0)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Sin calificaciones
              </div>
            </div>
          )}

          {/* Verified Badge */}
          <div className="mt-4 flex items-center justify-center bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium">
            <FaUserCheck className="mr-1" />
            <span>Vendedor verificado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerInfo;
