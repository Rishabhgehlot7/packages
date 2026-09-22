import { C as CartContext, B as BoostCartLike, a as CouponRule, b as CouponApplicationResult, M as MultiCouponApplicationResult, c as BestCouponResult, d as CouponUpsellHint } from './types-rF_biqFC.js';
export { e as CartItem, f as CouponDiscountType, T as TierRule } from './types-rF_biqFC.js';
export { AgentToolDefinition, CouponAgentToolkit } from './agent.js';
export { UseCouponOptions, UseCouponResult, useCoupon } from './react.js';

declare class CouponEngine {
    /**
     * Normalize arbitrary cart or @boostengine/cart instance into standard CartContext
     */
    static normalizeCart(cart: CartContext | BoostCartLike): CartContext;
    /**
     * Applies and validates a specific coupon code against the cart.
     */
    static apply(coupon: CouponRule, rawCart: CartContext | BoostCartLike): CouponApplicationResult;
    /**
     * Applies multiple stackable coupons in combination.
     */
    static applyMultiple(coupons: CouponRule[], rawCart: CartContext | BoostCartLike): MultiCouponApplicationResult;
    /**
     * Evaluates all available coupons and selects the single coupon that saves the user the MOST money!
     */
    static autoApplyBest(availableCoupons: CouponRule[], rawCart: CartContext | BoostCartLike): BestCouponResult;
    /**
     * Generates motivational Average Order Value (AOV) upsell hints for coupons the user is close to unlocking!
     */
    static getUpsellHints(availableCoupons: CouponRule[], rawCart: CartContext | BoostCartLike): CouponUpsellHint[];
    private static invalid;
}

export { BestCouponResult, BoostCartLike, CartContext, CouponApplicationResult, CouponEngine, CouponRule, CouponUpsellHint, MultiCouponApplicationResult };
