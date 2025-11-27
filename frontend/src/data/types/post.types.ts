/**
 * Post Types
 * 
 * TypeScript interfaces for post-related data
 */

/**
 * Post Status Enum
 */
export type PostStatus = 'ACTIVE' | 'CLOSED' | 'EXPIRED';

/**
 * Post model from Laravel API
 */
export interface Post {
  id: number;
  title: string;
  description: string;
  quantity_kg: number;
  price_per_kg: number;
  total_price: number;
  status: PostStatus;
  
  // Relationships
  post_type: {
    id: number;
    name: string;
    description: string;
  };
  
  product: {
    id: number;
    name: string;
    description: string;
    image_url: string;
    product_type: {
      id: number;
      name: string;
      description?: string;
    };
  };
  
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    address_details: string;
    is_verified: boolean;
  };
  
  municipality: {
    id: number;
    name: string;
  };
  
  images: PostImage[];
  
  // Computed fields
  favorites_count: number;
  is_favorited: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Post Image
 */
export interface PostImage {
  id: number;
  url: string;
}

/**
 * Create Post Request Payload
 */
export interface CreatePostRequest {
  title: string;
  description: string;
  quantity_kg: number;
  price_per_kg: number;
  post_type_id: number;
  product_id: number;
  municipality_id?: number; // Optional - for backward compatibility
  location?: string; // Ciudad, Departamento - from external API
  images?: File[]; // Files to upload
}

/**
 * Update Post Request Payload
 */
export interface UpdatePostRequest {
  title?: string;
  description?: string;
  quantity_kg?: number;
  price_per_kg?: number;
  status?: PostStatus;
  post_type_id?: number;
  product_id?: number;
  municipality_id?: number;
  location?: string;
  images?: File[]; // New files to upload
}

/**
 * Post Filters for listing
 */
export interface PostFilters {
  search?: string;
  product_id?: number;
  municipality_id?: number;
  post_type_id?: number;
  user_id?: number;
  status?: PostStatus;
  sort_by?: 'created_at' | 'price_per_kg' | 'quantity_kg' | 'title' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  cursor?: string; // For cursor pagination
}

/**
 * Post Type (Venta/Compra)
 */
export interface PostType {
  id: number;
  name: string;
  description: string;
}
