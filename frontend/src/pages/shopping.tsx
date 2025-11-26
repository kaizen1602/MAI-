import { useEffect, useState, useRef, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard"; // Importar PostCard directamente
import PostDetail from "../components/PostDetail";
import { postService } from "../data/services";
import type { Post } from "../data/types/post.types";
import { toast } from "react-hot-toast";
import EditPostModal from "../components/EditPostModal";
import type { CursorPaginatedResponse } from "../data/types/api.types";
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

export default function Shopping() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostDetail, setSelectedPostDetail] =
    useState<PostDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Mostrar 6 posts por página (2 filas de 3)
  const filterTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const loadPosts = async (filters: any = {}, cursor: string | null = null) => {
    try {
      setIsLoading(true);

      // Prepare filter parameters
      const filterParams: any = {
        post_type_id: 2, // COMPRA - Solicitudes de compra
        per_page: 20,
      };

      // Add cursor for pagination
      if (cursor) {
        filterParams.cursor = cursor;
      } else {
        // Reset to first page when loading new filters
        setCurrentPage(1);
      }

      // Map filters to API parameters
      if (filters.productType) {
        filterParams.search = filters.productType;
      }

      if (filters.city) {
        filterParams.search = filterParams.search
          ? `${filterParams.search} ${filters.city}`
          : filters.city;
      }

      if (filters.minPrice) {
        filterParams.min_price = Number(filters.minPrice);
      }

      if (filters.maxPrice) {
        filterParams.max_price = Number(filters.maxPrice);
      }

      if (filters.name) {
        filterParams.search = filterParams.search
          ? `${filterParams.search} ${filters.name}`
          : filters.name;
      }

      // Add sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "priceAsc":
            filterParams.sort_by = "price_per_kg";
            filterParams.sort_order = "asc";
            break;
          case "priceDesc":
            filterParams.sort_by = "price_per_kg";
            filterParams.sort_order = "desc";
            break;
          case "dateDesc":
            filterParams.sort_by = "created_at";
            filterParams.sort_order = "desc";
            break;
          case "dateAsc":
            filterParams.sort_by = "created_at";
            filterParams.sort_order = "asc";
            break;
        }
      }

      const response: CursorPaginatedResponse<Post> =
        await postService.getPosts(filterParams);

      // If it's pagination, append to existing posts
      if (cursor) {
        setPosts((prev) => [...prev, ...response.data]);
      } else {
        setPosts(response.data);
      }

      // Set pagination info
      setHasMore(!!response.pagination.next_cursor);
      setNextCursor(response.pagination.next_cursor || null);
    } catch (error) {
      console.error("Error cargando productos:", error);
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
      loadPosts(filters);
    }, 500); // Aumentar debounce para evitar re-renders
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load more posts (next page)
  const loadMore = async () => {
    if (hasMore && nextCursor) {
      await loadPosts({}, nextCursor);
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Go to previous page (reload with previous data)
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get current posts for pagination
  const getCurrentPosts = () => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return posts.slice(indexOfFirstPost, indexOfLastPost);
  };

  const handleEdit = async (postDetail: PostDetailData) => {
    try {
      // Fetch the full post data for editing
      const fullPost = await postService.getPost(postDetail.post_id);
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

    // If this post is currently selected, update the selection
    if (selectedPost && selectedPost.id === updatedPost.id) {
      setSelectedPost(updatedPost);
    }

    setShowEditModal(false);
    setEditingPost(null);
    toast.success("Publicación actualizada con éxito");
  };

  return (
    <MainLayout>
      {/* Contenedor principal que agrupa todo el contenido - Aumentado el ancho */}
      <div className="container mx-auto px-4 py-6 max-w-7xl w-full">
        <div className="mb-6">
          <Filters onFilter={handleFilter} />
        </div>
        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-300 mb-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-3 rounded-2xl shadow w-full">
          Solicitudes de Compra
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
                  />
                ))}
              </div>

              {/* Paginación */}
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Anterior
                </button>

                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Página {currentPage}
                </span>

                <button
                  onClick={loadMore}
                  disabled={!hasMore}
                  className={`px-4 py-2 rounded-lg ${
                    !hasMore
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Siguiente
                </button>
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
