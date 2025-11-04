import React from "react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  imageUrl: string;
  onEdit: () => void;
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
        src={imageUrl || "/default-avatar.png"}
        alt={name}
        className="w-40 h-40 rounded-full object-cover border-4 border-green-600 shadow-lg mb-4"
      />
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">
        {name}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-2">@{username}</p>

      <button
        onClick={onEdit}
        className="absolute top-6 right-6 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow"
      >
        Editar Perfil
      </button>
    </div>
  );
}
