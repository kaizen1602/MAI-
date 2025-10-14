import React, { useState } from "react";

interface EditProfileModalProps {
  user: any;
  onSave: (updatedUser: any) => void;
  onClose: () => void;
}

export default function EditProfileModal({ user, onSave, onClose }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    city: user.city,
    bio: user.bio || "",
    imageUrl: user.imageUrl,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="relative bg-white/95 dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg p-8 border border-green-200 dark:border-gray-700 animate-fadeIn">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        {/* Título */}
        <h2 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6 text-center">
          Editar Perfil
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.imageUrl || "/default-avatar.png"}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-green-600 shadow-md mb-4"
          />
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="URL de imagen de perfil"
            className="w-3/4 p-3 text-center border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
        </div>

        {/* Campos */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Usuario"
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ciudad"
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Biografía"
            rows={3}
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end mt-8 gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition-all font-medium shadow"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-all font-semibold shadow-md"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
