/**
 * @boostengine/core — Shared Type Primitives
 *
 * Universal, framework-agnostic data models used across the BoostEngine
 * ecosystem. These primitives are intentionally dependency-free so every
 * `@boostengine/*` package can share a single source of truth for money,
 * customers, line items, orders and payments.
 */

/**
 * ISO 4217 currency code. The union lists the currencies BoostEngine ships
 * with first-class support for; the `(string & {})` escape hatch keeps the
 * type permissive for stores operating in additional markets.
 */
export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'JPY'
  | 'AUD'
  | 'CAD'
  | 'SGD'
  | 'AED'
  | 'SAR'
  | 'CNY'
  | 'HKD'
  | 'NZD'
  | 'CHF'
  | 'SEK'
  | 'NOK'
  | 'DKK'
  | 'PLN'
  | 'MXN'
  | 'BRL'
  | 'ZAR'
  | 'KRW'
  | 'THB'
  | 'MYR'
  | 'IDR'
  | 'PHP'
  | 'VND'
  | 'BDT'
  | 'PKR'
  | 'LKR'
  | 'NPR'
  | 'EGP'
  | 'NGN'
  | 'KES'
  | (string & {});

/**
 * A monetary value. `amount` is expressed in the currency's *major* unit
 * (e.g. `19.99` for ₹19.99 or $19.99). Use the integer-safe helpers in the
 * money engine (`addMoney`, `subtractMoney`, …) for arithmetic instead of raw
 * floating-point operators.
 */
export interface Money {
  /** Value in the major currency unit (e.g. `19.99`). */
  amount: number;
  /** ISO 4217 currency code. */
  currency: CurrencyCode;
}

/** A full, line-item-level price decomposition for a cart or order. */
export interface PriceBreakdown {
  subtotal: Money;
  discount: Money;
  shipping: Money;
  tax: Money;
  total: Money;
}

/** Physical or billing address. */
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2 country code. */
  country: string;
  phone?: string;
  recipient?: string;
}

/** A store customer / shopper. */
export interface Customer {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Address[];
  metadata?: Record<string, any>;
}

/** A single line in a cart or order. */
export interface LineItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  sku?: string;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
  discount?: Money;
  tax?: Money;
  metadata?: Record<string, any>;
}

/** Order lifecycle status. */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'failed';

/** A store order. */
export interface Order {
  id: string;
  orderNumber?: string;
  customer: Customer;
  items: LineItem[];
  subtotal: Money;
  shipping?: Money;
  tax?: Money;
  discount?: Money;
  total: Money;
  currency: CurrencyCode;
  status?: OrderStatus;
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  metadata?: Record<string, any>;
}

/** Payment lifecycle status. */
export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'cancelled';

/** A payment attempt / session against an order. */
export interface PaymentSession {
  id: string;
  orderId?: string;
  /** Payment provider (e.g. `razorpay`, `stripe`, `paypal`). */
  provider: string;
  status: PaymentStatus;
  amount: Money;
  currency: CurrencyCode;
  method?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  metadata?: Record<string, any>;
}

/** Plugin category taxonomy. */
export type PluginCategory =
  | 'marketing'
  | 'operations'
  | 'payments'
  | 'sales'
  | 'engagement'
  | 'analytics'
  | 'inventory';

/** Runtime context handed to a plugin during its lifecycle. */
export interface PluginContext {
  storeId?: string;
  config: Record<string, any>;
  env?: Record<string, string>;
}
