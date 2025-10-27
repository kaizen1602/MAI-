import React, { useState, useRef } from 'react';
import { FaTimes, FaImage, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../data/context/AuthContext';
import { toast } from 'react-hot-toast';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updatedUser: any) => void;
}

export default function CompleteProfileModal({ isOpen, onClose, onProfileUpdated }: CompleteProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address_details: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Crear FormData para enviar archivos
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('phone_number', formData.phone_number);
      submitData.append('address_details', formData.address_details);
      
      if (profileImage) {
        submitData.append('profile_image', profileImage);
      }

      await updateProfile(submitData);
      
      toast.success('¡Perfil actualizado con éxito!');
      onProfileUpdated({ ...user, ...formData, profile_image: imagePreview });
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">
            Completa tu perfil
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Imagen de perfil */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              <FaImage className="inline mr-2" /> Foto de perfil
            </label>
            <div className="flex flex-col items-center">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 cursor-pointer hover:border-green-600 transition-colors"
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FaImage className="text-gray-400 text-3xl" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={triggerFileInput}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Seleccionar imagen
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Nombre */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <FaUser className="inline mr-2" /> Nombre completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Tu nombre completo"
            />
          </div>

          {/* Teléfono */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <FaPhone className="inline mr-2" /> Número de teléfono
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="+57 300 123 4567"
            />
          </div>

          {/* Dirección */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <FaMapMarkerAlt className="inline mr-2" /> Dirección
            </label>
            <textarea
              name="address_details"
              value={formData.address_details}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Calle 10 #20-30, Ciudad"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
