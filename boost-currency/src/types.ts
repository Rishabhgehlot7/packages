/**
 * @boostengine/currency - Type Definitions
 */

export type RoundingStrategy =
  | 'none'
  | 'round_up_99'     // e.g. 19.34 -> 19.99
  | 'round_up_95'     // e.g. 19.34 -> 19.95
  | 'round_up_49'     // e.g. 19.34 -> 19.49
  | 'round_integer'   // e.g. 19.60 -> 20.00
  | 'round_nearest_99'// e.g. 1430 -> 1499 (for high value currencies like INR, JPY)
  | 'round_nearest_49';

export interface CurrencyMetadata {
  code: string;            // ISO 4217, e.g. 'USD', 'INR', 'EUR'
  symbol: string;          // e.g. '$', '₹', '€', '£'
  name: string;            // e.g. 'US Dollar'
  symbolPosition: 'prefix' | 'suffix';
  decimalDigits: number;   // 2 for USD, 0 for JPY, 2 for INR
  decimalSeparator: string;// '.' or ','
  thousandsSeparator: string; // ',' or '.' or ' '
  spaceAfterSymbol?: boolean;
}

export interface ExchangeRatesConfig {
  baseCurrency: string;
  rates: Record<string, number>; // e.g. { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095 }
  updatedAt: string;
  provider?: string;
}

export interface MarketPricingRule {
  marketId: string;
  countryCode: string;     // ISO 3166-1 alpha-2, e.g. 'US', 'IN', 'AE'
  currencyCode: string;
  rounding: RoundingStrategy;
  markupPercentage?: number; // e.g., 3.5% FX risk buffer
  fixedShippingRate?: number;
}

export interface FormatPriceOptions {
  currencyCode?: string;
  showCode?: boolean;
  overrideDecimals?: number;
  locale?: string;
}

export interface ConvertedPrice {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  targetCurrency: string;
  exchangeRate: number;
  formatted: string;
  symbol: string;
}

export interface CurrencyEngineConfig {
  baseCurrency: string;
  supportedCurrencies?: string[];
  defaultRounding?: RoundingStrategy;
  fxBufferPercentage?: number; // Safety buffer added to conversions (e.g. 2%)
  customRates?: Record<string, number>;
  marketRules?: MarketPricingRule[];
}
