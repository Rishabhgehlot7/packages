import {
  BestCouponResult,
  BoostCartLike,
  CartContext,
  CartItem,
  CouponApplicationResult,
  CouponRule,
  CouponUpsellHint,
  MultiCouponApplicationResult,
} from './types';

export class CouponEngine {
  /**
   * Normalize arbitrary cart or @boostengine/cart instance into standard CartContext
   */
  public static normalizeCart(cart: CartContext | BoostCartLike): CartContext {
    const items: CartItem[] = (cart.items || []).map((i) => ({
      id: i.id || i.productId || 'item',
      productId: i.productId || i.id,
      name: i.name || i.title || 'Product',
      title: i.title || i.name,
      price: i.price,
      quantity: i.quantity,
      category: i.category,
      sku: i.sku,
    }));

    const calculatedSubtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    const subtotal = cart.subtotal !== undefined ? cart.subtotal : (cart.total !== undefined ? cart.total : calculatedSubtotal);

    return {
      items,
      subtotal,
      shippingFee: cart.shippingFee || 0,
      paymentMode: cart.paymentMode,
      customer: cart.customer,
    };
  }

  /**
   * Applies and validates a specific coupon code against the cart.
   */
  public static apply(coupon: CouponRule, rawCart: CartContext | BoostCartLike): CouponApplicationResult {
    const cart = this.normalizeCart(rawCart);
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

    // 5. Check minimum items quantity
    const totalItemQty = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    if (coupon.minQuantityRequired && totalItemQty < coupon.minQuantityRequired) {
      return this.invalid(
        code,
        baseTotal + shippingFee,
        `Cart must contain at least ${coupon.minQuantityRequired} items to apply this coupon.`
      );
    }

    // 6. Check payment mode restrictions (e.g. Prepaid only)
    if (
      coupon.applicablePaymentMode &&
      coupon.applicablePaymentMode !== 'ANY' &&
      cart.paymentMode &&
      cart.paymentMode.toUpperCase() !== coupon.applicablePaymentMode.toUpperCase()
    ) {
      return this.invalid(
        code,
        baseTotal + shippingFee,
        `This coupon is valid only on ${coupon.applicablePaymentMode} payments.`
      );
    }

    // 7. Check category restrictions
    if (coupon.allowedCategories && coupon.allowedCategories.length > 0) {
      const hasAllowedCategory = cart.items.some(
        (i) => i.category && coupon.allowedCategories!.includes(i.category)
      );
      if (!hasAllowedCategory) {
        return this.invalid(
          code,
          baseTotal + shippingFee,
          `This coupon is valid only on categories: ${coupon.allowedCategories.join(', ')}.`
        );
      }
    }

    // 8. Calculate discount by type
    let discountAmount = 0;
    let freeShippingApplied = false;
    let cashbackAmount = coupon.cashbackAmount || 0;

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

      case 'CASHBACK': {
        discountAmount = 0; // Cashback is credited into wallet, not deducted from cart total
        cashbackAmount = coupon.discountValue || coupon.cashbackAmount || 0;
        break;
      }

      case 'REFERRAL': {
        const calculated = (baseTotal * coupon.discountValue) / 100;
        discountAmount = coupon.maxDiscount
          ? Math.min(calculated, coupon.maxDiscount)
          : calculated;
        discountAmount = Math.min(discountAmount, baseTotal);
        break;
      }

      case 'TIERED': {
        if (coupon.tiers && coupon.tiers.length > 0) {
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
          const reqQty = coupon.bogoRules.buyQuantity + coupon.bogoRules.getQuantity;
          if (totalItemQty >= reqQty) {
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

    const result: CouponApplicationResult = {
      isValid: true,
      couponCode: code,
      discountAmount,
      freeShippingApplied,
      cashbackAmount: cashbackAmount > 0 ? cashbackAmount : undefined,
      finalTotal,
      appliedRule: coupon,
    };

    if (coupon.affiliateId) {
      const commRate = coupon.affiliateCommissionPercent || 10;
      result.affiliateAttribution = {
        affiliateId: coupon.affiliateId,
        commissionAmount: Math.round(((baseTotal * commRate) / 100) * 100) / 100,
      };
    }

    return result;
  }

  /**
   * Applies multiple stackable coupons in combination.
   */
  public static applyMultiple(
    coupons: CouponRule[],
    rawCart: CartContext | BoostCartLike
  ): MultiCouponApplicationResult {
    const cart = this.normalizeCart(rawCart);
    let runningSubtotal = cart.subtotal;
    let totalDiscount = 0;
    let freeShippingApplied = false;
    const applied: CouponApplicationResult[] = [];

    for (const coupon of coupons) {
      if (!coupon.isStackable && applied.length > 0) continue;

      const currentContext: CartContext = {
        ...cart,
        subtotal: runningSubtotal,
      };

      const res = this.apply(coupon, currentContext);
      if (res.isValid && res.discountAmount > 0) {
        applied.push(res);
        totalDiscount += res.discountAmount;
        runningSubtotal = Math.max(0, runningSubtotal - res.discountAmount);
        if (res.freeShippingApplied) freeShippingApplied = true;
      }
    }

    const shippingFee = freeShippingApplied ? 0 : (cart.shippingFee || 0);
    const finalTotal = Math.max(0, cart.subtotal - totalDiscount + shippingFee);

    return {
      appliedCoupons: applied,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      freeShippingApplied,
      finalTotal: Math.round(finalTotal * 100) / 100,
    };
  }

  /**
   * Evaluates all available coupons and selects the single coupon that saves the user the MOST money!
   */
  public static autoApplyBest(
    availableCoupons: CouponRule[],
    rawCart: CartContext | BoostCartLike
  ): BestCouponResult {
    const cart = this.normalizeCart(rawCart);
    const results: CouponApplicationResult[] = availableCoupons
      .map((c) => this.apply(c, cart))
      .filter((r) => r.isValid);

    if (results.length === 0) {
      return { allEvaluated: [], savingsAmount: 0 };
    }

    // Sort descending by discountAmount
    results.sort((a, b) => b.discountAmount - a.discountAmount);
    const best = results[0];

    return {
      bestCoupon: best,
      allEvaluated: results,
      savingsAmount: best.discountAmount,
    };
  }

  /**
   * Generates motivational Average Order Value (AOV) upsell hints for coupons the user is close to unlocking!
   */
  public static getUpsellHints(
    availableCoupons: CouponRule[],
    rawCart: CartContext | BoostCartLike
  ): CouponUpsellHint[] {
    const cart = this.normalizeCart(rawCart);
    const hints: CouponUpsellHint[] = [];
    const totalQty = cart.items.reduce((acc, i) => acc + i.quantity, 0);

    for (const coupon of availableCoupons) {
      const code = coupon.code.toUpperCase().trim();

      // 1. Min Subtotal Upsell (e.g. Cart is ₹850, Min subtotal is ₹1,000)
      if (coupon.minSubtotal && cart.subtotal < coupon.minSubtotal) {
        const diff = coupon.minSubtotal - cart.subtotal;
        // Only suggest if customer is within 40% threshold of unlocking
        if (diff <= coupon.minSubtotal * 0.4) {
          const savings =
            coupon.discountType === 'PERCENTAGE'
              ? Math.min((coupon.minSubtotal * coupon.discountValue) / 100, coupon.maxDiscount || 9999)
              : coupon.discountValue;

          hints.push({
            couponCode: code,
            type: 'ADD_MORE_AMOUNT',
            amountNeeded: diff,
            potentialSavings: Math.round(savings),
            message: `Add ₹${diff} more to unlock ₹${Math.round(savings)} OFF with code ${code}!`,
          });
        }
      }

      // 2. BOGO Quantity Upsell (e.g. Buy 2 Get 1, Cart has 2 items, need 3)
      if (coupon.discountType === 'BOGO' && coupon.bogoRules) {
        const needed = coupon.bogoRules.buyQuantity + coupon.bogoRules.getQuantity;
        if (totalQty < needed && needed - totalQty <= 2) {
          const itemsShort = needed - totalQty;
          hints.push({
            couponCode: code,
            type: 'ADD_MORE_ITEMS',
            itemsNeeded: itemsShort,
            potentialSavings: Math.round(cart.items[0]?.price || 300),
            message: `Add ${itemsShort} more item(s) to get 1 FREE with code ${code}!`,
          });
        }
      }

      // 3. Prepaid Payment Mode Incentive
      if (
        coupon.applicablePaymentMode === 'Prepaid' &&
        cart.paymentMode &&
        cart.paymentMode.toUpperCase() === 'COD'
      ) {
        hints.push({
          couponCode: code,
          type: 'SWITCH_PAYMENT_MODE',
          suggestedPaymentMode: 'Prepaid',
          potentialSavings: coupon.discountValue,
          message: `Pay with UPI or Card to save ₹${coupon.discountValue} instantly with code ${code}!`,
        });
      }
    }

    return hints;
  }

  private static invalid(code: string, finalTotal: number, reason: string): CouponApplicationResult {
    return {
      isValid: false,
      couponCode: code,
      discountAmount: 0,
      freeShippingApplied: false,
      finalTotal,
      reason,
    };
  }
}
