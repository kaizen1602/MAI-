import React from 'react';
import { FaUser, FaImage, FaPhone, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

interface ProfileProgressBarProps {
  user: {
    name?: string;
    email?: string;
    phone_number?: string;
    address_details?: string;
    profile_image?: string | null;
  };
  onCompleteProfile: () => void;
}

export default function ProfileProgressBar({ user, onCompleteProfile }: ProfileProgressBarProps) {
  // Debug: ver qué datos está recibiendo el componente
  console.log('ProfileProgressBar - Datos del usuario:', user);
  
  // Calcular el progreso del perfil
  const calculateProgress = () => {
    const fields = [
      { key: 'name', label: 'Nombre', icon: FaUser },
      { key: 'email', label: 'Email', icon: FaUser },
      { key: 'phone_number', label: 'Teléfono', icon: FaPhone },
      { key: 'address_details', label: 'Dirección', icon: FaMapMarkerAlt },
      { key: 'profile_image', label: 'Foto de perfil', icon: FaImage },
    ];

    const completedFields = fields.filter(field => {
      const value = user[field.key as keyof typeof user];
      
      // Para campos de texto, verificar que no estén vacíos y no sean valores por defecto
      if (field.key !== 'profile_image') {
        if (!value || value.toString().trim() === '') return false;
        
        // Verificar valores por defecto específicos
        const defaultValue = value.toString().trim();
        if (field.key === 'phone_number' && defaultValue.includes('0000 0000')) return false;
        if (field.key === 'address_details' && defaultValue === 'Por definir') return false;
        
        return true;
      }
      
      // Para la imagen de perfil, verificar que no sea la imagen por defecto
      if (field.key === 'profile_image') {
        return value && value !== '/default-avatar.jpg' && value !== null;
      }
      
      return false;
    });

    return {
      completed: completedFields.length,
      total: fields.length,
      percentage: Math.round((completedFields.length / fields.length) * 100),
      fields: fields.map(field => {
        const value = user[field.key as keyof typeof user];
        let completed = false;
        
        if (field.key !== 'profile_image') {
          if (!value || value.toString().trim() === '') {
            completed = false;
          } else {
            // Verificar valores por defecto específicos
            const defaultValue = value.toString().trim();
            if (field.key === 'phone_number' && defaultValue.includes('0000 0000')) {
              completed = false;
            } else if (field.key === 'address_details' && defaultValue === 'Por definir') {
              completed = false;
            } else {
              completed = true;
            }
          }
        } else {
          completed = !!(value && value !== '/default-avatar.jpg' && value !== null);
        }
        
        return {
          ...field,
          completed,
        };
      }),
    };
  };

  const progress = calculateProgress();
  
  // Debug: ver qué campos se consideran completados
  console.log('ProfileProgressBar - Progreso calculado:', progress);

  // No mostrar si el perfil está completo
  if (progress.percentage === 100) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
            <FaCheckCircle className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
              Completa tu perfil
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {progress.completed} de {progress.total} campos completados
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            {progress.percentage}%
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            completado
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Lista de campos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {progress.fields.map((field, index) => {
          const IconComponent = field.icon;
          return (
            <div 
              key={index}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                field.completed 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <IconComponent className={`text-sm ${field.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">{field.label}</span>
              {field.completed && (
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-xs ml-auto" />
              )}
            </div>
          );
        })}
      </div>

      {/* Botón para completar perfil */}
      <button
        onClick={onCompleteProfile}
        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        Completar perfil ahora
      </button>
    </div>
  );
}
