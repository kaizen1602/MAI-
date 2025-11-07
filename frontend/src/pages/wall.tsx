import { useEffect, useState, useRef, useCallback, ReactElement } from "react";
import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard"; // Importar PostCard directamente
import PostDetail from "../components/PostDetail";
import { postService, supportDataService } from "../data/services";
import type { Post } from "../data/types/post.types";
import { toast } from "react-hot-toast";
import Filters from "../components/filters";

// Adapter interface for PostDetail component
interface PostDetailData {
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
}

export default function Wall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostDetail, setSelectedPostDetail] =
    useState<PostDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const postsPerPage = 6; // Aumentado a 6 para mostrar 2 filas de 3
  const filterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstFilter = useRef(true);

  useEffect(() => {
    loadPosts();
  }, []);

  // Adapter function to convert Post to PostDetailData
  const adaptPostToDetail = (post: Post): PostDetailData => {
    return {
      post_id: post.id,
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
      images:
        post.images?.map((img) => ({
          image_id: img.id,
          url: img.url,
        })) || [],
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
    };
  };

  useEffect(() => {
    if (selectedPost) {
      setSelectedPostDetail(adaptPostToDetail(selectedPost));
      setShowPostDetailModal(true);
    } else {
      setSelectedPostDetail(null);
      setShowPostDetailModal(false);
    }
  }, [selectedPost]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await postService.getPosts({
        per_page: 50,
      });
      setPosts(response.data);
      setFilteredPosts(response.data);
      setCurrentPage(1); // Reset to first page when loading new posts
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
      toast.error("Error al cargar publicaciones");
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
    }, 300);
  }, []);

  const applyFilters = useCallback(
    async (filters: any) => {
      // Skip first filter application to prevent immediate API calls
      if (isFirstFilter.current) {
        isFirstFilter.current = false;
        return;
      }

      // Convertir los filtros del frontend a los parámetros que espera la API
      const apiFilters: any = {};

      if (filters.name) {
        apiFilters.search = filters.name;
      }

      if (filters.productType) {
      }

      if (filters.city) {

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
        setFilteredPosts(posts);
        setCurrentPage(1); // Reset to first page
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

      const response = await postService.getPosts({
        ...filters,
        per_page: 50,
      });

      setFilteredPosts(response.data);
      setCurrentPage(1); // Reset to first page when loading filtered posts
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

  // Get current posts for pagination
  const getCurrentPosts = () => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Generate pagination buttons with first 5, current, and last page
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
        {/* Filtros debajo del título */}
        <div className="mb-6">
          <Filters onFilter={handleFilter} />
        </div>
        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-300 mb-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-3 rounded-2xl shadow w-full">
          Muro de Publicaciones
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 flex-grow">
            {/* Lista de publicaciones con paginación en filas de 3 */}
            <div className="w-full">
              {/* Grid de publicaciones - 2 filas de 3 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {getCurrentPosts()
                  .slice(0, 3)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onSelectPost={setSelectedPost}
                      formatDate={formatDate}
                    />
                  ))}
              </div>

              {/* Segunda fila de publicaciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {getCurrentPosts()
                  .slice(3, 6)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onSelectPost={setSelectedPost}
                      formatDate={formatDate}
                    />
                  ))}
              </div>

              {/* Paginación */}
              <div className="flex justify-center mt-6 space-x-2 flex-wrap">
                {generatePaginationButtons()}
              </div>
            </div>

            {/* Modal para detalle de publicación (en móvil y escritorio) */}
            {showPostDetailModal && selectedPostDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <div className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <PostDetail
                    post={selectedPostDetail}
                    onClose={() => {
                      setSelectedPost(null);
                      setShowPostDetailModal(false);
                    }}
                    formatDate={formatDate}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
