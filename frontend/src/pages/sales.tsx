import { useEffect, useState, useRef, useCallback, ReactElement } from "react";
import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard"; // Importar PostCard directamente
import PostDetail from "../components/PostDetail";
import { postService, supportDataService } from "../data/services";
import type { Post } from "../data/types/post.types";
import { toast } from "react-hot-toast";
import EditPostModal from "../components/EditPostModal";
import Filters from "../components/filters";

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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Mostrar 6 posts por página (2 filas de 3)
  const filterTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Iniciando carga de posts tipo VENTA...");
      // Filtrar por tipo "Venta" (ID 1) para mostrar productos en venta
      const response = await postService.getPosts({
        post_type_id: 1, // VENTA
        per_page: 50,
      });

      console.log("✅ Respuesta de API:", response);
      console.log("📦 Posts recibidos:", response.data?.length || 0, "posts");

      if (response.data && response.data.length > 0) {
        setPosts(response.data);
        setFilteredPosts(response.data);
        console.log("✅ Posts guardados en estado");
      } else {
        console.warn("⚠️ No se recibieron posts de la API");
        setPosts([]);
        setFilteredPosts([]);
      }
      setCurrentPage(1); // Reset to first page when loading new posts
    } catch (error) {
      console.error("❌ Error cargando productos:", error);
      toast.error("Error al cargar productos en venta");
    } finally {
      setIsLoading(false);
      console.log("🏁 Carga finalizada");
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

  const applyFilters = useCallback(
    async (filters: any) => {
      // Convertir los filtros del frontend a los parámetros que espera la API
      const apiFilters: any = {
        post_type_id: 1, // VENTA
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
        // If no additional filters, just reload all posts from API
        // Don't use local 'posts' state as it might be stale or empty
        loadFilteredPosts(apiFilters);
        return;
      }

      // Aplicar filtros directamente llamando a la API
      loadFilteredPosts(apiFilters);
    },
    [posts]
  );

  const loadFilteredPosts = async (filters: any) => {
    try {
      setIsLoading(true);
      console.log("🔍 loadFilteredPosts llamado con filtros:", filters);

      const response = await postService.getPosts({
        ...filters,
        per_page: 50,
      });

      console.log("✅ loadFilteredPosts respuesta:", response);
      console.log("📦 Posts filtrados:", response.data?.length || 0);

      setFilteredPosts(response.data || []);
      setCurrentPage(1); // Reset to first page when loading filtered posts
    } catch (error: any) {
      console.error("❌ Error cargando publicaciones filtradas:", error);
      toast.error("Error al cargar publicaciones filtradas");
      // On error, keep current posts instead of potentially empty 'posts' state
      // Don't setFilteredPosts(posts) as it might be empty
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

  // Get current posts for pagination
  const getCurrentPosts = () => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Generate pagination buttons
  const generatePaginationButtons = (): ReactElement[] => {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const buttons: ReactElement[] = [];

    // Always show first page
    if (totalPages > 0) {
      buttons.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          1
        </button>
      );
    }

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 2; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === i
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show first 5 pages
      const maxInitialPages = Math.min(5, totalPages);
      for (let i = 2; i <= maxInitialPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === i
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }

      // Show ellipsis and current page if needed
      if (currentPage > 5 && currentPage < totalPages - 3) {
        buttons.push(
          <span key="ellipsis1" className="px-2 py-2">
            ...
          </span>
        );

        buttons.push(
          <button
            key={currentPage}
            onClick={() => paginate(currentPage)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            {currentPage}
          </button>
        );
      }

      // Show last pages
      if (currentPage < totalPages - 3) {
        buttons.push(
          <span key="ellipsis2" className="px-2 py-2">
            ...
          </span>
        );
      }

      // Show last page
      if (totalPages > 1) {
        buttons.push(
          <button
            key={totalPages}
            onClick={() => paginate(totalPages)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
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
    <MainLayout>
      {/* Contenedor principal que agrupa todo el contenido - Aumentado el ancho */}
      <div className="container mx-auto px-4 py-6 max-w-7xl w-full">

        <div className="mb-6">
          <Filters onFilter={handleFilter} />
        </div>
        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-300 mb-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-3 rounded-2xl shadow w-full">
          Productos en Venta
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 flex-grow">
            {/* Lista de publicaciones */}
            <div className="w-full">
              {/* Grid responsive: 1 col móvil, 2 cols tablet, 3 cols desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                {getCurrentPosts().map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelectPost={setSelectedPost}
                    formatDate={formatDate}
                    onPostUpdated={handleUpdateSubmit}
                    onPostDeleted={handleDelete}
                  />
                ))}
              </div>

              {/* Paginación */}
              <div className="flex justify-center mt-6 space-x-2 flex-wrap">
                {generatePaginationButtons()}
              </div>
            </div>

            {/* Modal para detalle de publicación (en móvil y escritorio) */}
            {selectedPost && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <div className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
      </div>
    </MainLayout>
  );
}
