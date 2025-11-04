import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostImageGallery from "../components/PostImageGallery";
import PostInfoSection from "../components/PostInfoSection";
import SellerInfo from "../components/SellerInfo";
import { useNavigate, useParams } from "react-router-dom";
import { postService } from "../data/services";
import type { Post } from "../data/types/post.types";
import { toast } from "react-hot-toast";

// Adapter interfaces to match component expectations
interface AdaptedPost {
  title: string;
  user: { user_id: number; name: string };
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
  const adaptUser = (user: Post["user"]): AdaptedUser => {
    return {
      user_id: user.id,
      name: user.name,
    };
  };

  useEffect(() => {
    // Resetear el índice de imagen seleccionada cuando cambia el post
    setSelectedImageIndex(0);

    // Load the post data from API
    if (id) {
      loadPost(parseInt(id));
    }
  }, [id]); // Dependencia en 'id' para que se ejecute cuando cambia

  const loadPost = async (postId: number) => {
    try {
      setLoading(true);
      setError(null);

      // Get the main post
      const postData = await postService.getPost(postId);
      const adaptedPost = adaptPost(postData);
      const adaptedUser = adaptUser(postData.user);

      setPost(adaptedPost);
      setUser(adaptedUser);

      // Get similar posts (same product type)
      const similarResponse = await postService.getPosts({
        product_id: postData.product.id,
        per_page: 4,
      });

      // Filter out the current post from similar posts
      const similarData = similarResponse.data
        .filter((p) => p.id !== postId)
        .slice(0, 4); // Limit to 4 posts

      setSimilarPosts(similarData);
    } catch (err: any) {
      console.error("Error loading post:", err);
      setError("Error al cargar la publicación");
      toast.error("Error al cargar la publicación");
    } finally {
      setLoading(false);
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
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300 dark:bg-gray-900"
        style={{
          backgroundImage: "url('/fondoMuro.jpg')",
        }}
      >
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              Cargando publicación...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post || !user) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300 dark:bg-gray-900"
        style={{
          backgroundImage: "url('/fondoMuro.jpg')",
        }}
      >
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-10">
            <p className="text-red-500 dark:text-red-400 text-xl">
              {error || "Publicación no encontrada"}
            </p>
            <button
              onClick={() => navigate("/wall")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300 dark:bg-gray-900"
      style={{
        backgroundImage: "url('/fondoMuro.jpg')",
      }}
    >
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Columna izquierda - Imágenes */}
          <div className="lg:w-2/5 w-full">
            <PostImageGallery
              images={photos}
              onImageSelect={handleImageSelect}
              selectedImageIndex={selectedImageIndex}
            />
          </div>

          {/* Columna central - Información de la publicación */}
          <div className="lg:w-2/5 w-full">
            <PostInfoSection post={post} formatDate={formatDate} />
          </div>

          {/* Columna derecha - Información del vendedor (más angstra) */}
          <div className="lg:w-1/5 w-full">
            <div className="lg:sticky lg:top-4">
              <SellerInfo user={user} />
            </div>
          </div>
        </div>

        {/* Sección de publicaciones similares */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-10 text-center">
            Publicaciones Similares
          </h2>
          {similarPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarPosts.map((similarPost) => (
                <div
                  key={similarPost.id}
                  className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-md p-5 hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleSimilarPostClick(similarPost.id)}
                >
                  <div className="rounded-xl overflow-hidden mb-4">
                    {similarPost.images?.length ? (
                      <img
                        src={similarPost.images[0].url}
                        alt={similarPost.title}
                        className="w-full h-44 object-cover"
                      />
                    ) : (
                      <div className="w-full h-44 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">
                          Sin imagen
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-xl text-blue-800 dark:text-blue-300 text-center">
                    {similarPost.title}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No se encontraron publicaciones similares
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
