import React from "react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  imageUrl: string;
  onEdit?: () => void;
}

export default function ProfileHeader({
  name,
  username,
  imageUrl,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white/90 dark:bg-gray-800 rounded-3xl shadow-lg p-8 flex flex-col items-center relative">
      <img
        src={imageUrl || "/default-avatar.svg"}
        alt={name}
        className="w-40 h-40 rounded-full object-cover border-4 border-blue-600 shadow-lg mb-4"
        onError={(e) => {
          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='avatarGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233b82f6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231e40af;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23avatarGrad)'/%3E%3Ccircle cx='50' cy='35' r='18' fill='%23ffffff' opacity='0.9'/%3E%3Cpath d='M 20 75 Q 20 60 50 60 Q 80 60 80 75' fill='%23ffffff' opacity='0.9'/%3E%3C/svg%3E";
        }}
      />
      <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
        {name}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-2">@{username}</p>

      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-6 right-6 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all shadow"
        >
          Editar Perfil
        </button>
      )}
    </div>
  );
}