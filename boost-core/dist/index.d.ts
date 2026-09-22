import { M as Money, C as CurrencyCode } from './index-C5jHJpOz.js';
export { A as ActionCallback, a as Address, b as BOOST_HOOKS, B as BoostEngine, c as BoostEngineConfig, d as BoostEngineImpl, e as BoostHookSystem, f as BoostPlugin, g as BoostPluginEngine, h as Customer, D as DOMAIN_EVENTS, i as DOMAIN_NAMESPACES, j as DomainNamespace, E as EngineInspection, k as EngineState, l as EventBus, m as EventBusImpl, n as EventBusOptions, o as EventEnvelope, p as EventListener, F as FilterCallback, H as HookSystem, L as LineItem, O as Order, q as OrderStatus, P as PaymentSession, r as PaymentStatus, s as PluginCategory, t as PluginContext, u as PluginHealthReport, v as PluginStatus, w as PriceBreakdown, R as RegisteredAction, x as RegisteredFilter, y as RegisteredPlugin, S as StateUpdater, z as Store, G as StoreListener, I as addAction, J as addFilter, K as applyFilters, N as boostCore, Q as createBoostEngine, T as createEventBus, U as createHooks, V as createStore, W as derive, X as doAction, Y as getDefaultEngine, Z as getDefaultHooks, _ as getState, $ as hasAction, a0 as hasFilter, a1 as matchesPattern, a2 as registerPlugin, a3 as removeAction, a4 as removeAllHooks, a5 as removeFilter, a6 as setState, a7 as subscribe } from './index-C5jHJpOz.js';

/**
 * @boostengine/core — Currency & Money Engine
 *
 * All monetary arithmetic is performed in *integer minor units* (cents, paise,
 * etc.) so that e-commerce totals never drift due to IEEE-754 floating-point
 * rounding. Public APIs accept and return `Money` objects expressed in major
 * units for ergonomics, while every operation round-trips through integers.
 */

/**
 * Number of minor units per major unit for a currency. Most currencies use 2
 * (cents/paise); zero-decimal currencies (JPY, KRW) use 0 and three-decimal
 * currencies (BHD, KWD, OMR) use 3.
 */
declare const CURRENCY_MINOR_UNITS: Record<string, number>;
declare const DEFAULT_MINOR_UNITS = 2;
/** Resolve the number of minor units (decimal places) for a currency. */
declare function getMinorUnits(currency: CurrencyCode): number;
/**
 * Convert a `Money` value to an integer count of minor units.
 * Rounding removes any sub-minor-unit remainder introduced by floats.
 */
declare function toMinorUnits(money: Money): number;
/** Build a `Money` value from an integer count of minor units. */
declare function fromMinorUnits(minorUnits: number, currency: CurrencyCode): Money;
/** Assert that two monetary values share a currency (throws otherwise). */
declare function assertSameCurrency(a: Money, b: Money): void;
/** Integer-safe addition. Returns a value in the same currency. */
declare function addMoney(a: Money, b: Money): Money;
/** Integer-safe subtraction (`a - b`). Returns a value in the same currency. */
declare function subtractMoney(a: Money, b: Money): Money;
/**
 * Integer-safe multiplication by a scalar factor (e.g. quantity, tax rate).
 * The result is rounded to the currency's minor unit.
 */
declare function multiplyMoney(money: Money, factor: number): Money;
/**
 * Integer-safe division by a scalar divisor. The result is rounded to the
 * currency's minor unit. Throws if `divisor` is zero.
 */
declare function divideMoney(money: Money, divisor: number): Money;
/** Negate a monetary value. */
declare function negateMoney(money: Money): Money;
/** True when the value represents zero in minor units. */
declare function isZeroMoney(money: Money): boolean;
/**
 * Compare two monetary values in the same currency.
 * Returns -1, 0 or 1 for less-than, equal or greater-than.
 */
declare function compareMoney(a: Money, b: Money): number;
/**
 * Convert a value between currencies using an exchange rate.
 *
 * `rate` expresses how many units of `targetCurrency` one unit of the source
 * currency is worth. The result is rounded to the target currency's minor unit.
 *
 * @example convertMoney({ amount: 100, currency: 'USD' }, 'INR', 83.5)
 */
declare function convertMoney(money: Money, targetCurrency: CurrencyCode, rate: number): Money;
interface FormatMoneyOptions {
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
declare function formatMoney(money: Money, options?: FormatMoneyOptions): string;

export { CURRENCY_MINOR_UNITS, CurrencyCode, DEFAULT_MINOR_UNITS, type FormatMoneyOptions, Money, addMoney, assertSameCurrency, compareMoney, convertMoney, divideMoney, formatMoney, fromMinorUnits, getMinorUnits, isZeroMoney, multiplyMoney, negateMoney, subtractMoney, toMinorUnits };
