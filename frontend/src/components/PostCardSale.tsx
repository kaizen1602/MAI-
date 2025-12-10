import {
  FaThumbsUp,
  FaRegCommentDots,
  FaMapMarkerAlt,
  FaImage,
  FaAppleAlt,
  FaFish,
  FaEgg,
  FaCheese,
  FaCarrot,
  FaDrumstickBite,
  FaSeedling,
  FaHeart,
} from "react-icons/fa";
import { favoriteService } from "../data/services";
import getPostMainImage from "../utils/getPostMainImage";
import { useAuth } from "../data/context/AuthContext";
import type { Post } from "../data/types/post.types";
import { toast } from "react-hot-toast";

interface PostCardSaleProps {
  post: Post;
  onSelectPost: (post: Post) => void;
  formatDate: (dateString: string) => string;
}

// Función para determinar el icono según el tipo de producto
const getProductIcon = (productName: string) => {
  const lowerName = productName.toLowerCase();

  if (
    lowerName.includes("tomate") ||
    lowerName.includes("lechuga") ||
    lowerName.includes("zanahoria") ||
    lowerName.includes("cebolla") ||
    lowerName.includes("papa") ||
    lowerName.includes("verdura")
  ) {
    return <FaCarrot className="text-4xl text-blue-500 mx-auto mb-2" />;
  }

  if (
    lowerName.includes("manzana") ||
    lowerName.includes("pera") ||
    lowerName.includes("plátano") ||
    lowerName.includes("naranja") ||
    lowerName.includes("fruta") ||
    lowerName.includes("mango") ||
    lowerName.includes("piña") ||
    lowerName.includes("aguacate")
  ) {
    return <FaAppleAlt className="text-4xl text-red-500 mx-auto mb-2" />;
  }

  if (
    lowerName.includes("pescado") ||
    lowerName.includes("atún") ||
    lowerName.includes("sardina") ||
    lowerName.includes("mariscos") ||
    lowerName.includes("camarón")
  ) {
    return <FaFish className="text-4xl text-blue-500 mx-auto mb-2" />;
  }

  if (lowerName.includes("huevo") || lowerName.includes("huevos")) {
    return <FaEgg className="text-4xl text-yellow-500 mx-auto mb-2" />;
  }

  if (
    lowerName.includes("pollo") ||
    lowerName.includes("carne") ||
    lowerName.includes("res") ||
    lowerName.includes("cerdo") ||
    lowerName.includes("pollo")
  ) {
    return (
      <FaDrumstickBite className="text-4xl text-orange-500 mx-auto mb-2" />
    );
  }

  if (
    lowerName.includes("queso") ||
    lowerName.includes("leche") ||
    lowerName.includes("yogurt") ||
    lowerName.includes("lácteo")
  ) {
    return <FaCheese className="text-4xl text-purple-500 mx-auto mb-2" />;
  }

  if (
    lowerName.includes("maíz") ||
    lowerName.includes("semilla") ||
    lowerName.includes("grano") ||
    lowerName.includes("arroz") ||
    lowerName.includes("frijol") ||
    lowerName.includes("lenteja")
  ) {
    return <FaSeedling className="text-4xl text-yellow-600 mx-auto mb-2" />;
  }

  // Icono por defecto
  return (
    <FaImage className="text-4xl text-gray-400 dark:text-gray-500 mx-auto mb-2" />
  );
};

function PostCardSale({ post, onSelectPost, formatDate }: PostCardSaleProps) {
  const { user } = useAuth();

  // Imagen principal con fallback centralizado
  const firstImage = getPostMainImage(post);

  // Obtenemos el nombre del producto o un valor por defecto
  const productName = post.product?.name || "Producto";

  // Extraemos el tipo de post correctamente
  const postType = post.post_type?.name || "Tipo desconocido";

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Debes iniciar sesión para guardar favoritos");
      return;
    }

    try {
      await favoriteService.toggleFavorite(post.id);
      // Create a new post object with updated values
      const updatedPost = {
        ...post,
        is_favorited: !post.is_favorited,
        favorites_count: post.favorites_count + (post.is_favorited ? -1 : 1),
      };

      // Pass the updated post to the parent component
      onSelectPost(updatedPost);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Error al actualizar favorito");
    }
  };

  return (
    <div
      className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transform transition-all"
      onClick={() => onSelectPost(post)}
    >
      {/* Título */}
      <h4 className="font-bold text-xl mb-3 text-blue-800 dark:text-blue-300">
        {post.title}
      </h4>

      {/* Primera imagen centrada y única o placeholder con icono */}
      <div className="mb-3 flex justify-center">
        <img
          src={firstImage}
          alt="Imagen principal"
          className="rounded-md object-cover border border-gray-200 dark:border-gray-700 w-full h-32"
          onError={(e) => {
            // Only set fallback if not already set to avoid infinite loop
            if (e.currentTarget.src !== window.location.origin + "/metodo-de-pago.png") {
              e.currentTarget.src = "/metodo-de-pago.png";
            }
          }}
        />
      </div>

      {/* Municipio con icono */}
      {post.municipality?.name && (
        <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-2">
          <FaMapMarkerAlt className="mr-2 text-blue-600 dark:text-blue-400" />
          <span>{post.municipality.name}</span>
        </div>
      )}

      {/* Precio y cantidad */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
          ${post.price_per_kg?.toLocaleString() || "0"} / kg
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          {post.quantity_kg?.toLocaleString() || "0"} kg
        </span>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3">
        <button
          onClick={handleFavoriteToggle}
          className={`flex items-center gap-1 ${
            post.is_favorited
              ? "text-red-500"
              : "text-gray-500 hover:text-red-400"
          }`}
        >
          <FaHeart className={post.is_favorited ? "fill-current" : ""} />
          <span className="text-sm">{post.favorites_count || 0}</span>
        </button>

        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            postType === "Venta"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
          }`}
        >
          {postType}
        </span>
      </div>
    </div>
  );
}

export default PostCardSale;
