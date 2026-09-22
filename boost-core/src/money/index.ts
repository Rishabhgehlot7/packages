/**
 * @boostengine/core — Currency & Money Engine
 *
 * All monetary arithmetic is performed in *integer minor units* (cents, paise,
 * etc.) so that e-commerce totals never drift due to IEEE-754 floating-point
 * rounding. Public APIs accept and return `Money` objects expressed in major
 * units for ergonomics, while every operation round-trips through integers.
 */

import type { CurrencyCode, Money } from '../types';

/**
 * Number of minor units per major unit for a currency. Most currencies use 2
 * (cents/paise); zero-decimal currencies (JPY, KRW) use 0 and three-decimal
 * currencies (BHD, KWD, OMR) use 3.
 */
export const CURRENCY_MINOR_UNITS: Record<string, number> = {
  BHD: 3,
  KWD: 3,
  OMR: 3,
  JPY: 0,
  KRW: 0,
  VND: 0,
};

export const DEFAULT_MINOR_UNITS = 2;

/** Resolve the number of minor units (decimal places) for a currency. */
export function getMinorUnits(currency: CurrencyCode): number {
  const code = String(currency).toUpperCase();
  if (code in CURRENCY_MINOR_UNITS) return CURRENCY_MINOR_UNITS[code];
  return DEFAULT_MINOR_UNITS;
}

/** 10^n helper (n is a non-negative integer). */
function pow10(n: number): number {
  let result = 1;
  for (let i = 0; i < n; i++) result *= 10;
  return result;
}

/**
 * Convert a `Money` value to an integer count of minor units.
 * Rounding removes any sub-minor-unit remainder introduced by floats.
 */
export function toMinorUnits(money: Money): number {
  const factor = pow10(getMinorUnits(money.currency));
  return Math.round(money.amount * factor);
}

/** Build a `Money` value from an integer count of minor units. */
export function fromMinorUnits(minorUnits: number, currency: CurrencyCode): Money {
  const factor = pow10(getMinorUnits(currency));
  return { amount: minorUnits / factor, currency };
}

/** Assert that two monetary values share a currency (throws otherwise). */
export function assertSameCurrency(a: Money, b: Money): void {
  if (String(a.currency).toUpperCase() !== String(b.currency).toUpperCase()) {
    throw new Error(
      `Currency mismatch: cannot operate on ${a.currency} and ${b.currency}.`,
    );
  }
}

/** Integer-safe addition. Returns a value in the same currency. */
export function addMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  const sum = toMinorUnits(a) + toMinorUnits(b);
  return fromMinorUnits(sum, a.currency);
}

/** Integer-safe subtraction (`a - b`). Returns a value in the same currency. */
export function subtractMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  const diff = toMinorUnits(a) - toMinorUnits(b);
  return fromMinorUnits(diff, a.currency);
}

/**
 * Integer-safe multiplication by a scalar factor (e.g. quantity, tax rate).
 * The result is rounded to the currency's minor unit.
 */
export function multiplyMoney(money: Money, factor: number): Money {
  const scaled = toMinorUnits(money) * factor;
  return fromMinorUnits(Math.round(scaled), money.currency);
}

/**
 * Integer-safe division by a scalar divisor. The result is rounded to the
 * currency's minor unit. Throws if `divisor` is zero.
 */
export function divideMoney(money: Money, divisor: number): Money {
  if (divisor === 0) throw new Error('Cannot divide money by zero.');
  return fromMinorUnits(Math.round(toMinorUnits(money) / divisor), money.currency);
}

/** Negate a monetary value. */
export function negateMoney(money: Money): Money {
  return fromMinorUnits(-toMinorUnits(money), money.currency);
}

/** True when the value represents zero in minor units. */
export function isZeroMoney(money: Money): boolean {
  return toMinorUnits(money) === 0;
}

/**
 * Compare two monetary values in the same currency.
 * Returns -1, 0 or 1 for less-than, equal or greater-than.
 */
export function compareMoney(a: Money, b: Money): number {
  assertSameCurrency(a, b);
  const diff = toMinorUnits(a) - toMinorUnits(b);
  return diff < 0 ? -1 : diff > 0 ? 1 : 0;
}

/**
 * Convert a value between currencies using an exchange rate.
 *
 * `rate` expresses how many units of `targetCurrency` one unit of the source
 * currency is worth. The result is rounded to the target currency's minor unit.
 *
 * @example convertMoney({ amount: 100, currency: 'USD' }, 'INR', 83.5)
 */
export function convertMoney(
  money: Money,
  targetCurrency: CurrencyCode,
  rate: number,
): Money {
  const sourceMajor = toMinorUnits(money) / pow10(getMinorUnits(money.currency));
  const targetMajor = sourceMajor * rate;
  const factor = pow10(getMinorUnits(targetCurrency));
  return { amount: Math.round(targetMajor * factor) / factor, currency: targetCurrency };
}

export interface FormatMoneyOptions {
  locale?: string;
  /** Override the number of minor units used for display. */
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

/**
 * Format a `Money` value for display using `Intl.NumberFormat`.
 *
 * @example formatMoney({ amount: 1299.5, currency: 'INR' }) // "₹1,299.50"
 */
export function formatMoney(money: Money, options: FormatMoneyOptions = {}): string {
  const locale = options.locale ?? 'en-US';
  const minorUnits = getMinorUnits(money.currency);

  let formatter: Intl.NumberFormat;
  try {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: String(money.currency),
      minimumFractionDigits:
        options.minimumFractionDigits ?? minorUnits,
      maximumFractionDigits:
        options.maximumFractionDigits ?? minorUnits,
    });
  } catch {
    // Unknown/unsupported currency code: fall back to a plain decimal format.
    formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits:
        options.minimumFractionDigits ?? minorUnits,
      maximumFractionDigits:
        options.maximumFractionDigits ?? minorUnits,
    });
    return `${String(money.currency).toUpperCase()} ${formatter.format(money.amount)}`;
  }

  return formatter.format(money.amount);
}
