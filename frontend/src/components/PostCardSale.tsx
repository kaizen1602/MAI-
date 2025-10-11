import { FaThumbsUp, FaRegCommentDots, FaMapMarkerAlt, FaImage, FaAppleAlt, FaFish, FaEgg, FaCheese, FaCarrot, FaDrumstickBite, FaSeedling } from "react-icons/fa";

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

interface PostCardSaleProps {
  post: Post;
  onSelectPost: (post: Post) => void;
  formatDate: (dateString: string) => string;
}

// Función para determinar el icono según el tipo de producto
const getProductIcon = (productName: string) => {
  const lowerName = productName.toLowerCase();
  
  if (lowerName.includes('tomate') || lowerName.includes('lechuga') || lowerName.includes('zanahoria') || 
      lowerName.includes('cebolla') || lowerName.includes('papa') || lowerName.includes('verdura')) {
    return <FaCarrot className="text-4xl text-green-500 mx-auto mb-2" />;
  }
  
  if (lowerName.includes('manzana') || lowerName.includes('pera') || lowerName.includes('plátano') || 
      lowerName.includes('naranja') || lowerName.includes('fruta') || lowerName.includes('mango') || 
      lowerName.includes('piña') || lowerName.includes('aguacate')) {
    return <FaAppleAlt className="text-4xl text-red-500 mx-auto mb-2" />;
  }
  
  if (lowerName.includes('pescado') || lowerName.includes('atún') || lowerName.includes('sardina') || 
      lowerName.includes('mariscos') || lowerName.includes('camarón')) {
    return <FaFish className="text-4xl text-blue-500 mx-auto mb-2" />;
  }
  
  if (lowerName.includes('huevo') || lowerName.includes('huevos')) {
    return <FaEgg className="text-4xl text-yellow-500 mx-auto mb-2" />;
  }
  
  if (lowerName.includes('pollo') || lowerName.includes('carne') || lowerName.includes('res') || 
      lowerName.includes('cerdo') || lowerName.includes('pollo')) {
    return <FaDrumstickBite className="text-4xl text-orange-500 mx-auto mb-2" />;
  }
  
  if (lowerName.includes('queso') || lowerName.includes('leche') || lowerName.includes('yogurt') || 
      lowerName.includes('lácteo')) {
    return <FaCheese className="text-4xl text-purple-500 mx-auto mb-2" />;
  }
  
  if (lowerName.includes('maíz') || lowerName.includes('semilla') || lowerName.includes('grano') || 
      lowerName.includes('arroz') || lowerName.includes('frijol') || lowerName.includes('lenteja')) {
    return <FaSeedling className="text-4xl text-yellow-600 mx-auto mb-2" />;
  }
  
  // Icono por defecto
  return <FaImage className="text-4xl text-gray-400 dark:text-gray-500 mx-auto mb-2" />;
};

function PostCardSale({ post, onSelectPost, formatDate }: PostCardSaleProps) {
  // Extraemos solo la primera imagen
  const firstImage = post.images && post.images.length > 0 ? post.images[0].url : null;
  
  // Obtenemos el nombre del producto o un valor por defecto
  const productName = post.product?.name || "Producto";

  return (
    <div
      className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transform transition-all"
      onClick={() => onSelectPost(post)}
    >
      {/* Título */}
      <h4 className="font-bold text-xl mb-3 text-green-800 dark:text-green-300">
        {post.title}
      </h4>

      {/* Primera imagen centrada y única o placeholder con icono */}
      <div className="mb-3 flex justify-center">
        {firstImage ? (
          <img
            src={firstImage}
            alt="Imagen principal"
            className="rounded-lg object-cover border border-gray-200 dark:border-gray-700 w-full h-40"
          />
        ) : (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 w-full h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <div className="text-center">
              {getProductIcon(productName)}
              <span className="text-gray-500 dark:text-gray-400 text-sm">Sin imagen</span>
            </div>
          </div>
        )}
      </div>

      {/* Municipio con icono */}
      {post.municipality?.name && (
        <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
          <FaMapMarkerAlt className="mr-2 text-green-600 dark:text-green-400" />
          <span>{post.municipality.name}</span>
        </div>
      )}
    </div>
  );
}

export default PostCardSale;