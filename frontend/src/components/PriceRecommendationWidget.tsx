/**
 * Price Recommendation Widget
 *
 * Displays intelligent price recommendations when users are creating/editing posts.
 * Shows comparison with market prices and actionable suggestions.
 */

import React, { useState, useEffect } from 'react';
import PricingService from '../data/services/PricingService';
import {
  PriceRecommendation,
  RecommendationType,
  getRecommendationColors,
  formatCOP,
} from '../data/types/pricing.types';

interface PriceRecommendationWidgetProps {
  productName: string;
  pricePerKg: number;
  category?: string;
  userId?: number;
  intent?: 'sell' | 'buy';
  onAccept?: (recommendedPrice: number) => void;
  onDismiss?: () => void;
  className?: string;
}

const PriceRecommendationWidget: React.FC<PriceRecommendationWidgetProps> = ({
  productName,
  pricePerKg,
  category,
  userId,
  intent = 'sell',
  onAccept,
  onDismiss,
  className = '',
}) => {
  console.log('🚀 PriceRecommendationWidget - COMPONENT LOADED', { productName, pricePerKg, intent });

  const [recommendation, setRecommendation] = useState<PriceRecommendation | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const isBuying = intent === 'buy';
  const userPriceLabel = isBuying ? 'Tu oferta de compra' : 'Tu precio de venta';
  const adjustButtonLabel = isBuying ? 'Ajustar oferta a' : 'Ajustar precio a';
  const keepPriceLabel = isBuying ? 'Mantener mi oferta' : 'Mantener mi precio';

  useEffect(() => {
    // Only fetch recommendation if we have required data
    if (productName && pricePerKg > 0) {
      console.log('🔍 PriceRecommendationWidget - Fetching recommendation:', {
        productName,
        pricePerKg,
        category,
        intent
      });

      // Debounce to avoid too many requests
      const timer = setTimeout(() => {
        fetchRecommendation();
      }, 800);

      return () => clearTimeout(timer);
    } else {
      console.log('⏸️ PriceRecommendationWidget - Not fetching (missing data):', {
        productName,
        pricePerKg
      });
    }
  }, [productName, pricePerKg, category, intent]);

  const fetchRecommendation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📡 PriceRecommendationWidget - Calling API with:', {
        product_name: productName,
        price_per_kg: pricePerKg,
        user_id: userId,
        category,
        context: intent,
      });

      const result = await PricingService.checkPrice({
        product_name: productName,
        price_per_kg: pricePerKg,
        user_id: userId,
        category,
        context: intent,
      });

      console.log('✅ PriceRecommendationWidget - API Response:', result);
      console.log('✅ PriceRecommendationWidget - API Response type:', typeof result);
      console.log('✅ PriceRecommendationWidget - API Response keys:', result ? Object.keys(result) : 'null/undefined');

      if (!result) {
        console.error('❌ PriceRecommendationWidget - Result is null/undefined');
        setError('El servidor no devolvió datos');
        return;
      }

      setRecommendation(result);
    } catch (err: any) {
      const errorMsg = err.message || 'Error al obtener recomendación';
      setError(errorMsg);
      console.error('❌ PriceRecommendationWidget - Error:', err);
      console.error('❌ PriceRecommendationWidget - Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRecommendation = () => {
    console.log('🎯 PriceRecommendationWidget - User clicked ACCEPT button');
    if (recommendation?.market_avg_price && onAccept) {
      console.log('💰 PriceRecommendationWidget - Calling onAccept with:', recommendation.market_avg_price);
      onAccept(recommendation.market_avg_price);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Don't render if dismissed
  if (!isVisible) {
    return null;
  }

  // Don't render if price is invalid
  if (pricePerKg <= 0) {
    console.log('⏸️ PriceRecommendationWidget - Invalid price:', pricePerKg);
    return null;
  }

  // Wait for product name
  if (!productName || productName.trim() === '') {
    console.log('⏸️ PriceRecommendationWidget - Waiting for product name...');
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm text-gray-600">
            Esperando información del producto...
          </span>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
          <span className="text-sm text-gray-600">
            Analizando precio de mercado...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`rounded-lg border border-yellow-200 bg-yellow-50 p-4 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                No pudimos analizar el precio
              </p>
              <p className="mt-1 text-xs text-yellow-700">{error}</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-yellow-500 hover:text-yellow-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // No recommendation yet
  if (!recommendation) {
    return null;
  }

  // Get color scheme based on recommendation type
  const colors = getRecommendationColors(recommendation.recommendation_type);

  // No market data available
  if (recommendation.recommendation_type === RecommendationType.NO_DATA) {
    return (
      <div className={`rounded-lg border border-blue-300 bg-blue-50 p-4 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                Análisis de precios no disponible
              </p>
              <p className="mt-1 text-xs text-blue-700">
                {recommendation.suggestion_text}
              </p>
              <div className="mt-3 rounded bg-white p-2 border border-blue-200">
                <p className="text-xs font-medium text-gray-700 mb-1">
                  💡 Sugerencia:
                </p>
                <p className="text-xs text-gray-600">
                  El tipo de producto seleccionado es muy general. Para obtener recomendaciones de precio más precisas, el sistema necesita productos específicos como:
                </p>
                <ul className="mt-2 ml-4 text-xs text-gray-600 list-disc space-y-1">
                  <li><strong>Papa Criolla</strong> - ~$4,500/kg</li>
                  <li><strong>Aguacate Hass</strong> - ~$6,500/kg</li>
                  <li><strong>Naranja</strong> - ~$2,500/kg</li>
                  <li><strong>Banano</strong> - ~$2,000/kg</li>
                  <li><strong>Mango</strong> - ~$3,500/kg</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500 italic">
                  Actualmente contamos con datos de mercado para 5 productos. Pronto agregaremos más.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 text-blue-400 hover:text-blue-600 flex-shrink-0"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Main recommendation display
  return (
    <div
      className={`rounded-lg border-l-4 ${colors.border} ${colors.bg} p-4 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="mb-3 flex items-center space-x-2">
            <span className="text-2xl">{colors.icon}</span>
            <h3 className={`text-sm font-bold ${colors.text}`}>
              Análisis de Precio de Mercado
            </h3>
          </div>

          {/* Price Comparison */}
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div className="rounded bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">{userPriceLabel}</p>
              <p className="text-lg font-bold text-gray-800">
                {formatCOP(recommendation.user_price)}/kg
              </p>
            </div>
            <div className="rounded bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">Promedio mercado</p>
              <p className="text-lg font-bold text-purple-600">
                {formatCOP(recommendation.market_avg_price || 0)}/kg
              </p>
            </div>
          </div>

          {/* Difference Badge */}
          {recommendation.difference_percentage !== undefined && (
            <div className="mb-3 inline-block rounded-full bg-white px-3 py-1 shadow-sm">
              <span className={`text-sm font-semibold ${colors.text}`}>
                {recommendation.difference_percentage > 0 ? '+' : ''}
                {recommendation.difference_percentage.toFixed(1)}% vs. mercado
              </span>
            </div>
          )}

          {/* Recommendation Text */}
          <div className="mb-3 rounded bg-white p-3 shadow-sm">
            <p className="text-sm text-gray-700">
              {recommendation.suggestion_text}
            </p>
          </div>

          {/* Price Range */}
          {recommendation.market_min_price && recommendation.market_max_price && (
            <div className="mb-3 text-xs text-gray-600">
              <p>
                Rango de mercado:{' '}
                <span className="font-medium">
                  {formatCOP(recommendation.market_min_price)} -{' '}
                  {formatCOP(recommendation.market_max_price)}
                </span>
              </p>
              {recommendation.data_points && (
                <p className="mt-1">
                  Basado en {recommendation.data_points} registros de los últimos{' '}
                  {recommendation.period_days || 30} días
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Show accept button if price is not optimal */}
            {recommendation.recommendation_type !== RecommendationType.IN_RANGE &&
              recommendation.market_avg_price && (
                <button
                  onClick={handleAcceptRecommendation}
                  className="rounded bg-purple-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-purple-700"
                >
                  {adjustButtonLabel} {formatCOP(recommendation.market_avg_price)}
                </button>
              )}

            {/* Keep my price button */}
            <button
              onClick={handleDismiss}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              {keepPriceLabel}
            </button>
          </div>

          {/* Normalization Info */}
          {recommendation.normalization && (
            <div className="mt-3 text-xs text-gray-500">
              <p>
                Producto identificado:{' '}
                <span className="font-medium">
                  {recommendation.product?.name}
                </span>
                {recommendation.normalization.variation && (
                  <span> ({recommendation.normalization.variation})</span>
                )}
              </p>
              <p>
                Confianza de coincidencia:{' '}
                <span
                  className={`font-medium ${
                    recommendation.normalization.confidence >= 0.9
                      ? 'text-green-600'
                      : recommendation.normalization.confidence >= 0.7
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {(recommendation.normalization.confidence * 100).toFixed(0)}%
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="ml-2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PriceRecommendationWidget;
