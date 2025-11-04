import { useEffect, useState, useRef, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import PostList from "../components/PostList";
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
    } else {
      setSelectedPostDetail(null);
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
        setFilteredPosts(posts);
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

  useEffect(() => {
    return () => {
      if (filterTimeout.current) {
        clearTimeout(filterTimeout.current);
      }
    };
  }, []);

  return (
    <MainLayout>
      <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-300 mb-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-3 rounded-2xl shadow w-full">
        Muro de Publicaciones
      </h1>

      {/* Filtros debajo del título */}
      <div className="mb-6">
        <Filters onFilter={handleFilter} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 flex-grow">
          {/* Lista de publicaciones */}
          <div className="lg:w-1/2 w-full">
            <PostList
              posts={filteredPosts}
              onSelectPost={setSelectedPost}
              formatDate={formatDate}
            />
          </div>

          {/* Detalle de publicación */}
          <div className="hidden lg:w-1/2 lg:block w-full">
            <PostDetail
              post={selectedPostDetail}
              onClose={() => setSelectedPost(null)}
              formatDate={formatDate}
            />
          </div>

          {/* Mobile modal overlay for post details */}
          {selectedPostDetail && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setSelectedPost(null)}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <PostDetail
                    post={selectedPostDetail}
                    onClose={() => setSelectedPost(null)}
                    formatDate={formatDate}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}
