import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FaTimes,
  FaImage,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobeAmericas,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuth } from "../data/context/AuthContext";
import { toast } from "react-hot-toast";
import supportDataService from "../data/services/SupportDataService";
import type { Department, Municipality } from "../data/types/product.types";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updatedUser: any) => void;
}

export default function CompleteProfileModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: CompleteProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    address_details: "",
    department_id: "",
    municipality_id: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar departamentos y datos del usuario al montar el componente
  useEffect(() => {
    if (isOpen) {
      loadDepartments();
      // Pre-llenar el formulario con los datos existentes del usuario
      if (user) {
        setFormData({
          name: user.name || "",
          phone_number: user.phone_number || "",
          address_details: user.address_details || "",
          department_id: user.department_id ? String(user.department_id) : "",
          municipality_id: user.municipality_id ? String(user.municipality_id) : "",
          bio: user.bio || "",
        });

        // Si el usuario ya tiene una imagen de perfil, mostrarla
        if (user.profile_image) {
          setImagePreview(user.profile_image);
        }
      }
    }
  }, [isOpen, user]);

  // Cargar municipios cuando cambia el departamento
  useEffect(() => {
    if (formData.department_id) {
      loadMunicipalities(parseInt(formData.department_id));
    } else {
      setMunicipalities([]);
    }
  }, [formData.department_id]);

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const data = await supportDataService.getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Error al cargar departamentos");
    } finally {
      setLoadingDepartments(false);
    }
  };

  const loadMunicipalities = async (departmentId: number) => {
    try {
      setLoadingMunicipalities(true);
      const data = await supportDataService.getMunicipalitiesByDepartment(departmentId);
      setMunicipalities(data);
    } catch (error) {
      console.error("Error loading municipalities:", error);
      toast.error("Error al cargar municipios");
    } finally {
      setLoadingMunicipalities(false);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

      // Validar que los campos requeridos estén completos
      if (!formData.department_id) {
        toast.error("Por favor selecciona un departamento");
        return;
      }

      // Crear FormData para enviar archivos
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("phone_number", formData.phone_number);
      submitData.append("address_details", formData.address_details);
      submitData.append("department_id", formData.department_id);

      if (formData.municipality_id) {
        submitData.append("municipality_id", formData.municipality_id);
      }

      if (formData.bio) {
        submitData.append("bio", formData.bio);
      }

      if (profileImage) {
        submitData.append("profile_image", profileImage);
      }

      await updateProfile(submitData);

      toast.success("¡Perfil actualizado con éxito!");
      onProfileUpdated({ ...user, ...formData, profile_image: imagePreview });
      onClose();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message || "Error al actualizar perfil"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Calcular el progreso del perfil
  const profileCompletion = useMemo(() => {
    const checks = {
      hasProfileImage: !!imagePreview,
      hasName: !!formData.name,
      hasPhone: !!formData.phone_number,
      hasDepartment: !!formData.department_id,
      hasMunicipality: !!formData.municipality_id,
      hasAddress: !!formData.address_details,
      hasBio: !!formData.bio,
    };

    const completed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const percentage = Math.round((completed / total) * 100);

    return { checks, completed, total, percentage };
  }, [formData, imagePreview]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-blue-100 dark:border-gray-700">
        {/* Header con gradiente */}
        <div className="relative flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <FaUser className="text-2xl" />
              Completa tu Perfil
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Agrega tu información para una mejor experiencia
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Barra de Progreso y Checklist */}
        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* Barra de progreso */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Progreso del Perfil
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {profileCompletion.completed}/{profileCompletion.total} completados ({profileCompletion.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${profileCompletion.percentage}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <ChecklistItem
              icon={FaImage}
              label="Foto"
              isComplete={profileCompletion.checks.hasProfileImage}
            />
            <ChecklistItem
              icon={FaUser}
              label="Nombre"
              isComplete={profileCompletion.checks.hasName}
              required
            />
            <ChecklistItem
              icon={FaPhone}
              label="Teléfono"
              isComplete={profileCompletion.checks.hasPhone}
            />
            <ChecklistItem
              icon={FaGlobeAmericas}
              label="Departamento"
              isComplete={profileCompletion.checks.hasDepartment}
              required
            />
            <ChecklistItem
              icon={FaMapMarkerAlt}
              label="Municipio"
              isComplete={profileCompletion.checks.hasMunicipality}
            />
            <ChecklistItem
              icon={FaMapMarkerAlt}
              label="Dirección"
              isComplete={profileCompletion.checks.hasAddress}
            />
            <ChecklistItem
              icon={FaUser}
              label="Biografía"
              isComplete={profileCompletion.checks.hasBio}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Imagen de perfil mejorada */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              <FaImage className="text-blue-600 dark:text-blue-400" />
              <span>Foto de Perfil</span>
            </label>
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="relative group">
                <div
                  className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg cursor-pointer hover:border-blue-600 transition-all duration-300 group-hover:scale-105"
                  onClick={triggerFileInput}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                      <FaImage className="text-blue-400 dark:text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-2 shadow-lg group-hover:bg-blue-700 transition-colors cursor-pointer" onClick={triggerFileInput}>
                  <FaImage className="text-white text-sm" />
                </div>
              </div>
              <button
                type="button"
                onClick={triggerFileInput}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                {imagePreview ? "Cambiar Imagen" : "Seleccionar Imagen"}
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

          {/* Grid de 2 columnas para campos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaUser className="text-blue-600 dark:text-blue-400" />
                <span>Nombre Completo <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400"
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaPhone className="text-blue-600 dark:text-blue-400" />
                <span>Número de Teléfono</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400"
                placeholder="+57 300 123 4567"
              />
            </div>

            {/* Departamento */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaGlobeAmericas className="text-blue-600 dark:text-blue-400" />
                <span>Departamento <span className="text-red-500">*</span></span>
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                required
                disabled={loadingDepartments}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-all duration-200 hover:border-blue-400 cursor-pointer"
              >
                <option value="">
                  {loadingDepartments ? "Cargando..." : "Selecciona un departamento"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Municipio */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
                <span>Municipio</span>
              </label>
              <select
                name="municipality_id"
                value={formData.municipality_id}
                onChange={handleInputChange}
                disabled={!formData.department_id || loadingMunicipalities}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-all duration-200 hover:border-blue-400 cursor-pointer"
              >
                <option value="">
                  {loadingMunicipalities
                    ? "Cargando..."
                    : !formData.department_id
                    ? "Primero selecciona un departamento"
                    : "Selecciona un municipio (opcional)"}
                </option>
                {municipalities.map((mun) => (
                  <option key={mun.id} value={mun.id}>
                    {mun.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
              <span>Dirección</span>
            </label>
            <textarea
              name="address_details"
              value={formData.address_details}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400 resize-none"
              placeholder="Ej: Calle 10 #20-30, Barrio Centro"
            />
          </div>

          {/* Biografía */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FaUser className="text-blue-600 dark:text-blue-400" />
              <span>Sobre Ti (Biografía)</span>
            </label>
            <div className="relative">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400 resize-none"
                placeholder="Cuéntanos un poco sobre ti, tu experiencia en agricultura, tus productos favoritos..."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Comparte información relevante para otros usuarios
                </p>
                <p className={`text-sm font-medium ${formData.bio.length > 450 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {formData.bio.length}/500
                </p>
              </div>
            </div>
          </div>

          {/* Submit buttons mejorados */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <FaUser />
                  <span>Guardar Perfil</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente auxiliar para items del checklist
interface ChecklistItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isComplete: boolean;
  required?: boolean;
}

function ChecklistItem({ icon: Icon, label, isComplete, required = false }: ChecklistItemProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isComplete
          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
      }`}
    >
      {isComplete ? (
        <FaCheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" />
      ) : (
        <FaTimesCircle className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <Icon className={`text-xs ${isComplete ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`} />
          <span
            className={`text-xs font-medium truncate ${
              isComplete
                ? "text-green-700 dark:text-green-300"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {label}
          </span>
          {required && !isComplete && (
            <span className="text-red-500 text-xs">*</span>
          )}
        </div>
      </div>
    </div>
  );
}
