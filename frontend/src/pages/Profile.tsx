import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfo from "../components/ProfileInfo";
import UserPosts from "../components/UserPosts";
import UserFavorites from "../components/UserFavorites";
import EditProfileModal from "../components/EditProfileModal";
import EditPostModal from "../components/EditPostModal";
import ProfileProgressBar from "../components/ProfileProgressBar";
import CompleteProfileModal from "../components/CompleteProfileModal";
import { useAuth } from "../data/context/AuthContext";
import { postService, userService } from "../data/services";
import authService from "../data/services/AuthService";
import { toast } from "react-hot-toast";
import type { Post } from "../data/types/post.types";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateProfile, isLoading } = useAuth();

  // Determinar si estamos viendo nuestro propio perfil o el de otro usuario
  const isOwnProfile = !userId || userId === user?.id.toString();

  // Estado para el perfil que estamos viendo (puede ser otro usuario)
  const [viewedProfile, setViewedProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Determinar el ID del perfil a cargar
  const profileUserId = userId ? parseInt(userId) : user?.id;

  // Check if we should auto-open the complete profile modal
  useEffect(() => {
    if (isOwnProfile && searchParams.get("complete") === "true") {
      setShowCompleteProfileModal(true);
      // Remove the query parameter so it doesn't trigger again
      setSearchParams({});
    }
  }, [isOwnProfile, searchParams, setSearchParams]);

  // Cargar datos del perfil visitado (si no es el propio)
  useEffect(() => {
    if (!isOwnProfile && userId) {
      loadViewedProfile(parseInt(userId));
    } else {
      setViewedProfile(null);
    }
  }, [userId, isOwnProfile]);

  const loadViewedProfile = async (id: number) => {
    try {
      setIsLoadingProfile(true);
      const profileData = await userService.getUserProfile(id);
      setViewedProfile(profileData);
      
      // Load user rating
      try {
        await userService.getUserRating(id);
      } catch (ratingError) {
        console.error("Error loading user rating:", ratingError);
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      toast.error("Error al cargar el perfil del usuario");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // El usuario a mostrar: el propio o el visitado
  const displayUser = isOwnProfile ? user : viewedProfile;
  const userWithImage = displayUser as any;

  useEffect(() => {
    if (profileUserId) {
      loadUserPosts();
    }
  }, [profileUserId]);

  const loadUserPosts = async () => {
    if (!profileUserId) return;

    try {
      setIsLoadingPosts(true);
      const response = await postService.getPosts({
        user_id: profileUserId,
        per_page: 10,
      });

      console.log("Respuesta de la API:", response);

      // Convertir posts al formato que espera el componente
      const formattedPosts = response.data.map((post: Post) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        // Pasar las imágenes completas en lugar de solo la URL
        images: post.images || [],
        likes: post.favorites_count,
        comments: 0,
        status: post.status || "ACTIVE",
        post_type: post.post_type, // Asegurarnos de incluir el tipo de publicación
        date: post.created_at,
      }));

      console.log("Publicaciones formateadas:", formattedPosts);
      setUserPosts(formattedPosts);
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
      toast.error("Error al cargar tus publicaciones");
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleSave = async (updatedUser: any) => {
    try {
      console.log("Iniciando actualización de perfil:", updatedUser);
      console.log(
        "authService methods:",
        Object.getOwnPropertyNames(authService)
      );
      console.log(
        "authService.changePassword:",
        typeof authService.changePassword
      );

      const formData = new FormData();
      formData.append("name", updatedUser.name);
      formData.append("email", updatedUser.email);
      if (updatedUser.city) {
        formData.append("address_details", updatedUser.city);
      }
      
      // Add new fields
      if (updatedUser.bio !== undefined) {
        formData.append("bio", updatedUser.bio);
      }
      
      if (updatedUser.department_id) {
        formData.append("department_id", updatedUser.department_id.toString());
      }

      // Si hay una nueva imagen, agregarla al FormData
      if (updatedUser.profileImage) {
        formData.append("profile_image", updatedUser.profileImage);
      }

      // Actualizar perfil básico
      console.log("Actualizando perfil básico...");
      await updateProfile(formData);
      console.log("Perfil básico actualizado exitosamente");

      // Si se está cambiando la contraseña, hacerlo por separado
      if (
        updatedUser.currentPassword &&
        updatedUser.newPassword &&
        updatedUser.confirmPassword
      ) {
        console.log("Cambiando contraseña...");
        try {
          await authService.changePassword(
            updatedUser.currentPassword,
            updatedUser.newPassword,
            updatedUser.confirmPassword
          );
          console.log("Contraseña cambiada exitosamente");
          toast.success("Perfil y contraseña actualizados correctamente");
        } catch (passwordError: any) {
          console.error("Error cambiando contraseña:", passwordError);
          console.error("Response data:", passwordError.response?.data);
          console.error("Response status:", passwordError.response?.status);
          toast.error(
            passwordError.response?.data?.message ||
              "Error al cambiar la contraseña"
          );
          return; // No cerrar el modal si falla el cambio de contraseña
        }
      } else {
        console.log("No se está cambiando la contraseña");
        toast.success("Perfil actualizado correctamente");
      }

      console.log("Cerrando modal...");
      setShowModal(false);
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      toast.error("Error al actualizar el perfil");
    }
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleCompleteProfile = () => {
    setShowCompleteProfileModal(true);
  };

  const handleProfileUpdated = () => {
    // El contexto ya maneja la actualización del usuario
    toast.success("¡Perfil completado con éxito!");
  };

  const handleEditPost = async (postId: number) => {
    try {
      // Fetch the full post data for editing
      const fullPost = await postService.getPost(postId);
      setEditingPost(fullPost);
      setShowEditPostModal(true);
    } catch (error) {
      console.error("Error fetching post for editing:", error);
      toast.error("Error al cargar la publicación para editar");
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await postService.deletePost(postId);
      // Remove the deleted post from the list
      setUserPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success("Publicación eliminada con éxito");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error al eliminar la publicación");
    }
  };

  const handlePostStatusUpdate = async (
    postId: number,
    status: "ACTIVE" | "CLOSED" | "EXPIRED"
  ) => {
    try {
      await postService.updatePostStatus(postId, status);

      // Update the posts in state
      setUserPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, status: status } : p
        )
      );

      toast.success("Estado de publicación actualizado");
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Error al actualizar el estado de la publicación");
    }
  };

  const handleUpdateSubmit = async (updatedPost: Post) => {
    // Convert the updated post to the format expected by the component
    const updatedPostData = {
      id: updatedPost.id,
      title: updatedPost.title,
      description: updatedPost.description,
      // Pasar las imágenes completas en lugar de solo la URL
      images: updatedPost.images || [],
      likes: updatedPost.favorites_count,
      comments: 0,
    };

    // Update the posts in state
    setUserPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPostData : p))
    );

    setShowEditPostModal(false);
    setEditingPost(null);
    toast.success("Publicación actualizada con éxito");
  };

  // Mostrar loading mientras se cargan datos
  if (isLoading || !user || (isLoadingProfile && !isOwnProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si estamos viendo otro perfil pero no se ha cargado aún
  if (!isOwnProfile && !displayUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Vista de perfil público (vendedor)
  if (!isOwnProfile && displayUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
          {/* Header del vendedor - Diseño profesional */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-6">
            {/* Banner gradient */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500"></div>
            
            {/* Info del vendedor */}
            <div className="px-4 sm:px-8 pb-6 sm:pb-8 -mt-16 sm:-mt-20">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                {/* Avatar */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                  {userWithImage?.profile_image ? (
                    <img
                      src={userWithImage.profile_image}
                      alt={displayUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-bold text-white">
                      {displayUser.name?.charAt(0)?.toUpperCase() || "V"}
                    </span>
                  )}
                </div>
                
                {/* Nombre y verificación */}
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                    {displayUser.name}
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    {displayUser.is_verified && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Vendedor Verificado
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats y contacto */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {userPosts.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Publicaciones</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                    {userPosts.filter(p => p.status === 'ACTIVE').length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Activas</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {displayUser.address_details || "N/A"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Ubicación</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                    {displayUser.created_at ? new Date(displayUser.created_at).getFullYear() : "-"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Miembro desde</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Publicaciones del vendedor */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🛒</span> Publicaciones de {displayUser.name?.split(' ')[0]}
            </h2>
            
            {isLoadingPosts ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => window.location.href = `/post/${post.id}`}
                  >
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-product.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {post.status === 'ACTIVE' ? 'Activo' : 'Cerrado'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ❤️ {post.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-gray-500 dark:text-gray-400">Este vendedor aún no tiene publicaciones</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista de perfil propio (original)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Columna izquierda - Información del perfil */}
          <div className="lg:w-2/3 w-full">
            <ProfileHeader
              name={displayUser?.name || "Usuario"}
              username={displayUser?.email || ""}
              imageUrl={userWithImage?.profile_image || "/default-avatar.jpg"}
              onEdit={isOwnProfile ? handleEdit : undefined}
            />

            {/* Barra de progreso del perfil */}
            {isOwnProfile && (
              <ProfileProgressBar
                user={userWithImage}
                onCompleteProfile={handleCompleteProfile}
              />
            )}

            {/* Información personal */}
            <div className="mt-6 sm:mt-8">
              <ProfileInfo
                email={displayUser?.email || ""}
                city={displayUser?.address_details || "No especificado"}
                department={displayUser?.department?.name || null}
                joinDate={displayUser?.created_at ? new Date(displayUser.created_at).toLocaleDateString(
                  "es-ES",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                ) : "Fecha no disponible"}
                bio={displayUser?.bio || ""}
              />
            </div>

            {/* Publicaciones del usuario */}
            <div className="mt-8">
              <UserPosts
                posts={userPosts}
                onEdit={isOwnProfile ? handleEditPost : undefined}
                onDelete={isOwnProfile ? handleDeletePost : undefined}
              />
            </div>
          </div>

          {/* Columna derecha - Favoritos */}
          <div className="lg:w-1/3 w-full">
            <UserFavorites userId={user?.id || 0} />
          </div>
        </div>

        {/* Modales */}
        {showModal && (
          <EditProfileModal
            user={{
              name: user?.name || "",
              email: user?.email || "",
              phone_number: user?.phone_number || "",
              username: user?.email || "",
              city: user?.address_details || "",
              bio: user?.bio || "",
              department_id: user?.department?.id || "",
              imageUrl: user?.profile_image || "/default-avatar.jpg",
              joinDate: user?.created_at || "",
            }}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}

        {showEditPostModal && editingPost && (
          <EditPostModal
            isOpen={showEditPostModal}
            onClose={() => {
              setShowEditPostModal(false);
              setEditingPost(null);
            }}
            post={editingPost}
            onSubmit={handleUpdateSubmit}
          />
        )}

        {showCompleteProfileModal && (
          <CompleteProfileModal
            isOpen={showCompleteProfileModal}
            onClose={() => setShowCompleteProfileModal(false)}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </div>
    </div>
  );
}
