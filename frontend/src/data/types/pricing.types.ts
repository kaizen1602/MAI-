/**
 * Intelligent Pricing Module - TypeScript Types
 *
 * Type definitions for price recommendations, market data, and trends
 */

// ============================================
// RECOMMENDATION TYPES
// ============================================

export enum RecommendationType {
  VERY_LOW = 'MUY_POR_DEBAJO',
  LOW = 'POR_DEBAJO',
  IN_RANGE = 'EN_RANGO',
  HIGH = 'POR_ENCIMA',
  VERY_HIGH = 'MUY_POR_ENCIMA',
  NO_DATA = 'NO_DATA',
}

export interface PriceRecommendation {
  success: boolean;
  has_data: boolean;
  product?: ProductMatch;
  user_price: number;
  market_avg_price?: number;
  market_min_price?: number;
  market_max_price?: number;
  difference_percentage?: number;
  recommendation_type: RecommendationType;
  suggestion_text: string;
  recommendation_color: string;
  icon: string;
  data_points?: number;
  period_days?: number;
  normalization?: NormalizationInfo;
  recommendation_id?: number;
}

export interface ProductMatch {
  id: number;
  name: string;
  category: string;
}

export interface NormalizationInfo {
  confidence: number;
  matched_name: string;
  variation?: string;
}

export interface CheckPriceRequest {
  product_name: string;
  price_per_kg: number;
  user_id?: number;
  category?: string;
  context?: 'sell' | 'buy';
}

export interface SuggestedPriceResponse {
  success: boolean;
  product: ProductMatch;
  recommended_price: number;
  price_range: PriceRange;
  trend: PriceTrend;
  normalization_confidence: number;
}

export interface PriceRange {
  min: number;
  max: number;
  avg: number;
  range: number;
  volatility: number;
}

// ============================================
// PRODUCT CATALOG TYPES
// ============================================

export interface ProductCatalog {
  id: number;
  name: string;
  category: string;
  description?: string;
  aliases: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductSearchResult {
  product: ProductCatalog;
  similarity: string;
  confidence: number;
}

export interface ProductSearchResponse {
  success: boolean;
  query: string;
  total: number;
  results: ProductSearchResult[];
}

export interface NormalizeProductRequest {
  product_name: string;
  category?: string;
}

export interface NormalizeProductResponse {
  success: boolean;
  raw_name: string;
  normalized?: {
    product: ProductCatalog;
    variation?: ProductVariation;
    confidence: string;
    confidence_score: number;
  };
  suggestions?: ProductSearchResult[];
}

export interface ProductVariation {
  id: number;
  product_catalog_id: number;
  variation_name: string;
  price_modifier: number;
  is_active: boolean;
}

export interface CategorySummary {
  category: string;
  product_count: number;
}

// ============================================
// MARKET PRICE TYPES
// ============================================

export interface MarketPrice {
  id: number;
  product_catalog_id: number;
  product_variation_id?: number;
  measurement_unit_id: number;
  quantity: number;
  price_extra?: number;
  price_first?: number;
  price_unit: number;
  price_variation: 'Estable' | 'Bajo' | 'Subio';
  date: string;
  source: string;
  raw_name?: string;
  extraction_confidence?: number;
  created_at: string;
  product_catalog?: ProductCatalog;
}

export interface PriceHistory {
  date: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  data_points: number;
}

export interface PriceHistoryResponse {
  success: boolean;
  product: ProductCatalog;
  period_days: number;
  from: string;
  to: string;
  data_points: number;
  history: PriceHistory[];
}

// ============================================
// TREND TYPES
// ============================================

export enum TrendDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
  UNKNOWN = 'UNKNOWN',
}

export interface PriceTrend {
  trend: TrendDirection;
  change_percentage: number;
  recent_avg?: number;
  older_avg?: number;
  message: string;
}

export interface ProductTrendData {
  id: number;
  product_catalog_id: number;
  period_start: string;
  period_end: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  price_volatility: number;
  trend_direction: TrendDirection;
  price_change_percentage: number;
  data_points: number;
}

export interface MarketOverview {
  total_products: number;
  total_price_records: number;
  average_price: number;
  price_variation_distribution: {
    Estable: number;
    Bajo: number;
    Subio: number;
  };
  trend_distribution: {
    STABLE: number;
    UP: number;
    DOWN: number;
  };
}

export interface MarketOverviewResponse {
  success: boolean;
  period_days: number;
  from: string;
  to: string;
  latest_ingestion: string;
  overview: MarketOverview;
  categories: CategorySummary[];
}

export interface VolatileProduct {
  product: ProductCatalog;
  avg_volatility: number;
  max_volatility: number;
  avg_change_percentage: number;
  trend_records: number;
}

export interface TrendingProduct {
  product: ProductCatalog;
  avg_increase?: string;
  avg_decrease?: string;
  max_increase?: string;
  max_decrease?: string;
  avg_price: number;
}

// ============================================
// RECOMMENDATION HISTORY TYPES
// ============================================

export interface RecommendationRecord {
  id: number;
  post_id?: number;
  user_id: number;
  product_catalog_id: number;
  product_catalog?: ProductCatalog;
  user_price: number;
  market_avg_price: number;
  market_min_price?: number;
  market_max_price?: number;
  recommendation_type: RecommendationType;
  difference_percentage?: number;
  suggestion_text: string;
  was_accepted?: boolean;
  final_price?: number;
  created_at: string;
  updated_at: string;
}

export interface AcceptanceRate {
  total_recommendations: number;
  accepted: number;
  rejected: number;
  acceptance_rate: number;
}

export interface UserRecommendationsResponse {
  success: boolean;
  user_id: number;
  acceptance_rate: AcceptanceRate;
  recommendations: {
    data: RecommendationRecord[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface RecommendationStats {
  total_recommendations: number;
  by_type: {
    [key in RecommendationType]?: number;
  };
  acceptance_rate: AcceptanceRate;
}

// ============================================
// REQUEST/FILTER TYPES
// ============================================

export interface ProductCatalogFilters {
  category?: string;
  is_active?: boolean;
  limit?: number;
  page?: number;
}

export interface MarketPriceFilters {
  days?: number;
  limit?: number;
}

export interface TrendFilters {
  days?: number;
  limit?: number;
}

export interface UpdateRecommendationRequest {
  was_accepted?: boolean;
  final_price?: number;
  post_id?: number;
}

// ============================================
// CHART DATA TYPES (for visualizations)
// ============================================

export interface PriceChartDataPoint {
  date: string;
  price: number;
  label?: string;
}

export interface TrendChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
  }[];
}

export interface CategoryDistributionData {
  category: string;
  count: number;
  percentage: number;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface PriceWidgetState {
  isLoading: boolean;
  isVisible: boolean;
  recommendation: PriceRecommendation | null;
  error: string | null;
}

export interface RecommendationColor {
  bg: string;
  border: string;
  text: string;
  icon: string;
}

// Helper function to get color scheme by recommendation type
export const getRecommendationColors = (
  type: RecommendationType
): RecommendationColor => {
  const colorMap: Record<RecommendationType, RecommendationColor> = {
    [RecommendationType.VERY_LOW]: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      icon: '⚠️',
    },
    [RecommendationType.LOW]: {
      bg: 'bg-orange-50',
      border: 'border-orange-500',
      text: 'text-orange-700',
      icon: '⬇️',
    },
    [RecommendationType.IN_RANGE]: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-700',
      icon: '✅',
    },
    [RecommendationType.HIGH]: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-700',
      icon: '⬆️',
    },
    [RecommendationType.VERY_HIGH]: {
      bg: 'bg-red-50',
      border: 'border-red-700',
      text: 'text-red-900',
      icon: '🔴',
    },
    [RecommendationType.NO_DATA]: {
      bg: 'bg-gray-50',
      border: 'border-gray-400',
      text: 'text-gray-700',
      icon: 'ℹ️',
    },
  };

  return colorMap[type];
};

// Helper function to format Colombian peso
export const formatCOP = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to get trend arrow
export const getTrendArrow = (direction: TrendDirection): string => {
  const arrowMap: Record<TrendDirection, string> = {
    [TrendDirection.UP]: '↗️',
    [TrendDirection.DOWN]: '↘️',
    [TrendDirection.STABLE]: '→',
    [TrendDirection.UNKNOWN]: '?',
  };

  return arrowMap[direction];
};
