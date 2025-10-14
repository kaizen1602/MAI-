import { useState } from "react";

export default function Carousel({ photos }: { photos: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow">
      <div className="relative h-40">
        <img
          src={photos[currentIndex]}
          alt={`Foto ${currentIndex + 1}`}
          className="w-full h-40 object-cover"
        />
        
        {photos.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition"
            >
              ❮
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition"
            >
              ❯
            </button>
            
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}