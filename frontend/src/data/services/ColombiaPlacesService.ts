/**
 * ColombiaPlacesService.ts
 *
 * Servicio para obtener departamentos y ciudades de Colombia
 * desde la API pública api-colombia.com
 *
 * API Docs: https://api-colombia.com/
 */

import axios from 'axios';

const API_BASE_URL = 'https://api-colombia.com/api/v1';

export interface ColombiaDepartment {
  id: number;
  name: string;
  description?: string;
  cityCapitalId?: number;
  municipalities?: number;
  surface?: number;
  population?: number;
  phonePrefix?: string;
  countryId?: number;
  cityCapital?: {
    id: number;
    name: string;
    population?: number;
    postalCode?: string;
  };
}

export interface ColombiaCity {
  id: number;
  name: string;
  description?: string;
  surface?: number;
  population?: number;
  postalCode?: string;
  departmentId: number;
}

/**
 * Servicio singleton para datos de lugares de Colombia
 */
export class ColombiaPlacesService {
  private static instance: ColombiaPlacesService;
  private client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  // Cache para evitar llamadas repetidas
  private departmentsCache: ColombiaDepartment[] | null = null;
  private citiesByDeptCache: Map<number, ColombiaCity[]> = new Map();

  private constructor() {}

  public static getInstance(): ColombiaPlacesService {
    if (!ColombiaPlacesService.instance) {
      ColombiaPlacesService.instance = new ColombiaPlacesService();
    }
    return ColombiaPlacesService.instance;
  }

  /**
   * Obtiene todos los departamentos de Colombia
   */
  async getDepartments(): Promise<ColombiaDepartment[]> {
    if (this.departmentsCache) {
      return this.departmentsCache;
    }

    try {
      const response = await this.client.get<ColombiaDepartment[]>('/Department');
      // Ordenar alfabéticamente
      const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
      this.departmentsCache = sorted;
      return sorted;
    } catch (error) {
      console.error('Error fetching departments from api-colombia.com:', error);
      throw error;
    }
  }

  /**
   * Obtiene las ciudades de un departamento específico
   */
  async getCitiesByDepartment(departmentId: number): Promise<ColombiaCity[]> {
    const cached = this.citiesByDeptCache.get(departmentId);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.client.get<ColombiaCity[]>(`/Department/${departmentId}/cities`);
      // Ordenar alfabéticamente
      const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
      this.citiesByDeptCache.set(departmentId, sorted);
      return sorted;
    } catch (error) {
      console.error(`Error fetching cities for department ${departmentId}:`, error);
      throw error;
    }
  }

  /**
   * Limpia el cache (útil si se necesita refrescar datos)
   */
  clearCache(): void {
    this.departmentsCache = null;
    this.citiesByDeptCache.clear();
  }
}

export default ColombiaPlacesService.getInstance();
