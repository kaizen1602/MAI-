/**
 * Axios Configuration
 * 
 * Centralized Axios instance with default configuration.
 * This instance will be used across all services following the DRY principle.
 */

import axios, { AxiosInstance } from 'axios';

/**
 * Create and configure Axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: '', // Vite proxy already adds /api prefix, so we use empty baseURL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: false, // Not needed for token-based auth
});

export default apiClient;
