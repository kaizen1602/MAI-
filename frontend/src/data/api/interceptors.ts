

import apiClient from './axios.config';
import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

/**
 * Storage keys
 */
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

/**
 * Request Interceptor
 * Automatically adds Bearer token to all requests if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common HTTP errors globally
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response as-is
    return response;
  },
  (error: AxiosError<any>) => {
    // Endpoints que manejan sus propios errores (no mostrar toast automático)
    const skipToastEndpoints = [
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/auth/login',
      '/api/auth/register',
    ];

    const isSkipToastEndpoint = skipToastEndpoints.some(endpoint => 
      error.config?.url?.includes(endpoint)
    );

    // Handle different error status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Clear auth data and redirect to login
          console.error('Unauthorized access - Redirecting to login');
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            if (!isSkipToastEndpoint) {
              toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
          break;

        case 403:
          // Forbidden - User doesn't have permissions
          console.error('Forbidden access');
          if (!isSkipToastEndpoint) {
            toast.error('No tienes permisos para realizar esta acción.');
          }
          break;

        case 404:
          // Not Found
          console.error('Resource not found');
          if (!isSkipToastEndpoint) {
            toast.error('Recurso no encontrado.');
          }
          break;

        case 422:
          // Validation Error - Laravel returns this for validation failures
          console.error('Validation error:', data.errors);
          if (!isSkipToastEndpoint) {
            if (data.errors) {
              // Show first validation error
              const firstError = Object.values(data.errors)[0];
              if (Array.isArray(firstError) && firstError.length > 0) {
                toast.error(firstError[0] as string);
              }
            } else if (data.message) {
              toast.error(data.message);
            }
          }
          break;

        case 500:
          // Server Error
          console.error('Server error:', data);
          if (!isSkipToastEndpoint) {
            toast.error('Error del servidor. Por favor, intenta más tarde.');
          }
          break;

        default:
          // Other errors
          console.error(`HTTP Error ${status}:`, data);
          if (!isSkipToastEndpoint) {
            toast.error(data.message || 'Ha ocurrido un error inesperado.');
          }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      if (!isSkipToastEndpoint) {
        toast.error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      if (!isSkipToastEndpoint) {
        toast.error('Error al realizar la solicitud.');
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Export the configured client with interceptors
 */
export default apiClient;

/**
 * Export storage keys for use in services
 */
export { TOKEN_KEY, USER_KEY };
