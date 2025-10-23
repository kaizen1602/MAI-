/**
 * Product Types
 * 
 * TypeScript interfaces for product-related data
 */

import type { CursorPaginatedResponse } from './api.types';

/**
 * Product model from Laravel API
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  available: boolean;
  contact_phone?: string;
  contact_email?: string;
  product_type: {
    id: number;
    name: string;
    description: string;
  };
  user: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  municipality: {
    id: number;
    name: string;
  };
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

/**
 * Product Image
 */
export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  created_at: string;
}

/**
 * Product Type
 */
export interface ProductType {
  id: number;
  name: string;
  description: string;
}

/**
 * Department (Geography)
 */
export interface Department {
  id: number;
  name: string;
}

/**
 * Municipality (Geography)
 */
export interface Municipality {
  id: number;
  name: string;
  department?: {
    id: number;
    name: string;
  };
}

/**
 * Review model
 */
export interface Review {
  id: number;
  rating: number; // 1-5
  comment: string;
  reviewer: {
    id: number;
    name: string;
  };
  reviewed: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Create Review Request
 */
export interface CreateReviewRequest {
  reviewed_id: number;
  rating: number;
  comment: string;
}

/**
 * Price Alert model
 */
export interface PriceAlert {
  id: number;
  product: {
    id: number;
    name: string;
    description: string;
  };
  municipality: {
    id: number;
    name: string;
  };
  target_price: number;
  status: 'ACTIVE' | 'TRIGGERED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
}

/**
 * Create Price Alert Request
 */
export interface CreatePriceAlertRequest {
  product_id: number;
  municipality_id: number;
  target_price: number;
}

/**
 * Favorite (Post favorite)
 */
export interface Favorite {
  post: Post;
  date: string;
}

/**
 * Filtros para búsqueda y listado de productos
 */
export interface ProductFilters {
  product_type_id?: number;
  department_id?: number;
  municipality_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  cursor?: string;
  limit?: number;
}

/**
 * Request para crear un nuevo producto
 */
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  unit: string;
  product_type_id: number;
  department_id: number;
  municipality_id: number;
  contact_phone?: string;
  contact_email?: string;
  available?: boolean;
}

/**
 * Request para actualizar un producto
 */
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  unit?: string;
  product_type_id?: number;
  department_id?: number;
  municipality_id?: number;
  contact_phone?: string;
  contact_email?: string;
  available?: boolean;
}

// Re-export Post type for convenience
import { Post } from './post.types';
export type { Post, CursorPaginatedResponse };
