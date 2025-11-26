import { FaThumbsUp, FaRegCommentDots } from "react-icons/fa";
import { useAuth } from "../data/context/AuthContext";
import type { Post } from "../data/types/post.types";
import FavoriteButton from "./FavoriteButton";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import PostActionsModal from "./PostActionsModal";

interface PostCardProps {
  post: Post;
  onSelectPost: (post: Post) => void;
  formatDate: (dateString: string) => string;
  onPostUpdated?: (updatedPost: Post) => void;
  onPostDeleted?: (postId: number) => void;
}

// Estilos por tipo de publicación
const typeStyles: Record<string, string> = {
  Venta: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Compra: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

// Fondo / borde de la tarjeta según tipo
const cardBackgrounds: Record<string, string> = {
  Venta: "border-blue-200 hover:border-blue-400",
  Compra: "border-green-200 hover:border-green-400",
};

function PostCard({
  post,
  onSelectPost,
  formatDate,
  onPostUpdated,
  onPostDeleted,
}: PostCardProps) {
  const { user } = useAuth();
  const [showActionsModal, setShowActionsModal] = useState(false);

  const userName = post.user?.name || "Usuario desconocido";
  const postType = post.post_type?.name || "Tipo desconocido";

  // Imágenes: si hay varias, se toma sólo la primera
  const photos = post.images?.map((img) => img.url) || [];
  const firstPhoto = photos.length > 0 ? photos[0] : "/metodo-de-pago.png";
  // Si quieres conservar displayPhotos en el futuro, puedes mantener esta línea:
  // const displayPhotos = photos.length > 0 ? photos : ["/metodo-de-pago.png"];

  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionsModal(true);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    onPostUpdated?.(updatedPost);
    setShowActionsModal(false);
  };

  const handlePostDeleted = (postId: number) => {
    onPostDeleted?.(postId);
    setShowActionsModal(false);
  };

  return (
    <div
      className={`bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-md p-5 cursor-pointer border-2 transition-all transform hover:-translate-y-1 overflow-hidden flex flex-col h-full ${
        cardBackgrounds[postType] || "border-gray-200"
      }`}
      onClick={() => onSelectPost(post)}
    >
      {/* Header usuario */}
      <div className="flex items-center mb-3">
        <div className="bg-blue-200 dark:bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
          <span className="font-bold text-blue-800 dark:text-white text-lg">
            {typeof userName === "string" && userName
              ? userName.charAt(0)
              : "?"}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 truncate">
            {userName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {formatDate(post.created_at)}
          </p>
        </div>
      </div>

      {/* Título */}
      <h4 className="font-bold text-xl mb-2 text-blue-800 dark:text-blue-300">
        {post.title}
      </h4>

      {/* Imagen principal - SOLO la primera imagen (si hay varias, se ignoran las demás) */}
      <div className="mb-4 rounded-md overflow-hidden flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-700">
        <img
          src={firstPhoto}
          alt={`Imagen principal de ${post.title}`}
          className={`w-full h-36 rounded-md ${
            photos.length === 0
              ? "object-contain bg-gray-100 opacity-70"
              : "object-cover"
          }`}
        />
      </div>

      {/* NOTA: NO se muestran miniaturas en esta versión — así garantizamos que aunque haya muchas imágenes,
          solo se muestre la primera. */}

      {/* Footer */}
      <div className="mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FavoriteButton
              post={post}
              onFavoriteChange={(isFavorite) => {
                const updatedPost = {
                  ...post,
                  is_favorited: isFavorite,
                  favorites_count: post.favorites_count + (isFavorite ? 1 : -1),
                };
                onSelectPost(updatedPost);
              }}
              size="sm"
            />
            <span className="text-sm text-gray-500">{post.favorites_count || 0}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                typeStyles[postType] || "bg-gray-200 text-gray-800"
              }`}
            >
              {postType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
