export type CouponDiscountType =
  | 'PERCENTAGE'
  | 'FLAT'
  | 'FREE_SHIPPING'
  | 'TIERED'
  | 'BOGO'
  | 'CASHBACK'
  | 'REFERRAL';

export interface CartItem {
  id?: string;
  productId?: string;
  name?: string;
  title?: string;
  sku?: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface CartContext {
  items: CartItem[];
  subtotal: number;
  total?: number;
  shippingFee?: number;
  paymentMode?: 'Prepaid' | 'COD' | string;
  customer?: {
    id?: string;
    isFirstOrder?: boolean;
    orderCount?: number;
    email?: string;
    phone?: string;
  };
}

/**
 * Universal bridge interface compatible with @boostengine/cart
 */
export interface BoostCartLike {
  items: Array<{
    id?: string;
    productId?: string;
    name?: string;
    title?: string;
    price: number;
    quantity: number;
    category?: string;
    sku?: string;
  }>;
  total?: number;
  subtotal?: number;
  shippingFee?: number;
  paymentMode?: 'Prepaid' | 'COD' | string;
  customer?: {
    id?: string;
    isFirstOrder?: boolean;
    orderCount?: number;
    email?: string;
    phone?: string;
  };
}

export interface TierRule {
  minAmount: number;
  discountAmount: number;
}

export interface CouponRule {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number; // Percentage (e.g. 15 for 15%) or flat amount (e.g. 200 for ₹200)
  maxDiscount?: number; // Cap for percentage discounts (e.g. max ₹500)
  minSubtotal?: number; // Minimum cart value required
  minQuantityRequired?: number; // Minimum total items in cart
  applicablePaymentMode?: 'Prepaid' | 'COD' | 'ANY';
  firstOrderOnly?: boolean;
  startDate?: string;
  expiryDate?: string;
  usageLimitPerUser?: number;
  totalUsageLimit?: number;
  currentUsageCount?: number;
  isStackable?: boolean; // Can be combined with other coupons
  tiers?: TierRule[];
  bogoRules?: {
    buyQuantity: number;
    getQuantity: number;
    discountPercentOnGet: number; // 100 for free, 50 for half price
  };
  allowedCategories?: string[];
  excludedCategories?: string[];
  allowedSkus?: string[];
  excludedSkus?: string[];
  // Influencer & Affiliate referral attribution
  affiliateId?: string;
  affiliateCommissionPercent?: number;
  // Cashback into user wallet
  cashbackAmount?: number;
}

export interface CouponApplicationResult {
  isValid: boolean;
  couponCode: string;
  discountAmount: number;
  freeShippingApplied: boolean;
  cashbackAmount?: number;
  finalTotal: number;
  reason?: string;
  appliedRule?: CouponRule;
  affiliateAttribution?: {
    affiliateId: string;
    commissionAmount: number;
  };
}

export interface BestCouponResult {
  bestCoupon?: CouponApplicationResult;
  allEvaluated: CouponApplicationResult[];
  savingsAmount: number;
}

export interface MultiCouponApplicationResult {
  appliedCoupons: CouponApplicationResult[];
  totalDiscount: number;
  freeShippingApplied: boolean;
  finalTotal: number;
}

export interface CouponUpsellHint {
  couponCode: string;
  type: 'ADD_MORE_AMOUNT' | 'ADD_MORE_ITEMS' | 'SWITCH_PAYMENT_MODE';
  amountNeeded?: number;
  itemsNeeded?: number;
  suggestedPaymentMode?: 'Prepaid';
  potentialSavings: number;
  message: string;
}
