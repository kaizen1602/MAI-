import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaRegFileAlt, FaTimes } from "react-icons/fa"; // Importamos el icono de cierre

interface PostDetailProps {
  post: {
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
  } | null;
  onClose?: () => void; 
  formatDate?: (dateString: string) => string; 
}

export default function PostDetail({ post, onClose, formatDate }: PostDetailProps) {
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500 dark:text-gray-300">
        <FaRegFileAlt className="text-4xl mb-4 text-gray-400 dark:text-gray-500" />
        <p className="text-xl font-medium">
          Selecciona una publicación para ver los detalles
        </p>
      </div>
    );
  }

  const userName = post.user?.name || "Usuario desconocido";
  const postType = post.post_type?.type_name || "Tipo desconocido";
  const photos = post.images?.map((img) => img.url) || [];

  return (
    <div className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-md p-6 relative">
      {/* Botón de cierre en la esquina superior derecha */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes className="text-2xl" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="bg-green-200 dark:bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mr-4">
          <span className="font-bold text-green-800 dark:text-white text-lg">
            {userName.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
            {userName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate
              ? formatDate(post.created_at)
              : new Date(post.created_at).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col space-y-4">
        {/* Imágenes */}
        {photos.length > 0 && (
          <div className="relative">
            <Carousel
              showThumbs={false}
              infiniteLoop
              useKeyboardArrows
              autoPlay
              interval={3000}
              showStatus={false}
            >
              {photos.map((photo, index) => (
                <div key={index} className="aspect-[16/9]">
                  <img 
                    src={photo} 
                    alt={`Imagen ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Título */}
        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200">
          {post.title}
        </h2>

        {/* Descripción */}
        <p className="text-gray-600 dark:text-gray-400">{post.description}</p>

        {/* Detalles */}
        <div className="flex flex-col space-y-2">
          {post.quantity_kg !== undefined && (
            <p>
              <span className="font-bold">Cantidad:</span> {post.quantity_kg} kg
            </p>
          )}
          {post.price_per_kg !== undefined && (
            <p>
              <span className="font-bold">Precio:</span> ${post.price_per_kg} por kg
            </p>
          )}
          {post.municipality?.name && (
            <p>
              <span className="font-bold">Municipio:</span> {post.municipality.name}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            postType === "Venta"
              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
          }`}
        >
          {postType}
        </span>

        {/* Botón */}
        <Link
          to={`/post/${post.post_id}`}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold shadow ${
            postType === "Venta"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {postType === "Venta" ? "🛒 Comprar" : "🤝 Ofrecer"}
        </Link>
      </div>
    </div>
  );
}