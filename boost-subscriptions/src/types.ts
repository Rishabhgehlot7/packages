/**
 * @boostengine/subscriptions - Type Definitions
 */

export type SubscriptionFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'yearly' | 'custom_days';

export type SubscriptionStatus =
  | 'active'
  | 'paused'
  | 'skipped'
  | 'cancelled'
  | 'expired'
  | 'pending_payment'
  | 'failed';

export interface SubscriptionDiscountConfig {
  type: 'percentage' | 'fixed_amount';
  value: number; // e.g. 10 for 10% or 50 for 50 off
  applyOnFirstOrderOnly?: boolean;
  tierDiscounts?: {
    orderThreshold: number; // e.g., after 3 recurring orders
    discountPercentage: number; // get 15%
  }[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  frequency: SubscriptionFrequency;
  intervalDays?: number; // Used when frequency is custom_days
  discount: SubscriptionDiscountConfig;
  freeShipping?: boolean;
  minCyclesRequired?: number; // Minimum orders before cancellation allowed
  maxCyclesAllowed?: number;
  trialDays?: number;
}

export interface SubscriptionItem {
  productId: string;
  variantId?: string;
  title: string;
  quantity: number;
  unitPrice: number;
  discountedPrice: number;
  sku?: string;
  imageUrl?: string;
}

export interface SubscriptionShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface SubscriptionPaymentMethod {
  gateway: 'stripe' | 'razorpay' | 'cashfree' | 'lemonsqueezy' | 'manual';
  customerId: string;
  paymentMethodToken: string; // Tokenized card/mandate ID
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface SubscriptionOrderHistory {
  orderId: string;
  cycleNumber: number;
  billedAt: string;
  amount: number;
  status: 'paid' | 'failed' | 'refunded';
  invoiceUrl?: string;
}

export interface SubscriptionRecord {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  items: SubscriptionItem[];
  shippingAddress: SubscriptionShippingAddress;
  paymentMethod: SubscriptionPaymentMethod;
  currency: string;
  frequency: SubscriptionFrequency;
  intervalDays?: number;
  
  // Pricing
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  taxTotal: number;
  totalAmount: number;
  
  // Lifecycle Dates
  createdAt: string;
  updatedAt: string;
  nextBillingDate: string;
  nextDeliveryDate: string;
  pausedUntil?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  
  // Tracking
  cycleCount: number;
  orderHistory: SubscriptionOrderHistory[];
  metadata?: Record<string, any>;
}

export interface CreateSubscriptionInput {
  customerId: string;
  customerEmail: string;
  customerName: string;
  plan: SubscriptionPlan;
  items: SubscriptionItem[];
  shippingAddress: SubscriptionShippingAddress;
  paymentMethod: SubscriptionPaymentMethod;
  currency?: string;
  shippingFee?: number;
  taxRatePercent?: number;
  startDate?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionMetrics {
  totalActiveSubscriptions: number;
  totalPausedSubscriptions: number;
  totalCancelledSubscriptions: number;
  monthlyRecurringRevenue: number; // MRR in base currency
  annualRecurringRevenue: number;  // ARR in base currency
  averageOrderValue: number;       // AOV
  churnRatePercentage: number;
  activeSubscriberCount: number;
}
