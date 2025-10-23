import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfo from "../components/ProfileInfo";
import UserPosts from "../components/UserPosts";
import UserFavorites from "../components/UserFavorites";
import ProfilePurchases from "../components/PurchaseHistory";
import EditProfileModal from "../components/EditProfileModal";
import EditPostModal from "../components/EditPostModal";
import ProfileProgressBar from "../components/ProfileProgressBar";
import CompleteProfileModal from "../components/CompleteProfileModal";
import { useAuth } from "../data/context/AuthContext";
import { usePurchases } from "../data/context/PurchaseContext";
import { postService } from "../data/services";
import { toast } from "react-hot-toast";
import type { Post } from "../data/types/post.types";

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const { purchases } = usePurchases();
  const [showModal, setShowModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = async () => {
    if (!user) return;
    
    try {
      setIsLoadingPosts(true);
      const response = await postService.getPosts({
        user_id: user.id,
        per_page: 10
      });
      
      // Convertir posts al formato que espera el componente
      const formattedPosts = response.data.map((post: Post) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        imageUrl: post.images[0]?.url || '/default-post.jpg',
        likes: post.favorites_count,
        comments: 0,
        status: post.status?.toLowerCase() || 'active'
      }));
      
      setUserPosts(formattedPosts);
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
      toast.error('Error al cargar tus publicaciones');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleSave = async (updatedUser: any) => {
    try {
      await updateProfile({
        name: updatedUser.name,
        email: updatedUser.email,
      });
      toast.success('Perfil actualizado correctamente');
      setShowModal(false);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleCompleteProfile = () => {
    setShowCompleteProfileModal(true);
  };

  const handleProfileUpdated = (updatedUser: any) => {
    // El contexto ya maneja la actualización del usuario
    toast.success('¡Perfil completado con éxito!');
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
      setUserPosts(prev => prev.filter(post => post.id !== postId));
      toast.success("Publicación eliminada con éxito");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error al eliminar la publicación");
    }
  };

  const handlePostStatusUpdate = async (postId: number, status: 'ACTIVE' | 'CLOSED' | 'EXPIRED') => {
    try {
      const updatedPost = await postService.updatePostStatus(postId, status);
      
      // Update the posts in state
      setUserPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, status: status.toLowerCase() }
          : p
      ));
      
      toast.success('Estado de publicación actualizado');
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error('Error al actualizar el estado de la publicación');
    }
  };

  const handleMarkAsSold = (postId: number, soldOnPlatform: boolean) => {
    const status = soldOnPlatform ? 'CLOSED' : 'CLOSED';
    handlePostStatusUpdate(postId, status);
  };

  const handleDeactivate = (postId: number) => {
    handlePostStatusUpdate(postId, 'EXPIRED');
  };

  const handleUpdateSubmit = async (updatedPost: Post) => {
    // Convert the updated post to the format expected by the component
    const updatedPostData = {
      id: updatedPost.id,
      title: updatedPost.title,
      description: updatedPost.description,
      imageUrl: updatedPost.images[0]?.url || '/default-post.jpg',
      likes: updatedPost.favorites_count,
      comments: 0
    };
    
    // Update the posts in state
    setUserPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPostData : p));
    
    setShowEditPostModal(false);
    setEditingPost(null);
    toast.success("Publicación actualizada con éxito");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/fondoMuro.jpg')" }}
    >
      <Navbar />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Columna izquierda - Información del perfil (más ancha) */}
          <div className="lg:w-2/3 w-full">
            {/* Encabezado */}
            <ProfileHeader
              name={user.name}
              username={user.email}
              imageUrl={user.profile_image || "/default-avatar.jpg"}
              onEdit={handleEdit}
            />

            {/* Barra de progreso del perfil */}
            <ProfileProgressBar
              user={user}
              onCompleteProfile={handleCompleteProfile}
            />

            {/* Información personal */}
            <div className="mt-8">
              <ProfileInfo 
                email={user.email} 
                city={user.address_details || 'No especificado'}
                joinDate={new Date(user.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                bio={`Miembro desde ${new Date(user.created_at).getFullYear()}`}
              />
            </div>

            {/* Historial de compras */}
            <div className="mt-8">
              <ProfilePurchases />
            </div>

            {/* Favoritos */}
            <div className="mt-8">
              <UserFavorites userId={user.id} />
            </div>
          </div>

          {/* Columna derecha - Publicaciones (más angstra) */}
          <div className="lg:w-1/3 w-full">
            {isLoadingPosts ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <UserPosts 
                posts={userPosts} 
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onMarkAsSold={handleMarkAsSold}
                onDeactivate={handleDeactivate}
              />
            )}
          </div>
        </div>

        {/* Modal para editar perfil */}
        {showModal && (
          <EditProfileModal
            user={{
              name: user.name,
              email: user.email,
              username: user.email,
              imageUrl: '/default-avatar.jpg',
              city: user.address_details || '',
              joinDate: user.created_at,
              bio: '',
              posts: userPosts,
              purchases: []
            }}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}
        
        {/* Modal para completar perfil */}
        <CompleteProfileModal
          isOpen={showCompleteProfileModal}
          onClose={() => setShowCompleteProfileModal(false)}
          onProfileUpdated={handleProfileUpdated}
        />
        
        {/* Modal para editar publicación */}
        {editingPost && (
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
      </div>
    </div>
  );
}