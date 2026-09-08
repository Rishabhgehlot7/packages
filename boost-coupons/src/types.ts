export type CouponDiscountType =
  | 'PERCENTAGE'
  | 'FLAT'
  | 'FREE_SHIPPING'
  | 'TIERED'
  | 'BOGO';

export interface CartItem {
  id: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface CartContext {
  items: CartItem[];
  subtotal: number;
  shippingFee?: number;
  paymentMode?: 'Prepaid' | 'COD';
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
  maxDiscount?: number;  // Cap for percentage discounts (e.g. max ₹500)
  minSubtotal?: number;  // Minimum cart value required
  applicablePaymentMode?: 'Prepaid' | 'COD' | 'ANY';
  firstOrderOnly?: boolean;
  startDate?: string;
  expiryDate?: string;
  usageLimitPerUser?: number;
  totalUsageLimit?: number;
  currentUsageCount?: number;
  tiers?: TierRule[];
  bogoRules?: {
    buyQuantity: number;
    getQuantity: number;
    discountPercentOnGet: number; // 100 for free, 50 for half price
  };
  allowedCategories?: string[];
  excludedSkus?: string[];
}

export interface CouponApplicationResult {
  isValid: boolean;
  couponCode: string;
  discountAmount: number;
  freeShippingApplied: boolean;
  finalTotal: number;
  reason?: string;
  appliedRule?: CouponRule;
}

export interface BestCouponResult {
  bestCoupon?: CouponApplicationResult;
  allEvaluated: CouponApplicationResult[];
}
