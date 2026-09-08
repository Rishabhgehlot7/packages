'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/gst.ts
var STATE_CODE_MAP = {
  mh: "maharashtra",
  dl: "delhi",
  ka: "karnataka",
  tn: "tamil nadu",
  gj: "gujarat",
  up: "uttar pradesh",
  wb: "west bengal",
  rj: "rajasthan",
  ts: "telangana",
  tg: "telangana",
  ap: "andhra pradesh",
  kl: "kerala",
  mp: "madhya pradesh",
  hr: "haryana",
  pb: "punjab",
  br: "bihar",
  or: "odisha",
  od: "odisha",
  as: "assam",
  jh: "jharkhand",
  ct: "chhattisgarh",
  cg: "chhattisgarh",
  ut: "uttarakhand",
  uk: "uttarakhand",
  hp: "himachal pradesh",
  tr: "tripura",
  ml: "meghalaya",
  mn: "manipur",
  nl: "nagaland",
  ga: "goa",
  ar: "arunachal pradesh",
  mz: "mizoram",
  sk: "sikkim",
  py: "puducherry",
  ch: "chandigarh",
  jk: "jammu and kashmir",
  la: "ladakh",
  dn: "dadra and nagar haveli and daman and diu",
  dd: "dadra and nagar haveli and daman and diu",
  an: "andaman and nicobar islands",
  ld: "lakshadweep"
};
function normalizeState(state) {
  if (!state) return "";
  const clean = state.trim().toLowerCase();
  return STATE_CODE_MAP[clean] || clean;
}
var GSTCalculator = class {
  /**
   * Calculates detailed GST breakdown across cart items
   */
  static calculate(items, origin, destination) {
    const originState = normalizeState(origin.state);
    const destState = destination ? normalizeState(destination.state) : originState;
    const isIntraState = Boolean(originState && destState && originState === destState);
    const taxMode = origin.taxMode || "inclusive";
    let totalTaxable = 0;
    let totalTax = 0;
    const hsnMap = /* @__PURE__ */ new Map();
    for (const item of items) {
      const rate = item.taxRate !== void 0 ? item.taxRate : 18;
      const itemTotalPrice = Math.round(item.price * item.quantity * 100) / 100;
      const hsn = item.hsnCode || "GENERAL";
      let taxable = 0;
      let tax = 0;
      if (taxMode === "inclusive") {
        taxable = Math.round(itemTotalPrice / (1 + rate / 100) * 100) / 100;
        tax = Math.round((itemTotalPrice - taxable) * 100) / 100;
      } else {
        taxable = itemTotalPrice;
        tax = Math.round(itemTotalPrice * (rate / 100) * 100) / 100;
      }
      totalTaxable += taxable;
      totalTax += tax;
      const existingHsn = hsnMap.get(hsn);
      if (existingHsn) {
        existingHsn.taxableAmount = Math.round((existingHsn.taxableAmount + taxable) * 100) / 100;
        existingHsn.taxAmount = Math.round((existingHsn.taxAmount + tax) * 100) / 100;
      } else {
        hsnMap.set(hsn, {
          hsnCode: hsn,
          taxRate: rate,
          taxableAmount: taxable,
          taxAmount: tax
        });
      }
    }
    totalTaxable = Math.round(totalTaxable * 100) / 100;
    totalTax = Math.round(totalTax * 100) / 100;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    if (isIntraState) {
      cgst = Math.round(totalTax / 2 * 100) / 100;
      sgst = Math.round((totalTax - cgst) * 100) / 100;
      igst = 0;
    } else {
      cgst = 0;
      sgst = 0;
      igst = totalTax;
    }
    return {
      taxableAmount: totalTaxable,
      totalTax,
      cgst,
      sgst,
      igst,
      taxType: isIntraState ? "INTRA_STATE" : "INTER_STATE",
      hsnBreakdown: Array.from(hsnMap.values())
    };
  }
};

// src/cart.ts
var BoostCart = class {
  constructor(options = {}) {
    __publicField(this, "items", []);
    __publicField(this, "origin");
    __publicField(this, "destination");
    __publicField(this, "shipping");
    __publicField(this, "payment");
    __publicField(this, "discount", null);
    this.origin = options.origin || { state: "Maharashtra", taxMode: "inclusive" };
    this.destination = options.destination;
    this.shipping = options.shipping || { freeShippingThreshold: 999, flatShippingRate: 79 };
    this.payment = options.payment || { paymentMethod: "prepaid", codFee: 49, prepaidDiscountPercentage: 0 };
    if (options.initialItems && options.initialItems.length > 0) {
      this.items = options.initialItems.map((i) => ({ ...i }));
    }
  }
  getItemKey(item) {
    if (item.id) return item.id;
    return `${item.productId}_${item.variantId || "default"}`;
  }
  /**
   * Adds an item to the cart or increments quantity if already present
   */
  addItem(item) {
    const key = this.getItemKey(item);
    const existing = this.items.find((i) => this.getItemKey(i) === key);
    if (existing) {
      existing.quantity += item.quantity > 0 ? item.quantity : 1;
      return existing;
    }
    const newItem = {
      ...item,
      id: key,
      quantity: item.quantity > 0 ? item.quantity : 1
    };
    this.items.push(newItem);
    return newItem;
  }
  /**
   * Removes an item by its unique ID
   */
  removeItem(id) {
    const initialLen = this.items.length;
    this.items = this.items.filter((i) => i.id !== id && this.getItemKey(i) !== id);
    return this.items.length < initialLen;
  }
  /**
   * Updates an item's quantity. If quantity <= 0, the item is removed.
   */
  updateQuantity(id, quantity) {
    const item = this.items.find((i) => i.id === id || this.getItemKey(i) === id);
    if (!item) return false;
    if (quantity <= 0) {
      return this.removeItem(id);
    }
    item.quantity = Math.floor(quantity);
    return true;
  }
  /**
   * Clears all items from the cart
   */
  clear() {
    this.items = [];
    this.discount = null;
  }
  /**
   * Gets current items
   */
  getItems() {
    return [...this.items];
  }
  setOrigin(origin) {
    this.origin = origin;
  }
  setDestination(destination) {
    this.destination = destination;
  }
  setShippingConfig(shipping) {
    this.shipping = shipping;
  }
  setPaymentConfig(payment) {
    this.payment = payment;
  }
  applyDiscount(discount) {
    this.discount = discount;
  }
  removeDiscount() {
    this.discount = null;
  }
  /**
   * Calculates Free Shipping Progress Bar status
   */
  calculateFreeShippingProgress(subtotal) {
    const threshold = this.shipping.freeShippingThreshold || 0;
    if (threshold <= 0) {
      return {
        threshold: 0,
        currentAmount: subtotal,
        amountRemaining: 0,
        percentage: 100,
        isEligible: true,
        message: "Free shipping unlocked! \u{1F389}"
      };
    }
    const currentAmount = subtotal;
    const amountRemaining = Math.max(0, Math.round((threshold - currentAmount) * 100) / 100);
    const percentage = Math.min(100, Math.round(currentAmount / threshold * 100));
    const isEligible = amountRemaining === 0;
    let message = "";
    if (isEligible) {
      message = "\u{1F389} Congratulations! You unlocked FREE Delivery!";
    } else {
      message = `\u{1F69A} Add \u20B9${amountRemaining} more to unlock FREE Delivery!`;
    }
    return {
      threshold,
      currentAmount,
      amountRemaining,
      percentage,
      isEligible,
      message
    };
  }
  /**
   * Produces a comprehensive summary with all taxes, discounts, shipping & checkout totals
   */
  getSummary() {
    const itemCount = this.items.length;
    const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = Math.round(
      this.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    ) / 100;
    const totalMRP = Math.round(
      this.items.reduce((sum, item) => {
        const mrp = item.compareAtPrice && item.compareAtPrice > item.price ? item.compareAtPrice : item.price;
        return sum + mrp * item.quantity;
      }, 0) * 100
    ) / 100;
    const freeShipping = this.calculateFreeShippingProgress(subtotal);
    let shippingFee = 0;
    if (!freeShipping.isEligible && subtotal > 0) {
      shippingFee = this.shipping.flatShippingRate || 0;
    }
    let discountAmount = 0;
    if (this.discount) {
      discountAmount = Math.min(subtotal, Math.max(0, this.discount.amount));
    }
    let codFee = 0;
    if (this.payment.paymentMethod === "cod" && subtotal > 0) {
      codFee = this.payment.codFee || 0;
    }
    let prepaidDiscount = 0;
    if (this.payment.paymentMethod === "prepaid" && this.payment.prepaidDiscountPercentage && this.payment.prepaidDiscountPercentage > 0) {
      const calculated = (subtotal - discountAmount) * (this.payment.prepaidDiscountPercentage / 100);
      prepaidDiscount = Math.round(calculated * 100) / 100;
      if (this.payment.prepaidDiscountMax && prepaidDiscount > this.payment.prepaidDiscountMax) {
        prepaidDiscount = this.payment.prepaidDiscountMax;
      }
    }
    const totalSavings = Math.round(
      (Math.max(0, totalMRP - subtotal) + discountAmount + prepaidDiscount) * 100
    ) / 100;
    const gst = GSTCalculator.calculate(this.items, this.origin, this.destination);
    let finalTotal = subtotal - discountAmount + shippingFee + codFee - prepaidDiscount;
    if (this.origin.taxMode === "exclusive") {
      finalTotal += gst.totalTax;
    }
    finalTotal = Math.max(0, Math.round(finalTotal * 100) / 100);
    return {
      items: [...this.items],
      itemCount,
      totalQuantity,
      subtotal,
      totalMRP,
      totalSavings,
      discount: this.discount ? { ...this.discount, amount: discountAmount } : null,
      shippingFee,
      codFee,
      prepaidDiscount,
      gst,
      freeShipping,
      finalTotal
    };
  }
  /**
   * Serializes current state to a portable JSON object (ideal for localStorage or DB)
   */
  toJSON() {
    return {
      items: this.items,
      discount: this.discount
    };
  }
  /**
   * Rehydrates cart from stored JSON
   */
  fromJSON(data) {
    if (data.items && Array.isArray(data.items)) {
      this.items = data.items.map((i) => ({ ...i }));
    }
    if (data.discount) {
      this.discount = data.discount;
    }
  }
};
function createBoostCart(options) {
  return new BoostCart(options);
}

exports.BoostCart = BoostCart;
exports.GSTCalculator = GSTCalculator;
exports.createBoostCart = createBoostCart;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map