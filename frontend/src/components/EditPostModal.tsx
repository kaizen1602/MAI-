import React, { useState, useEffect } from "react";
import { FaTimes, FaImage, FaDollarSign, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { postService, supportDataService } from "../data/services";
import type { Department, Municipality, ProductType } from "../data/types/product.types";
import type { PostType } from "../data/types/post.types";
import type { Post, UpdatePostRequest } from "../data/types/post.types";
import { toast } from "react-hot-toast";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onSubmit: (updatedPost: Post) => void;
}

export default function EditPostModal({ isOpen, onClose, post, onSubmit }: EditPostModalProps) {
  const [formData, setFormData] = useState({
    title: post.title,
    description: post.description,
    post_type_id: post.post_type.id,
    product_id: post.product.id,
    quantity_kg: post.quantity_kg.toString(),
    price_per_kg: post.price_per_kg.toString(),
    municipality_id: post.municipality.id.toString(),
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState(post.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Support data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [postTypes, setPostTypes] = useState<PostType[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSupportData();
      // Initialize form with post data
      setFormData({
        title: post.title,
        description: post.description,
        post_type_id: post.post_type.id,
        product_id: post.product.id,
        quantity_kg: post.quantity_kg.toString(),
        price_per_kg: post.price_per_kg.toString(),
        municipality_id: post.municipality.id.toString(),
      });
      setExistingImages(post.images || []);
    }
  }, [isOpen, post]);

  useEffect(() => {
    // Load municipalities when we have the department ID
    const loadMunicipalitiesForDepartment = async () => {
      if (formData.municipality_id) {
        try {
          // We need to find the department ID from the municipality
          const allMunicipalities = await supportDataService.getMunicipalities();
          const selectedMunicipality = allMunicipalities.find(m => m.id === Number(formData.municipality_id));
          if (selectedMunicipality && selectedMunicipality.department) {
            const muns = await supportDataService.getMunicipalitiesByDepartment(selectedMunicipality.department.id);
            setMunicipalities(muns);
          }
        } catch (error) {
          console.error('Error cargando municipios:', error);
        }
      }
    };
    
    loadMunicipalitiesForDepartment();
  }, [formData.municipality_id]);

  const loadSupportData = async () => {
    try {
      setIsLoading(true);
      const data = await supportDataService.loadAllSupportData();
      setDepartments(data.departments);
      setPostTypes(data.postTypes);
      setProductTypes(data.productTypes);
      
      // Load municipalities for the current department
      const allMunicipalities = await supportDataService.getMunicipalities();
      const selectedMunicipality = allMunicipalities.find(m => m.id === post.municipality.id);
      if (selectedMunicipality && selectedMunicipality.department) {
        const muns = await supportDataService.getMunicipalitiesByDepartment(selectedMunicipality.department.id);
        setMunicipalities(muns);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar datos del formulario');
    } finally {
      setIsLoading(false);
    }
  };

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
      setImages(files);
      
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Update the post
      const updateData: UpdatePostRequest = {
        title: formData.title,
        description: formData.description,
        quantity_kg: Number(formData.quantity_kg) || 0,
        price_per_kg: Number(formData.price_per_kg) || 0,
        post_type_id: formData.post_type_id,
        product_id: formData.product_id,
        municipality_id: Number(formData.municipality_id),
      };

      const updatedPost = await postService.updatePost(post.id, {
        ...updateData,
        images: images.length > 0 ? images : undefined
      });

      toast.success('¡Publicación actualizada con éxito!');
      
      onSubmit(updatedPost);
      onClose();
    } catch (error: any) {
      console.error('Error actualizando publicación:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">
            Editar Publicación
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
            <div className="grid grid-cols-2 gap-4">
              {postTypes.map(type => (
                <label 
                  key={type.id}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.post_type_id === type.id 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="post_type_id"
                    value={type.id}
                    checked={formData.post_type_id === type.id}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{type.name}</span>
                </label>
              ))}
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
              <FaTag className="inline mr-2" /> Tipo de Producto *
            </label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            >
              {productTypes.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Cantidad (kg)
              </label>
              <input
                type="number"
                name="quantity_kg"
                value={formData.quantity_kg}
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
                name="price_per_kg"
                value={formData.price_per_kg}
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
            <select
              name="municipality_id"
              value={formData.municipality_id}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecciona un municipio</option>
              {municipalities.map(mun => (
                <option key={mun.id} value={mun.id}>
                  {mun.name}
                </option>
              ))}
            </select>
          </div>

          {/* Imágenes existentes */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Imágenes actuales
              </label>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.url}
                      alt="Imagen actual"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuevas imágenes */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <FaImage className="inline mr-2" /> Agregar más imágenes
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
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center disabled:opacity-50"
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}