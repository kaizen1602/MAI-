/**
 * Pricing Service
 *
 * Handles all intelligent pricing operations:
 * - Price recommendations
 * - Product catalog search and normalization
 * - Market price data
 * - Trend analysis
 *
 * Following Single Responsibility Principle (SOLID)
 */

import { BaseService } from './base/BaseService';
import { ENDPOINTS } from '../api/endpoints';
import {
  PriceRecommendation,
  CheckPriceRequest,
  SuggestedPriceResponse,
  ProductSearchResponse,
  NormalizeProductRequest,
  NormalizeProductResponse,
  ProductCatalog,
  ProductCatalogFilters,
  CategorySummary,
  UserRecommendationsResponse,
  RecommendationStats,
  UpdateRecommendationRequest,
  MarketOverviewResponse,
  TrendFilters,
  VolatileProduct,
  TrendingProduct,
  PriceHistoryResponse,
  MarketPriceFilters,
  ProductTrendData,
} from '../types/pricing.types';

class PricingService extends BaseService {
  // ============================================
  // RECOMMENDATION ENDPOINTS
  // ============================================

  /**
   * Check price and get recommendation
   *
   * @param request - Price check request data
   * @returns Price recommendation with comparison
   */
  async checkPrice(request: CheckPriceRequest): Promise<PriceRecommendation> {
    try {
      const response = await this.client.post(ENDPOINTS.PRICING.CHECK_PRICE, request);
      
      // El endpoint devuelve directamente los datos, no en response.data.data
      if (response.data && typeof response.data === 'object') {
        // Si tiene success: false, lanzar error con el mensaje
        if (response.data.success === false) {
          throw new Error(response.data.message || 'No encontramos este producto en nuestro catálogo.');
        }
        
        // Si tiene success: true, devolver los datos directamente
        if (response.data.success === true) {
          return response.data as PriceRecommendation;
        }
        
        // Si no tiene success, asumir que es la respuesta directa
        return response.data as PriceRecommendation;
      }
      
      return response.data;
    } catch (error: any) {
      // Si es un error de autenticación, intentar sin user_id
      if (error.response?.status === 401 && request.user_id) {
        const requestWithoutUser = { ...request };
        delete requestWithoutUser.user_id;
        return this.checkPrice(requestWithoutUser);
      }
      throw error;
    }
  }

  /**
   * Get suggested optimal price for a product
   *
   * @param productName - Product name to check
   * @param category - Optional product category
   * @returns Suggested price with range and trend
   */
  async getSuggestedPrice(
    productName: string,
    category?: string
  ): Promise<SuggestedPriceResponse> {
    const params = new URLSearchParams({ product_name: productName });
    if (category) params.append('category', category);

    return this.handleRequest<SuggestedPriceResponse>(
      this.client.get(`${ENDPOINTS.PRICING.SUGGESTED_PRICE}?${params}`)
    );
  }

  /**
   * Get user's recommendation history
   *
   * @param limit - Number of recommendations per page
   * @param page - Page number
   * @returns Paginated recommendations with acceptance rate
   */
  async getMyRecommendations(
    limit: number = 20,
    page: number = 1
  ): Promise<UserRecommendationsResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
    });

    return this.handleRequest<UserRecommendationsResponse>(
      this.client.get(`${ENDPOINTS.PRICING.MY_RECOMMENDATIONS}?${params}`)
    );
  }

  /**
   * Get recommendation statistics
   *
   * @param userId - Optional user ID for user-specific stats
   * @returns Recommendation statistics and acceptance rates
   */
  async getRecommendationStats(
    userId?: number
  ): Promise<{ success: boolean; stats: RecommendationStats }> {
    const params = userId
      ? new URLSearchParams({ user_id: userId.toString() })
      : '';

    return this.handleRequest<{ success: boolean; stats: RecommendationStats }>(
      this.client.get(`${ENDPOINTS.PRICING.RECOMMENDATION_STATS}${params ? '?' + params : ''}`)
    );
  }

  /**
   * Update a recommendation (mark as accepted/rejected)
   *
   * @param recommendationId - Recommendation ID
   * @param data - Update data
   * @returns Updated recommendation
   */
  async updateRecommendation(
    recommendationId: number,
    data: UpdateRecommendationRequest
  ): Promise<{ success: boolean; message: string; data: any }> {
    return this.handleRequest<{ success: boolean; message: string; data: any }>(
      this.client.put(ENDPOINTS.PRICING.UPDATE_RECOMMENDATION(recommendationId), data)
    );
  }

  // ============================================
  // PRODUCT CATALOG ENDPOINTS
  // ============================================

  /**
   * Search products with fuzzy matching
   *
   * @param query - Search query
   * @param category - Optional category filter
   * @param limit - Max results
   * @returns Matching products with similarity scores
   */
  async searchProducts(
    query: string,
    category?: string,
    limit: number = 20
  ): Promise<ProductSearchResponse> {
    const params = new URLSearchParams({ query, limit: limit.toString() });
    if (category) params.append('category', category);

    return this.handleRequest<ProductSearchResponse>(
      this.client.get(`${ENDPOINTS.PRICING.CATALOG_SEARCH}?${params}`)
    );
  }

  /**
   * Normalize a product name to catalog
   *
   * @param request - Product name and optional category
   * @returns Normalized product or suggestions
   */
  async normalizeProduct(
    request: NormalizeProductRequest
  ): Promise<NormalizeProductResponse> {
    return this.handleRequest<NormalizeProductResponse>(
      this.client.post(ENDPOINTS.PRICING.CATALOG_NORMALIZE, request)
    );
  }

  /**
   * Get all product categories
   *
   * @returns List of categories with product counts
   */
  async getCategories(): Promise<{
    success: boolean;
    total: number;
    categories: CategorySummary[];
  }> {
    return this.handleRequest<{
      success: boolean;
      total: number;
      categories: CategorySummary[];
    }>(this.client.get(ENDPOINTS.PRICING.CATALOG_CATEGORIES));
  }

  /**
   * Get products by category
   *
   * @param category - Category name
   * @returns Products in category with statistics
   */
  async getProductsByCategory(category: string): Promise<{
    success: boolean;
    category: string;
    total_products: number;
    products: ProductCatalog[];
    statistics: {
      products_with_prices: number;
      avg_price: number;
      min_price: number;
      max_price: number;
    };
  }> {
    return this.handleRequest(
      this.client.get(`/catalog/category/${encodeURIComponent(category)}`)
    );
  }

  /**
   * Get product by ID
   *
   * @param productId - Product catalog ID
   * @returns Product details with price statistics
   */
  async getProductById(productId: number): Promise<{
    success: boolean;
    product: ProductCatalog;
    latest_price: any;
    price_statistics: {
      avg_price: number;
      min_price: number;
      max_price: number;
      data_points: number;
    };
  }> {
    return this.handleRequest(this.client.get(`/catalog/products/${productId}`));
  }

  /**
   * List all products with filters
   *
   * @param filters - Filter options
   * @returns Paginated product list
   */
  async listProducts(filters?: ProductCatalogFilters): Promise<{
    success: boolean;
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    products: ProductCatalog[];
  }> {
    let url = '/catalog/products';

    if (filters) {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.is_active !== undefined)
        params.append('is_active', filters.is_active.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.page) params.append('page', filters.page.toString());

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }

    return this.handleRequest(this.client.get(url));
  }

  // ============================================
  // MARKET PRICE ENDPOINTS
  // ============================================

  /**
   * Get latest market prices
   *
   * @param days - Days to look back (default: 7)
   * @returns Latest prices grouped by product
   */
  async getLatestPrices(days: number = 7): Promise<{
    success: boolean;
    period: string;
    from: string;
    to: string;
    total_products: number;
    products: any[];
  }> {
    return this.handleRequest(
      this.client.get(`/market-prices/latest?days=${days}`)
    );
  }

  /**
   * Get price history for a product
   *
   * @param productId - Product catalog ID
   * @param days - Historical period (default: 30)
   * @returns Daily aggregated price history
   */
  async getPriceHistory(
    productId: number,
    days: number = 30
  ): Promise<PriceHistoryResponse> {
    return this.handleRequest<PriceHistoryResponse>(
      this.client.get(`/market-prices/history/${productId}?days=${days}`)
    );
  }

  /**
   * Get prices by specific date
   *
   * @param date - Date in YYYY-MM-DD format
   * @returns All prices for that date
   */
  async getPricesByDate(date: string): Promise<{
    success: boolean;
    date: string;
    total: number;
    prices: any[];
  }> {
    return this.handleRequest(this.client.get(`/market-prices/date/${date}`));
  }

  // ============================================
  // TREND & ANALYTICS ENDPOINTS
  // ============================================

  /**
   * Get market overview statistics
   *
   * @param days - Analysis period (default: 30)
   * @returns Comprehensive market statistics
   */
  async getMarketOverview(days: number = 30): Promise<MarketOverviewResponse> {
    return this.handleRequest<MarketOverviewResponse>(
      this.client.get(`/trends/market-overview?days=${days}`)
    );
  }

  /**
   * Get trend analysis for a product
   *
   * @param productId - Product catalog ID
   * @param days - Analysis period (default: 30)
   * @returns Product trend data
   */
  async getProductTrend(productId: number, days: number = 30): Promise<{
    success: boolean;
    product: ProductCatalog;
    period_days: number;
    latest_trend: ProductTrendData;
    historical_trends: ProductTrendData[];
    daily_prices: any[];
  }> {
    return this.handleRequest(
      this.client.get(`/trends/product/${productId}?days=${days}`)
    );
  }

  /**
   * Get category trend analysis
   *
   * @param category - Category name
   * @param days - Analysis period (default: 30)
   * @returns Category trend data
   */
  async getCategoryTrend(category: string, days: number = 30): Promise<{
    success: boolean;
    category: string;
    period_days: number;
    total_products: number;
    category_statistics: {
      avg_price: number;
      min_price: number;
      max_price: number;
    };
    products: ProductCatalog[];
  }> {
    return this.handleRequest(
      this.client.get(
        `/trends/category/${encodeURIComponent(category)}?days=${days}`
      )
    );
  }

  /**
   * Get volatile products (high price volatility)
   *
   * @param filters - Filter options
   * @returns Products with highest volatility
   */
  async getVolatileProducts(filters?: TrendFilters): Promise<{
    success: boolean;
    period_days: number;
    total: number;
    volatile_products: VolatileProduct[];
  }> {
    const params = new URLSearchParams();
    if (filters?.days) params.append('days', filters.days.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/trends/volatile-products${queryString ? '?' + queryString : ''}`;

    return this.handleRequest(this.client.get(url));
  }

  /**
   * Get stable products (low price volatility)
   *
   * @param filters - Filter options
   * @returns Products with lowest volatility
   */
  async getStableProducts(filters?: TrendFilters): Promise<{
    success: boolean;
    period_days: number;
    total: number;
    stable_products: VolatileProduct[];
  }> {
    const params = new URLSearchParams();
    if (filters?.days) params.append('days', filters.days.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/trends/stable-products${queryString ? '?' + queryString : ''}`;

    return this.handleRequest(this.client.get(url));
  }

  /**
   * Get products with increasing prices
   *
   * @param filters - Filter options
   * @returns Products with trending up prices
   */
  async getIncreasingPrices(filters?: TrendFilters): Promise<{
    success: boolean;
    period_days: number;
    total: number;
    increasing_products: TrendingProduct[];
  }> {
    const params = new URLSearchParams();
    if (filters?.days) params.append('days', filters.days.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/trends/increasing-prices${queryString ? '?' + queryString : ''}`;

    return this.handleRequest(this.client.get(url));
  }

  /**
   * Get products with decreasing prices
   *
   * @param filters - Filter options
   * @returns Products with trending down prices
   */
  async getDecreasingPrices(filters?: TrendFilters): Promise<{
    success: boolean;
    period_days: number;
    total: number;
    decreasing_products: TrendingProduct[];
  }> {
    const params = new URLSearchParams();
    if (filters?.days) params.append('days', filters.days.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/trends/decreasing-prices${queryString ? '?' + queryString : ''}`;

    return this.handleRequest(this.client.get(url));
  }

  /**
   * Compare price between two dates
   *
   * @param productId - Product catalog ID
   * @param date1 - First date (YYYY-MM-DD)
   * @param date2 - Second date (YYYY-MM-DD)
   * @returns Price comparison data
   */
  async comparePriceByDates(
    productId: number,
    date1: string,
    date2: string
  ): Promise<{
    success: boolean;
    product: ProductCatalog;
    comparison: {
      date1: string;
      price1: number;
      date2: string;
      price2: number;
      difference: number;
      percentage_change: number;
      trend: 'UP' | 'DOWN' | 'STABLE';
    };
  }> {
    const params = new URLSearchParams({
      product_id: productId.toString(),
      date1,
      date2,
    });

    return this.handleRequest(this.client.get(`/trends/price-comparison?${params}`));
  }
}

export default new PricingService();
