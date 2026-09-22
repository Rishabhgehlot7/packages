/**
 * @boostengine/cart - Universal TypeScript eCommerce Cart Engine
 * Comprehensive type definitions for items, discounts, GST breakdown, shipping, custom fees, and storage.
 */

export interface CartItem {
  /** Unique item identifier in cart (e.g., 'prod123_size-xl' or UUID) */
  id: string;
  /** Parent product ID */
  productId: string;
  /** Variant ID if product has variants */
  variantId?: string;
  /** Display title */
  title: string;
  /** Selected variant name (e.g. "Black / XL") */
  variantTitle?: string;
  /** Unit selling price (after regular item-level discounts) */
  price: number;
  /** Original MRP / Compare-at price for savings calculation */
  compareAtPrice?: number;
  /** Quantity of this item */
  quantity: number;
  /** Maximum allowable quantity or stock available */
  maxStock?: number;
  /** Thumbnail image URL */
  image?: string;
  /** Stock Keeping Unit code */
  sku?: string;
  /** Weight in grams (useful for logistics/shipping calculation) */
  weightGrams?: number;
  /** Indian HSN (Harmonized System of Nomenclature) Code */
  hsnCode?: string;
  /** Indian GST rate percentage (e.g., 0, 5, 12, 18, 28). Default: 18 */
  taxRate?: number;
  /** If true, this item is tax exempt */
  isTaxExempt?: boolean;
  /** Custom metadata (e.g. custom engraving, gift note, vendor ID) */
  metadata?: Record<string, any>;
}

export interface StoreOriginConfig {
  /** Indian State name or 2-letter code (e.g. "Maharashtra" or "MH") */
  state: string;
  /** Store warehouse pincode */
  pincode?: string;
  /** Store 15-digit GSTIN */
  gstin?: string;
  /**
   * Tax calculation mode:
   * - 'inclusive': Product prices already include GST (Standard Indian D2C retail).
   * - 'exclusive': GST is computed and added on top of the subtotal (B2B wholesale).
   * @default 'inclusive'
   */
  taxMode?: 'inclusive' | 'exclusive';
}

export interface CustomerShippingAddress {
  /** Destination state name or 2-letter code (e.g. "Karnataka" or "KA") */
  state: string;
  /** 6-digit delivery pincode */
  pincode?: string;
  /** Delivery city */
  city?: string;
  /** Destination country code (default: 'IN') */
  country?: string;
}

export interface ShippingConfig {
  /** Minimum subtotal to qualify for free shipping (e.g. 999) */
  freeShippingThreshold?: number;
  /** Standard flat shipping charge when below threshold (e.g. 79) */
  flatShippingRate?: number;
  /** Optional free delivery promo active */
  isPromotionalFreeShipping?: boolean;
}

export interface PaymentConfig {
  /** Selected payment method */
  paymentMethod?: 'prepaid' | 'cod';
  /** Cash-on-Delivery convenience surcharge (e.g. 49) */
  codFee?: number;
  /** Instant prepaid discount percentage (e.g. 5 for 5% off) */
  prepaidDiscountPercentage?: number;
  /** Maximum cap for prepaid discount in currency units (e.g. 200) */
  prepaidDiscountMax?: number;
}

export type DiscountType = 'flat' | 'percentage' | 'free_shipping' | 'bogo' | 'tiered';

export interface TieredVolumeRule {
  /** Minimum total quantity across qualifying items (e.g. 3) */
  minQuantity: number;
  /** Percentage discount applied when reaching this tier (e.g. 20 for 20% off) */
  discountPercentage: number;
}

export interface BogoRuleConfig {
  /** Buy X units (e.g. 2) */
  buyQuantity: number;
  /** Get Y units free (e.g. 1) */
  getQuantity: number;
  /** Optional list of eligible product IDs. If omitted, all items qualify */
  eligibleProductIds?: string[];
}

export interface DiscountRule {
  /** Unique coupon code (case-insensitive, e.g. "FESTIVE10", "BUY2GET1") */
  code: string;
  /** Discount type */
  type: DiscountType;
  /**
   * Value:
   * - If type is 'flat': Amount in currency units (e.g. 200 for ₹200 off)
   * - If type is 'percentage': Percentage (e.g. 15 for 15% off)
   * - If type is 'free_shipping', 'bogo', 'tiered': Calculated dynamically
   */
  value?: number;
  /** Minimum order subtotal required to apply coupon */
  minOrderValue?: number;
  /** Maximum discount amount cap for percentage discounts (e.g. 500) */
  maxDiscount?: number;
  /** BOGO configuration when type is 'bogo' */
  bogoConfig?: BogoRuleConfig;
  /** Tiered quantity volume rules when type is 'tiered' */
  tieredRules?: TieredVolumeRule[];
  /** Human-readable description */
  description?: string;
}

export interface AppliedDiscount {
  code: string;
  type: DiscountType;
  value: number;
  /** Exact monetary amount deducted */
  amount: number;
  description?: string;
}

export interface DiscountValidationResult {
  isValid: boolean;
  code: string;
  amount: number;
  error?: string;
}

export interface CustomFee {
  /** Unique identifier (e.g. 'gift_wrap', 'express_delivery') */
  id: string;
  /** Display title (e.g. 'Handcrafted Gift Wrapping & Card') */
  title: string;
  /** Fee amount */
  amount: number;
  /** Whether Indian GST applies to this fee. Default: false */
  isTaxable?: boolean;
  /** Tax rate if taxable. Default: 18 */
  taxRate?: number;
}

export interface AbandonedCartMetadata {
  /** Timestamp of last user action in milliseconds */
  lastModifiedAt: number;
  /** Customer email address */
  customerEmail?: string;
  /** Customer 10-digit mobile number for WhatsApp / SMS recovery */
  customerPhone?: string;
  /** Customer name */
  customerName?: string;
  /** Current funnel progress stage */
  checkoutStep: 'cart' | 'address' | 'payment' | 'completed';
  /** Deep-link URL or token to restore cart on any device */
  recoveryToken?: string;
}

export interface HSNTaxEntry {
  hsnCode: string;
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface GSTBreakdown {
  taxableAmount: number;
  totalTax: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxType: 'INTRA_STATE' | 'INTER_STATE';
  hsnBreakdown: HSNTaxEntry[];
}

export interface FreeShippingProgress {
  threshold: number;
  currentAmount: number;
  amountRemaining: number;
  /** 0 to 100 integer for animated UI progress bars */
  percentage: number;
  isEligible: boolean;
  /** Friendly UX message */
  message: string;
}

export interface CurrencyConfig {
  /** ISO 4217 Currency Code (default: 'INR') */
  code?: string;
  /** Currency symbol (default: '₹') */
  symbol?: string;
  /** Locale for formatting (default: 'en-IN') */
  locale?: string;
  /** Number of decimals (default: 2) */
  fractionDigits?: number;
}

export interface FormattedCartSummary {
  subtotal: string;
  totalMRP: string;
  totalSavings: string;
  discountAmount: string;
  shippingFee: string;
  codFee: string;
  prepaidDiscount: string;
  totalCustomFees: string;
  totalTax: string;
  cgst: string;
  sgst: string;
  igst: string;
  finalTotal: string;
}

export interface CartSummary {
  /** List of current items */
  items: CartItem[];
  /** Count of distinct items */
  itemCount: number;
  /** Total units count across all items */
  totalQuantity: number;
  /** Total gross weight in grams */
  totalWeightGrams: number;
  /** Subtotal of items (price * quantity) */
  subtotal: number;
  /** Original MRP total (compareAtPrice * quantity) */
  totalMRP: number;
  /** Total savings (MRP discount + coupon discount + prepaid discount) */
  totalSavings: number;
  /** Active coupon discount, if applied */
  discount: AppliedDiscount | null;
  /** Additional custom surcharges (e.g. Gift wrap, Express shipping) */
  customFees: CustomFee[];
  /** Sum of all custom fees */
  totalCustomFees: number;
  /** Shipping fee */
  shippingFee: number;
  /** Cash-on-delivery surcharge */
  codFee: number;
  /** Instant prepaid discount amount */
  prepaidDiscount: number;
  /** 100% compliant Indian GST breakdown */
  gst: GSTBreakdown;
  /** Progress status towards free delivery */
  freeShipping: FreeShippingProgress;
  /** Final payable checkout amount */
  finalTotal: number;
  /** Ready-to-render formatted currency strings (e.g. "₹1,499.00") */
  formatted: FormattedCartSummary;
  /** Abandoned cart and funnel recovery tracking */
  recovery: AbandonedCartMetadata;
}

/**
 * Storage adapter interface for universal persistence (Web & Mobile)
 */
export interface StorageAdapter {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
  /** Optional cross-tab / cross-window synchronization listener */
  onSync?(callback: (rawState: string) => void): () => void;
}

export type CartEventType =
  | 'item:added'
  | 'item:updated'
  | 'item:removed'
  | 'cart:cleared'
  | 'cart:merged'
  | 'discount:applied'
  | 'discount:removed'
  | 'fee:added'
  | 'fee:removed'
  | 'config:updated'
  | 'recovery:updated'
  | 'cart:rehydrated';

export interface CartEventPayload {
  type: CartEventType;
  item?: CartItem;
  discount?: AppliedDiscount | null;
  fee?: CustomFee;
  summary: CartSummary;
}

export type CartEventListener = (payload: CartEventPayload) => void;
export type CartSubscription = (summary: CartSummary) => void;
