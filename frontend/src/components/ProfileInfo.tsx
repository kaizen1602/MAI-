
import { FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaStar } from "react-icons/fa";

interface ProfileInfoProps {
  email: string;
  city: string;
  department?: string | null;
  joinDate: string;
  bio: string;
  rating?: {
    average_rating: number;
    total_reviews: number;
  };
}

export default function ProfileInfo({
  email,
  city,
  department,
  joinDate,
  bio,
  rating,
}: ProfileInfoProps) {
  // Function to render star ratings
  const renderStars = (ratingValue: number) => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white/90 dark:bg-gray-800 rounded-3xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Información Personal
        </h3>
        <p className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
          <FaEnvelope className="mr-3 text-blue-600" /> {email}
        </p>
        <p className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
          <FaMapMarkerAlt className="mr-3 text-blue-600" /> {city}
        </p>
        <p className="flex items-center text-gray-700 dark:text-gray-300">
          <FaCalendarAlt className="mr-3 text-blue-600" /> Miembro desde:{" "}
          {joinDate}
        </p>
      </div>

      <div className="bg-white/90 dark:bg-gray-800 rounded-3xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Biografía</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {bio || "Aún no ha agregado una biografía."}
        </p>
        
        {/* Department information below biography */}
        {department && (
          <p className="flex items-center text-gray-700 dark:text-gray-300 mb-4">
            <FaMapMarkerAlt className="mr-3 text-blue-600" /> {department}
          </p>
        )}
        
        {/* Rating Section */}
        {rating && rating.total_reviews > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Calificación
            </h4>
            <div className="flex items-center">
              <div className="flex mr-2">
                {renderStars(rating.average_rating)}
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {rating.average_rating.toFixed(1)} ({rating.total_reviews} reseñas)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}