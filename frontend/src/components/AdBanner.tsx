import React from "react";

const AdBanner: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex-grow bg-blue-100 rounded-lg overflow-hidden">
        <img
          src="/publicidad.png"
          alt="Publicidad"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AdBanner;
