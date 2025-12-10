import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaTrash, FaCheck, FaBan, FaEdit } from "react-icons/fa";
import getPostMainImage from "../utils/getPostMainImage";

interface Post {
  id: number;
  title: string;
  imageUrl?: string;
  description?: string;
  price?: string;
  date?: string;
  status?: string;
  images?: { id: number; url: string }[];
  post_type?: { id: number; name: string };
}

interface UserPostsProps {
  posts: Post[];
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onMarkAsSold?: (postId: number, soldOnPlatform: boolean) => void;
  onDeactivate?: (postId: number) => void;
}

interface PostModalProps {
  post: Post;
  onClose: () => void;
  onDelete?: (postId: number) => void;
  onMarkAsSold: (postId: number, soldOnPlatform: boolean) => void;
  onDeactivate: (postId: number) => void;
}

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
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

function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">
          {title}
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
          {message}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

interface SoldConfirmationModalProps {
  post: Post;
  onConfirm: (soldOnPlatform: boolean) => void;
  onCancel: () => void;
}

function SoldConfirmationModal({
  post,
  onConfirm,
  onCancel,
}: SoldConfirmationModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">
          Marcar como Vendido
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-2 text-center">
          <strong>Publicación:</strong> {post.title}
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
          ¿Dónde vendiste este producto?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onConfirm(true)}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <FaCheck className="mr-2" /> En esta plataforma
          </button>
          <button
            onClick={() => onConfirm(false)}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <FaCheck className="mr-2" /> Fuera de la plataforma
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-3 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function PostModal({
  post,
  onClose,
  onDelete,
  onMarkAsSold,
  onDeactivate,
}: PostModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.id);
    }
    onClose();
  };

  if (showDeleteConfirm) {
    return (
      <ConfirmationModal
        title="Eliminar Publicación"
        message="¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    );
  }

  if (showSoldModal) {
    return (
      <SoldConfirmationModal
        post={post}
        onConfirm={(soldOnPlatform) => {
          onMarkAsSold(post.id, soldOnPlatform);
          onClose();
        }}
        onCancel={() => setShowSoldModal(false)}
      />
    );
  }

  if (showDeactivateConfirm) {
    return (
      <ConfirmationModal
        title="Desactivar Publicación"
        message="¿Estás seguro de que quieres desactivar esta publicación? Podrás reactivarla más tarde."
        onConfirm={() => {
          onDeactivate(post.id);
          onClose();
        }}
        onCancel={() => setShowDeactivateConfirm(false)}
      />
    );
  }

  // Imágenes: usar helper centralizado para fallback
  const firstPhoto = getPostMainImage(post);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">
          {post.title}
        </h2>

        <div className="rounded-xl overflow-hidden mb-6">
          <img
            src={firstPhoto}
            alt={post.title}
            className={`w-full h-64 rounded-md ${
              photos.length === 0
                ? "object-contain bg-gray-100 opacity-70"
                : "object-cover"
            }`}
            onError={(e) => {
              e.currentTarget.src = "/metodo-de-pago.png";
            }}
          />
        </div>

        <div className="space-y-4 mb-6">
          {post.description && (
            <p className="text-gray-700 dark:text-gray-300">
              {post.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Fecha: {post.date || "N/A"}
            </span>
            {post.price && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Precio: {post.price}
              </span>
            )}
            {post.status && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Estado: {post.status}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {post.status !== "CLOSED" && (
            <button
              onClick={() => setShowSoldModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
            >
              <FaCheck className="mr-2" /> Marcar como Vendido
            </button>
          )}

          <button
            onClick={() => setShowDeactivateConfirm(true)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center"
          >
            <FaBan className="mr-2" /> Desactivar
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
          >
            <FaTrash className="mr-2" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserPosts({
  posts,
  onEdit,
  onDelete,
  onMarkAsSold: onMarkAsSoldProp,
  onDeactivate: onDeactivateProp,
}: UserPostsProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Agregar console.log para depuración
  console.log("Posts recibidos en UserPosts:", posts);

  // Filtrar publicaciones activas
  const activePosts = posts.filter(post => 
    post.status?.toUpperCase() !== "CLOSED" && 
    post.status?.toUpperCase() !== "EXPIRED"
  );
  
  console.log("Publicaciones activas:", activePosts);

  // Clasificar en compras y ventas
  const salesPosts = activePosts.filter(
    post => post.post_type?.name === "Venta"
  );
  const purchasePosts = activePosts.filter(
    post => post.post_type?.name === "Compra"
  );
  
  console.log("Ventas:", salesPosts);
  console.log("Compras:", purchasePosts);

  const handleMarkAsSold = (postId: number, soldOnPlatform: boolean) => {
    if (onMarkAsSoldProp) {
      onMarkAsSoldProp(postId, soldOnPlatform);
    } else {
      // Fallback si no se pasa la función
      const platform = soldOnPlatform
        ? "en la plataforma"
        : "fuera de la plataforma";
      console.log(`Marcar publicación ${postId} como vendido ${platform}`);
      toast.success(`Publicación marcada como vendida ${platform}`);
    }
  };

  const handleDeactivate = (postId: number) => {
    if (onDeactivateProp) {
      onDeactivateProp(postId);
    } else {
      // Fallback si no se pasa la función
      console.log("Desactivar publicación con ID:", postId);
      toast.success("Publicación desactivada exitosamente");
    }
  };

  // Función para renderizar una lista de publicaciones
  const renderPostList = (posts: Post[], title: string) => {
    if (posts.length === 0) return null;

    return (
      <div className="mb-8">
        <h4 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
          {title} ({posts.length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => {
            // Imágenes: usar helper centralizado para fallback
            const firstPhoto = getPostMainImage(post);
            const postType = post.post_type?.name || "Tipo desconocido";

            return (
              <div
                key={post.id}
                className={`bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-md p-5 cursor-pointer border-2 transition-all transform hover:-translate-y-1 overflow-hidden flex flex-col h-full ${
                  cardBackgrounds[postType] || "border-gray-200"
                }`}
                onClick={() => setSelectedPost(post)}
              >
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
                    onError={(e) => {
                      e.currentTarget.src = "/metodo-de-pago.png";
                    }}
                  />
                </div>

                {/* Footer */}
                <div className="mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {post.date || "Fecha no disponible"}
                      </span>
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
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-6 text-center">
        Mis Publicaciones Activas
      </h3>

      {activePosts.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes publicaciones activas aún.
        </p>
      ) : (
        <>
          {renderPostList(salesPosts, "Ventas")}
          {renderPostList(purchasePosts, "Compras")}
        </>
      )}

      {/* Modal para mostrar detalles de la publicación */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={onDelete}
          onMarkAsSold={handleMarkAsSold}
          onDeactivate={handleDeactivate}
        />
      )}
    </div>
  );
}