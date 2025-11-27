/**
 * usePriceRecommendation Hook
 *
 * Custom React hook for managing price recommendations.
 * Handles fetching, state management, and user interactions.
 */

import { useState, useEffect, useCallback } from 'react';
import PricingService from '../data/services/PricingService';
import {
  PriceRecommendation,
  RecommendationType,
  SuggestedPriceResponse,
} from '../data/types/pricing.types';

interface UsePriceRecommendationOptions {
  productName: string;
  pricePerKg: number;
  category?: string;
  userId?: number;
  autoFetch?: boolean;
  debounceMs?: number;
}

interface UsePriceRecommendationReturn {
  recommendation: PriceRecommendation | null;
  suggestedPrice: SuggestedPriceResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchRecommendation: () => Promise<void>;
  fetchSuggestedPrice: () => Promise<void>;
  acceptRecommendation: () => number | null;
  dismissRecommendation: () => void;
  isOptimal: boolean;
  isPriceTooHigh: boolean;
  isPriceTooLow: boolean;
}

export const usePriceRecommendation = ({
  productName,
  pricePerKg,
  category,
  userId,
  autoFetch = true,
  debounceMs = 500,
}: UsePriceRecommendationOptions): UsePriceRecommendationReturn => {
  const [recommendation, setRecommendation] = useState<PriceRecommendation | null>(
    null
  );
  const [suggestedPrice, setSuggestedPrice] =
    useState<SuggestedPriceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce timer
  useEffect(() => {
    if (!autoFetch || !productName || pricePerKg <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      fetchRecommendation();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [productName, pricePerKg, category, autoFetch, debounceMs]);

  /**
   * Fetch price recommendation
   */
  const fetchRecommendation = useCallback(async () => {
    if (!productName || pricePerKg <= 0) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await PricingService.checkPrice({
        product_name: productName,
        price_per_kg: pricePerKg,
        user_id: userId,
        category,
      });

      setRecommendation(result);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener recomendación';
      setError(errorMessage);
      console.error('Price recommendation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [productName, pricePerKg, category, userId]);

  /**
   * Fetch suggested optimal price
   */
  const fetchSuggestedPrice = useCallback(async () => {
    if (!productName) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await PricingService.getSuggestedPrice(productName, category);

      setSuggestedPrice(result);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener precio sugerido';
      setError(errorMessage);
      console.error('Suggested price error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [productName, category]);

  /**
   * Accept recommendation and return the recommended price
   */
  const acceptRecommendation = useCallback((): number | null => {
    if (!recommendation?.market_avg_price) {
      return null;
    }

    return recommendation.market_avg_price;
  }, [recommendation]);

  /**
   * Dismiss/clear recommendation
   */
  const dismissRecommendation = useCallback(() => {
    setRecommendation(null);
    setError(null);
  }, []);

  // Computed properties
  const isOptimal =
    recommendation?.recommendation_type === RecommendationType.IN_RANGE;

  const isPriceTooHigh =
    recommendation?.recommendation_type === RecommendationType.HIGH ||
    recommendation?.recommendation_type === RecommendationType.VERY_HIGH;

  const isPriceTooLow =
    recommendation?.recommendation_type === RecommendationType.LOW ||
    recommendation?.recommendation_type === RecommendationType.VERY_LOW;

  return {
    recommendation,
    suggestedPrice,
    isLoading,
    error,
    fetchRecommendation,
    fetchSuggestedPrice,
    acceptRecommendation,
    dismissRecommendation,
    isOptimal,
    isPriceTooHigh,
    isPriceTooLow,
  };
};

export default usePriceRecommendation;
