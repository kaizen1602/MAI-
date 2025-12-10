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
  const mainImage = images[selectedImageIndex] || "/metodo-de-pago.png";

  return (
    <div>
      {/* Imagen principal */}
      <div className="mb-4">
        <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg">
          {mainImage ? (
            <div className="w-full h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <img
                src={mainImage}
                alt="Imagen principal"
                className="object-contain w-full h-full"
                onError={(e) => {
                  // Only set fallback if not already set to avoid infinite loop
                  if (e.currentTarget.src !== window.location.origin + "/metodo-de-pago.png") {
                    e.currentTarget.src = "/metodo-de-pago.png";
                  }
                }}
              />
            </div>
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
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <img
                  src={photo}
                  alt={`Miniatura ${index + 1}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // Only set fallback if not already set to avoid infinite loop
                    if (e.currentTarget.src !== window.location.origin + "/metodo-de-pago.png") {
                      e.currentTarget.src = "/metodo-de-pago.png";
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostImageGallery;
