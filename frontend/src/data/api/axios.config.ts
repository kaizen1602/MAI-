/**
 * Axios Configuration
 * 
 * Centralized Axios instance with default configuration.
 * This instance will be used across all services following the DRY principle.
 */

import axios, { AxiosInstance } from 'axios';

/**
 * Configuracion de Axios
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: '', // Url de base
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 segundos, la petición falla.
  withCredentials: false, // Es falso porque se usa cookies
});

export default apiClient;
