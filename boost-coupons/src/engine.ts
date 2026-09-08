import {
  BestCouponResult,
  CartContext,
  CouponApplicationResult,
  CouponRule,
} from './types';

export class CouponEngine {
  /**
   * Applies and validates a specific coupon code against the cart context.
   */
  public static apply(coupon: CouponRule, cart: CartContext): CouponApplicationResult {
    const code = coupon.code.toUpperCase().trim();
    const baseTotal = cart.subtotal;
    const shippingFee = cart.shippingFee || 0;

    // 1. Check active dates
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return this.invalid(code, baseTotal + shippingFee, 'Coupon offer has not started yet.');
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      return this.invalid(code, baseTotal + shippingFee, 'Coupon code has expired.');
    }

    // 2. Check total usage limit
    if (
      coupon.totalUsageLimit !== undefined &&
      coupon.currentUsageCount !== undefined &&
      coupon.currentUsageCount >= coupon.totalUsageLimit
    ) {
      return this.invalid(code, baseTotal + shippingFee, 'Coupon usage limit has been reached.');
    }

    // 3. Check first order only rule
    if (coupon.firstOrderOnly && cart.customer) {
      if (cart.customer.isFirstOrder === false || (cart.customer.orderCount && cart.customer.orderCount > 0)) {
        return this.invalid(code, baseTotal + shippingFee, 'This coupon is valid only on your first order.');
      }
    }

    // 4. Check minimum cart subtotal
    if (coupon.minSubtotal && baseTotal < coupon.minSubtotal) {
      return this.invalid(
        code,
        baseTotal + shippingFee,
        `Minimum cart value of ₹${coupon.minSubtotal} required to use this coupon.`
      );
    }

    // 5. Check payment mode restrictions (e.g. Prepaid only)
    if (
      coupon.applicablePaymentMode &&
      coupon.applicablePaymentMode !== 'ANY' &&
      cart.paymentMode &&
      cart.paymentMode !== coupon.applicablePaymentMode
    ) {
      return this.invalid(
        code,
        baseTotal + shippingFee,
        `This coupon is valid only on ${coupon.applicablePaymentMode} payments.`
      );
    }

    // 6. Calculate discount by type
    let discountAmount = 0;
    let freeShippingApplied = false;

    switch (coupon.discountType) {
      case 'FLAT': {
        discountAmount = Math.min(coupon.discountValue, baseTotal);
        break;
      }

      case 'PERCENTAGE': {
        const calculated = (baseTotal * coupon.discountValue) / 100;
        discountAmount = coupon.maxDiscount
          ? Math.min(calculated, coupon.maxDiscount)
          : calculated;
        discountAmount = Math.min(discountAmount, baseTotal);
        break;
      }

      case 'FREE_SHIPPING': {
        freeShippingApplied = true;
        discountAmount = shippingFee;
        break;
      }

      case 'TIERED': {
        if (coupon.tiers && coupon.tiers.length > 0) {
          // Sort tiers descending
          const sorted = [...coupon.tiers].sort((a, b) => b.minAmount - a.minAmount);
          const matched = sorted.find((t) => baseTotal >= t.minAmount);
          if (matched) {
            discountAmount = matched.discountAmount;
          } else {
            return this.invalid(
              code,
              baseTotal + shippingFee,
              `Cart subtotal ₹${baseTotal} does not meet tier requirements.`
            );
          }
        }
        break;
      }

      case 'BOGO': {
        if (coupon.bogoRules) {
          const totalQty = cart.items.reduce((acc, i) => acc + i.quantity, 0);
          const reqQty = coupon.bogoRules.buyQuantity + coupon.bogoRules.getQuantity;
          if (totalQty >= reqQty) {
            // Find lowest priced item in cart to discount
            const sortedItems = [...cart.items].sort((a, b) => a.price - b.price);
            const freeItem = sortedItems[0];
            discountAmount = (freeItem.price * coupon.bogoRules.discountPercentOnGet) / 100;
          } else {
            return this.invalid(
              code,
              baseTotal + shippingFee,
              `Add at least ${reqQty} items to your cart to activate Buy ${coupon.bogoRules.buyQuantity} Get ${coupon.bogoRules.getQuantity} offer.`
            );
          }
        }
        break;
      }
    }

    // Round discount to 2 decimals
    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalTotal = Math.max(0, baseTotal - discountAmount + (freeShippingApplied ? 0 : shippingFee));

    return {
      isValid: true,
      couponCode: code,
      discountAmount,
      freeShippingApplied,
      finalTotal,
      appliedRule: coupon,
    };
  }

  /**
   * Evaluates all available coupons and automatically selects the one that provides the HIGHEST savings!
   */
  public static autoApplyBest(availableCoupons: CouponRule[], cart: CartContext): BestCouponResult {
    const results: CouponApplicationResult[] = availableCoupons
      .map((c) => this.apply(c, cart))
      .filter((r) => r.isValid);

    if (results.length === 0) {
      return { allEvaluated: [] };
    }

    // Sort by highest discountAmount descending
    results.sort((a, b) => b.discountAmount - a.discountAmount);

    return {
      bestCoupon: results[0],
      allEvaluated: results,
    };
  }

  private static invalid(code: string, currentTotal: number, reason: string): CouponApplicationResult {
    return {
      isValid: false,
      couponCode: code,
      discountAmount: 0,
      freeShippingApplied: false,
      finalTotal: currentTotal,
      reason,
    };
  }
}
