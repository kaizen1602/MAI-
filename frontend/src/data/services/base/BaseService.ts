/**
 * Base Service
 * 
 * Abstract base class for all services following SOLID principles:
 * - Single Responsibility: Handles common HTTP operations
 * - Open/Closed: Open for extension, closed for modification
 * - Liskov Substitution: All services can be substituted with this base
 * - Dependency Inversion: Depends on abstractions (Axios), not concretions
 */

import apiClient from '../../api/interceptors';
import { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../../types/api.types';

/**
 * Base Service Class
 * All service classes should extend this to inherit common functionality
 */
export abstract class BaseService {
  /**
   * Handle API request and extract data
   * 
   * @param request - Axios promise
   * @returns Extracted data from response
   * @throws Error if request fails
   */
  protected async handleRequest<T>(
    request: Promise<AxiosResponse<any>>
  ): Promise<T> {
    try {
      const response = await request;
      
      // Check if response follows ApiResponse structure
      if (response.data && typeof response.data === 'object') {
        // If it has a 'success' field, it's our API response
        if ('success' in response.data) {
          const apiResponse = response.data as ApiResponse<T>;
          
          if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Request failed');
          }
          
          return apiResponse.data;
        }
        
        // If it has 'data' field directly, return it
        if ('data' in response.data) {
          return response.data.data;
        }
      }
      
      // Otherwise return response data as-is
      return response.data;
    } catch (error) {
      // Error is already handled by interceptors
      // Just re-throw it
      throw error;
    }
  }

  /**
   * Handle API request and return full response
   * (including pagination, filters, etc.)
   * 
   * @param request - Axios promise
   * @returns Full API response
   */
  protected async handleFullResponse<T>(
    request: Promise<AxiosResponse<any>>
  ): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Build FormData for multipart requests
   * Useful for file uploads
   * 
   * @param data - Object with data to convert
   * @returns FormData instance
   */
  protected buildFormData(data: Record<string, any>): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle arrays (like images)
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${key}[${index}]`, item);
            } else {
              formData.append(`${key}[${index}]`, String(item));
            }
          });
        }
        // Handle Files
        else if (value instanceof File) {
          formData.append(key, value);
        }
        // Handle regular values
        else {
          formData.append(key, String(value));
        }
      }
    });

    return formData;
  }

  /**
   * Extract error message from error object
   * 
   * @param error - Error object
   * @returns Error message string
   */
  protected extractErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Ha ocurrido un error inesperado';
  }

  /**
   * Get Axios client instance
   * Can be overridden by child classes if needed
   */
  protected get client() {
    return apiClient;
  }
}
