import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaTrash, FaCheck, FaBan, FaEdit } from "react-icons/fa";

interface Post {
  id: number;
  title: string;
  imageUrl?: string;
  description?: string;
  price?: string;
  date?: string;
  status?: string;
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
  onEdit?: (postId: number) => void;
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

function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4 text-center">
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
        <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4 text-center">
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
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
          >
            <FaCheck className="mr-2" /> En esta plataforma
          </button>
          <button
            onClick={() => onConfirm(false)}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
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
  onEdit,
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post.id);
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4 text-center">
          {post.title}
        </h2>

        <div className="rounded-xl overflow-hidden mb-6">
          <img
            src={post.imageUrl || "https://picsum.photos/400"}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="space-y-4 mb-6">
          {post.description && (
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Descripción:</strong> {post.description}
            </p>
          )}
          {post.price && (
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Precio:</strong> {post.price}
            </p>
          )}
          {post.date && (
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Fecha:</strong> {post.date}
            </p>
          )}
          {post.status && (
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Estado:</strong> {post.status}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
          >
            <FaEdit className="mr-2" /> Editar
          </button>

          <button
            onClick={() => setShowSoldModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
          >
            <FaCheck className="mr-2" /> Marcar como Vendido
          </button>

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

  const handleDelete = (postId: number) => {
    if (onDelete) {
      onDelete(postId);
    }
  };

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

  return (
    <div className="mt-8">
      <h3 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-6 text-center">
        Mis Publicaciones Activas
      </h3>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes publicaciones aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-transform hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="rounded-xl overflow-hidden h-48">
                <img
                  src={post.imageUrl || "https://picsum.photos/300"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg text-green-700 dark:text-green-300 text-center">
                  {post.title}
                </h4>
                {post.status && (
                  <div className="text-center mt-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {post.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para mostrar detalles de la publicación */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkAsSold={handleMarkAsSold}
          onDeactivate={handleDeactivate}
        />
      )}
    </div>
  );
}
