'use strict';

var react = require('react');

// src/engine.ts
var CouponEngine = class {
  /**
   * Normalize arbitrary cart or @boostengine/cart instance into standard CartContext
   */
  static normalizeCart(cart) {
    const items = (cart.items || []).map((i) => ({
      id: i.id || i.productId || "item",
      productId: i.productId || i.id,
      name: i.name || i.title || "Product",
      title: i.title || i.name,
      price: i.price,
      quantity: i.quantity,
      category: i.category,
      sku: i.sku
    }));
    const calculatedSubtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    const subtotal = cart.subtotal !== void 0 ? cart.subtotal : cart.total !== void 0 ? cart.total : calculatedSubtotal;
    return {
      items,
      subtotal,
      shippingFee: cart.shippingFee || 0,
      paymentMode: cart.paymentMode,
      customer: cart.customer
    };
  }
  /**
   * Applies and validates a specific coupon code against the cart.
   */
  static apply(coupon, rawCart) {
    const cart = this.normalizeCart(rawCart);
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
    const totalItemQty = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    if (coupon.minQuantityRequired && totalItemQty < coupon.minQuantityRequired) {
      return this.invalid(
        code,
        baseTotal + shippingFee,
        `Cart must contain at least ${coupon.minQuantityRequired} items to apply this coupon.`
      );
    }
    if (coupon.applicablePaymentMode && coupon.applicablePaymentMode !== "ANY" && cart.paymentMode && cart.paymentMode.toUpperCase() !== coupon.applicablePaymentMode.toUpperCase()) {
      return this.invalid(
        code,
        baseTotal + shippingFee,
        `This coupon is valid only on ${coupon.applicablePaymentMode} payments.`
      );
    }
    if (coupon.allowedCategories && coupon.allowedCategories.length > 0) {
      const hasAllowedCategory = cart.items.some(
        (i) => i.category && coupon.allowedCategories.includes(i.category)
      );
      if (!hasAllowedCategory) {
        return this.invalid(
          code,
          baseTotal + shippingFee,
          `This coupon is valid only on categories: ${coupon.allowedCategories.join(", ")}.`
        );
      }
    }
    let discountAmount = 0;
    let freeShippingApplied = false;
    let cashbackAmount = coupon.cashbackAmount || 0;
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
      case "CASHBACK": {
        discountAmount = 0;
        cashbackAmount = coupon.discountValue || coupon.cashbackAmount || 0;
        break;
      }
      case "REFERRAL": {
        const calculated = baseTotal * coupon.discountValue / 100;
        discountAmount = coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
        discountAmount = Math.min(discountAmount, baseTotal);
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
          const reqQty = coupon.bogoRules.buyQuantity + coupon.bogoRules.getQuantity;
          if (totalItemQty >= reqQty) {
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
    const result = {
      isValid: true,
      couponCode: code,
      discountAmount,
      freeShippingApplied,
      cashbackAmount: cashbackAmount > 0 ? cashbackAmount : void 0,
      finalTotal,
      appliedRule: coupon
    };
    if (coupon.affiliateId) {
      const commRate = coupon.affiliateCommissionPercent || 10;
      result.affiliateAttribution = {
        affiliateId: coupon.affiliateId,
        commissionAmount: Math.round(baseTotal * commRate / 100 * 100) / 100
      };
    }
    return result;
  }
  /**
   * Applies multiple stackable coupons in combination.
   */
  static applyMultiple(coupons, rawCart) {
    const cart = this.normalizeCart(rawCart);
    let runningSubtotal = cart.subtotal;
    let totalDiscount = 0;
    let freeShippingApplied = false;
    const applied = [];
    for (const coupon of coupons) {
      if (!coupon.isStackable && applied.length > 0) continue;
      const currentContext = {
        ...cart,
        subtotal: runningSubtotal
      };
      const res = this.apply(coupon, currentContext);
      if (res.isValid && res.discountAmount > 0) {
        applied.push(res);
        totalDiscount += res.discountAmount;
        runningSubtotal = Math.max(0, runningSubtotal - res.discountAmount);
        if (res.freeShippingApplied) freeShippingApplied = true;
      }
    }
    const shippingFee = freeShippingApplied ? 0 : cart.shippingFee || 0;
    const finalTotal = Math.max(0, cart.subtotal - totalDiscount + shippingFee);
    return {
      appliedCoupons: applied,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      freeShippingApplied,
      finalTotal: Math.round(finalTotal * 100) / 100
    };
  }
  /**
   * Evaluates all available coupons and selects the single coupon that saves the user the MOST money!
   */
  static autoApplyBest(availableCoupons, rawCart) {
    const cart = this.normalizeCart(rawCart);
    const results = availableCoupons.map((c) => this.apply(c, cart)).filter((r) => r.isValid);
    if (results.length === 0) {
      return { allEvaluated: [], savingsAmount: 0 };
    }
    results.sort((a, b) => b.discountAmount - a.discountAmount);
    const best = results[0];
    return {
      bestCoupon: best,
      allEvaluated: results,
      savingsAmount: best.discountAmount
    };
  }
  /**
   * Generates motivational Average Order Value (AOV) upsell hints for coupons the user is close to unlocking!
   */
  static getUpsellHints(availableCoupons, rawCart) {
    const cart = this.normalizeCart(rawCart);
    const hints = [];
    const totalQty = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    for (const coupon of availableCoupons) {
      const code = coupon.code.toUpperCase().trim();
      if (coupon.minSubtotal && cart.subtotal < coupon.minSubtotal) {
        const diff = coupon.minSubtotal - cart.subtotal;
        if (diff <= coupon.minSubtotal * 0.4) {
          const savings = coupon.discountType === "PERCENTAGE" ? Math.min(coupon.minSubtotal * coupon.discountValue / 100, coupon.maxDiscount || 9999) : coupon.discountValue;
          hints.push({
            couponCode: code,
            type: "ADD_MORE_AMOUNT",
            amountNeeded: diff,
            potentialSavings: Math.round(savings),
            message: `Add \u20B9${diff} more to unlock \u20B9${Math.round(savings)} OFF with code ${code}!`
          });
        }
      }
      if (coupon.discountType === "BOGO" && coupon.bogoRules) {
        const needed = coupon.bogoRules.buyQuantity + coupon.bogoRules.getQuantity;
        if (totalQty < needed && needed - totalQty <= 2) {
          const itemsShort = needed - totalQty;
          hints.push({
            couponCode: code,
            type: "ADD_MORE_ITEMS",
            itemsNeeded: itemsShort,
            potentialSavings: Math.round(cart.items[0]?.price || 300),
            message: `Add ${itemsShort} more item(s) to get 1 FREE with code ${code}!`
          });
        }
      }
      if (coupon.applicablePaymentMode === "Prepaid" && cart.paymentMode && cart.paymentMode.toUpperCase() === "COD") {
        hints.push({
          couponCode: code,
          type: "SWITCH_PAYMENT_MODE",
          suggestedPaymentMode: "Prepaid",
          potentialSavings: coupon.discountValue,
          message: `Pay with UPI or Card to save \u20B9${coupon.discountValue} instantly with code ${code}!`
        });
      }
    }
    return hints;
  }
  static invalid(code, finalTotal, reason) {
    return {
      isValid: false,
      couponCode: code,
      discountAmount: 0,
      freeShippingApplied: false,
      finalTotal,
      reason
    };
  }
};

// src/agent.ts
var CouponAgentToolkit = class {
  constructor(catalog = []) {
    this.catalog = catalog;
  }
  /**
   * Returns standard OpenAI/Gemini/JSON Schema tool declarations for LLM function calling
   */
  getToolDefinitions() {
    return [
      {
        name: "validateCouponCode",
        description: "Verify if a promo code or coupon is valid for the customer shopping cart, and calculate the discount savings.",
        parameters: {
          type: "object",
          properties: {
            code: { type: "string", description: "Promo code entered by user (e.g. SAVE20, FIRST100, BOGO)" },
            subtotal: { type: "number", description: "Cart subtotal amount in Rupees" },
            paymentMode: { type: "string", enum: ["Prepaid", "COD"], description: "Payment method selected" },
            isFirstOrder: { type: "boolean", description: "Whether customer is making their first purchase" }
          },
          required: ["code", "subtotal"]
        }
      },
      {
        name: "autoApplyBestCoupon",
        description: "Automatically scan all active promotional offers and select the single best coupon that saves the customer the most money.",
        parameters: {
          type: "object",
          properties: {
            subtotal: { type: "number", description: "Cart subtotal amount in Rupees" },
            paymentMode: { type: "string", enum: ["Prepaid", "COD"], description: "Payment mode" }
          },
          required: ["subtotal"]
        }
      },
      {
        name: "getMotivationalUpsellDeals",
        description: "Recommend locked discounts and tell the customer exactly how much more to add to cart to unlock extra savings.",
        parameters: {
          type: "object",
          properties: {
            subtotal: { type: "number", description: "Current cart subtotal" },
            itemCount: { type: "number", description: "Total quantity of items in cart" }
          },
          required: ["subtotal"]
        }
      }
    ];
  }
  /**
   * Executes a tool invoked by the AI agent
   */
  async executeTool(name, args) {
    const cart = {
      items: [
        {
          price: Number(args.subtotal) || 1e3,
          quantity: Number(args.itemCount) || 1
        }
      ],
      subtotal: Number(args.subtotal) || 0,
      paymentMode: args.paymentMode || "Prepaid",
      customer: {
        isFirstOrder: args.isFirstOrder !== void 0 ? Boolean(args.isFirstOrder) : void 0
      }
    };
    switch (name) {
      case "validateCouponCode": {
        const code = String(args.code).toUpperCase().trim();
        const rule = this.catalog.find((c) => c.code.toUpperCase() === code);
        if (!rule) {
          return {
            isValid: false,
            couponCode: code,
            reason: `Promo code '${code}' is invalid or expired.`
          };
        }
        return CouponEngine.apply(rule, cart);
      }
      case "autoApplyBestCoupon": {
        const result = CouponEngine.autoApplyBest(this.catalog, cart);
        if (result.bestCoupon) {
          return {
            bestCouponCode: result.bestCoupon.couponCode,
            discountSavings: result.bestCoupon.discountAmount,
            finalCartTotal: result.bestCoupon.finalTotal,
            freeShippingApplied: result.bestCoupon.freeShippingApplied
          };
        }
        return {
          bestCouponCode: null,
          message: "No eligible coupons found for the current cart value."
        };
      }
      case "getMotivationalUpsellDeals": {
        return CouponEngine.getUpsellHints(this.catalog, cart);
      }
      default:
        throw new Error(`Unknown coupon agent tool: '${name}'`);
    }
  }
  /**
   * Generates sample active coupons for testing shopping bots offline
   */
  static getSampleDeals() {
    return [
      {
        code: "WELCOME100",
        discountType: "FLAT",
        discountValue: 100,
        minSubtotal: 499,
        firstOrderOnly: true
      },
      {
        code: "MEGA20",
        discountType: "PERCENTAGE",
        discountValue: 20,
        maxDiscount: 500,
        minSubtotal: 1500
      },
      {
        code: "FREESHIP",
        discountType: "FREE_SHIPPING",
        discountValue: 0,
        minSubtotal: 999
      },
      {
        code: "PREPAID50",
        discountType: "FLAT",
        discountValue: 50,
        applicablePaymentMode: "Prepaid"
      }
    ];
  }
};
function useCoupon(availableCoupons = [], cart, options = {}) {
  const { onApplied, onRemoved, onError } = options;
  const [appliedRule, setAppliedRule] = react.useState(null);
  const [error, setError] = react.useState(null);
  const appliedResult = react.useMemo(() => {
    if (!appliedRule) return null;
    const res = CouponEngine.apply(appliedRule, cart);
    if (!res.isValid) {
      return null;
    }
    return res;
  }, [appliedRule, cart]);
  const upsellHints = react.useMemo(() => {
    return CouponEngine.getUpsellHints(availableCoupons, cart);
  }, [availableCoupons, cart]);
  const eligibleCoupons = react.useMemo(() => {
    return availableCoupons.filter((c) => CouponEngine.apply(c, cart).isValid);
  }, [availableCoupons, cart]);
  const applyCode = react.useCallback(
    (code) => {
      const clean = code.trim().toUpperCase();
      const match = availableCoupons.find((c) => c.code.toUpperCase() === clean);
      if (!match) {
        const msg = `Invalid coupon code: '${code}'`;
        setError(msg);
        onError?.(msg);
        return false;
      }
      const res = CouponEngine.apply(match, cart);
      if (!res.isValid) {
        const msg = res.reason || `Coupon '${code}' cannot be applied.`;
        setError(msg);
        onError?.(msg);
        return false;
      }
      setError(null);
      setAppliedRule(match);
      onApplied?.(res);
      return true;
    },
    [availableCoupons, cart, onApplied, onError]
  );
  const removeCoupon = react.useCallback(() => {
    setAppliedRule(null);
    setError(null);
    onRemoved?.();
  }, [onRemoved]);
  const autoApplyBest = react.useCallback(() => {
    const best = CouponEngine.autoApplyBest(availableCoupons, cart);
    if (best.bestCoupon && best.bestCoupon.appliedRule) {
      setAppliedRule(best.bestCoupon.appliedRule);
      setError(null);
      onApplied?.(best.bestCoupon);
      return true;
    }
    return false;
  }, [availableCoupons, cart, onApplied]);
  const cartSubtotal = cart.subtotal ?? cart.total ?? 0;
  const shippingFee = cart.shippingFee || 0;
  const discountAmount = appliedResult?.discountAmount || 0;
  const freeShipping = Boolean(appliedResult?.freeShippingApplied);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + (freeShipping ? 0 : shippingFee));
  return {
    appliedCoupon: appliedResult,
    discountAmount,
    freeShippingApplied: freeShipping,
    finalTotal,
    error,
    applyCode,
    removeCoupon,
    autoApplyBest,
    eligibleCoupons,
    upsellHints
  };
}

exports.CouponAgentToolkit = CouponAgentToolkit;
exports.CouponEngine = CouponEngine;
exports.useCoupon = useCoupon;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map