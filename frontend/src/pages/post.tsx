import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostImageGallery from "../components/PostImageGallery";
import PostInfoSection from "../components/PostInfoSection";
import SellerInfo from "../components/SellerInfo";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Definimos la interfaz para los posts con la estructura real de los datos
interface Post {
  post_id: number;
  title: string;
  user: { user_id: number; name: string };
  description: string;
  created_at: string;
  post_type: { type_id: number; type_name: string };
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

// Interfaz para posts similares
interface SimilarPost {
  post_id: number;
  title: string;
  images?: { image_id: number; url: string }[];
}

// Datos de ejemplo para diferentes posts
const mockPostsData = [
  {
    post_id: 1,
    title: "Venta de tomates orgánicos",
    user: { user_id: 101, name: "Juan Pérez" },
    description: "Tomates 100% orgánicos, recién cosechados. Precio especial por mayor.",
    created_at: "2025-09-29T10:30:00",
    post_type: { type_id: 1, type_name: "Venta" },
    images: [
      { image_id: 501, url: "https://picsum.photos/400/300?random=10" },
      { image_id: 502, url: "https://picsum.photos/400/300?random=20" },
      { image_id: 503, url: "https://picsum.photos/400/300?random=30" }
    ],
    likes: 15,
    comments: 3,
    quantity_kg: 200,
    price_per_kg: 2500.0,
    municipality: { municipality_id: 11, name: "Bogotá" },
    product: {
      product_id: 1,
      name: "Tomate",
      description: "Tomate fresco orgánico",
      image_url: "https://picsum.photos/200/150?random=1"
    }
  },
  {
    post_id: 2,
    title: "Venta de lechugas frescas",
    user: { user_id: 102, name: "María García" },
    description: "Lechugas frescas cosechadas esta mañana. Disponibles en unidades o por mayor.",
    created_at: "2025-09-28T18:45:00",
    post_type: { type_id: 1, type_name: "Venta" },
    images: [
      { image_id: 504, url: "https://picsum.photos/400/300?random=40" }
    ],
    likes: 8,
    comments: 2,
    quantity_kg: 50,
    price_per_kg: 3200.0,
    municipality: { municipality_id: 22, name: "Medellín" },
    product: {
      product_id: 2,
      name: "Lechuga Fresca",
      description: "Lechuga crujiente y verde",
      image_url: "https://picsum.photos/200/150?random=2"
    }
  },
  {
    post_id: 3,
    title: "Venta de zanahorias orgánicas",
    user: { user_id: 103, name: "Carlos Ramírez" },
    description: "Zanahorias orgánicas de primera calidad. Excelente presentación.",
    created_at: "2025-09-27T14:20:00",
    post_type: { type_id: 1, type_name: "Venta" },
    images: [
      { image_id: 505, url: "https://picsum.photos/400/300?random=50" },
      { image_id: 506, url: "https://picsum.photos/400/300?random=51" }
    ],
    likes: 12,
    comments: 1,
    quantity_kg: 100,
    price_per_kg: 2800.0,
    municipality: { municipality_id: 33, name: "Cali" },
    product: {
      product_id: 3,
      name: "Zanahoria Orgánica",
      description: "Zanahoria fresca y nutritiva",
      image_url: "https://picsum.photos/200/150?random=3"
    }
  },
  {
    post_id: 4,
    title: "Venta de pimientos rojos",
    user: { user_id: 104, name: "Ana López" },
    description: "Pimientos rojos de la mejor calidad. Recién recolectados.",
    created_at: "2025-09-26T11:30:00",
    post_type: { type_id: 1, type_name: "Venta" },
    images: [
      { image_id: 507, url: "https://picsum.photos/400/300?random=60" }
    ],
    likes: 6,
    comments: 0,
    quantity_kg: 75,
    price_per_kg: 4500.0,
    municipality: { municipality_id: 44, name: "Cartagena" },
    product: {
      product_id: 4,
      name: "Pimiento Rojo",
      description: "Pimiento dulce y jugoso",
      image_url: "https://picsum.photos/200/150?random=4"
    }
  },
  {
    post_id: 5,
    title: "Venta de cebollas moradas",
    user: { user_id: 105, name: "Pedro Gómez" },
    description: "Cebollas moradas frescas y de buen tamaño. Precio por mayor.",
    created_at: "2025-09-25T16:45:00",
    post_type: { type_id: 1, type_name: "Venta" },
    images: [
      { image_id: 508, url: "https://picsum.photos/400/300?random=70" },
      { image_id: 509, url: "https://picsum.photos/400/300?random=71" }
    ],
    likes: 9,
    comments: 3,
    quantity_kg: 150,
    price_per_kg: 2200.0,
    municipality: { municipality_id: 55, name: "Barranquilla" },
    product: {
      product_id: 5,
      name: "Cebolla Morada",
      description: "Cebolla dulce y sabrosa",
      image_url: "https://picsum.photos/200/150?random=5"
    }
  }
];

function PostPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([]);

  useEffect(() => {
    // Resetear el índice de imagen seleccionada cuando cambia el post
    setSelectedImageIndex(0);
    
    // En una aplicación real, aquí haríamos una llamada a la API
    // Por ahora, simulamos con datos de ejemplo
    if (id) {
      const postId = parseInt(id);
      // Buscar el post por ID
      const foundPost = mockPostsData.find(p => p.post_id === postId) || null;
      setPost(foundPost);
      
      // Simulamos posts similares (excluyendo el post actual)
      const otherPosts = mockPostsData.filter(p => p.post_id !== postId);
      const mockSimilarPosts: SimilarPost[] = otherPosts.map(post => ({
        post_id: post.post_id,
        title: post.title,
        images: post.images
      }));
      
      setSimilarPosts(mockSimilarPosts);
    }
  }, [id]); // Dependencia en 'id' para que se ejecute cuando cambia

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
  };

  if (!post) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300 dark:bg-gray-900"
        style={{
          backgroundImage: "url('/fondoMuro.jpg')",
        }}
      >
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-10">Cargando...</div>
        </div>
      </div>
    );
  }

  const photos = post.images?.map(img => img.url) || [];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300 dark:bg-gray-900"
      style={{
        backgroundImage: "url('/fondoMuro.jpg')",
      }}
    >
      <Navbar />
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
          
          {/* Columna derecha - Información del vendedor (más angosta) */}
          <div className="lg:w-1/5 w-full">
            <div className="lg:sticky lg:top-4">
              <SellerInfo user={post.user} />
            </div>
          </div>
        </div>
        
        {/* Sección de publicaciones similares */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-10 text-center">
            Publicaciones Similares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarPosts.map((similarPost) => (
              <div 
                key={similarPost.post_id} 
                className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-md p-5 hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleSimilarPostClick(similarPost.post_id)}
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
                      <span className="text-gray-500 dark:text-gray-400">Sin imagen</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-xl text-green-800 dark:text-green-300 text-center">
                  {similarPost.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;