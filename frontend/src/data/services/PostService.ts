/**
 * Post Service
 * 
 * Handles all post-related operations:
 * - List posts with filters and pagination
 * - Get post details
 * - Create, update, delete posts
 * - Manage post images
 * 
 * Following Single Responsibility Principle (SOLID)
 */

import { BaseService } from './base/BaseService';
import { ENDPOINTS, buildQueryString } from '../api/endpoints';
import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostFilters,
} from '../types/post.types';
import { CursorPaginatedResponse } from '../types/api.types';

class PostService extends BaseService {
  /**
   * Get list of posts with filters and pagination
   * 
   * @param filters - Filter criteria
   * @returns Paginated posts response
   */
  async getPosts(filters?: PostFilters): Promise<CursorPaginatedResponse<Post>> {
    let url = ENDPOINTS.POSTS.BASE;

    if (filters) {
      const queryString = buildQueryString(filters);
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.handleFullResponse<CursorPaginatedResponse<Post>>(
      this.client.get(url)
    );
  }

  /**
   * Get single post by ID
   * 
   * @param id - Post ID
   * @returns Post data
   */
  async getPost(id: number): Promise<Post> {
    return this.handleRequest<Post>(
      this.client.get(ENDPOINTS.POSTS.DETAIL(id))
    );
  }

  /**
   * Create new post
   * 
   * @param data - Post creation data
   * @returns Created post
   */
  async createPost(data: CreatePostRequest): Promise<Post> {
    // Build FormData for file upload
    const formData = new FormData();
    
    // Add all the regular fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('quantity_kg', data.quantity_kg.toString());
    formData.append('price_per_kg', data.price_per_kg.toString());
    formData.append('post_type_id', data.post_type_id.toString());
    formData.append('product_id', data.product_id.toString());
    formData.append('municipality_id', data.municipality_id.toString());
    
    // Add images if they exist
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    return this.handleRequest<Post>(
      this.client.post(ENDPOINTS.POSTS.BASE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  /**
   * Update existing post
   * 
   * @param id - Post ID
   * @param data - Update data
   * @returns Updated post
   */
  async updatePost(id: number, data: UpdatePostRequest): Promise<Post> {
    // If images are included, use FormData
    if (data.images && data.images.length > 0) {
      const formData = this.buildFormData(data);
      
      return this.handleRequest<Post>(
        this.client.post(ENDPOINTS.POSTS.DETAIL(id), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: { _method: 'PUT' }, // Laravel method spoofing
        })
      );
    }

    // Otherwise use regular JSON
    return this.handleRequest<Post>(
      this.client.put(ENDPOINTS.POSTS.DETAIL(id), data)
    );
  }

  /**
   * Delete post
   * 
   * @param id - Post ID
   */
  async deletePost(id: number): Promise<void> {
    await this.handleRequest(
      this.client.delete(ENDPOINTS.POSTS.DETAIL(id))
    );
  }

  /**
   * Add image to existing post
   * 
   * @param postId - Post ID
   * @param image - Image file
   */
  async addImage(postId: number, image: File): Promise<void> {
    const formData = new FormData();
    formData.append('image', image);

    await this.handleRequest(
      this.client.post(ENDPOINTS.POSTS.IMAGES(postId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  /**
   * Update post status
   * 
   * @param id - Post ID
   * @param status - New status (ACTIVE, CLOSED, EXPIRED)
   * @returns Updated post
   */
  async updatePostStatus(id: number, status: 'ACTIVE' | 'CLOSED' | 'EXPIRED'): Promise<Post> {
    return this.handleRequest<Post>(
      this.client.patch(ENDPOINTS.POSTS.UPDATE_STATUS(id), { status })
    );
  }

  /**
   * Delete post image
   * 
   * @param imageId - Image ID
   */
  async deleteImage(imageId: number): Promise<void> {
    await this.handleRequest(
      this.client.delete(ENDPOINTS.POSTS.DELETE_IMAGE(imageId))
    );
  }

  /**
   * Get posts by type (Venta/Compra)
   * Convenience method for common filtering
   *
   * @param postTypeId - Post type ID (1=Venta, 2=Compra)
   * @param additionalFilters - Additional filters
   * @returns Filtered posts
   */
  async getPostsByType(
    postTypeId: number,
    additionalFilters?: Partial<PostFilters>
  ): Promise<CursorPaginatedResponse<Post>> {
    return this.getPosts({
      post_type_id: postTypeId,
      ...additionalFilters,
    });
  }

  /**
   * Get user's posts
   * 
   * @param userId - User ID
   * @param filters - Additional filters
   * @returns User's posts
   */
  async getUserPosts(
    userId: number,
    filters?: Partial<PostFilters>
  ): Promise<CursorPaginatedResponse<Post>> {
    return this.getPosts({
      user_id: userId,
      ...filters,
    });
  }

  /**
   * Search posts by keyword
   * 
   * @param searchTerm - Search term
   * @param filters - Additional filters
   * @returns Search results
   */
  async searchPosts(
    searchTerm: string,
    filters?: Partial<PostFilters>
  ): Promise<CursorPaginatedResponse<Post>> {
    return this.getPosts({
      search: searchTerm,
      ...filters,
    });
  }
}

// Export singleton instance
export default new PostService();
