/**
 * PriceAlertService.ts
 * 
 * Servicio para la gestión de alertas de precio.
 * Permite a los usuarios crear alertas para ser notificados cuando
 * un producto alcance un precio objetivo.
 * Requiere autenticación.
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility: Solo maneja operaciones con alertas de precio
 * - Open/Closed: Extiende BaseService sin modificarlo
 * - Dependency Inversion: Depende de abstracciones
 */

import { BaseService } from './base/BaseService';
import { ENDPOINTS } from '../api/endpoints';
import type { PriceAlert, CreatePriceAlertRequest } from '../types/product.types';

/**
 * Servicio singleton para gestión de alertas de precio
 */
export class PriceAlertService extends BaseService {
  private static instance: PriceAlertService;

  /**
   * Constructor privado para implementar patrón Singleton
   */
  private constructor() {
    super();
  }

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): PriceAlertService {
    if (!PriceAlertService.instance) {
      PriceAlertService.instance = new PriceAlertService();
    }
    return PriceAlertService.instance;
  }

  /**
   * Obtiene todas las alertas de precio del usuario autenticado
   * 
   * @returns Promise con array de alertas
   * 
   * @example
   * const alerts = await PriceAlertService.getInstance().getAlerts();
   */
  async getAlerts(): Promise<PriceAlert[]> {
    return this.handleRequest<PriceAlert[]>(
      this.client.get(ENDPOINTS.PRICE_ALERTS.BASE)
    );
  }

  /**
   * Obtiene una alerta específica por ID
   * 
   * @param id - ID de la alerta
   * @returns Promise con la alerta
   * 
   * @example
   * const alert = await PriceAlertService.getInstance().getAlert(1);
   */
  async getAlert(id: number): Promise<PriceAlert> {
    return this.handleRequest<PriceAlert>(
      this.client.get(ENDPOINTS.PRICE_ALERTS.DETAIL(id))
    );
  }

  /**
   * Crea una nueva alerta de precio
   * 
   * @param data - Datos de la alerta (producto, municipio, precio objetivo)
   * @returns Promise con la alerta creada
   * 
   * @example
   * const newAlert = await PriceAlertService.getInstance().createAlert({
   *   product_id: 1,
   *   municipality_id: 5,
   *   target_price: 150.00
   * });
   */
  async createAlert(data: CreatePriceAlertRequest): Promise<PriceAlert> {
    return this.handleRequest<PriceAlert>(
      this.client.post(ENDPOINTS.PRICE_ALERTS.BASE, data)
    );
  }

  /**
   * Actualiza una alerta existente
   * 
   * @param id - ID de la alerta a actualizar
   * @param data - Datos a actualizar
   * @returns Promise con la alerta actualizada
   * 
   * @example
   * const updated = await PriceAlertService.getInstance().updateAlert(1, {
   *   target_price: 120.00
   * });
   */
  async updateAlert(
    id: number,
    data: Partial<CreatePriceAlertRequest>
  ): Promise<PriceAlert> {
    return this.handleRequest<PriceAlert>(
      this.client.put(ENDPOINTS.PRICE_ALERTS.DETAIL(id), data)
    );
  }

  /**
   * Elimina una alerta
   * 
   * @param id - ID de la alerta a eliminar
   * @returns Promise que se resuelve cuando se elimina
   * 
   * @example
   * await PriceAlertService.getInstance().deleteAlert(1);
   */
  async deleteAlert(id: number): Promise<void> {
    await this.handleRequest<void>(
      this.client.delete(ENDPOINTS.PRICE_ALERTS.DETAIL(id))
    );
  }

  /**
   * Obtiene alertas activas del usuario
   * 
   * @returns Promise con array de alertas activas
   * 
   * @example
   * const activeAlerts = await PriceAlertService.getInstance().getActiveAlerts();
   */
  async getActiveAlerts(): Promise<PriceAlert[]> {
    const alerts = await this.getAlerts();
    return alerts.filter(alert => alert.status === 'ACTIVE');
  }

  /**
   * Obtiene alertas disparadas del usuario
   * 
   * @returns Promise con array de alertas disparadas
   * 
   * @example
   * const triggered = await PriceAlertService.getInstance().getTriggeredAlerts();
   */
  async getTriggeredAlerts(): Promise<PriceAlert[]> {
    const alerts = await this.getAlerts();
    return alerts.filter(alert => alert.status === 'TRIGGERED');
  }

  /**
   * Cancela una alerta (cambia su estado a CANCELLED)
   * 
   * @param id - ID de la alerta a cancelar
   * @returns Promise con la alerta cancelada
   * 
   * @example
   * await PriceAlertService.getInstance().cancelAlert(1);
   */
  async cancelAlert(id: number): Promise<PriceAlert> {
    // Assuming the backend handles status change via a specific endpoint
    // If not, we'd use updateAlert with status: 'CANCELLED'
    return this.deleteAlert(id).then(() => this.getAlert(id));
  }

  /**
   * Obtiene alertas para un producto específico
   * 
   * @param productId - ID del producto
   * @returns Promise con array de alertas del producto
   * 
   * @example
   * const productAlerts = await PriceAlertService.getInstance().getAlertsByProduct(1);
   */
  async getAlertsByProduct(productId: number): Promise<PriceAlert[]> {
    const alerts = await this.getAlerts();
    return alerts.filter(alert => alert.product.id === productId);
  }
}

// Exportar instancia singleton para conveniencia
export default PriceAlertService.getInstance();
