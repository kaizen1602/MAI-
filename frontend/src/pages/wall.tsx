import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PostList from "../components/PostList";
import PostDetail from "../components/PostDetail";
import { postService, supportDataService } from "../data/services";
import type { Post } from "../data/types/post.types";
import { toast } from "react-hot-toast";
import EditPostModal from "../components/EditPostModal";

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

function Wall() {
  console.log('Wall component rendering'); // Debug log
  
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostDetail, setSelectedPostDetail] = useState<PostDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const filterTimeout = useRef<NodeJS.Timeout | null>(null);
  const isFirstFilter = useRef(true);

  // Adapter function to convert Post to PostDetailData
  const adaptPostToDetail = (post: Post): PostDetailData => {
    return {
      post_id: post.id,
      title: post.title,
      user: {
        user_id: post.user.id,
        name: post.user.name
      },
      description: post.description,
      created_at: post.created_at,
      post_type: {
        type_id: post.post_type.id,
        type_name: post.post_type.name
      },
      images: post.images?.map(img => ({
        image_id: img.id,
        url: img.url
      })) || [],
      quantity_kg: post.quantity_kg,
      price_per_kg: post.price_per_kg,
      municipality: {
        municipality_id: post.municipality.id,
        name: post.municipality.name
      },
      product: {
        product_id: post.product.id,
        name: post.product.name,
        description: post.product.description,
        image_url: post.product.image_url
      }
    };
  };

  const loadPosts = useCallback(async (loadMore = false) => {
    try {
      setIsLoading(true);
      
      const response = await postService.getPosts({
        cursor: loadMore && cursor ? cursor : undefined,
        per_page: 20
      });

      if (loadMore) {
        setPosts(prev => [...prev, ...response.data]);
        setFilteredPosts(prev => [...prev, ...response.data]);
      } else {
        setPosts(response.data);
        setFilteredPosts(response.data);
      }

      setCursor(response.pagination.next_cursor);
      setHasMore(response.pagination.has_more_pages);
    } catch (error: any) {
      console.error('Error cargando publicaciones:', error);
      toast.error('Error al cargar publicaciones');
    } finally {
      setIsLoading(false);
    }
  }, []); // Remover cursor de las dependencias

  useEffect(() => {
    if (selectedPost) {
      setSelectedPostDetail(adaptPostToDetail(selectedPost));
    } else {
      setSelectedPostDetail(null);
    }
  }, [selectedPost]);

  useEffect(() => {
    loadPosts();
  }, []); // Solo ejecutar una vez al montar

  // Detectar cuando se vuelve a la página y recargar si es necesario
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && posts.length === 0) {
        console.log('Page became visible and no posts loaded, reloading...');
        loadPosts(false);
      }
    };

    const handleFocus = () => {
      if (posts.length === 0) {
        console.log('Page focused and no posts loaded, reloading...');
        loadPosts(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [posts.length, loadPosts]);

  // Detectar cambios en la ubicación (navegación hacia atrás/adelante)
  useEffect(() => {
    if (location.pathname === '/wall' && posts.length === 0) {
      console.log('Navigated to wall page with no posts, reloading...');
      loadPosts(false);
    }
  }, [location.pathname, posts.length, loadPosts]);

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
    const apiFilters: any = {};
    
    if (filters.name) {
      apiFilters.search = filters.name;
    }
    
    if (filters.postType) {
      // Los filtros ahora usan IDs numéricos directamente
      apiFilters.post_type_id = Number(filters.postType);
    }
    
    if (filters.productType) {
      // Los filtros ahora usan IDs numéricos directamente
      apiFilters.product_id = Number(filters.productType);
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
        console.warn('No se pudo obtener el ID del municipio:', error);
      }
    }
    
    if (filters.minPrice) {
      apiFilters.min_price = Number(filters.minPrice);
    }
    
    if (filters.maxPrice) {
      apiFilters.max_price = Number(filters.maxPrice);
    }
    
    // Don't filter if no actual filters are applied
    const hasFilters = Object.keys(apiFilters).some(key => 
      apiFilters[key] !== undefined && apiFilters[key] !== null && apiFilters[key] !== ''
    );
    
    if (!hasFilters) {
      // If no filters, reload all posts from the beginning
      console.log('No filters applied, reloading all posts');
      loadPosts(false); // Reload from beginning
      return;
    }
    
    // Aplicar filtros directamente llamando a la API
    loadFilteredPosts(apiFilters);
  }, [loadPosts]);

  const loadFilteredPosts = useCallback(async (filters: any) => {
    try {
      setIsLoading(true);
      
      const response = await postService.getPosts({
        ...filters,
        per_page: 20
      });

      setFilteredPosts(response.data);
      
      setCursor(response.pagination.next_cursor);
      setHasMore(response.pagination.has_more_pages);
    } catch (error: any) {
      console.error('Error cargando publicaciones filtradas:', error);
      toast.error('Error al cargar publicaciones filtradas');
      // On error, show all posts
      setFilteredPosts(posts);
    } finally {
      setIsLoading(false);
    }
  }, [posts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Handle post selection with scroll to top
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    scrollToTop();
  };

  const handlePostUpdated = (updatedPost: Post) => {
    // Update the post in the lists
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setFilteredPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    
    // Update selected post if it's the same
    if (selectedPost && selectedPost.id === updatedPost.id) {
      setSelectedPost(updatedPost);
    }
  };

  const handlePostDeleted = (postId: number) => {
    // Remove the post from the lists
    setPosts(prev => prev.filter(p => p.id !== postId));
    setFilteredPosts(prev => prev.filter(p => p.id !== postId));
    
    // Clear selected post if it was deleted
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
      setSelectedPostDetail(null);
    }
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
    setPosts(prev => prev.filter(p => p.id !== postId));
    setFilteredPosts(prev => prev.filter(p => p.id !== postId));
    
    // If the deleted post was selected, close the detail view
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleUpdateSubmit = async (updatedPost: Post) => {
    // Update the posts in state
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setFilteredPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    
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
      <h1 className="text-3xl font-extrabold text-green-900 dark:text-green-300 mb-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-3 rounded-2xl shadow w-full">
        Muro de Publicaciones
      </h1>

      {isLoading && posts.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-6 flex-grow">
            {/* Lista */}
            <div className="lg:w-1/2 w-full">
              <PostList
                posts={filteredPosts}
                onSelectPost={handleSelectPost}
                formatDate={formatDate}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
              
              {/* Botón Cargar Más */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => loadPosts(true)}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Cargando...' : 'Cargar más publicaciones'}
                  </button>
                </div>
              )}
            </div>

            {/* Detalle - only visible on desktop */}
            <div className="hidden lg:w-1/2 lg:block w-full">
              <PostDetail
                post={selectedPostDetail}
                onClose={() => setSelectedPost(null)}
                formatDate={formatDate}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
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
        </>
      )}
    </MainLayout>
  );
}

export default Wall;