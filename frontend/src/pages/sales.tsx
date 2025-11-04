import { useEffect, useState, useRef, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import PostListSale from "../components/PostListSale";
import PostDetail from "../components/PostDetail";
import { postService, supportDataService } from "../data/services";
import type { Post } from "../data/types/post.types";
import { toast } from "react-hot-toast";
import EditPostModal from "../components/EditPostModal";

// Definimos la interfaz para los posts con la estructura real
interface PostData {
  id: number;
  title: string;
  description: string;
  created_at: string;
  post_type: { id: number; name: string };
  user: { id: number; name: string };
  images: { id: number; url: string }[];
  favorites_count: number;
  quantity_kg?: number;
  price_per_kg?: number;
  municipality: { id: number; name: string };
  product: {
    id: number;
    name: string;
    description: string;
    image_url: string;
  };
}

export default function Sales() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const filterTimeout = useRef<NodeJS.Timeout | null>(null);
  const isFirstFilter = useRef(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      // Filtrar por tipo "Demanda" (ID 2) para mostrar solicitudes de compra
      const response = await postService.getPosts({
        post_type_id: 2, // DEMANDA
        per_page: 50,
      });

      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
      toast.error("Error al cargar solicitudes de compra");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = useCallback((filters: any) => {
    // Clear previous timeout
    if (filterTimeout.current) {
      clearTimeout(filterTimeout.current);
    }

    // Set new timeout to debounce filter requests
    filterTimeout.current = setTimeout(() => {
      applyFilters(filters);
    }, 500); // Aumentar debounce para evitar re-renders
  }, []);

  const applyFilters = useCallback(async (filters: any) => {
    // Skip first filter application to prevent immediate API calls
    if (isFirstFilter.current) {
      isFirstFilter.current = false;
      return;
    }

    // Convertir los filtros del frontend a los parámetros que espera la API
    const apiFilters: any = {
      post_type_id: 2, // DEMANDA
    };

    if (filters.name) {
      apiFilters.search = filters.name;
    }

    if (filters.productType) {
      // This would require a product type filter on the backend
      // For now, we'll do client-side filtering for product type
    }

    if (filters.city) {
      // Primero necesitamos obtener el ID del municipio
      try {
        const municipalities = await supportDataService.getMunicipalities();
        const matchingMunicipality = municipalities.find((m: any) =>
          m.name.toLowerCase().includes(filters.city.toLowerCase())
        );
        if (matchingMunicipality) {
          apiFilters.municipality_id = matchingMunicipality.id;
        }
      } catch (error) {
        console.warn("No se pudo obtener el ID del municipio:", error);
      }
    }

    if (filters.minPrice) {
      apiFilters.min_price = Number(filters.minPrice);
    }

    if (filters.maxPrice) {
      apiFilters.max_price = Number(filters.maxPrice);
    }

    // Don't filter if no actual filters are applied (except the post_type_id)
    const hasAdditionalFilters = Object.keys(apiFilters).some(
      (key) =>
        key !== "post_type_id" &&
        apiFilters[key] !== undefined &&
        apiFilters[key] !== null &&
        apiFilters[key] !== ""
    );

    if (!hasAdditionalFilters) {
      // If no additional filters, show all posts
      loadFilteredPosts({ post_type_id: 2 });
      return;
    }

    // Aplicar filtros directamente llamando a la API
    loadFilteredPosts(apiFilters);
  }, []);

  const loadFilteredPosts = async (filters: any) => {
    try {
      setIsLoading(true);

      const response = await postService.getPosts({
        ...filters,
        per_page: 50,
      });

      setFilteredPosts(response.data);
    } catch (error: any) {
      console.error("Error cargando publicaciones filtradas:", error);
      toast.error("Error al cargar publicaciones filtradas");
      // On error, show all posts
      setFilteredPosts(posts);
    } finally {
      setIsLoading(false);
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

  const handleEdit = async (post: Post) => {
    try {
      // Fetch the full post data for editing
      const fullPost = await postService.getPost(post.id);
      setEditingPost(fullPost);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching post for editing:", error);
      toast.error("Error al cargar la publicación para editar");
    }
  };

  const handleDelete = (postId: number) => {
    // Remove the deleted post from the lists
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setFilteredPosts((prev) => prev.filter((p) => p.id !== postId));

    // If the deleted post was selected, close the detail view
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleUpdateSubmit = async (updatedPost: Post) => {
    // Update the posts in state
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
    setFilteredPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );

    // If this post is currently selected, update the selection
    if (selectedPost && selectedPost.id === updatedPost.id) {
      setSelectedPost(updatedPost);
    }

    setShowEditModal(false);
    setEditingPost(null);
    toast.success("Publicación actualizada con éxito");
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (filterTimeout.current) {
        clearTimeout(filterTimeout.current);
      }
    };
  }, []);

  return (
    <MainLayout onFilter={handleFilter}>
      <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-300 mb-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-3 rounded-2xl shadow w-full">
        Solicitudes de Compra
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 flex-grow">
          {/* Lista en dos columnas */}
          <div className="lg:w-1/2 w-full">
            <PostListSale
              posts={filteredPosts}
              onSelectPost={setSelectedPost}
              formatDate={formatDate}
            />
          </div>

          {/* Detalle */}
          <div className="hidden lg:w-1/2 lg:block w-full">
            <PostDetail
              post={
                selectedPost
                  ? {
                      post_id: selectedPost.id,
                      title: selectedPost.title,
                      user: {
                        user_id: selectedPost.user.id,
                        name: selectedPost.user.name,
                      },
                      description: selectedPost.description,
                      created_at: selectedPost.created_at,
                      post_type: {
                        type_id: selectedPost.post_type.id,
                        type_name: selectedPost.post_type.name,
                      },
                      images:
                        selectedPost.images?.map((img) => ({
                          image_id: img.id,
                          url: img.url,
                        })) || [],
                      quantity_kg: selectedPost.quantity_kg,
                      price_per_kg: selectedPost.price_per_kg,
                      municipality: {
                        municipality_id: selectedPost.municipality.id,
                        name: selectedPost.municipality.name,
                      },
                      product: {
                        product_id: selectedPost.product.id,
                        name: selectedPost.product.name,
                        description: selectedPost.product.description,
                        image_url: selectedPost.product.image_url,
                      },
                    }
                  : null
              }
              onClose={() => setSelectedPost(null)}
              formatDate={formatDate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* Mobile modal overlay for post details */}
          {selectedPost && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setSelectedPost(null)}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <PostDetail
                    post={{
                      post_id: selectedPost.id,
                      title: selectedPost.title,
                      user: {
                        user_id: selectedPost.user.id,
                        name: selectedPost.user.name,
                      },
                      description: selectedPost.description,
                      created_at: selectedPost.created_at,
                      post_type: {
                        type_id: selectedPost.post_type.id,
                        type_name: selectedPost.post_type.name,
                      },
                      images:
                        selectedPost.images?.map((img) => ({
                          image_id: img.id,
                          url: img.url,
                        })) || [],
                      quantity_kg: selectedPost.quantity_kg,
                      price_per_kg: selectedPost.price_per_kg,
                      municipality: {
                        municipality_id: selectedPost.municipality.id,
                        name: selectedPost.municipality.name,
                      },
                      product: {
                        product_id: selectedPost.product.id,
                        name: selectedPost.product.name,
                        description: selectedPost.product.description,
                        image_url: selectedPost.product.image_url,
                      },
                    }}
                    onClose={() => setSelectedPost(null)}
                    formatDate={formatDate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Edit Post Modal */}
          {editingPost && (
            <EditPostModal
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingPost(null);
              }}
              post={editingPost}
              onSubmit={handleUpdateSubmit}
            />
          )}
        </div>
      )}
    </MainLayout>
  );
}
