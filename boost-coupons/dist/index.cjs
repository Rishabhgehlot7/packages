'use strict';

// src/engine.ts
var CouponEngine = class {
  /**
   * Applies and validates a specific coupon code against the cart context.
   */
  static apply(coupon, cart) {
    const code = coupon.code.toUpperCase().trim();
    const baseTotal = cart.subtotal;
    const shippingFee = cart.shippingFee || 0;
    const now = /* @__PURE__ */ new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return this.invalid(code, baseTotal + shippingFee, "Coupon offer has not started yet.");
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      return this.invalid(code, baseTotal + shippingFee, "Coupon code has expired.");
    }
    if (coupon.totalUsageLimit !== void 0 && coupon.currentUsageCount !== void 0 && coupon.currentUsageCount >= coupon.totalUsageLimit) {
      return this.invalid(code, baseTotal + shippingFee, "Coupon usage limit has been reached.");
    }
    if (coupon.firstOrderOnly && cart.customer) {
      if (cart.customer.isFirstOrder === false || cart.customer.orderCount && cart.customer.orderCount > 0) {
        return this.invalid(code, baseTotal + shippingFee, "This coupon is valid only on your first order.");
      }
    }
    if (coupon.minSubtotal && baseTotal < coupon.minSubtotal) {
      return this.invalid(
        code,
        baseTotal + shippingFee,
        `Minimum cart value of \u20B9${coupon.minSubtotal} required to use this coupon.`
      );
    }
    if (coupon.applicablePaymentMode && coupon.applicablePaymentMode !== "ANY" && cart.paymentMode && cart.paymentMode !== coupon.applicablePaymentMode) {
      return this.invalid(
        code,
        baseTotal + shippingFee,
        `This coupon is valid only on ${coupon.applicablePaymentMode} payments.`
      );
    }
    let discountAmount = 0;
    let freeShippingApplied = false;
    switch (coupon.discountType) {
      case "FLAT": {
        discountAmount = Math.min(coupon.discountValue, baseTotal);
        break;
      }
      case "PERCENTAGE": {
        const calculated = baseTotal * coupon.discountValue / 100;
        discountAmount = coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
        discountAmount = Math.min(discountAmount, baseTotal);
        break;
      }
      case "FREE_SHIPPING": {
        freeShippingApplied = true;
        discountAmount = shippingFee;
        break;
      }
      case "TIERED": {
        if (coupon.tiers && coupon.tiers.length > 0) {
          const sorted = [...coupon.tiers].sort((a, b) => b.minAmount - a.minAmount);
          const matched = sorted.find((t) => baseTotal >= t.minAmount);
          if (matched) {
            discountAmount = matched.discountAmount;
          } else {
            return this.invalid(
              code,
              baseTotal + shippingFee,
              `Cart subtotal \u20B9${baseTotal} does not meet tier requirements.`
            );
          }
        }
        break;
      }
      case "BOGO": {
        if (coupon.bogoRules) {
          const totalQty = cart.items.reduce((acc, i) => acc + i.quantity, 0);
          const reqQty = coupon.bogoRules.buyQuantity + coupon.bogoRules.getQuantity;
          if (totalQty >= reqQty) {
            const sortedItems = [...cart.items].sort((a, b) => a.price - b.price);
            const freeItem = sortedItems[0];
            discountAmount = freeItem.price * coupon.bogoRules.discountPercentOnGet / 100;
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
    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalTotal = Math.max(0, baseTotal - discountAmount + (freeShippingApplied ? 0 : shippingFee));
    return {
      isValid: true,
      couponCode: code,
      discountAmount,
      freeShippingApplied,
      finalTotal,
      appliedRule: coupon
    };
  }
  /**
   * Evaluates all available coupons and automatically selects the one that provides the HIGHEST savings!
   */
  static autoApplyBest(availableCoupons, cart) {
    const results = availableCoupons.map((c) => this.apply(c, cart)).filter((r) => r.isValid);
    if (results.length === 0) {
      return { allEvaluated: [] };
    }
    results.sort((a, b) => b.discountAmount - a.discountAmount);
    return {
      bestCoupon: results[0],
      allEvaluated: results
    };
  }
  static invalid(code, currentTotal, reason) {
    return {
      isValid: false,
      couponCode: code,
      discountAmount: 0,
      freeShippingApplied: false,
      finalTotal: currentTotal,
      reason
    };
  }
};

exports.CouponEngine = CouponEngine;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map