import React, { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import WhatsAppContactModal from "./WhatsAppContactModal";
import PurchaseConfirmationModal from "./PurchaseConfirmationModal";

interface PostInfoSectionProps {
  post: {
    title: string;
    user: { user_id: number; name: string };
    description: string;
    created_at: string;
    post_type: { type_id: number; type_name: string };
    quantity_kg?: number;
    price_per_kg?: number;
    municipality?: { municipality_id: number; name: string };
    product?: {
      product_id: number;
      name: string;
      description: string;
      image_url: string;
    };
  };
  formatDate: (dateString: string) => string;
}

function PostInfoSection({ post, formatDate }: PostInfoSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleWhatsAppContact = () => {
    // In a real application, you would have the seller's WhatsApp number
    // For now, we'll use a placeholder URL
    const phoneNumber = "+573001234567"; // Placeholder phone number
    const message = `Hola, estoy interesado en tu publicación: ${post.title}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Abrir WhatsApp inmediatamente
    window.open(whatsappUrl, "_blank");

    // Cerrar modal de WhatsApp y mostrar confirmación de forma más suave
    setIsModalOpen(false);

    // Usar requestAnimationFrame para evitar parpadeos
    requestAnimationFrame(() => {
      setIsConfirmationModalOpen(true);
    });
  };

  const handleConfirmPurchase = async (rating?: number) => {
    if (rating && rating > 0) {
      console.log(`Purchase confirmed with rating: ${rating}`);
    } else {
      console.log("Purchase confirmed without rating");
    }

    setIsConfirmationModalOpen(false);
  };

  const handleRateLater = () => {
    // In a real application, you might set a reminder to rate later
    console.log("User chose to rate later");
  };

  // Determine if this is a purchase (Venta) or sale (Compra)
  const isPurchase = post.post_type?.type_name === "Venta";

  return (
    <>
      <div className="bg-white/90 dark:bg-gray-800 backdrop-blur rounded-2xl shadow-md p-8">
        {/* Título centrado */}
        <h1 className="text-5xl font-bold text-blue-800 dark:text-blue-300 mb-4 text-center">
          {post.title}
        </h1>

        {/* Fecha de publicación */}
        <div className="flex items-center justify-center mb-8 text-xl text-gray-600 dark:text-gray-400">
          <FaCalendarAlt className="mr-3" />
          <span>Publicado el {formatDate(post.created_at)}</span>
        </div>

        {/* Descripción */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Descripción
          </h2>
          <p className="text-2xl text-gray-700 dark:text-gray-300">
            {post.description}
          </p>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {post.quantity_kg !== undefined && (
            <div className="p-5 bg-blue-50 dark:bg-gray-700 rounded-xl">
              <p className="font-bold text-2xl text-gray-800 dark:text-gray-200">
                Cantidad
              </p>
              <p className="text-2xl text-gray-700 dark:text-gray-300">
                {post.quantity_kg} kg
              </p>
            </div>
          )}

          {post.price_per_kg !== undefined && (
            <div className="p-5 bg-blue-50 dark:bg-gray-700 rounded-xl">
              <p className="font-bold text-2xl text-gray-800 dark:text-gray-200">
                Precio
              </p>
              <p className="text-2xl text-gray-700 dark:text-gray-300">
                ${post.price_per_kg} por kg
              </p>
            </div>
          )}

          {post.municipality?.name && (
            <div className="p-5 bg-blue-50 dark:bg-gray-700 rounded-xl">
              <p className="font-bold text-2xl text-gray-800 dark:text-gray-200">
                Ubicación
              </p>
              <p className="text-2xl text-gray-700 dark:text-gray-300 flex items-center">
                <FaMapMarkerAlt className="mr-3 text-blue-600 dark:text-blue-400 text-2xl" />
                {post.municipality.name}
              </p>
            </div>
          )}

          {post.product?.name && (
            <div className="p-5 bg-blue-50 dark:bg-gray-700 rounded-xl">
              <p className="font-bold text-2xl text-gray-800 dark:text-gray-200">
                Producto
              </p>
              <p className="text-2xl text-gray-700 dark:text-gray-300">
                {post.product.name}
              </p>
            </div>
          )}
        </div>

        {/* Botón de acción */}
        <button
          onClick={handleContactClick}
          className={`w-full py-5 rounded-2xl text-white font-bold text-2xl shadow-lg transition-all ${
            post.post_type?.type_name === "Venta"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {post.post_type?.type_name === "Venta" ? "🛒 Comprar" : "🤝 Ofrecer"}
        </button>
      </div>

      <WhatsAppContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        sellerName={post.user.name}
        productName={post.title}
        onContact={handleWhatsAppContact}
      />

      <PurchaseConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        productName={post.title}
        sellerName={post.user.name}
        isPurchase={isPurchase}
        onConfirm={handleConfirmPurchase}
        onRateLater={handleRateLater}
      />
    </>
  );
}

export default PostInfoSection;
