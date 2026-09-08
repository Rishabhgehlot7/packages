type CouponDiscountType = 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING' | 'TIERED' | 'BOGO';
interface CartItem {
    id: string;
    name: string;
    sku?: string;
    price: number;
    quantity: number;
    category?: string;
}
interface CartContext {
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
interface TierRule {
    minAmount: number;
    discountAmount: number;
}
interface CouponRule {
    code: string;
    discountType: CouponDiscountType;
    discountValue: number;
    maxDiscount?: number;
    minSubtotal?: number;
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
        discountPercentOnGet: number;
    };
    allowedCategories?: string[];
    excludedSkus?: string[];
}
interface CouponApplicationResult {
    isValid: boolean;
    couponCode: string;
    discountAmount: number;
    freeShippingApplied: boolean;
    finalTotal: number;
    reason?: string;
    appliedRule?: CouponRule;
}
interface BestCouponResult {
    bestCoupon?: CouponApplicationResult;
    allEvaluated: CouponApplicationResult[];
}

declare class CouponEngine {
    /**
     * Applies and validates a specific coupon code against the cart context.
     */
    static apply(coupon: CouponRule, cart: CartContext): CouponApplicationResult;
    /**
     * Evaluates all available coupons and automatically selects the one that provides the HIGHEST savings!
     */
    static autoApplyBest(availableCoupons: CouponRule[], cart: CartContext): BestCouponResult;
    private static invalid;
}

export { type BestCouponResult, type CartContext, type CartItem, type CouponApplicationResult, type CouponDiscountType, CouponEngine, type CouponRule, type TierRule };
