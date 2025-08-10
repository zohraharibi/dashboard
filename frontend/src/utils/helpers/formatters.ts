/**
 * Currency formatting utilities
 */

/**
 * Formats a number or string amount with the appropriate currency symbol
 * @param amount - The amount to format (number or string)
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR', 'GBP')
 * @returns Formatted string with currency symbol and 2 decimal places
 */
export const formatCurrency = (amount: number | string, currencyCode: string): string => {
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'CHF',
    'CNY': '¥',
    'SEK': 'kr',
    'NOK': 'kr',
    'DKK': 'kr'
  };
  
  const symbol = currencySymbols[currencyCode?.toUpperCase()] || currencyCode || '$';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return `${symbol}—`;
  
  return `${symbol}${numAmount.toFixed(2)}`;
};
