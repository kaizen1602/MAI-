import React, { useState } from "react";
import { FaTimes, FaImage, FaDollarSign, FaMapMarkerAlt, FaTag } from "react-icons/fa";

interface PublishPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => void;
}

export default function PublishPostModal({ isOpen, onClose, onSubmit }: PublishPostModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    postType: "Venta", // Venta or Compra
    product: "",
    quantity: "",
    price: "",
    municipality: "",
    images: [] as string[],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
      
      // In a real app, you would upload these files to a server
      // For now, we'll just store the preview URLs
      setFormData(prev => ({
        ...prev,
        images: previews
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
    });
    // Reset form
    setFormData({
      title: "",
      description: "",
      postType: "Venta",
      product: "",
      quantity: "",
      price: "",
      municipality: "",
      images: [],
    });
    setImagePreviews([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">
            Publicar Producto
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
          {/* Tipo de publicación */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Tipo de Publicación
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postType"
                  value="Venta"
                  checked={formData.postType === "Venta"}
                  onChange={handleInputChange}
                  className="mr-2 h-5 w-5 text-green-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Venta</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postType"
                  value="Compra"
                  checked={formData.postType === "Compra"}
                  onChange={handleInputChange}
                  className="mr-2 h-5 w-5 text-green-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Compra</span>
              </label>
            </div>
          </div>

          {/* Título */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ej: Venta de tomates orgánicos"
            />
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe tu producto en detalle..."
            />
          </div>

          {/* Producto */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <FaTag className="inline mr-2" /> Nombre del Producto *
            </label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ej: Tomate"
            />
          </div>

          {/* Cantidad y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Cantidad (kg)
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: 100"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                <FaDollarSign className="inline mr-2" /> Precio por kg ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: 2500"
              />
            </div>
          </div>

          {/* Municipio */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <FaMapMarkerAlt className="inline mr-2" /> Municipio *
            </label>
            <input
              type="text"
              name="municipality"
              value={formData.municipality}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ej: Bogotá"
            />
          </div>

          {/* Imágenes */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <FaImage className="inline mr-2" /> Imágenes
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaImage className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Haz clic para subir</span> o arrastra
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG (Máx. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
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
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}