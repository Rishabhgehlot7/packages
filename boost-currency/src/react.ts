/**
 * @boostengine/currency - React Hooks for Multi-Currency Storefronts
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { CurrencyEngine, DEFAULT_CURRENCIES, COUNTRY_TO_CURRENCY } from './engine';
import {
  CurrencyEngineConfig,
  RoundingStrategy,
  ConvertedPrice,
  FormatPriceOptions,
  CurrencyMetadata
} from './types';

export interface UseCurrencyOptions extends Partial<CurrencyEngineConfig> {
  initialCurrency?: string;
  autoDetectGeo?: boolean;
}

export function useCurrency(options: UseCurrencyOptions = {}) {
  const [engine] = useState(() => new CurrencyEngine(options));
  const [currentCurrency, setCurrentCurrency] = useState<string>(
    options.initialCurrency || options.baseCurrency || 'INR'
  );
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  // Auto-detect Geo-IP currency if enabled (browser locale/timezone approximation or header)
  useEffect(() => {
    if (options.autoDetectGeo && typeof window !== 'undefined') {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        let detected = 'IN';
        if (timeZone.includes('New_York') || timeZone.includes('Los_Angeles') || timeZone.includes('Chicago')) {
          detected = 'US';
        } else if (timeZone.includes('London')) {
          detected = 'GB';
        } else if (timeZone.includes('Dubai')) {
          detected = 'AE';
        } else if (timeZone.includes('Berlin') || timeZone.includes('Paris')) {
          detected = 'DE';
        } else if (timeZone.includes('Tokyo')) {
          detected = 'JP';
        } else if (timeZone.includes('Sydney')) {
          detected = 'AU';
        } else if (timeZone.includes('Singapore')) {
          detected = 'SG';
        }

        setDetectedCountry(detected);
        const autoCurr = engine.detectCurrencyFromCountry(detected);
        if (autoCurr) {
          setCurrentCurrency(autoCurr);
        }
      } catch {
        // Fallback silently
      }
    }
  }, [options.autoDetectGeo, engine]);

  const currentMetadata = useMemo<CurrencyMetadata>(() => {
    return engine.getCurrencyMetadata(currentCurrency);
  }, [engine, currentCurrency]);

  const availableCurrencies = useMemo(() => {
    return Object.values(DEFAULT_CURRENCIES);
  }, []);

  const formatPrice = useCallback((amount: number, overrideOptions?: FormatPriceOptions): string => {
    return engine.formatPrice(amount, currentCurrency, overrideOptions);
  }, [engine, currentCurrency]);

  const convertPrice = useCallback((
    amount: number,
    fromCurrency?: string,
    rounding?: RoundingStrategy
  ): ConvertedPrice => {
    const from = fromCurrency || options.baseCurrency || 'INR';
    return engine.convert(amount, from, currentCurrency, { rounding });
  }, [engine, currentCurrency, options.baseCurrency]);

  const switchCurrency = useCallback((code: string) => {
    setCurrentCurrency(code.toUpperCase());
  }, []);

  return {
    currentCurrency,
    currentMetadata,
    switchCurrency,
    detectedCountry,
    availableCurrencies,
    formatPrice,
    convertPrice,
    baseCurrency: options.baseCurrency || 'INR'
  };
}
