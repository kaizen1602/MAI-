import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Post } from '../data/types/post.types';
import favoriteService from '../data/services/FavoriteService';
import { toast } from 'react-hot-toast';

interface FavoriteButtonProps {
  post: Post;
  onFavoriteChange?: (isFavorite: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  post,
  onFavoriteChange,
  size = 'md',
}) => {
  const [isFavorite, setIsFavorite] = useState(post.is_favorited || false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(post.is_favorited || false);
  }, [post.is_favorited]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que el click se propague al contenedor padre
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    try {
      const newFavoriteState = await favoriteService.toggleFavorite(post.id);
      setIsFavorite(newFavoriteState);
      onFavoriteChange?.(newFavoriteState);
      
      if (newFavoriteState) {
        toast.success('Agregado a favoritos');
      } else {
        toast.success('Removido de favoritos');
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-7 h-7';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 20;
      default:
        return 18;
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        ${getSizeClasses()}
        flex items-center justify-center
        rounded-full transition-all duration-200
        ${isFavorite 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
      ) : (
        <Heart 
          size={getIconSize()} 
          className={isFavorite ? 'fill-current' : ''}
        />
      )}
    </button>
  );
};

export default FavoriteButton;
