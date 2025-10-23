/**
 * ReviewService.ts
 * 
 * Servicio para la gestión de reseñas/calificaciones de usuarios.
 * Requiere autenticación.
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility: Solo maneja operaciones con reseñas
 * - Open/Closed: Extiende BaseService sin modificarlo
 * - Dependency Inversion: Depende de abstracciones
 */

import { BaseService } from './base/BaseService';
import { ENDPOINTS } from '../api/endpoints';
import type { Review, CreateReviewRequest } from '../types/product.types';

/**
 * Servicio singleton para gestión de reseñas
 */
export class ReviewService extends BaseService {
  private static instance: ReviewService;

  /**
   * Constructor privado para implementar patrón Singleton
   */
  private constructor() {
    super();
  }

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService();
    }
    return ReviewService.instance;
  }

  /**
   * Obtiene todas las reseñas (del usuario autenticado)
   * 
   * @returns Promise con array de reseñas
   * 
   * @example
   * const reviews = await ReviewService.getInstance().getReviews();
   */
  async getReviews(): Promise<Review[]> {
    return this.handleRequest<Review[]>(
      this.client.get(ENDPOINTS.REVIEWS.BASE)
    );
  }

  /**
   * Obtiene una reseña específica por ID
   * 
   * @param id - ID de la reseña
   * @returns Promise con la reseña
   * 
   * @example
   * const review = await ReviewService.getInstance().getReview(1);
   */
  async getReview(id: number): Promise<Review> {
    return this.handleRequest<Review>(
      this.client.get(ENDPOINTS.REVIEWS.DETAIL(id))
    );
  }

  /**
   * Crea una nueva reseña para un usuario
   * 
   * @param data - Datos de la reseña (usuario a calificar, rating, comentario)
   * @returns Promise con la reseña creada
   * 
   * @example
   * const newReview = await ReviewService.getInstance().createReview({
   *   reviewed_id: 2,
   *   rating: 5,
   *   comment: 'Excelente vendedor, muy profesional'
   * });
   */
  async createReview(data: CreateReviewRequest): Promise<Review> {
    return this.handleRequest<Review>(
      this.client.post(ENDPOINTS.REVIEWS.BASE, data)
    );
  }

  /**
   * Actualiza una reseña existente
   * 
   * @param id - ID de la reseña a actualizar
   * @param data - Datos a actualizar
   * @returns Promise con la reseña actualizada
   * 
   * @example
   * const updated = await ReviewService.getInstance().updateReview(1, {
   *   rating: 4,
   *   comment: 'Buen servicio'
   * });
   */
  async updateReview(
    id: number,
    data: Partial<CreateReviewRequest>
  ): Promise<Review> {
    return this.handleRequest<Review>(
      this.client.put(ENDPOINTS.REVIEWS.DETAIL(id), data)
    );
  }

  /**
   * Elimina una reseña
   * 
   * @param id - ID de la reseña a eliminar
   * @returns Promise que se resuelve cuando se elimina
   * 
   * @example
   * await ReviewService.getInstance().deleteReview(1);
   */
  async deleteReview(id: number): Promise<void> {
    await this.handleRequest<void>(
      this.client.delete(ENDPOINTS.REVIEWS.DETAIL(id))
    );
  }

  /**
   * Obtiene reseñas de un usuario específico
   * 
   * @param userId - ID del usuario
   * @returns Promise con array de reseñas del usuario
   * 
   * @example
   * const userReviews = await ReviewService.getInstance().getUserReviews(2);
   */
  async getUserReviews(userId: number): Promise<Review[]> {
    const allReviews = await this.getReviews();
    return allReviews.filter(review => review.reviewed.id === userId);
  }

  /**
   * Calcula el promedio de calificación de un usuario
   * 
   * @param userId - ID del usuario
   * @returns Promise con el promedio (0 si no hay reseñas)
   * 
   * @example
   * const avgRating = await ReviewService.getInstance().getUserAverageRating(2);
   */
  async getUserAverageRating(userId: number): Promise<number> {
    const reviews = await this.getUserReviews(userId);
    
    if (reviews.length === 0) {
      return 0;
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }
}

// Exportar instancia singleton para conveniencia
export default ReviewService.getInstance();
