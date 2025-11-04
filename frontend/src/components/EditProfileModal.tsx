import React, { useState, useRef } from "react";
import { FaImage, FaUpload } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface EditProfileModalProps {
  user: any;
  onSave: (updatedUser: any) => void;
  onClose: () => void;
}

export default function EditProfileModal({
  user,
  onSave,
  onClose,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    city: user.city,
    bio: user.bio || "",
    imageUrl: user.imageUrl,
    // Campos para cambio de contraseña
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize image preview with user's current profile image
  React.useEffect(() => {
    if (user.imageUrl && user.imageUrl !== "/default-avatar.jpg") {
      setImagePreview(user.imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [user.imageUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Validar contraseñas si se están cambiando
      if (showPasswordSection) {
        if (!formData.currentPassword) {
          toast.error("Por favor ingresa tu contraseña actual");
          setIsSubmitting(false);
          return;
        }
        if (!formData.newPassword) {
          toast.error("Por favor ingresa una nueva contraseña");
          setIsSubmitting(false);
          return;
        }
        if (formData.newPassword.length < 8) {
          toast.error("La nueva contraseña debe tener al menos 8 caracteres");
          setIsSubmitting(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("Las contraseñas nuevas no coinciden");
          setIsSubmitting(false);
          return;
        }
      }

      const updatedData = {
        ...formData,
        profileImage: profileImage, // Incluir la imagen si se seleccionó una nueva
        // Incluir contraseñas solo si se están cambiando
        ...(showPasswordSection && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      };
      onSave(updatedData);
      onClose();
    } catch (error) {
      console.error("Error al guardar perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="relative bg-white/95 dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] border border-blue-200 dark:border-gray-700 animate-fadeIn flex flex-col">
        {/* Header fijo */}
        <div className="flex-shrink-0 p-8 pb-4">
          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
          >
            ✕
          </button>

          {/* Título */}
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">
            Editar Perfil
          </h2>

          {/* Información general */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 dark:text-blue-400 text-xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  ¿Qué puedes editar?
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Modifica tu información personal, foto de perfil y datos de
                  contacto. Los campos marcados con * son obligatorios.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📸 Foto de Perfil
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Esta imagen aparecerá en tus publicaciones y perfil
              </p>
            </div>
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 cursor-pointer hover:border-blue-700 transition-colors shadow-md mb-4"
              onClick={triggerFileInput}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Avatar"
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <FaUpload className="text-sm" />
              Cambiar Foto
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Campos */}
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                👤 Nombre Completo *
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Tu nombre real que verán otros usuarios
              </p>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Juan Carlos Pérez"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Usuario */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🏷️ Nombre de Usuario
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Tu identificador único en la plataforma
              </p>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ej: juanperez2024"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📧 Correo Electrónico *
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Se usa para iniciar sesión y recibir notificaciones
              </p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: juan@ejemplo.com"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🏘️ Ubicación
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Tu ciudad o región para mostrar proximidad
              </p>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ej: Bogotá, Colombia"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Biografía */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📝 Biografía
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Cuéntanos sobre ti, tus productos o experiencia agrícola
              </p>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Ej: Agricultor con 10 años de experiencia en cultivos orgánicos..."
                rows={3}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none"
              />
            </div>

            {/* Sección de cambio de contraseña */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    🔒 Cambiar Contraseña
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Opcional: Cambia tu contraseña de acceso
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordSection(!showPasswordSection);
                    // Limpiar campos de contraseña al cancelar
                    if (showPasswordSection) {
                      setFormData((prev) => ({
                        ...prev,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }));
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    showPasswordSection
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {showPasswordSection ? "Cancelar" : "Cambiar"}
                </button>
              </div>

              {showPasswordSection && (
                <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  {/* Contraseña actual */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🔑 Contraseña Actual *
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Confirma tu contraseña actual para poder cambiarla
                    </p>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Tu contraseña actual"
                      className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  {/* Nueva contraseña */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🆕 Nueva Contraseña *
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Mínimo 8 caracteres, incluye letras y números
                    </p>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Nueva contraseña"
                      className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  {/* Confirmar contraseña */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      ✅ Confirmar Nueva Contraseña *
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Repite la nueva contraseña para confirmar
                    </p>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirma la nueva contraseña"
                      className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  {/* Indicador de fortaleza de contraseña */}
                  {formData.newPassword && (
                    <div className="text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Fortaleza:
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`w-2 h-2 rounded-full ${
                                formData.newPassword.length >= level * 2
                                  ? "bg-blue-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {formData.newPassword.length < 8 &&
                          "Mínimo 8 caracteres"}
                        {formData.newPassword.length >= 8 &&
                          formData.newPassword.length < 12 &&
                          "Buena"}
                        {formData.newPassword.length >= 12 && "Excelente"}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Información de campos obligatorios */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 dark:text-yellow-400 text-lg">
                ⚠️
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                  Campos Obligatorios
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li>
                    • <strong>Nombre Completo:</strong> Aparece en tus
                    publicaciones
                  </li>
                  <li>
                    • <strong>Correo Electrónico:</strong> Se usa para iniciar
                    sesión
                  </li>
                  {showPasswordSection && (
                    <>
                      <li>
                        • <strong>Contraseña Actual:</strong> Para verificar tu
                        identidad
                      </li>
                      <li>
                        • <strong>Nueva Contraseña:</strong> Mínimo 8 caracteres
                      </li>
                      <li>
                        • <strong>Confirmar Contraseña:</strong> Debe coincidir
                        con la nueva
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer fijo con botones */}
        <div className="flex-shrink-0 px-8 pb-8">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition-all font-medium shadow"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-xl transition-all font-semibold shadow-md flex items-center gap-2 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {showPasswordSection
                    ? "Cambiando contraseña..."
                    : "Guardando..."}
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
