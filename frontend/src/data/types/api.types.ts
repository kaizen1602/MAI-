/**
 * API Response Types
 * 
 * TypeScript interfaces for API responses following Laravel's response structure
 */

/**
 * Standard API Response from Laravel
 * Following Interface Segregation Principle (SOLID)
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Paginated Response (Cursor Pagination)
 * Used for listing endpoints like /posts
 */
export interface CursorPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    per_page: number;
    next_cursor: string | null;
    prev_cursor: string | null;
    next_page_url: string | null;
    prev_page_url: string | null;
    has_more_pages: boolean;
  };
  filters_applied?: Record<string, any>;
  sort_applied?: {
    sort_by: string;
    sort_order: 'asc' | 'desc';
  };
}

/**
 * Traditional Paginated Response (Offset Pagination)
 * Used for some endpoints like /products
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    prev_page: number | null;
    next_page: number | null;
    from: number;
    to: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    first_page_url: string;
    last_page_url: string;
  };
}

/**
 * API Error Response
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>; // Laravel validation errors
  error?: string; // Single error message
}

/**
 * Common HTTP Status Codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Request State for UI
 */
export interface RequestState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
