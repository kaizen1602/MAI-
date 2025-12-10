/**
 * Utility functions for formatting numbers and other data
 */

/**
 * Format a number with thousands separators
 * @param num - The number to format
 * @returns Formatted string with thousands separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-CO').format(num);
};

/**
 * Format a price in Colombian pesos
 * @param amount - The amount to format
 * @returns Formatted price string
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};
