/**
 * Types Index
 * 
 * Central export point for all TypeScript types and interfaces.
 * Simplifies imports across the application.
 */

// API Types
export type {
  ApiResponse,
  PaginatedResponse,
  CursorPaginatedResponse,
  ApiError,
  RequestState,
} from './api.types';

export { HttpStatus } from './api.types';

// Auth Types
export type {
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  AuthResponse,
  ProfileResponse,
} from './auth.types';

// Post Types
export type {
  Post,
  PostType,
  PostImage,
  CreatePostRequest,
  UpdatePostRequest,
  PostFilters,
} from './post.types';

// Product Types
export type {
  Product,
  ProductType,
  ProductImage,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  Department,
  Municipality,
  Review,
  CreateReviewRequest,
  PriceAlert,
  CreatePriceAlertRequest,
  Favorite,
} from './product.types';
