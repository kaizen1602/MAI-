/**
 * SupportDataService.ts
 * 
 * Servicio para obtener datos de soporte (catálogos y datos maestros).
 * Estos son datos públicos que no requieren autenticación.
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility: Solo maneja datos de soporte/catálogos
 * - Open/Closed: Extiende BaseService sin modificarlo
 * - Dependency Inversion: Depende de abstracciones
 */

import { BaseService } from './base/BaseService';
import { ENDPOINTS } from '../api/endpoints';
import type {
  Department,
  Municipality,
  ProductType
} from '../types/product.types';
import type { PostType } from '../types/post.types';

/**
 * Servicio singleton para datos de soporte
 */
export class SupportDataService extends BaseService {
  private static instance: SupportDataService;

  /**
   * Constructor privado para implementar patrón Singleton
   */
  private constructor() {
    super();
  }

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): SupportDataService {
    if (!SupportDataService.instance) {
      SupportDataService.instance = new SupportDataService();
    }
    return SupportDataService.instance;
  }

  /**
   * Obtiene lista de todos los departamentos
   * Endpoint público - no requiere autenticación
   * 
   * @returns Promise con array de departamentos
   * 
   * @example
   * const departments = await SupportDataService.getInstance().getDepartments();
   */
  async getDepartments(): Promise<Department[]> {
    return this.handleRequest<Department[]>(
      this.client.get(ENDPOINTS.SUPPORT.DEPARTMENTS)
    );
  }

  /**
   * Obtiene lista de todos los municipios
   * Endpoint público - no requiere autenticación
   * 
   * @returns Promise con array de municipios
   * 
   * @example
   * const municipalities = await SupportDataService.getInstance().getMunicipalities();
   */
  async getMunicipalities(): Promise<Municipality[]> {
    return this.handleRequest<Municipality[]>(
      this.client.get(ENDPOINTS.SUPPORT.MUNICIPALITIES)
    );
  }

  /**
   * Obtiene municipios filtrados por departamento
   * Endpoint público - no requiere autenticación
   * 
   * @param departmentId - ID del departamento
   * @returns Promise con array de municipios del departamento
   * 
   * @example
   * const muns = await SupportDataService.getInstance().getMunicipalitiesByDepartment(1);
   */
  async getMunicipalitiesByDepartment(departmentId: number): Promise<Municipality[]> {
    return this.handleRequest<Municipality[]>(
      this.client.get(ENDPOINTS.SUPPORT.MUNICIPALITIES_BY_DEPT(departmentId))
    );
  }

  /**
   * Obtiene lista de tipos de publicación
   * Endpoint público - no requiere autenticación
   * 
   * @returns Promise con array de tipos de publicación
   * 
   * @example
   * const postTypes = await SupportDataService.getInstance().getPostTypes();
   */
  async getPostTypes(): Promise<PostType[]> {
    return this.handleRequest<PostType[]>(
      this.client.get(ENDPOINTS.SUPPORT.POST_TYPES)
    );
  }

  /**
   * Obtiene lista de tipos de producto
   * Endpoint público - no requiere autenticación
   * 
   * @returns Promise con array de tipos de producto
   * 
   * @example
   * const productTypes = await SupportDataService.getInstance().getProductTypes();
   */
  async getProductTypes(): Promise<ProductType[]> {
    return this.handleRequest<ProductType[]>(
      this.client.get(ENDPOINTS.SUPPORT.PRODUCT_TYPES)
    );
  }

  /**
   * Carga todos los datos de soporte en paralelo
   * Útil para inicialización de la aplicación
   * 
   * @returns Promise con todos los datos de soporte
   * 
   * @example
   * const supportData = await SupportDataService.getInstance().loadAllSupportData();
   * console.log(supportData.departments, supportData.municipalities);
   */
  async loadAllSupportData() {
    const [departments, municipalities, postTypes, productTypes] = await Promise.all([
      this.getDepartments(),
      this.getMunicipalities(),
      this.getPostTypes(),
      this.getProductTypes(),
    ]);

    return {
      departments,
      municipalities,
      postTypes,
      productTypes,
    };
  }
}

// Exportar instancia singleton para conveniencia
export default SupportDataService.getInstance();
