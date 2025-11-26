import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostImageGallery from "../components/PostImageGallery";
import PostInfoSection from "../components/PostInfoSection";
import SellerInfo from "../components/SellerInfo";
import { useNavigate, useParams } from "react-router-dom";
import { postService } from "../data/services";
import { userService } from "../data/services";
import type { Post } from "../data/types/post.types";
import { toast } from "react-hot-toast";

// Adapter interfaces to match component expectations
interface AdaptedPost {
  title: string;
  user: { user_id: number; name: string; phone_number?: string };
  description: string;
  created_at: string;
  post_type: { type_id: number; type_name: string };
  quantity_kg?: number;
  price_per_kg?: number;
  municipality?: { municipality_id: number; name: string };
  product?: {
    product_id: number;
    name: string;
    description: string;
    image_url: string;
  };
  images?: { image_id: number; url: string }[];
}

interface AdaptedUser {
  user_id: number;
  name: string;
  profile_image?: string;
}

// Interfaz para posts similares
interface SimilarPost {
  id: number;
  title: string;
  images: { id: number; url: string }[];
}

function PostPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<AdaptedPost | null>(null);
  const [user, setUser] = useState<AdaptedUser | null>(null);
  const [userRating, setUserRating] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Adapter function to convert Post to AdaptedPost
  const adaptPost = (post: Post): AdaptedPost => {
    return {
      title: post.title,
      user: {
        user_id: post.user.id,
        name: post.user.name,
        phone_number: post.user.phone_number,
      },
      description: post.description,
      created_at: post.created_at,
      post_type: {
        type_id: post.post_type.id,
        type_name: post.post_type.name,
      },
      quantity_kg: post.quantity_kg,
      price_per_kg: post.price_per_kg,
      municipality: {
        municipality_id: post.municipality.id,
        name: post.municipality.name,
      },
      product: {
        product_id: post.product.id,
        name: post.product.name,
        description: post.product.description,
        image_url: post.product.image_url,
      },
      images:
        post.images?.map((img) => ({
          image_id: img.id,
          url: img.url,
        })) || [],
    };
  };

  // Adapter function to convert User to AdaptedUser
  const adaptUser = (userData: any): AdaptedUser => {
    return {
      user_id: userData.id,
      name: userData.name,
      profile_image: userData.profile_image || undefined,
    };
  };

  useEffect(() => {
    console.log("ID de post desde URL params:", id);

    // Resetear el índice de imagen seleccionada cuando cambia el post
    setSelectedImageIndex(0);

    // Load the post data from API
    if (id && !isNaN(parseInt(id))) {
      loadPost(parseInt(id));
    } else {
      console.error("ID de post inválido:", id);
      setError("ID de publicación inválido");
      setLoading(false);
    }
  }, [id]); // Dependencia en 'id' para que se ejecute cuando cambia

  const loadPost = async (postId: number) => {
    try {
      console.log("Iniciando carga de post con ID:", postId);
      setLoading(true);
      setError(null);

      // Get the main post
      const postData = await postService.getPost(postId);
      console.log("Datos del post recibidos:", postData);

      if (!postData) {
        throw new Error("No se recibieron datos del post");
      }

      const adaptedPost = adaptPost(postData);
      console.log("Post adaptado:", adaptedPost);
      setPost(adaptedPost);

      // Get user profile data
      // First set fallback immediately from post data
      console.log("📋 Datos de usuario del post:", postData.user);
      const fallbackUser = adaptUser({
        id: postData.user?.id,
        name: postData.user?.name || "Usuario",
        profile_image: undefined,
      });
      console.log("👤 Usuario fallback inicial:", fallbackUser);
      setUser(fallbackUser);

      // Then try to get more detailed profile
      try {
        console.log("🔍 Obteniendo perfil de usuario con ID:", postData.user?.id);
        const userProfileData = await userService.getUserProfile(
          postData.user.id
        );
        console.log("✅ Datos de perfil de usuario recibidos:", userProfileData);
        const adaptedUser = adaptUser(userProfileData);
        console.log("👤 Usuario adaptado:", adaptedUser);
        setUser(adaptedUser);
      } catch (userError) {
        console.error("❌ Error al obtener perfil de usuario:", userError);
        // Keep the fallback user that was already set
        console.log("⚠️ Usando datos de usuario del post como fallback");
      }

      // Get user rating
      try {
        console.log(
          "Obteniendo calificación de usuario con ID:",
          postData.user.id
        );
        const ratingData = await userService.getUserRating(postData.user.id);
        console.log("Datos de calificación recibidos:", ratingData);
        setUserRating(ratingData);
      } catch (ratingError) {
        console.log("No se pudo cargar la calificación del usuario");
      }

      // Get similar posts (same product type)
      try {
        console.log(
          "Obteniendo posts similares para producto ID:",
          postData.product.id
        );
        const similarResponse = await postService.getPosts({
          product_id: postData.product.id,
          per_page: 4,
        });
        console.log("Respuesta de posts similares:", similarResponse);

        // Filter out the current post from similar posts
        const similarData = similarResponse.data
          .filter((p) => p.id !== postId)
          .slice(0, 4); // Limit to 4 posts
        console.log("Posts similares filtrados:", similarData);

        setSimilarPosts(similarData);
      } catch (similarError) {
        console.error("Error al obtener posts similares:", similarError);
        setSimilarPosts([]);
      }
    } catch (err: any) {
      console.error("Error loading post:", err);
      setError(
        "Error al cargar la publicación: " +
          (err.message || "Error desconocido")
      );
      toast.error("Error al cargar la publicación");
    } finally {
      setLoading(false);
      console.log("Finalizando carga de post");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleSimilarPostClick = (postId: number) => {
    toast.success("Cargando publicación...");
    // Navegar a la publicación
    navigate(`/post/${postId}`);
    // Simple scroll to top with minimal approach to avoid simulator issues
    if (window.scrollTo) {
      setTimeout(() => {
        try {
          window.scrollTo(0, 0);
        } catch (e) {
          // Silently fail in simulator environment
          console.log("Scroll to top skipped due to simulator limitations");
        }
      }, 50);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="max-w-8xl mx-auto px-4 py-8">
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              Cargando publicación...
            </p>
            {id && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                ID: {id}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Solo mostrar error si realmente hay un error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center mt-12">
            <div className="text-5xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              {error}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Lo sentimos, no pudimos cargar la publicación solicitada.
            </p>
            <button
              onClick={() => navigate("/wall")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verificar datos esenciales antes de renderizar
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center mt-12">
            <div className="text-5xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Publicación no encontrada
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              No pudimos encontrar la publicación solicitada.
            </p>
            {id && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                ID buscado: {id}
              </p>
            )}
            <button
              onClick={() => navigate("/wall")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center mt-12">
            <div className="text-5xl mb-6">👤</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Información del vendedor no disponible
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              No pudimos cargar la información del vendedor.
            </p>
            <button
              onClick={() => navigate("/wall")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const photos = post.images?.map((img) => img.url) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda - Imágenes */}
          <div className="lg:w-2/5 w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <PostImageGallery
                images={photos}
                onImageSelect={handleImageSelect}
                selectedImageIndex={selectedImageIndex}
              />
            </div>
          </div>

          {/* Columna central - Información de la publicación */}
          <div className="lg:w-2/5 w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <PostInfoSection post={post} formatDate={formatDate} />
            </div>
          </div>

          {/* Columna derecha - Información del vendedor */}
          <div className="lg:w-1/5 w-full">
            <div className="lg:sticky lg:top-4 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <SellerInfo user={user} rating={userRating} />
              </div>

              {/* Additional info card */}
              <div className="bg-gradient-to-br from-blue-100 to-green-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg p-6 border border-blue-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3">
                  💡 Consejo
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Verifica siempre la información del vendedor y acuerda los
                  detalles de la transacción antes de proceder.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de publicaciones similares */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Publicaciones Similares
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
          </div>

          {similarPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarPosts.map((similarPost) => (
                <div
                  key={similarPost.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-700"
                  onClick={() => handleSimilarPostClick(similarPost.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    {similarPost.images?.length ? (
                      <img
                        src={similarPost.images[0].url}
                        alt={similarPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <span className="text-gray-400 dark:text-gray-500">
                          Sin imagen
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white font-semibold text-sm">
                        Ver detalles
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-2">
                      {similarPost.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No se encontraron publicaciones similares
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Prueba buscando otros productos relacionados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
