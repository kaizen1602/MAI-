/**
 * Services Index
 * 
 * Central export point for all services.
 * Provides convenient access to all singleton service instances.
 */

// Import and re-export all singleton instances
import authService from './AuthService';
import postService from './PostService';
import productService from './ProductService';
import favoriteService from './FavoriteService';
import reviewService from './ReviewService';
import priceAlertService from './PriceAlertService';
import supportDataService from './SupportDataService';

// Export singleton instances for direct use
export {
  authService,
  postService,
  productService,
  favoriteService,
  reviewService,
  priceAlertService,
  supportDataService,
};

/**
 * Object containing all service instances
 * Useful for dependency injection or testing
 */
export const services = {
  auth: authService,
  post: postService,
  product: productService,
  favorite: favoriteService,
  review: reviewService,
  priceAlert: priceAlertService,
  supportData: supportDataService,
} as const;
