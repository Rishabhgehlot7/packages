var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
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
function normalizeIndianState(state) {
  if (!state) return "";
  const clean = state.trim().toLowerCase();
  return STATE_CODE_MAP[clean] || clean;
}
var GSTCalculator = class {
  /**
   * Calculates detailed GST breakdown across cart items
   * Compliant with Indian GST rules (Intra-state CGST + SGST vs Inter-state IGST)
   */
  static calculate(items, origin, destination) {
    const originState = normalizeIndianState(origin.state);
    const destState = destination?.state ? normalizeIndianState(destination.state) : originState;
    const isIntraState = Boolean(originState && destState && originState === destState);
    const taxMode = origin.taxMode || "inclusive";
    let totalTaxable = 0;
    let totalTax = 0;
    const hsnMap = /* @__PURE__ */ new Map();
    for (const item of items) {
      if (item.quantity <= 0) continue;
      const isExempt = Boolean(item.isTaxExempt);
      const rate = isExempt ? 0 : item.taxRate !== void 0 ? item.taxRate : 18;
      const itemTotalPrice = Math.round(item.price * item.quantity * 100) / 100;
      const hsn = item.hsnCode || "GENERAL";
      let taxable = 0;
      let tax = 0;
      if (isExempt || rate === 0) {
        taxable = itemTotalPrice;
        tax = 0;
      } else if (taxMode === "inclusive") {
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

// src/events.ts
var CartEventEmitter = class {
  constructor() {
    __publicField(this, "listeners", /* @__PURE__ */ new Map());
    __publicField(this, "anyListeners", /* @__PURE__ */ new Set());
  }
  /**
   * Subscribe to a specific cart event
   */
  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, /* @__PURE__ */ new Set());
    }
    this.listeners.get(event).add(listener);
    return () => this.off(event, listener);
  }
  /**
   * Subscribe to all cart events
   */
  onAny(listener) {
    this.anyListeners.add(listener);
    return () => this.anyListeners.delete(listener);
  }
  /**
   * Unsubscribe from an event
   */
  off(event, listener) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }
  /**
   * Emit an event to all subscribed listeners safely
   */
  emit(payload) {
    const specific = this.listeners.get(payload.type);
    if (specific) {
      for (const listener of specific) {
        try {
          listener(payload);
        } catch (err) {
          console.error(`[BoostCart Event Error] Error in '${payload.type}' listener:`, err);
        }
      }
    }
    for (const listener of this.anyListeners) {
      try {
        listener(payload);
      } catch (err) {
        console.error(`[BoostCart Event Error] Error in wildcard listener:`, err);
      }
    }
  }
  /**
   * Clear all registered listeners
   */
  removeAllListeners() {
    this.listeners.clear();
    this.anyListeners.clear();
  }
};

// src/format.ts
var CurrencyFormatter = class {
  constructor(config = {}) {
    __publicField(this, "config");
    this.config = {
      code: config.code || "INR",
      symbol: config.symbol || "\u20B9",
      locale: config.locale || "en-IN",
      fractionDigits: config.fractionDigits !== void 0 ? config.fractionDigits : 2
    };
  }
  /**
   * Formats a raw number into a localized currency string
   * Example: 1499.5 -> "₹1,499.50"
   */
  format(amount) {
    const safeAmount = isNaN(amount) ? 0 : amount;
    try {
      const formattedNumber = new Intl.NumberFormat(this.config.locale, {
        minimumFractionDigits: this.config.fractionDigits,
        maximumFractionDigits: this.config.fractionDigits
      }).format(safeAmount);
      return `${this.config.symbol}${formattedNumber}`;
    } catch {
      return `${this.config.symbol}${safeAmount.toFixed(this.config.fractionDigits)}`;
    }
  }
  /**
   * Generates formatted strings for all summary values
   */
  formatSummary(raw) {
    return {
      subtotal: this.format(raw.subtotal),
      totalMRP: this.format(raw.totalMRP),
      totalSavings: this.format(raw.totalSavings),
      discountAmount: this.format(raw.discountAmount),
      shippingFee: raw.shippingFee === 0 ? "FREE" : this.format(raw.shippingFee),
      codFee: this.format(raw.codFee),
      prepaidDiscount: this.format(raw.prepaidDiscount),
      totalCustomFees: this.format(raw.totalCustomFees),
      totalTax: this.format(raw.totalTax),
      cgst: this.format(raw.cgst),
      sgst: this.format(raw.sgst),
      igst: this.format(raw.igst),
      finalTotal: this.format(raw.finalTotal)
    };
  }
};

// src/cart.ts
var BoostCart = class {
  constructor(options = {}) {
    __publicField(this, "items", []);
    __publicField(this, "customFees", []);
    __publicField(this, "origin");
    __publicField(this, "destination");
    __publicField(this, "shipping");
    __publicField(this, "payment");
    __publicField(this, "discountRule", null);
    __publicField(this, "storage");
    __publicField(this, "storageKey");
    __publicField(this, "events");
    __publicField(this, "formatter");
    __publicField(this, "subscribers", /* @__PURE__ */ new Set());
    __publicField(this, "recovery");
    __publicField(this, "storageUnsync");
    this.origin = options.origin || { state: "Maharashtra", taxMode: "inclusive" };
    this.destination = options.destination;
    this.shipping = options.shipping || { freeShippingThreshold: 999, flatShippingRate: 79 };
    this.payment = options.payment || { paymentMethod: "prepaid", codFee: 49, prepaidDiscountPercentage: 0 };
    this.storage = options.storage;
    this.storageKey = options.storageKey || "boost_cart";
    this.events = new CartEventEmitter();
    this.formatter = new CurrencyFormatter(options.currency);
    this.recovery = {
      lastModifiedAt: Date.now(),
      checkoutStep: "cart"
    };
    if (options.onEvent) {
      this.events.onAny(options.onEvent);
    }
    if (options.initialItems && options.initialItems.length > 0) {
      this.items = options.initialItems.map((i) => ({ ...i }));
    }
    if (options.initialFees && options.initialFees.length > 0) {
      this.customFees = options.initialFees.map((f) => ({ ...f }));
    }
    if (this.storage?.onSync) {
      this.storageUnsync = this.storage.onSync((raw) => {
        try {
          if (raw) {
            const parsed = JSON.parse(raw);
            this.fromJSON(parsed, false);
          }
        } catch {
        }
      });
    }
    this.tryRehydrateFromStorage();
  }
  getItemKey(item) {
    if (item.id) return item.id;
    return `${item.productId}_${item.variantId || "default"}`;
  }
  matchesItem(item, identifier) {
    return item.id === identifier || item.productId === identifier || `${item.productId}_${item.variantId || "default"}` === identifier;
  }
  notifySubscribers() {
    if (this.subscribers.size === 0) return;
    const summary = this.getSummary();
    for (const sub of this.subscribers) {
      try {
        sub(summary);
      } catch (err) {
        console.error("[BoostCart Subscriber Error]:", err);
      }
    }
  }
  triggerMutation(eventType, item, fee, syncStorage = true) {
    this.recovery.lastModifiedAt = Date.now();
    const summary = this.getSummary();
    this.events.emit({
      type: eventType,
      item,
      fee,
      discount: summary.discount,
      summary
    });
    this.notifySubscribers();
    if (syncStorage) {
      this.syncStorage();
    }
  }
  syncStorage() {
    if (!this.storage) return;
    try {
      const payload = JSON.stringify(this.toJSON());
      this.storage.setItem(this.storageKey, payload);
    } catch (err) {
      console.warn("[BoostCart Storage Error] Failed to persist cart state:", err);
    }
  }
  tryRehydrateFromStorage() {
    if (!this.storage) return;
    try {
      const raw = this.storage.getItem(this.storageKey);
      if (typeof raw === "string" && raw) {
        const parsed = JSON.parse(raw);
        this.fromJSON(parsed, false);
      } else if (raw && typeof raw.then === "function") {
        raw.then((asyncVal) => {
          if (asyncVal) {
            this.fromJSON(JSON.parse(asyncVal), false);
          }
        }).catch(() => {
        });
      }
    } catch {
    }
  }
  /**
   * Adds an item to the cart or increments its quantity if it already exists
   */
  addItem(item) {
    if (typeof item.price !== "number" || isNaN(item.price) || item.price < 0) {
      throw new Error(`[BoostCart] Item price must be a non-negative number. Received: ${item.price}`);
    }
    const key = this.getItemKey(item);
    const existing = this.items.find((i) => this.matchesItem(i, key));
    const addQty = item.quantity > 0 ? Math.floor(item.quantity) : 1;
    let affectedItem;
    if (existing) {
      const effectiveMaxStock = item.maxStock !== void 0 ? item.maxStock : existing.maxStock;
      let targetQty = existing.quantity + addQty;
      if (effectiveMaxStock !== void 0 && targetQty > effectiveMaxStock) {
        targetQty = effectiveMaxStock;
      }
      existing.quantity = targetQty;
      if (item.maxStock !== void 0) existing.maxStock = item.maxStock;
      if (item.price !== void 0) existing.price = item.price;
      if (item.title) existing.title = item.title;
      affectedItem = existing;
    } else {
      let initialQty = addQty;
      if (item.maxStock !== void 0 && initialQty > item.maxStock) {
        initialQty = item.maxStock;
      }
      const newItem = {
        ...item,
        id: key,
        quantity: initialQty
      };
      this.items.push(newItem);
      affectedItem = newItem;
    }
    this.triggerMutation("item:added", affectedItem);
    return affectedItem;
  }
  /**
   * Updates an item's quantity. If quantity <= 0, the item is removed.
   */
  updateQuantity(id, quantity) {
    const item = this.items.find((i) => this.matchesItem(i, id));
    if (!item) return false;
    if (quantity <= 0) {
      return this.removeItem(id);
    }
    let nextQty = Math.floor(quantity);
    if (item.maxStock !== void 0 && nextQty > item.maxStock) {
      nextQty = item.maxStock;
    }
    item.quantity = nextQty;
    this.triggerMutation("item:updated", item);
    return true;
  }
  /**
   * Removes an item by its unique ID, composite key, or productId
   */
  removeItem(id) {
    const itemIndex = this.items.findIndex((i) => this.matchesItem(i, id));
    if (itemIndex === -1) return false;
    const [removed] = this.items.splice(itemIndex, 1);
    this.triggerMutation("item:removed", removed);
    return true;
  }
  /**
   * Clears all items, applied discounts, and custom fees
   */
  clear() {
    this.items = [];
    this.discountRule = null;
    this.customFees = [];
    this.triggerMutation("cart:cleared");
  }
  /**
   * Returns a clean copy of all current items
   */
  getItems() {
    return this.items.map((i) => ({ ...i }));
  }
  /**
   * Finds a specific item by its ID or productId
   */
  getItem(id) {
    const found = this.items.find((i) => this.matchesItem(i, id));
    return found ? { ...found } : void 0;
  }
  /**
   * Checks if an item exists in the cart by its ID or productId
   */
  hasItem(id) {
    return this.items.some((i) => this.matchesItem(i, id));
  }
  // ==========================================
  // CUSTOM FEES & SURCHARGES (Gift Wrap, etc.)
  // ==========================================
  /**
   * Adds or updates a custom surcharge (e.g. Gift Wrap, Express Shipping, Fragile Packaging)
   */
  addFee(fee) {
    const existingIndex = this.customFees.findIndex((f) => f.id === fee.id);
    if (existingIndex !== -1) {
      this.customFees[existingIndex] = { ...fee };
    } else {
      this.customFees.push({ ...fee });
    }
    this.triggerMutation("fee:added", void 0, fee);
  }
  /**
   * Removes a custom surcharge by ID
   */
  removeFee(id) {
    const idx = this.customFees.findIndex((f) => f.id === id);
    if (idx === -1) return false;
    const [removed] = this.customFees.splice(idx, 1);
    this.triggerMutation("fee:removed", void 0, removed);
    return true;
  }
  /**
   * Returns all active custom fees
   */
  getFees() {
    return this.customFees.map((f) => ({ ...f }));
  }
  /**
   * Clears all active custom fees
   */
  clearFees() {
    this.customFees = [];
    this.triggerMutation("fee:removed");
  }
  // ==========================================
  // ABANDONED CART & FUNNEL RECOVERY
  // ==========================================
  /**
   * Sets customer contact information for abandoned cart recovery
   */
  setCustomerInfo(info) {
    if (info.email) this.recovery.customerEmail = info.email;
    if (info.phone) this.recovery.customerPhone = info.phone;
    if (info.name) this.recovery.customerName = info.name;
    this.triggerMutation("recovery:updated");
  }
  /**
   * Tracks customer's current checkout progress step
   */
  setCheckoutStep(step) {
    this.recovery.checkoutStep = step;
    this.triggerMutation("recovery:updated");
  }
  /**
   * Returns a ready-to-post payload for WhatsApp / SMS / Webhook abandoned cart bots
   */
  getRecoveryPayload() {
    const summary = this.getSummary();
    return {
      customer: {
        email: this.recovery.customerEmail,
        phone: this.recovery.customerPhone,
        name: this.recovery.customerName
      },
      checkoutStep: this.recovery.checkoutStep,
      lastModifiedAt: this.recovery.lastModifiedAt,
      subtotal: summary.subtotal,
      finalTotal: summary.finalTotal,
      itemCount: summary.totalQuantity,
      items: summary.items.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price
      }))
    };
  }
  // ==========================================
  // CART MERGE (Guest to User)
  // ==========================================
  /**
   * Merges another set of items into this cart (e.g. Guest Cart -> Logged-in Cart merge)
   */
  merge(source, options = {}) {
    const strategy = options.strategy || "combine";
    const sourceItems = Array.isArray(source) ? source : source.items || [];
    for (const item of sourceItems) {
      const key = this.getItemKey(item);
      const existing = this.items.find((i) => this.getItemKey(i) === key);
      if (existing) {
        if (strategy === "combine") {
          let newQty = existing.quantity + item.quantity;
          if (item.maxStock !== void 0 && newQty > item.maxStock) {
            newQty = item.maxStock;
          }
          existing.quantity = newQty;
        } else {
          existing.quantity = item.quantity;
        }
      } else {
        this.items.push({ ...item, id: key });
      }
    }
    if (!Array.isArray(source)) {
      if (source.discount) {
        this.applyDiscount(source.discount);
      }
      if (source.fees && Array.isArray(source.fees)) {
        for (const fee of source.fees) {
          this.addFee(fee);
        }
      }
    }
    this.triggerMutation("cart:merged");
  }
  // ==========================================
  // ADVANCED DISCOUNTS (Flat, %, BOGO, Tiered)
  // ==========================================
  /**
   * Validates whether a coupon code or discount rule can be applied to the current cart
   */
  validateDiscount(discount) {
    const subtotal = this.calculateBaseSubtotal();
    const code = discount.code.toUpperCase().trim();
    const minOrder = discount.minOrderValue || 0;
    if (minOrder > 0 && subtotal < minOrder) {
      return {
        isValid: false,
        code,
        amount: 0,
        error: `Minimum order value of ${this.formatter.format(minOrder)} required for code ${code}.`
      };
    }
    const type = discount.type || "flat";
    const rawDiscount = discount;
    const discountValue = rawDiscount.value !== void 0 ? rawDiscount.value : rawDiscount.amount !== void 0 ? rawDiscount.amount : 0;
    let computedAmount = 0;
    if (type === "flat") {
      computedAmount = Math.min(subtotal, Math.max(0, discountValue));
    } else if (type === "percentage") {
      const pctDiscount = subtotal * (discountValue / 100);
      const maxCap = discount.maxDiscount;
      computedAmount = maxCap && pctDiscount > maxCap ? maxCap : pctDiscount;
      computedAmount = Math.min(subtotal, Math.round(computedAmount * 100) / 100);
    } else if (type === "free_shipping") {
      computedAmount = 0;
    } else if (type === "bogo") {
      const bogo = discount.bogoConfig || { buyQuantity: 2, getQuantity: 1 };
      const setSize = bogo.buyQuantity + bogo.getQuantity;
      const qualifyingUnitPrices = [];
      for (const item of this.items) {
        if (!bogo.eligibleProductIds || bogo.eligibleProductIds.includes(item.productId)) {
          for (let q = 0; q < item.quantity; q++) {
            qualifyingUnitPrices.push(item.price);
          }
        }
      }
      if (qualifyingUnitPrices.length < setSize) {
        return {
          isValid: false,
          code,
          amount: 0,
          error: `Code ${code} requires purchasing at least ${setSize} qualifying items.`
        };
      }
      qualifyingUnitPrices.sort((a, b) => a - b);
      const freeUnitsCount = Math.floor(qualifyingUnitPrices.length / setSize) * bogo.getQuantity;
      computedAmount = qualifyingUnitPrices.slice(0, freeUnitsCount).reduce((sum, p) => sum + p, 0);
    } else if (type === "tiered") {
      const rules = discount.tieredRules || [];
      const totalUnits = this.items.reduce((sum, item) => sum + item.quantity, 0);
      const sortedRules = [...rules].sort((a, b) => b.minQuantity - a.minQuantity);
      const matchedRule = sortedRules.find((r) => totalUnits >= r.minQuantity);
      if (!matchedRule) {
        const lowestReq = sortedRules[sortedRules.length - 1]?.minQuantity || 2;
        return {
          isValid: false,
          code,
          amount: 0,
          error: `Code ${code} requires at least ${lowestReq} items in cart to unlock tier discount.`
        };
      }
      const pctDiscount = subtotal * (matchedRule.discountPercentage / 100);
      const maxCap = discount.maxDiscount;
      computedAmount = maxCap && pctDiscount > maxCap ? maxCap : pctDiscount;
      computedAmount = Math.min(subtotal, Math.round(computedAmount * 100) / 100);
    }
    return {
      isValid: true,
      code,
      amount: Math.max(0, Math.round(computedAmount * 100) / 100)
    };
  }
  /**
   * Applies a coupon discount (supports Flat, Percentage with Max Cap, Free Shipping, BOGO, and Tiered rules)
   */
  applyDiscount(discount) {
    const raw = discount;
    const normalizedRule = {
      code: discount.code.toUpperCase().trim(),
      type: discount.type || "flat",
      value: raw.value !== void 0 ? raw.value : raw.amount !== void 0 ? raw.amount : 0,
      minOrderValue: discount.minOrderValue,
      maxDiscount: discount.maxDiscount,
      bogoConfig: discount.bogoConfig,
      tieredRules: discount.tieredRules,
      description: discount.description
    };
    const validation = this.validateDiscount(normalizedRule);
    if (!validation.isValid) {
      return validation;
    }
    this.discountRule = normalizedRule;
    this.triggerMutation("discount:applied");
    return validation;
  }
  /**
   * Removes currently applied discount coupon
   */
  removeDiscount() {
    if (this.discountRule) {
      this.discountRule = null;
      this.triggerMutation("discount:removed");
    }
  }
  setOrigin(origin) {
    this.origin = origin;
    this.triggerMutation("config:updated");
  }
  setDestination(destination) {
    this.destination = destination;
    this.triggerMutation("config:updated");
  }
  setShippingConfig(shipping) {
    this.shipping = shipping;
    this.triggerMutation("config:updated");
  }
  setPaymentConfig(payment) {
    this.payment = payment;
    this.triggerMutation("config:updated");
  }
  setCurrency(currency) {
    this.formatter = new CurrencyFormatter(currency);
    this.triggerMutation("config:updated");
  }
  /**
   * Subscribes to cart state changes (Svelte store & React useSyncExternalStore compliant)
   */
  subscribe(listener) {
    this.subscribers.add(listener);
    listener(this.getSummary());
    return () => {
      this.subscribers.delete(listener);
    };
  }
  /**
   * Subscribes to fine-grained cart events ('item:added', 'fee:added', etc.)
   */
  on(event, listener) {
    return this.events.on(event, listener);
  }
  /**
   * Subscribes to any cart event
   */
  onAny(listener) {
    return this.events.onAny(listener);
  }
  calculateBaseSubtotal() {
    return Math.round(
      this.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    ) / 100;
  }
  /**
   * Calculates Free Shipping Progress Bar status
   */
  calculateFreeShippingProgress(subtotal) {
    const threshold = this.shipping.freeShippingThreshold || 0;
    if (threshold <= 0 || this.shipping.isPromotionalFreeShipping) {
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
      const remainingStr = this.formatter.format(amountRemaining);
      message = `\u{1F69A} Add ${remainingStr} more to unlock FREE Delivery!`;
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
   * Produces a comprehensive summary with all taxes, discounts, shipping, custom fees & checkout totals
   */
  getSummary() {
    const itemCount = this.items.length;
    const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalWeightGrams = this.items.reduce(
      (sum, item) => sum + (item.weightGrams || 0) * item.quantity,
      0
    );
    const subtotal = this.calculateBaseSubtotal();
    const totalMRP = Math.round(
      this.items.reduce((sum, item) => {
        const mrp = item.compareAtPrice && item.compareAtPrice > item.price ? item.compareAtPrice : item.price;
        return sum + mrp * item.quantity;
      }, 0) * 100
    ) / 100;
    const freeShipping = this.calculateFreeShippingProgress(subtotal);
    let shippingFee = 0;
    const hasFreeShippingCoupon = this.discountRule?.type === "free_shipping";
    if (!freeShipping.isEligible && !hasFreeShippingCoupon && !this.shipping.isPromotionalFreeShipping && subtotal > 0) {
      shippingFee = this.shipping.flatShippingRate || 0;
    }
    let appliedDiscount = null;
    let discountAmount = 0;
    if (this.discountRule) {
      const validation = this.validateDiscount(this.discountRule);
      if (validation.isValid) {
        discountAmount = validation.amount;
        appliedDiscount = {
          code: this.discountRule.code,
          type: this.discountRule.type,
          value: this.discountRule.value || 0,
          amount: discountAmount,
          description: this.discountRule.description
        };
      }
    }
    const totalCustomFees = Math.round(
      this.customFees.reduce((sum, fee) => sum + fee.amount, 0) * 100
    ) / 100;
    let codFee = 0;
    if (this.payment.paymentMethod === "cod" && subtotal > 0) {
      codFee = this.payment.codFee || 0;
    }
    let prepaidDiscount = 0;
    if (this.payment.paymentMethod === "prepaid" && this.payment.prepaidDiscountPercentage && this.payment.prepaidDiscountPercentage > 0) {
      const eligibleBase = Math.max(0, subtotal - discountAmount);
      const calculated = eligibleBase * (this.payment.prepaidDiscountPercentage / 100);
      prepaidDiscount = Math.round(calculated * 100) / 100;
      if (this.payment.prepaidDiscountMax && prepaidDiscount > this.payment.prepaidDiscountMax) {
        prepaidDiscount = this.payment.prepaidDiscountMax;
      }
    }
    const mrpDiscount = Math.max(0, totalMRP - subtotal);
    const totalSavings = Math.round((mrpDiscount + discountAmount + prepaidDiscount) * 100) / 100;
    const gstItems = [...this.items];
    for (const fee of this.customFees) {
      if (fee.isTaxable) {
        gstItems.push({
          id: `fee_${fee.id}`,
          productId: `fee_${fee.id}`,
          title: fee.title,
          price: fee.amount,
          quantity: 1,
          taxRate: fee.taxRate !== void 0 ? fee.taxRate : 18,
          hsnCode: "9968"
          // Services HSN
        });
      }
    }
    const gst = GSTCalculator.calculate(gstItems, this.origin, this.destination);
    let finalTotal = subtotal - discountAmount + shippingFee + codFee + totalCustomFees - prepaidDiscount;
    if (this.origin.taxMode === "exclusive") {
      finalTotal += gst.totalTax;
    }
    if (this.items.length === 0) {
      finalTotal = 0;
    } else {
      finalTotal = Math.max(0, Math.round(finalTotal * 100) / 100);
    }
    const formatted = this.formatter.formatSummary({
      subtotal,
      totalMRP,
      totalSavings,
      discountAmount,
      shippingFee,
      codFee,
      prepaidDiscount,
      totalCustomFees,
      totalTax: gst.totalTax,
      cgst: gst.cgst,
      sgst: gst.sgst,
      igst: gst.igst,
      finalTotal
    });
    return {
      items: this.getItems(),
      itemCount,
      totalQuantity,
      totalWeightGrams,
      subtotal,
      totalMRP,
      totalSavings,
      discount: appliedDiscount,
      customFees: this.getFees(),
      totalCustomFees,
      shippingFee,
      codFee,
      prepaidDiscount,
      gst,
      freeShipping,
      finalTotal,
      formatted,
      recovery: { ...this.recovery }
    };
  }
  /**
   * Serializes current state to a portable JSON object
   */
  toJSON() {
    return {
      items: this.items,
      discount: this.discountRule,
      fees: this.customFees,
      origin: this.origin,
      destination: this.destination,
      shipping: this.shipping,
      payment: this.payment,
      recovery: this.recovery
    };
  }
  /**
   * Rehydrates cart from stored JSON object
   */
  fromJSON(data, syncStorage = true) {
    if (data.items && Array.isArray(data.items)) {
      this.items = data.items.map((i) => ({ ...i }));
    }
    if (data.discount) {
      this.applyDiscount(data.discount);
    } else if (data.discount === null) {
      this.discountRule = null;
    }
    if (data.fees && Array.isArray(data.fees)) {
      this.customFees = data.fees.map((f) => ({ ...f }));
    }
    if (data.origin) this.origin = data.origin;
    if (data.destination) this.destination = data.destination;
    if (data.shipping) this.shipping = data.shipping;
    if (data.payment) this.payment = data.payment;
    if (data.recovery) this.recovery = { ...data.recovery };
    this.triggerMutation("cart:rehydrated", void 0, void 0, syncStorage);
  }
  destroy() {
    if (this.storageUnsync) {
      this.storageUnsync();
    }
    this.subscribers.clear();
    this.events.removeAllListeners();
  }
};
function createBoostCart(options) {
  return new BoostCart(options);
}

// src/storage.ts
var MemoryStorageAdapter = class {
  constructor() {
    __publicField(this, "memory", /* @__PURE__ */ new Map());
    __publicField(this, "syncListeners", /* @__PURE__ */ new Set());
  }
  getItem(key) {
    return this.memory.get(key) ?? null;
  }
  setItem(key, value) {
    this.memory.set(key, value);
    for (const listener of this.syncListeners) {
      listener(value);
    }
  }
  removeItem(key) {
    this.memory.delete(key);
  }
  clear() {
    this.memory.clear();
  }
  onSync(callback) {
    this.syncListeners.add(callback);
    return () => this.syncListeners.delete(callback);
  }
};
var LocalStorageAdapter = class {
  constructor(options = {}) {
    __publicField(this, "key");
    __publicField(this, "isBrowser");
    __publicField(this, "syncCallbacks", /* @__PURE__ */ new Set());
    __publicField(this, "storageEventListener");
    this.key = options.key || "boost_cart";
    this.isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";
    const enableCrossTab = options.crossTabSync !== false;
    if (this.isBrowser && enableCrossTab) {
      this.storageEventListener = (e) => {
        if (e.key === this.key && e.newValue) {
          for (const cb of this.syncCallbacks) {
            try {
              cb(e.newValue);
            } catch (err) {
              console.error("[BoostCart Cross-Tab Sync Error]:", err);
            }
          }
        }
      };
      window.addEventListener("storage", this.storageEventListener);
    }
  }
  getItem(key = this.key) {
    if (!this.isBrowser) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  setItem(key = this.key, value) {
    if (!this.isBrowser) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
    }
  }
  removeItem(key = this.key) {
    if (!this.isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
    }
  }
  /**
   * Registers a callback triggered whenever another browser tab updates the cart
   */
  onSync(callback) {
    this.syncCallbacks.add(callback);
    return () => this.syncCallbacks.delete(callback);
  }
  destroy() {
    if (this.isBrowser && this.storageEventListener) {
      window.removeEventListener("storage", this.storageEventListener);
    }
    this.syncCallbacks.clear();
  }
};
var SessionStorageAdapter = class {
  constructor(options = {}) {
    __publicField(this, "key");
    __publicField(this, "isBrowser");
    this.key = options.key || "boost_cart_session";
    this.isBrowser = typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
  }
  getItem(key = this.key) {
    if (!this.isBrowser) return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }
  setItem(key = this.key, value) {
    if (!this.isBrowser) return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
    }
  }
  removeItem(key = this.key) {
    if (!this.isBrowser) return;
    try {
      window.sessionStorage.removeItem(key);
    } catch {
    }
  }
};
var AsyncStorageAdapter = class {
  constructor(storage, options = {}) {
    __publicField(this, "storage");
    __publicField(this, "key");
    this.storage = storage;
    this.key = options.key || "boost_cart_mobile";
  }
  async getItem(key = this.key) {
    try {
      return await this.storage.getItem(key);
    } catch {
      return null;
    }
  }
  async setItem(key = this.key, value) {
    try {
      await this.storage.setItem(key, value);
    } catch {
    }
  }
  async removeItem(key = this.key) {
    try {
      await this.storage.removeItem(key);
    } catch {
    }
  }
};
function createMemoryStorageAdapter() {
  return new MemoryStorageAdapter();
}
function createLocalStorageAdapter(options) {
  return new LocalStorageAdapter(options);
}
function createSessionStorageAdapter(options) {
  return new SessionStorageAdapter(options);
}
function createAsyncStorageAdapter(storage, options) {
  return new AsyncStorageAdapter(storage, options);
}

// src/react.ts
function createCartHookBindings(cart, summary) {
  return {
    ...summary,
    cart,
    addItem: cart.addItem.bind(cart),
    removeItem: cart.removeItem.bind(cart),
    updateQuantity: cart.updateQuantity.bind(cart),
    clear: cart.clear.bind(cart),
    applyDiscount: cart.applyDiscount.bind(cart),
    removeDiscount: cart.removeDiscount.bind(cart)
  };
}
function useBoostCart(cart) {
  let React;
  try {
    React = __require("react");
  } catch {
    return createCartHookBindings(cart, cart.getSummary());
  }
  if (React?.useSyncExternalStore) {
    const summary2 = React.useSyncExternalStore(
      (callback) => cart.subscribe(callback),
      () => cart.getSummary(),
      () => cart.getSummary()
      // SSR snapshot for Next.js App Router
    );
    return createCartHookBindings(cart, summary2);
  }
  const [summary, setSummary] = React.useState(() => cart.getSummary());
  React.useEffect(() => {
    return cart.subscribe((nextSummary) => {
      setSummary(nextSummary);
    });
  }, [cart]);
  return createCartHookBindings(cart, summary);
}

// src/agent.ts
var CartAgentToolkit = class {
  /**
   * Generates a concise, LLM-friendly markdown report of the current cart
   */
  static inspect(cart) {
    const s = cart.getSummary();
    const itemsList = s.items.map(
      (i, idx) => `  ${idx + 1}. [${i.id}] "${i.title}" x ${i.quantity} @ ${i.price} (HSN: ${i.hsnCode || "N/A"}, GST: ${i.taxRate ?? 18}%)`
    ).join("\n");
    return [
      `\u{1F6D2} **BoostCart State Report**`,
      `Items (${s.totalQuantity} units across ${s.itemCount} distinct products):`,
      itemsList || "  (Cart is empty)",
      `
\u{1F4CA} **Financials**:`,
      `- Subtotal: ${s.formatted.subtotal}`,
      `- Total MRP: ${s.formatted.totalMRP}`,
      `- Total Customer Savings: ${s.formatted.totalSavings}`,
      s.discount ? `- Discount Applied: ${s.discount.code} (-${s.formatted.discountAmount})` : `- Discount: None`,
      `- Shipping Fee: ${s.formatted.shippingFee} (${s.freeShipping.message})`,
      s.codFee > 0 ? `- COD Fee: ${s.formatted.codFee}` : null,
      s.prepaidDiscount > 0 ? `- Prepaid Instant Cashback: -${s.formatted.prepaidDiscount}` : null,
      `- Indian GST (${s.gst.taxType}): ${s.formatted.totalTax} (CGST: ${s.formatted.cgst}, SGST: ${s.formatted.sgst}, IGST: ${s.formatted.igst})`,
      `---------------------------------`,
      `\u{1F4B0} **Final Payable Total: ${s.formatted.finalTotal}**`
    ].filter(Boolean).join("\n");
  }
  /**
   * Validates an item object before passing to addItem, giving agents actionable hints
   */
  static validateItem(item) {
    const errors = [];
    if (!item || typeof item !== "object") {
      return { valid: false, errors: ["Item must be an object"] };
    }
    if (!item.productId) errors.push('Missing required property: "productId"');
    if (!item.title) errors.push('Missing required property: "title"');
    if (typeof item.price !== "number" || isNaN(item.price) || item.price < 0) {
      errors.push('Property "price" must be a non-negative number');
    }
    if (item.quantity !== void 0 && (typeof item.quantity !== "number" || item.quantity < 1)) {
      errors.push('Property "quantity" must be an integer >= 1');
    }
    if (item.taxRate !== void 0 && (typeof item.taxRate !== "number" || item.taxRate < 0 || item.taxRate > 100)) {
      errors.push('Property "taxRate" must be a percentage between 0 and 100');
    }
    return { valid: errors.length === 0, errors };
  }
};

export { AsyncStorageAdapter, BoostCart, CartAgentToolkit, CartEventEmitter, CurrencyFormatter, GSTCalculator, LocalStorageAdapter, MemoryStorageAdapter, SessionStorageAdapter, createAsyncStorageAdapter, createBoostCart, createCartHookBindings, createLocalStorageAdapter, createMemoryStorageAdapter, createSessionStorageAdapter, normalizeIndianState, useBoostCart };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map