/**
 * Public Base Service
 * 
 * Base class for services that need to make public API requests
 * without authentication.
 */

import publicClient from '../../api/publicClient';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../../types/api.types';

/**
 * Public Base Service Class
 * For services that don't require authentication
 */
export abstract class PublicBaseService {
  /**
   * Handle public API request and extract data
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
      // Just re-throw it
      throw error;
    }
  }

  /**
   * Handle public API request and return full response
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
   * Get public Axios client instance
   */
  protected get client() {
    return publicClient;
  }
}