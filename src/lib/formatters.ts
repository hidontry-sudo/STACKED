import { Currency } from '@/types';

/**
 * Standard conversion rate: 1 USD = 15,000 IDR
 * $100 -> Rp 1.500.000 (exactly matching product specifications)
 */
export const USD_TO_IDR_RATE = 15000;

export interface FormatCurrencyOptions {
  /**
   * If true (default), converts base USD value to IDR when currency is 'IDR'.
   * Set to false if the number is already in IDR.
   */
  convert?: boolean;
  /**
   * Include compact suffixes (k, M for USD; rb, Jt, M for IDR)
   */
  compact?: boolean;
  /**
   * Number of decimal places (only applied to USD; IDR never shows decimal cents)
   */
  decimals?: number;
}

/**
 * Formats a monetary amount into USD or IDR.
 * For IDR, format the values without decimal cents and use Indonesian dot separators (e.g., Rp 1.500.000).
 */
export function formatCurrency(
  value: number | undefined | null,
  currency: Currency = 'USD',
  options?: FormatCurrencyOptions
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return currency === 'IDR' ? 'Rp 0' : '$0';
  }

  const shouldConvert = options?.convert ?? true;
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  if (currency === 'IDR') {
    const rawIdr = shouldConvert ? Math.round(absValue * USD_TO_IDR_RATE) : Math.round(absValue);

    if (options?.compact) {
      if (rawIdr >= 1_000_000_000) {
        return `${isNegative ? '-' : ''}Rp ${(rawIdr / 1_000_000_000).toFixed(1).replace('.', ',')}M`;
      }
      if (rawIdr >= 1_000_000) {
        const val = (rawIdr / 1_000_000).toFixed(1).replace('.0', '').replace('.', ',');
        return `${isNegative ? '-' : ''}Rp ${val}Jt`;
      }
      if (rawIdr >= 1_000) {
        return `${isNegative ? '-' : ''}Rp ${(rawIdr / 1_000).toFixed(0)}rb`;
      }
      return `${isNegative ? '-' : ''}Rp ${rawIdr.toLocaleString('id-ID')}`;
    }

    // Indonesian format: dot separator, no decimal cents (e.g. Rp 1.500.000)
    const formatted = rawIdr.toLocaleString('id-ID');
    return `${isNegative ? '-' : ''}Rp ${formatted}`;
  }

  // USD Formatting
  if (options?.compact) {
    if (absValue >= 1_000_000) {
      const val = (absValue / 1_000_000).toFixed(1).replace('.0', '');
      return `${isNegative ? '-' : ''}$${val}M`;
    }
    if (absValue >= 1_000) {
      const val = (absValue / 1_000).toFixed(0);
      return `${isNegative ? '-' : ''}$${val}k`;
    }
  }

  const decimals = options?.decimals ?? 0;
  if (decimals > 0) {
    const formatted = absValue.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${isNegative ? '-' : ''}$${formatted}`;
  }

  const formatted = Math.round(absValue).toLocaleString('en-US');
  return `${isNegative ? '-' : ''}$${formatted}`;
}

/**
 * Convenient compact formatter for charts and axis ticks
 */
export function formatCurrencyCompact(
  value: number | undefined | null,
  currency: Currency = 'USD',
  convert: boolean = true
): string {
  return formatCurrency(value, currency, { compact: true, convert });
}
