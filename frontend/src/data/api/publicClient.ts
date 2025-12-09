/**
 * Public API Client
 * 
 * Axios instance for public API requests that don't require authentication.
 * This is useful for statistics and other public data.
 */

import axios, { AxiosInstance } from 'axios';

/**
 * Public API Client Configuration
 */
const publicClient: AxiosInstance = axios.create({
  baseURL: '', // Url de base - vacío porque las rutas ya incluyen /api
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

export default publicClient;