/**
 * User Service
 * 
 * Handles user-related API operations including ratings and public profiles.
 */

import { BaseService } from './base/BaseService';
import { ENDPOINTS } from '../api/endpoints';

// Types for user rating
export interface UserRating {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: {
    '5_stars': number;
    '4_stars': number;
    '3_stars': number;
    '2_stars': number;
    '1_star': number;
  };
}

export interface UserRatingResponse {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: {
    '5_stars': number;
    '4_stars': number;
    '3_stars': number;
    '2_stars': number;
    '1_star': number;
  };
}

class UserService extends BaseService {
  /**
   * Get user's average rating and review statistics
   * 
   * @param userId - User ID
   * @returns Promise with user rating data
   */
  async getUserRating(userId: number): Promise<UserRatingResponse> {
    return this.handleRequest(
      this.client.get(ENDPOINTS.USERS.RATING(userId))
    );
  }

  /**
   * Get public user profile
   * 
   * @param userId - User ID
   * @returns Promise with user profile data
   */
  async getUserProfile(userId: number): Promise<any> {
    return this.handleRequest(
      this.client.get(ENDPOINTS.USERS.SHOW(userId))
    );
  }
}

// Export singleton instance
export default new UserService();
