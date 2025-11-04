import React, { useState } from "react";

interface PostImageGalleryProps {
  images: string[];
  onImageSelect: (index: number) => void;
  selectedImageIndex: number;
}

function PostImageGallery({
  images,
  onImageSelect,
  selectedImageIndex,
}: PostImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    // En móvil, hacer zoom al hacer clic
    // En escritorio, hacer zoom al pasar el mouse
    if (window.innerWidth < 768) {
      setIsZoomed(!isZoomed);
    }
  };

  const handleMouseEnter = () => {
    // En escritorio, hacer zoom al pasar el mouse
    if (window.innerWidth >= 768) {
      setIsZoomed(true);
    }
  };

  const handleMouseLeave = () => {
    // En escritorio, quitar zoom al salir el mouse
    if (window.innerWidth >= 768) {
      setIsZoomed(false);
    }
  };

  const mainImage = images[selectedImageIndex] || "";

  return (
    <div>
      {/* Imagen principal */}
      <div className="mb-4">
        <div
          className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg cursor-pointer ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={handleImageClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {mainImage ? (
            <img
              src={mainImage}
              alt="Imagen principal"
              className={`w-full h-auto object-contain transition-transform duration-300 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl">
              <span className="text-gray-500 dark:text-gray-400">
                Sin imagen
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Miniaturas centradas */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto py-4 justify-center">
          {images.map((photo, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden cursor-pointer border-2 ${
                index === selectedImageIndex
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => onImageSelect(index)}
            >
              <img
                src={photo}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostImageGallery;
