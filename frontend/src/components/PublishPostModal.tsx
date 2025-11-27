import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaImage,
  FaDollarSign,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";
import { postService, supportDataService, colombiaPlacesService } from "../data/services";
import type {
  ProductType,
} from "../data/types/product.types";
import type { ColombiaDepartment, ColombiaCity } from "../data/services/ColombiaPlacesService";
import type { PostType, CreatePostRequest } from "../data/types/post.types";
import { toast } from "react-hot-toast";
import PriceRecommendationWidget from "./PriceRecommendationWidget";

interface PublishPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => void;
}

export default function PublishPostModal({
  isOpen,
  onClose,
  onSubmit,
}: PublishPostModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    post_type_id: 1,
    product_id: 1,
    quantity_kg: "",
    price_per_kg: "",
    department_name: "",
    city_name: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Support data from backend
  const [postTypes, setPostTypes] = useState<PostType[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Colombia places from external API
  const [departments, setDepartments] = useState<ColombiaDepartment[]>([]);
  const [cities, setCities] = useState<ColombiaCity[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSupportData();
      loadDepartments();
    }
  }, [isOpen]);

  // Cargar ciudades cuando cambia el departamento seleccionado
  useEffect(() => {
    if (formData.department_name) {
      const selectedDept = departments.find(d => d.name === formData.department_name);
      if (selectedDept) {
        loadCities(selectedDept.id);
      }
    } else {
      setCities([]);
      setFormData((prev) => ({ ...prev, city_name: "" }));
    }
  }, [formData.department_name, departments]);

  const loadSupportData = async () => {
    try {
      setIsLoading(true);
      const data = await supportDataService.loadAllSupportData();
      setPostTypes(data.postTypes);
      setProductTypes(data.productTypes);

      // Establecer el primer producto como predeterminado
      if (data.productTypes.length > 0) {
        setFormData((prev) => ({
          ...prev,
          product_id: data.productTypes[0].id,
        }));
      }

      // Asegurar que el tipo de publicación por defecto esté seleccionado
      if (data.postTypes.length > 0) {
        setFormData((prev) => ({
          ...prev,
          post_type_id: data.postTypes[0]?.id ?? 1,
        }));
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error al cargar datos del formulario");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const depts = await colombiaPlacesService.getDepartments();
      setDepartments(depts);
    } catch (error) {
      console.error("Error cargando departamentos:", error);
      toast.error("Error al cargar departamentos de Colombia");
    }
  };

  const loadCities = async (deptId: number) => {
    try {
      setIsLoadingCities(true);
      setCities([]);
      setFormData((prev) => ({ ...prev, city_name: "" }));
      const citiesData = await colombiaPlacesService.getCitiesByDepartment(deptId);
      setCities(citiesData);
    } catch (error) {
      console.error("Error cargando ciudades:", error);
      toast.error("Error al cargar ciudades");
    } finally {
      setIsLoadingCities(false);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "post_type_id" || name === "product_id"
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImages(files);

      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.department_name || !formData.city_name) {
      toast.error("Por favor selecciona departamento y ciudad");
      return;
    }

    try {
      setIsSubmitting(true);

      // Crear el post - enviamos el nombre de la ciudad como ubicación
      const postData: CreatePostRequest = {
        title: formData.title,
        description: formData.description,
        quantity_kg: Number(formData.quantity_kg) || 0,
        price_per_kg: Number(formData.price_per_kg) || 0,
        post_type_id: Number(formData.post_type_id),
        product_id: Number(formData.product_id),
        location: `${formData.city_name}, ${formData.department_name}`,
        images: images.length > 0 ? images : undefined,
      };

      const newPost = await postService.createPost(postData);

      toast.success("¡Publicación creada con éxito!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        post_type_id: postTypes.length ? postTypes[0]?.id ?? 1 : 1,
        product_id: productTypes[0]?.id || 1,
        quantity_kg: "",
        price_per_kg: "",
        department_name: "",
        city_name: "",
      });
      setImages([]);
      setImagePreviews([]);
      setCities([]);

      onSubmit(newPost);
      onClose();

      // Recargar la página para mostrar el nuevo post
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error("Error creando publicación:", error);
      toast.error(
        error.response?.data?.message || "Error al crear publicación"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 to-transparent backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-800">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            Publicar Producto
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Cerrar"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {isLoading && (
            <div className="mb-0 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-700 dark:text-blue-300">
                  Cargando datos del formulario...
                </span>
              </div>
            </div>
          )}
          {/* Tipo de publicación */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Tipo de Publicación
            </label>
            <div className="grid grid-cols-2 gap-4">
              {postTypes.length > 0 ? (
                postTypes.map((type) => {
                  const selected = formData.post_type_id === type.id;
                  return (
                    <label
                      key={type.id}
                      className={`flex items-center justify-center px-4 py-3 min-h-[48px] border-2 rounded-lg cursor-pointer transition shadow-sm text-center
                        ${
                          selected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-700 dark:text-slate-300"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="post_type_id"
                        value={type.id}
                        checked={selected}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm">
                        {type.name ?? "Sin nombre"}
                      </span>
                    </label>
                  );
                })
              ) : (
                <div className="col-span-2 text-center text-slate-500 dark:text-slate-400 py-4">
                  Cargando tipos de publicación...
                </div>
              )}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition"
              placeholder="Ej: Venta de tomates orgánicos"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition"
              placeholder="Describe tu producto en detalle..."
            />
          </div>

          {/* Producto */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <FaTag className="inline mr-2 text-blue-600" /> Tipo de Producto
              *
            </label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition"
            >
              {productTypes.length > 0 ? (
                productTypes.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))
              ) : (
                <option value="">Cargando tipos de producto...</option>
              )}
            </select>
          </div>

          {/* Cantidad y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Cantidad (kg)
              </label>
              <input
                type="number"
                name="quantity_kg"
                value={formData.quantity_kg}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition"
                placeholder="Ej: 100"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                <FaDollarSign className="inline mr-2 text-blue-600" /> Precio
                por kg ($)
              </label>
              <input
                type="number"
                name="price_per_kg"
                value={formData.price_per_kg}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition"
                placeholder="Ej: 2500"
              />
            </div>
          </div>

          {/* Price Recommendation Widget */}
          {(() => {
            const shouldRenderWidget =
              formData.price_per_kg && Number(formData.price_per_kg) > 0;

            const selectedProduct = productTypes.find(
              (p) => p.id === formData.product_id
            );
            const selectedPostType = postTypes.find(
              (type) => type.id === formData.post_type_id
            );

            // Usar el título del formulario como nombre del producto (más específico)
            const productName =
              formData.title ||
              selectedProduct?.name ||
              (selectedProduct as any)?.type_name ||
              "";

            // Determinar intención (venta/compra) para personalizar el análisis
            const rawTypeName =
              selectedPostType?.name ||
              (selectedPostType as any)?.type_name ||
              "";
            const intent: "sell" | "buy" = rawTypeName
              .toLowerCase()
              .includes("compra")
              ? "buy"
              : "sell";

            return shouldRenderWidget && productName ? (
              <PriceRecommendationWidget
                productName={productName}
                pricePerKg={Number(formData.price_per_kg)}
                intent={intent}
                onAccept={(recommendedPrice) => {
                  setFormData((prev) => ({
                    ...prev,
                    price_per_kg: recommendedPrice.toString(),
                  }));
                  toast.success(
                    `Precio ajustado a $${recommendedPrice.toLocaleString(
                      "es-CO"
                    )}/kg`
                  );
                }}
                className="mt-4"
              />
            ) : null;
          })()}

          {/* Departamento */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
              Departamento *
            </label>
            <select
              name="department_name"
              value={formData.department_name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition"
            >
              <option value="">Selecciona un departamento</option>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Cargando departamentos...</option>
              )}
            </select>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
              Ciudad *
            </label>
            <select
              name="city_name"
              value={formData.city_name}
              onChange={handleInputChange}
              required
              disabled={!formData.department_name || isLoadingCities}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50 transition"
            >
              <option value="">
                {!formData.department_name
                  ? "Primero selecciona un departamento"
                  : isLoadingCities
                    ? "Cargando ciudades..."
                    : "Selecciona una ciudad"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <FaImage className="inline mr-2 text-blue-600" /> Imágenes
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-blue-200 dark:border-slate-700 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaImage className="w-8 h-8 mb-2 text-blue-500 dark:text-blue-400" />
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Haz clic para subir</span> o
                    arrastra
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
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
                    className="w-full h-24 object-cover rounded-lg shadow-sm"
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
              className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-50"
            >
              {isSubmitting ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
