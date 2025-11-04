import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaRegFileAlt, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../data/context/AuthContext";
import { postService } from "../data/services";
import type { Post } from "../data/types/post.types";
import { toast } from "react-hot-toast";

interface PostDetailProps {
  post: {
    post_id: number;
    title: string;
    user: { user_id: number; name: string };
    description: string;
    created_at: string;
    post_type: { type_id: number; type_name: string };
    images?: { image_id: number; url: string }[];
    quantity_kg?: number;
    price_per_kg?: number;
    municipality?: { municipality_id: number; name: string };
    product?: {
      product_id: number;
      name: string;
      description: string;
      image_url: string;
    };
  } | null;
  onClose?: () => void;
  formatDate?: (dateString: string) => string;
  onEdit?: (post: any) => void;
  onDelete?: (postId: number) => void;
}

export default function PostDetail({
  post,
  onClose,
  formatDate,
  onEdit,
  onDelete,
}: PostDetailProps) {
  const { user } = useAuth();

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl">
        <FaRegFileAlt className="text-5xl mb-6 text-blue-400 dark:text-blue-300" />
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Sin publicación seleccionada
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Selecciona una publicación para ver los detalles
        </p>
      </div>
    );
  }

  const userName = post.user?.name || "Usuario desconocido";
  const postType = post.post_type?.type_name || "Tipo desconocido";
  const photos = post.images?.map((img) => img.url) || [];

  // Check if current user is the owner of the post
  const isOwner = user && user.id === post.user.user_id;

  const handleDelete = async () => {
    if (!isOwner) return;

    try {
      await postService.deletePost(post.post_id);
      toast.success("Publicación eliminada con éxito");
      if (onDelete) {
        onDelete(post.post_id);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error al eliminar la publicación");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 p-6 relative">
        {/* Botón de cierre en la esquina superior derecha */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
          >
            <FaTimes className="text-xl" />
          </button>
        )}

        {/* User info */}
        <div className="flex items-center mb-4">
          <div className="bg-blue-500 dark:bg-blue-600 rounded-full w-14 h-14 flex items-center justify-center mr-4 shadow-md">
            <span className="font-bold text-white text-xl">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
              {userName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {formatDate
                ? formatDate(post.created_at)
                : new Date(post.created_at).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </p>
          </div>
          {/* Edit/Delete buttons for owner */}
          {isOwner && (
            <div className="ml-auto flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(post)}
                  className="p-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 hover:scale-110"
                  title="Editar"
                >
                  <FaEdit />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-3 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 hover:scale-110"
                title="Eliminar"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {/* Post title */}
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100 mt-2">
          {post.title}
        </h2>
      </div>

      {/* Body content */}
      <div className="p-6">
        {/* Imágenes */}
        {photos.length > 0 && (
          <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
            <Carousel
              showThumbs={false}
              infiniteLoop
              useKeyboardArrows
              autoPlay
              interval={5000}
              showStatus={false}
              swipeable
              emulateTouch
            >
              {photos.map((photo, index) => (
                <div key={index} className="aspect-[16/9]">
                  <img
                    src={photo}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Descripción */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
            Descripción
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Detalles en tarjeta */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3">
            Detalles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {post.quantity_kg !== undefined && (
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">
                  Cantidad:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {post.quantity_kg} kg
                </span>
              </div>
            )}
            {post.price_per_kg !== undefined && (
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">
                  Precio:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  ${post.price_per_kg?.toLocaleString()} por kg
                </span>
              </div>
            )}
            {post.municipality?.name && (
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">
                  Municipio:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {post.municipality.name}
                </span>
              </div>
            )}
            {post.product?.name && (
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">
                  Producto:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {post.product.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with action button */}
      <div className="px-6 pb-6">
        <div className="flex justify-between items-center">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
              postType === "Oferta"
                ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                : "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
            }`}
          >
            {postType}
          </span>

          {/* Botón de acción */}
          <Link
            to={`/post/${post.post_id}`}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl ${
              postType === "Oferta"
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            }`}
          >
            {postType === "Oferta" ? "🛒 Comprar" : "🤝 Ofrecer"}
          </Link>
        </div>
      </div>
    </div>
  );
}
