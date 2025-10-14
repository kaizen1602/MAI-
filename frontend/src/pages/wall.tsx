import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PostList from "../components/PostList";
import PostDetail from "../components/PostDetail";
import postsData from "../data/post.json";

// Definimos la interfaz para los posts con la estructura real
interface PostData {
  post_id: number;
  title: string;
  description: string;
  created_at: string;
  post_type: { type_id: number; type_name: string };
  user: { user_id: number; name: string };
  images?: { image_id: number; url: string }[];
  likes?: number;
  comments?: number;
}

function Wall() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  useEffect(() => {

    const loadedPosts = postsData.map((post: any) => ({
      ...post,
      likes: post.likes || 0,
      comments: post.comments || 0
    }));
    setPosts(loadedPosts);
    setFilteredPosts(loadedPosts);
  }, []);

  const handleFilter = (filters: any) => {
    let results = posts;
    if (filters.nombre) {
      results = results.filter((p) =>
        (typeof p.user === "object" ? p.user.name : p.user)
          .toLowerCase()
          .includes(filters.nombre.toLowerCase())
      );
    }
    setFilteredPosts(results);
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

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Handle post selection with scroll to top
  const handleSelectPost = (post: PostData) => {
    setSelectedPost(post);
    scrollToTop();
  };

  return (
    <MainLayout onFilter={handleFilter}>
      <h1 className="text-3xl font-extrabold text-green-900 dark:text-green-300 mb-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-3 rounded-2xl shadow w-full">
        Muro de Publicaciones
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 flex-grow">
        {/* Lista */}
        <div className="lg:w-1/2 w-full">
          <PostList
            posts={filteredPosts}
            onSelectPost={handleSelectPost}
            formatDate={formatDate}
          />
        </div>

        {/* Detalle - only visible on desktop */}
        <div className="hidden lg:w-1/2 lg:block w-full">
          <PostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            formatDate={formatDate}
          />
        </div>
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
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
                formatDate={formatDate}
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Wall;