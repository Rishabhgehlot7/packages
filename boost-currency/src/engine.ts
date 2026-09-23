/**
 * @boostengine/currency - Core Engine Implementation
 */

import {
  CurrencyMetadata,
  RoundingStrategy,
  ExchangeRatesConfig,
  MarketPricingRule,
  FormatPriceOptions,
  ConvertedPrice,
  CurrencyEngineConfig
} from './types';

/**
 * Built-in standard ISO currency dictionary
 */
export const DEFAULT_CURRENCIES: Record<string, CurrencyMetadata> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: false
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: false
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: ',',
    thousandsSeparator: '.',
    spaceAfterSymbol: true
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: false
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: true
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    name: 'Saudi Riyal',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: true
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: false
  },
  AUD: {
    code: 'AUD',
    symbol: 'AU$',
    name: 'Australian Dollar',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: false
  },
  SGD: {
    code: 'SGD',
    symbol: 'SG$',
    name: 'Singapore Dollar',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: false
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    symbolPosition: 'prefix',
    decimalDigits: 0,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: false
  },
  QAR: {
    code: 'QAR',
    symbol: 'QAR',
    name: 'Qatari Riyal',
    symbolPosition: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: true
  },
  KWD: {
    code: 'KWD',
    symbol: 'KWD',
    name: 'Kuwaiti Dinar',
    symbolPosition: 'prefix',
    decimalDigits: 3,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    spaceAfterSymbol: true
  }
};

/**
 * Standard ISO Country Code to Currency Code mapping
 */
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  UK: 'GBP',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  AE: 'AED',
  SA: 'SAR',
  CA: 'CAD',
  AU: 'AUD',
  SG: 'SGD',
  JP: 'JPY',
  QA: 'QAR',
  KW: 'KWD'
};

export class CurrencyEngine {
  private baseCurrency: string;
  private rates: Map<string, number> = new Map();
  private currencies: Map<string, CurrencyMetadata> = new Map();
  private marketRules: Map<string, MarketPricingRule> = new Map();
  private defaultRounding: RoundingStrategy;
  private fxBufferPercentage: number;

  constructor(config: Partial<CurrencyEngineConfig> = {}) {
    this.baseCurrency = config.baseCurrency || 'INR';
    this.defaultRounding = config.defaultRounding || 'none';
    this.fxBufferPercentage = config.fxBufferPercentage || 0;

    // Load default currencies
    for (const [code, meta] of Object.entries(DEFAULT_CURRENCIES)) {
      this.currencies.set(code, meta);
    }

    // Default rates relative to INR
    const defaultRates: Record<string, number> = {
      INR: 1.0,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      AED: 0.044,
      SAR: 0.045,
      CAD: 0.016,
      AUD: 0.018,
      SGD: 0.016,
      JPY: 1.85,
      QAR: 0.044,
      KWD: 0.0037
    };

    const initialRates = { ...defaultRates, ...(config.customRates || {}) };
    for (const [code, rate] of Object.entries(initialRates)) {
      this.rates.set(code.toUpperCase(), rate);
    }

    if (config.marketRules) {
      for (const rule of config.marketRules) {
        this.marketRules.set(rule.countryCode.toUpperCase(), rule);
      }
    }
  }

  /**
   * Get metadata for a currency code
   */
  public getCurrencyMetadata(code: string): CurrencyMetadata {
    const upper = code.toUpperCase();
    const meta = this.currencies.get(upper);
    if (meta) return meta;

    return {
      code: upper,
      symbol: upper,
      name: upper,
      symbolPosition: 'prefix',
      decimalDigits: 2,
      decimalSeparator: '.',
      thousandsSeparator: ',',
      spaceAfterSymbol: true
    };
  }

  /**
   * Detects currency code from ISO country code
   */
  public detectCurrencyFromCountry(countryCode: string): string {
    const upper = countryCode.toUpperCase();
    return COUNTRY_TO_CURRENCY[upper] || this.baseCurrency;
  }

  /**
   * Update exchange rates dynamically
   */
  public updateRates(ratesConfig: Partial<ExchangeRatesConfig>): void {
    if (ratesConfig.baseCurrency) {
      this.baseCurrency = ratesConfig.baseCurrency.toUpperCase();
    }
    if (ratesConfig.rates) {
      for (const [code, rate] of Object.entries(ratesConfig.rates)) {
        this.rates.set(code.toUpperCase(), rate);
      }
    }
  }

  /**
   * Calculate conversion exchange rate between any two currencies
   */
  public getExchangeRate(fromCurrency: string, toCurrency: string): number {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();

    if (from === to) return 1.0;

    const fromRate = this.rates.get(from);
    const toRate = this.rates.get(to);

    if (!fromRate || !toRate) {
      throw new Error(`Missing exchange rate for conversion from ${from} to ${to}.`);
    }

    // Rate = toRate / fromRate
    return toRate / fromRate;
  }

  /**
   * Applies psychological pricing and rounding rules
   */
  public applyRounding(amount: number, strategy: RoundingStrategy, decimalDigits: number = 2): number {
    if (strategy === 'none') {
      return Number(amount.toFixed(decimalDigits));
    }

    if (strategy === 'round_integer') {
      return Math.round(amount);
    }

    const integerPart = Math.floor(amount);

    if (strategy === 'round_up_99') {
      return integerPart + 0.99;
    }

    if (strategy === 'round_up_95') {
      return integerPart + 0.95;
    }

    if (strategy === 'round_up_49') {
      return integerPart + 0.49;
    }

    if (strategy === 'round_nearest_99') {
      // e.g. 1430 -> 1499, 1480 -> 1499
      const hundreds = Math.floor(amount / 100) * 100;
      return hundreds + 99;
    }

    if (strategy === 'round_nearest_49') {
      const hundreds = Math.floor(amount / 100) * 100;
      return hundreds + 49;
    }

    return Number(amount.toFixed(decimalDigits));
  }

  /**
   * Formats a raw number according to currency rules
   */
  public formatPrice(amount: number, currencyCode: string, options: FormatPriceOptions = {}): string {
    const meta = this.getCurrencyMetadata(currencyCode);
    const decimals = options.overrideDecimals !== undefined ? options.overrideDecimals : meta.decimalDigits;

    const fixed = amount.toFixed(decimals);
    const parts = fixed.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];

    // Thousands separator formatting
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, meta.thousandsSeparator);

    const formattedNumber = decimalPart !== undefined && decimals > 0
      ? `${integerPart}${meta.decimalSeparator}${decimalPart}`
      : integerPart;

    const space = meta.spaceAfterSymbol ? ' ' : '';
    let result = meta.symbolPosition === 'prefix'
      ? `${meta.symbol}${space}${formattedNumber}`
      : `${formattedNumber}${space}${meta.symbol}`;

    if (options.showCode) {
      result = `${result} ${meta.code}`;
    }

    return result;
  }

  /**
   * Converts amount between currencies with market markup, rounding, and formatting
   */
  public convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    options: {
      rounding?: RoundingStrategy;
      applyBuffer?: boolean;
      countryCode?: string;
    } = {}
  ): ConvertedPrice {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();
    const meta = this.getCurrencyMetadata(to);

    const baseRate = this.getExchangeRate(from, to);

    // Check market rules for country
    let markup = options.applyBuffer ? this.fxBufferPercentage : 0;
    let rounding = options.rounding || this.defaultRounding;

    if (options.countryCode) {
      const marketRule = this.marketRules.get(options.countryCode.toUpperCase());
      if (marketRule) {
        if (marketRule.markupPercentage) markup += marketRule.markupPercentage;
        if (marketRule.rounding) rounding = marketRule.rounding;
      }
    }

    let effectiveRate = baseRate;
    if (markup > 0) {
      effectiveRate = effectiveRate * (1 + markup / 100);
    }

    let convertedRaw = amount * effectiveRate;
    const convertedAmount = this.applyRounding(convertedRaw, rounding, meta.decimalDigits);
    const formatted = this.formatPrice(convertedAmount, to);

    return {
      originalAmount: amount,
      originalCurrency: from,
      convertedAmount,
      targetCurrency: to,
      exchangeRate: Math.round(effectiveRate * 100000) / 100000,
      formatted,
      symbol: meta.symbol
    };
  }

  /**
   * Export state
   */
  public exportRates(): Record<string, number> {
    return Object.fromEntries(this.rates);
  }
}
