import React, { useState, useEffect } from "react";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Post } from "../data/types/post.types";
import favoriteService from "../data/services/FavoriteService";
import { toast } from "react-hot-toast";

interface UserFavoritesProps {
  userId: number;
}

const UserFavorites: React.FC<UserFavoritesProps> = ({ userId }) => {
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const favoritePosts = await favoriteService.getFavorites();
      setFavorites(favoritePosts);
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("Error al cargar favoritos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (postId: number) => {
    try {
      await favoriteService.removeFavorite(postId);
      setFavorites((prev) => prev.filter((post) => post.id !== postId));
      toast.success("Removido de favoritos");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Error al remover de favoritos");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-blue-600 bg-blue-100";
      case "CLOSED":
        return "text-blue-600 bg-blue-100";
      case "EXPIRED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Activa";
      case "CLOSED":
        return "Vendida";
      case "EXPIRED":
        return "Desactivada";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Heart className="mr-2 text-red-500" size={24} />
          Mis Favoritos
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Heart className="mr-2 text-red-500" size={24} />
        Mis Favoritos ({favorites.length})
      </h3>

      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No tienes favoritos aún</p>
          <p className="text-gray-400 text-sm">
            Las publicaciones que marques con ❤️ aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((post) => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Imagen */}
                <div className="flex-shrink-0">
                  {post.images && post.images.length > 0 ? (
                    <img
                      src={post.images[0].url}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {post.description}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>
                            {post.municipality?.name ||
                              "Ubicación no especificada"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-blue-600">
                            ${post.price_per_kg.toLocaleString()}/kg
                          </span>
                          <span className="text-sm text-gray-500">
                            ({post.quantity_kg} kg)
                          </span>
                        </div>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {getStatusText(post.status)}
                        </span>
                      </div>
                    </div>

                    {/* Botón de remover */}
                    <button
                      onClick={() => handleRemoveFavorite(post.id)}
                      className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      title="Remover de favoritos"
                    >
                      <Heart size={18} className="fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFavorites;
