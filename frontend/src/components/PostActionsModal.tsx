import React, { useState } from "react";
import { X, Edit, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Post } from "../data/types/post.types";
import postService from "../data/services/PostService";
import { toast } from "react-hot-toast";

interface PostActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onPostUpdated?: (updatedPost: Post) => void;
  onPostDeleted?: (postId: number) => void;
}

const PostActionsModal: React.FC<PostActionsModalProps> = ({
  isOpen,
  onClose,
  post,
  onPostUpdated,
  onPostDeleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "ACTIVE" | "CLOSED" | "EXPIRED" | null
  >(null);

  if (!isOpen || !post) return null;

  const handleStatusUpdateClick = (status: "ACTIVE" | "CLOSED" | "EXPIRED") => {
    setPendingStatus(status);
    setShowStatusConfirm(true);
  };

  const handleStatusUpdateConfirm = async () => {
    if (!post || !pendingStatus) return;

    setIsLoading(true);
    try {
      const updatedPost = await postService.updatePostStatus(
        post.id,
        pendingStatus
      );
      onPostUpdated?.(updatedPost);

      const statusMessages = {
        ACTIVE: "Publicación activada exitosamente",
        CLOSED: "Publicación marcada como vendida",
        EXPIRED: "Publicación desactivada",
      };

      toast.success(statusMessages[pendingStatus]);
      setShowStatusConfirm(false);
      setPendingStatus(null);
      onClose();
    } catch (error: any) {
      console.error("Error updating post status:", error);
      toast.error(
        error.response?.data?.message || "Error al actualizar el estado"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdateCancel = () => {
    setShowStatusConfirm(false);
    setPendingStatus(null);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!post) return;

    setIsLoading(true);
    try {
      await postService.deletePost(post.id);
      onPostDeleted?.(post.id);
      toast.success("Publicación eliminada exitosamente");
      setShowDeleteConfirm(false);
      onClose();
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error(
        error.response?.data?.message || "Error al eliminar la publicación"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Acciones de Publicación
          </h2>
          <p className="text-gray-600 mb-4">{post.title}</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700">
              Estado actual:
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                post.status
              )}`}
            >
              {getStatusText(post.status)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Editar */}
          <button
            onClick={() => {
              onClose();
              // Aquí podrías abrir un modal de edición
              toast.success("Funcionalidad de edición próximamente");
            }}
            className="w-full flex items-center gap-3 p-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            disabled={isLoading}
          >
            <Edit size={20} />
            <span className="font-medium">Editar</span>
          </button>

          {/* Marcar como Vendido */}
          {post.status !== "CLOSED" && (
            <button
              onClick={() => handleStatusUpdateClick("CLOSED")}
              className="w-full flex items-center gap-3 p-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              disabled={isLoading}
            >
              <CheckCircle size={20} />
              <span className="font-medium">Marcar como Vendido</span>
            </button>
          )}

          {/* Desactivar */}
          {post.status !== "EXPIRED" && (
            <button
              onClick={() => handleStatusUpdateClick("EXPIRED")}
              className="w-full flex items-center gap-3 p-3 text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              disabled={isLoading}
            >
              <XCircle size={20} />
              <span className="font-medium">Desactivar</span>
            </button>
          )}

          {/* Reactivar */}
          {post.status !== "ACTIVE" && (
            <button
              onClick={() => handleStatusUpdateClick("ACTIVE")}
              className="w-full flex items-center gap-3 p-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              disabled={isLoading}
            >
              <CheckCircle size={20} />
              <span className="font-medium">Reactivar</span>
            </button>
          )}

          {/* Eliminar */}
          <button
            onClick={handleDeleteClick}
            className="w-full flex items-center gap-3 p-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            disabled={isLoading}
          >
            <Trash2 size={20} />
            <span className="font-medium">Eliminar</span>
          </button>
        </div>

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 mt-2">Procesando...</p>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Eliminar Publicación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar esta publicación? Esta
              acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para cambio de estado */}
      {showStatusConfirm && pendingStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {pendingStatus === "CLOSED" && "Marcar como Vendido"}
              {pendingStatus === "EXPIRED" && "Desactivar Publicación"}
              {pendingStatus === "ACTIVE" && "Reactivar Publicación"}
            </h3>
            <p className="text-gray-600 mb-6">
              {pendingStatus === "CLOSED" &&
                "¿Estás seguro de que quieres marcar esta publicación como vendida?"}
              {pendingStatus === "EXPIRED" &&
                "¿Estás seguro de que quieres desactivar esta publicación? Podrás reactivarla más tarde."}
              {pendingStatus === "ACTIVE" &&
                "¿Estás seguro de que quieres reactivar esta publicación?"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleStatusUpdateCancel}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleStatusUpdateConfirm}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  pendingStatus === "CLOSED"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : pendingStatus === "EXPIRED"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostActionsModal;
