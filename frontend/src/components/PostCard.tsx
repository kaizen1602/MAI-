import { FaThumbsUp, FaRegCommentDots } from "react-icons/fa";

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
}

interface PostCardProps {
  post: Post;
  onSelectPost: (post: Post) => void;
  formatDate: (dateString: string) => string;
}

const typeStyles: Record<string, string> = {
  Venta: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  Compra: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
};

function PostCard({ post, onSelectPost, formatDate }: PostCardProps) {
  // Extraemos el nombre del usuario correctamente
  const userName = post.user?.name || "Usuario desconocido";
  
  // Extraemos el tipo de post correctamente
  const postType = post.post_type?.type_name || "Tipo desconocido";
  
  // Extraemos las imágenes correctamente
  const photos = post.images?.map(img => img.url) || [];

  return (
    <div
      className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transform transition-all"
      onClick={() => onSelectPost(post)}
    >
      {/* Header usuario */}
      <div className="flex items-center mb-3">
        <div className="bg-green-200 dark:bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mr-4">
          <span className="font-bold text-green-800 dark:text-white text-lg">
            {typeof userName === "string" && userName ? userName.charAt(0) : "?"}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 truncate">
            {userName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {formatDate(post.created_at)}
          </p>
        </div>
      </div>

      {/* Título */}
      <h4 className="font-bold text-xl mb-2 text-green-800 dark:text-green-300">
        {post.title}
      </h4>

      {/* Contenido */}
      <p className="mb-4 text-gray-700 dark:text-gray-300 line-clamp-2">
        {post.description}
      </p>

{/* Miniaturas en fila centradas */}
{photos && photos.length > 0 && (
  <div className="mb-4 flex gap-3 justify-center">
    {photos.slice(0, 3).map((photo, index) => {
      // Si es la última visible y hay más imágenes, mostramos el overlay +n
      if (index === 2 && photos.length > 3) {
        return (
          <div key={index} className="relative w-32 h-24 rounded-lg overflow-hidden">
            <img
              src={photo}
              alt={`miniatura ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                +{photos.length - 3}
              </span>
            </div>
          </div>
        );
      }
      return (
        <img
          key={index}
          src={photo}
          alt={`miniatura ${index + 1}`}
          className="w-32 h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
        />
      );
    })}
  </div>
)}
      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-6 text-gray-500 dark:text-gray-400">
          
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            typeStyles[postType] || "bg-gray-200 text-gray-800"
          }`}
        >
          {postType}
        </span>
      </div>
    </div>
  );
}

export default PostCard;