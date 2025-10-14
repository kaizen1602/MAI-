import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PostListSale from "../components/PostListSale";
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

export default function Sales() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  useEffect(() => {
    // Filtrar solo los posts de tipo Compra al cargar para "Quiero Vender" (mostrar lo que la gente busca comprar)
    const compraPosts = postsData
      .filter((post: any) => post.post_type.type_name === "Compra")
      .map((post: any) => ({
        ...post,
        likes: post.likes || 0,
        comments: post.comments || 0
      }));
    setPosts(compraPosts);
    setFilteredPosts(compraPosts);
  }, []);

  const handleFilter = (filters: any) => {
    let results = posts;

    if (filters.productType) {
      results = results.filter(p => 
        p.product?.name.toLowerCase().includes(filters.productType.toLowerCase())
      );
    }

    if (filters.city) {
      results = results.filter(p => 
        p.municipality?.name.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.minPrice) {
      results = results.filter(p => (p.price_per_kg ?? 0) >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      results = results.filter(p => (p.price_per_kg ?? 0) <= Number(filters.maxPrice));
    }

    if (filters.name) {
      results = results.filter(p => 
        p.title.toLowerCase().includes(filters.name.toLowerCase())
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

  return (
    <MainLayout onFilter={handleFilter}>
      <h1 className="text-3xl font-extrabold text-green-900 dark:text-green-300 mb-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-3 rounded-2xl shadow w-full">
        Solicitudes de Compra
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 flex-grow">
        {/* Lista en dos columnas */}
        <div className="lg:w-1/2 w-full">
          <PostListSale
            posts={filteredPosts}
            onSelectPost={(post: PostData) => setSelectedPost(post)}
            formatDate={formatDate}
          />
        </div>

        {/* Detalle */}
        <div className="hidden lg:w-1/2 lg:block w-full">
          <PostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            formatDate={formatDate}
          />
        </div>
      </div>
    </MainLayout>
  );
}