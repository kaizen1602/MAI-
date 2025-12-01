

// Base URL
// Use Vite env var `VITE_API_URL` in development/preview when provided
// Example: VITE_API_URL=http://localhost:8000
const rawApiUrl = (import.meta as any)?.env?.VITE_API_URL || '';
const apiOrigin = rawApiUrl ? rawApiUrl.replace(/\/$/, '') : '';
export const API_BASE_URL = apiOrigin ? `${apiOrigin}/api` : '/api';

/**
 * All application endpoints organized by domain
 */
export const ENDPOINTS = {
  // ==========================================
  // Authentication Endpoints
  // ==========================================
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    LOGOUT_ALL: `${API_BASE_URL}/auth/logout-all`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  },

  // ==========================================
  // User Endpoints
  // ==========================================
  USERS: {
    SHOW: (id: number) => `${API_BASE_URL}/users/${id}`,
    RATING: (id: number) => `${API_BASE_URL}/users/${id}/rating`,
  },
  POSTS: {
    BASE: `${API_BASE_URL}/posts`,
    DETAIL: (id: number) => `${API_BASE_URL}/posts/${id}`,
    UPDATE_STATUS: (id: number) => `${API_BASE_URL}/posts/${id}/status`,
    IMAGES: (postId: number) => `${API_BASE_URL}/posts/${postId}/images`,
    DELETE_IMAGE: (imageId: number) => `${API_BASE_URL}/posts/images/${imageId}`,
  },

  // ==========================================
  // Products Endpoints
  // ==========================================
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    DETAIL: (id: number) => `${API_BASE_URL}/products/${id}`,
    BY_USER: (userId: number) => `${API_BASE_URL}/users/${userId}/products`,
    ADD_IMAGE: (productId: number) => `${API_BASE_URL}/products/${productId}/images`,
    DELETE_IMAGE: (imageId: number) => `${API_BASE_URL}/products/images/${imageId}`,
  },

  // ==========================================
  // Favorites Endpoints
  // ==========================================
  FAVORITES: {
    BASE: `${API_BASE_URL}/my-favorites`,
    DELETE: (postId: number) => `${API_BASE_URL}/my-favorites/${postId}`,
  },

  // ==========================================
  // Reviews Endpoints
  // ==========================================
  REVIEWS: {
    BASE: `${API_BASE_URL}/reviews`,
    DETAIL: (id: number) => `${API_BASE_URL}/reviews/${id}`,
  },

  // ==========================================
  // Price Alerts Endpoints
  // ==========================================
  PRICE_ALERTS: {
    BASE: `${API_BASE_URL}/my-alerts`,
    DETAIL: (id: number) => `${API_BASE_URL}/my-alerts/${id}`,
  },

  // ==========================================
  // Transactions Endpoints
  // ==========================================
  TRANSACTIONS: {
    BASE: `${API_BASE_URL}/transactions`,
    DETAIL: (id: number) => `${API_BASE_URL}/transactions/${id}`,
    PURCHASE_HISTORY: `${API_BASE_URL}/transactions/purchase-history`,
    CREATE_REVIEW: (id: number) => `${API_BASE_URL}/transactions/${id}/review`,
  },

  // ==========================================
  // Support Data Endpoints (Public)
  // ==========================================
  SUPPORT: {
    DEPARTMENTS: `${API_BASE_URL}/departments`,
    MUNICIPALITIES: `${API_BASE_URL}/municipalities`,
    MUNICIPALITIES_BY_DEPT: (deptId: number) => 
      `${API_BASE_URL}/municipalities/department/${deptId}`,
    POST_TYPES: `${API_BASE_URL}/post-types`,
    PRODUCT_TYPES: `${API_BASE_URL}/product-types`,
  },

  // ==========================================
  // Pricing & Recommendations Endpoints
  // ==========================================
  PRICING: {
    CHECK_PRICE: `${API_BASE_URL}/recommendations/check-price`,
    SUGGESTED_PRICE: `${API_BASE_URL}/recommendations/suggested-price`,
    MY_RECOMMENDATIONS: `${API_BASE_URL}/recommendations/my-recommendations`,
    RECOMMENDATION_STATS: `${API_BASE_URL}/recommendations/stats`,
    UPDATE_RECOMMENDATION: (id: number) => `${API_BASE_URL}/recommendations/${id}`,
    // Catalog endpoints
    CATALOG_SEARCH: `${API_BASE_URL}/catalog/search`,
    CATALOG_NORMALIZE: `${API_BASE_URL}/catalog/normalize`,
    CATALOG_CATEGORIES: `${API_BASE_URL}/catalog/categories`,
    CATALOG_CATEGORY: (category: string) => `${API_BASE_URL}/catalog/category/${encodeURIComponent(category)}`,
    CATALOG_PRODUCTS: `${API_BASE_URL}/catalog/products`,
    CATALOG_PRODUCT: (id: number) => `${API_BASE_URL}/catalog/products/${id}`,
    // Market prices endpoints
    MARKET_PRICES_LATEST: `${API_BASE_URL}/market-prices/latest`,
    MARKET_PRICES_HISTORY: (productId: number) => `${API_BASE_URL}/market-prices/history/${productId}`,
    MARKET_PRICES_BY_DATE: `${API_BASE_URL}/market-prices/date`,
    MARKET_OVERVIEW: `${API_BASE_URL}/market-prices/overview`,
    MARKET_PRICES_FILTERED: `${API_BASE_URL}/market-prices`,
    // Trends endpoints
    TRENDS: `${API_BASE_URL}/market-prices/trends`,
    VOLATILE_PRODUCTS: `${API_BASE_URL}/market-prices/volatile`,
    TRENDING_PRODUCTS: `${API_BASE_URL}/market-prices/trending`,
  },
} as const;

/**
 * Utility function to build query strings
 * @param params - Object with query parameters
 * @returns URLSearchParams string
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};
