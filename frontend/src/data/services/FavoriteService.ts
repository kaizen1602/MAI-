/**
 * FavoriteService.ts
 * 
 * Servicio para la gestión de favoritos (posts guardados).
 * Requiere autenticación.
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility: Solo maneja operaciones con favoritos
 * - Open/Closed: Extiende BaseService sin modificarlo
 * - Dependency Inversion: Depende de abstracciones
 */

import { BaseService } from './base/BaseService';
import { ENDPOINTS } from '../api/endpoints';
import type { Post } from '../types/post.types';

/**
 * Servicio singleton para gestión de favoritos
 */
export class FavoriteService extends BaseService {
  private static instance: FavoriteService;

  /**
   * Constructor privado para implementar patrón Singleton
   */
  private constructor() {
    super();
  }

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): FavoriteService {
    if (!FavoriteService.instance) {
      FavoriteService.instance = new FavoriteService();
    }
    return FavoriteService.instance;
  }

  /**
   * Obtiene lista de publicaciones favoritas del usuario autenticado
   * 
   * @returns Promise con array de posts favoritos
   * 
   * @example
   * const favorites = await FavoriteService.getInstance().getFavorites();
   */
  async getFavorites(): Promise<Post[]> {
    return this.handleRequest<Post[]>(
      this.client.get(ENDPOINTS.FAVORITES.BASE)
    );
  }

  /**
   * Agrega una publicación a favoritos
   * 
   * @param postId - ID de la publicación a agregar
   * @returns Promise que se resuelve cuando se agrega
   * 
   * @example
   * await FavoriteService.getInstance().addFavorite(5);
   */
  async addFavorite(postId: number): Promise<void> {
    await this.handleRequest<void>(
      this.client.post(ENDPOINTS.FAVORITES.BASE, { post_id: postId })
    );
  }

  /**
   * Elimina una publicación de favoritos
   * 
   * @param postId - ID de la publicación a eliminar
   * @returns Promise que se resuelve cuando se elimina
   * 
   * @example
   * await FavoriteService.getInstance().removeFavorite(5);
   */
  async removeFavorite(postId: number): Promise<void> {
    await this.handleRequest<void>(
      this.client.delete(ENDPOINTS.FAVORITES.DELETE(postId))
    );
  }

  /**
   * Verifica si una publicación está en favoritos
   * 
   * @param postId - ID de la publicación a verificar
   * @returns Promise que resuelve true si está en favoritos
   * 
   * @example
   * const isFavorite = await FavoriteService.getInstance().isFavorite(5);
   */
  async isFavorite(postId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(post => post.id === postId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  /**
   * Toggle del estado de favorito de una publicación
   * Si está en favoritos, lo elimina. Si no está, lo agrega.
   * 
   * @param postId - ID de la publicación
   * @returns Promise que resuelve true si se agregó, false si se eliminó
   * 
   * @example
   * const wasAdded = await FavoriteService.getInstance().toggleFavorite(5);
   */
  async toggleFavorite(postId: number): Promise<boolean> {
    const isFav = await this.isFavorite(postId);
    
    if (isFav) {
      await this.removeFavorite(postId);
      return false;
    } else {
      await this.addFavorite(postId);
      return true;
    }
  }
}

// Exportar instancia singleton para conveniencia
export default FavoriteService.getInstance();
