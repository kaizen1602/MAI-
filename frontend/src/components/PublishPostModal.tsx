import React, { useState, useEffect } from "react";
import { FaTimes, FaImage, FaDollarSign, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { postService, supportDataService } from "../data/services";
import type { Department, Municipality, ProductType } from "../data/types/product.types";
import type { PostType, CreatePostRequest } from "../data/types/post.types"; // Import the correct type
import { toast } from "react-hot-toast";

interface PublishPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => void;
}

export default function PublishPostModal({ isOpen, onClose, onSubmit }: PublishPostModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    post_type_id: 1, // OFERTA por defecto
    product_id: 1, // Temporal, se actualizará dinámicamente
    quantity_kg: "",
    price_per_kg: "",
    department_id: "",
    municipality_id: "",
  });

  console.log('Estado inicial formData:', formData);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.department_id) {
      loadMunicipalities(Number(formData.department_id));
    } else {
      setMunicipalities([]);
      setFormData(prev => ({ ...prev, municipality_id: "" }));
    }
  }, [formData.department_id]);

  const loadSupportData = async () => {
    try {
      setIsLoading(true);
      const data = await supportDataService.loadAllSupportData();
      setDepartments(data.departments);
      setPostTypes(data.postTypes);
      setProductTypes(data.productTypes);
      
      // Establecer el primer producto como predeterminado
      if (data.productTypes.length > 0) {
        setFormData(prev => ({ ...prev, product_id: data.productTypes[0].id }));
      }
      
      // Asegurar que el tipo de publicación por defecto esté seleccionado
      if (data.postTypes.length > 0) {
        setFormData(prev => ({ ...prev, post_type_id: 1 })); // Oferta por defecto
      }
      
      console.log('Support data loaded:', { 
        departments: data.departments.length, 
        postTypes: data.postTypes.length, 
        productTypes: data.productTypes.length 
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar datos del formulario');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMunicipalities = async (deptId: number) => {
    try {
      const muns = await supportDataService.getMunicipalitiesByDepartment(deptId);
      setMunicipalities(muns);
    } catch (error) {
      console.error('Error cargando municipios:', error);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Cambiando ${name} a:`, value, typeof value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'post_type_id' ? Number(value) : value
      };
      console.log('Nuevo formData:', newData);
      return newData;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImages(files);
      
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.department_id || !formData.municipality_id) {
      toast.error('Por favor selecciona departamento y municipio');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Crear el post
      const postData: CreatePostRequest = {
        title: formData.title,
        description: formData.description,
        quantity_kg: Number(formData.quantity_kg) || 0,
        price_per_kg: Number(formData.price_per_kg) || 0,
        post_type_id: Number(formData.post_type_id),
        product_id: Number(formData.product_id),
        municipality_id: Number(formData.municipality_id),
        images: images.length > 0 ? images : undefined
      };

      const newPost = await postService.createPost(postData);

      toast.success('¡Publicación creada con éxito!');
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        post_type_id: 1,
        product_id: productTypes[0]?.id || 1,
        quantity_kg: "",
        price_per_kg: "",
        department_id: "",
        municipality_id: "",
      });
      setImages([]);
      setImagePreviews([]);
      
      onSubmit(newPost);
      onClose();
      
      // Recargar la página para mostrar el nuevo post
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error('Error creando publicación:', error);
      toast.error(error.response?.data?.message || 'Error al crear publicación');
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
          {isLoading && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-700 dark:text-blue-300">Cargando datos del formulario...</span>
              </div>
            </div>
          )}
          {/* Tipo de publicación */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Tipo de Publicación
            </label>
            <div className="grid grid-cols-2 gap-4">
              {postTypes.length > 0 ? postTypes.map(type => (
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
              )) : (
                <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-4">
                  Cargando tipos de publicación...
                </div>
              )}
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
              {productTypes.length > 0 ? productTypes.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              )) : (
                <option value="">Cargando tipos de producto...</option>
              )}
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

          {/* Departamento */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Departamento *
            </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecciona un departamento</option>
              {departments.length > 0 ? departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              )) : (
                <option value="">Cargando departamentos...</option>
              )}
            </select>
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
              disabled={!formData.department_id}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
              <option value="">Selecciona un municipio</option>
              {municipalities.map(mun => (
                <option key={mun.id} value={mun.id}>
                  {mun.name}
                </option>
              ))}
            </select>
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
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center disabled:opacity-50"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}