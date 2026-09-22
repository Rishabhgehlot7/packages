// src/engine.ts
var DealsEngine = class {
  /**
   * Calculate time remaining from the given endDate.
   */
  static calculateTimeRemaining(endDate) {
    const total = Date.parse(endDate.toString()) - Date.parse((/* @__PURE__ */ new Date()).toString());
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    const seconds = Math.floor(total / 1e3 % 60);
    const minutes = Math.floor(total / 1e3 / 60 % 60);
    const hours = Math.floor(total / (1e3 * 60 * 60) % 24);
    const days = Math.floor(total / (1e3 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, isExpired: false };
  }
  /**
   * Calculate claim percentage and sold out status.
   */
  static calculateClaimInfo(claimedCount = 0, totalLimit) {
    if (!totalLimit || totalLimit <= 0) {
      return {
        claimedCount,
        percentageClaimed: 0,
        isSoldOut: false
      };
    }
    const safeClaimed = Math.max(0, claimedCount);
    const percentage = Math.min(100, Math.round(safeClaimed / totalLimit * 100));
    const remainingClaims = Math.max(0, totalLimit - safeClaimed);
    return {
      totalLimit,
      claimedCount: safeClaimed,
      percentageClaimed: percentage,
      isSoldOut: safeClaimed >= totalLimit,
      remainingClaims
    };
  }
  /**
   * Compute final discounted price and savings for a single item.
   */
  static computeDealPrice(originalPrice, deal) {
    if (originalPrice <= 0) {
      return { originalPrice: 0, dealPrice: 0, savings: 0, discountPercentage: 0 };
    }
    let dealPrice = originalPrice;
    let savings = 0;
    let discountPercentage = 0;
    switch (deal.type) {
      case "percentage":
      case "flash_sale": {
        const pct = Math.min(100, Math.max(0, deal.discountValue));
        savings = originalPrice * pct / 100;
        dealPrice = Math.max(0, originalPrice - savings);
        discountPercentage = pct;
        break;
      }
      case "fixed_discount": {
        savings = Math.min(originalPrice, Math.max(0, deal.discountValue));
        dealPrice = Math.max(0, originalPrice - savings);
        discountPercentage = originalPrice > 0 ? Math.round(savings / originalPrice * 100) : 0;
        break;
      }
    }
    return {
      originalPrice: Number(originalPrice.toFixed(2)),
      dealPrice: Number(dealPrice.toFixed(2)),
      savings: Number(savings.toFixed(2)),
      discountPercentage
    };
  }
};
var BoostDealsManager = class {
  dealsMap = /* @__PURE__ */ new Map();
  reservationsMap = /* @__PURE__ */ new Map();
  userClaimsMap = /* @__PURE__ */ new Map();
  // `${dealId}_${userId}` -> count
  eventListeners = /* @__PURE__ */ new Map();
  defaultTTL;
  constructor(options = {}) {
    this.defaultTTL = options.ttlSeconds || 600;
  }
  // --- Real-time Event Emitter ---
  on(event, handler) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, /* @__PURE__ */ new Set());
    }
    this.eventListeners.get(event).add(handler);
    return () => this.off(event, handler);
  }
  off(event, handler) {
    const set = this.eventListeners.get(event);
    if (set) {
      set.delete(handler);
    }
  }
  emit(event, payload) {
    const set = this.eventListeners.get(event);
    if (set) {
      for (const handler of set) {
        try {
          handler(payload);
        } catch (e) {
          console.error(`[BoostDeals] Error in "${event}" event handler:`, e);
        }
      }
    }
  }
  // --- Deal Registration & Management ---
  registerDeal(deal) {
    const normalized = {
      ...deal,
      claimedCount: deal.claimedCount || 0,
      stackable: deal.stackable !== void 0 ? deal.stackable : true,
      exclusive: deal.exclusive || false,
      priority: deal.priority || 0
    };
    this.dealsMap.set(deal.id, normalized);
    this.emit("deal:registered", normalized);
    return normalized;
  }
  registerDeals(deals2) {
    return deals2.map((d) => this.registerDeal(d));
  }
  getDeal(dealId) {
    return this.dealsMap.get(dealId);
  }
  removeDeal(dealId) {
    return this.dealsMap.delete(dealId);
  }
  clear() {
    this.dealsMap.clear();
    this.reservationsMap.clear();
    this.userClaimsMap.clear();
  }
  // --- TTL Sweeping & Claim Reservations ---
  sweepExpiredReservations() {
    const now = (/* @__PURE__ */ new Date()).getTime();
    let releasedCount = 0;
    for (const [id, res] of this.reservationsMap.entries()) {
      if (Date.parse(res.expiresAt) <= now) {
        const deal = this.dealsMap.get(res.dealId);
        if (deal && deal.claimedCount) {
          deal.claimedCount = Math.max(0, deal.claimedCount - res.quantity);
        }
        const userKey = `${res.dealId}_${res.userId}`;
        const currentCount = this.userClaimsMap.get(userKey) || 0;
        const newCount = Math.max(0, currentCount - res.quantity);
        if (newCount === 0) {
          this.userClaimsMap.delete(userKey);
        } else {
          this.userClaimsMap.set(userKey, newCount);
        }
        this.reservationsMap.delete(id);
        releasedCount += res.quantity;
        this.emit("claim:released", {
          dealId: res.dealId,
          reservationId: id,
          userId: res.userId,
          quantity: res.quantity,
          reason: "expired"
        });
      }
    }
    return releasedCount;
  }
  /**
   * Reserve a claim with TTL lock, bot protection (maxClaimsPerUser), and stock verification.
   */
  reserveClaim(dealId, userId, quantity = 1, ttlSeconds) {
    this.sweepExpiredReservations();
    const deal = this.dealsMap.get(dealId);
    if (!deal) {
      throw new Error(`Deal with ID "${dealId}" not found.`);
    }
    const now = /* @__PURE__ */ new Date();
    const isStarted = Date.parse(deal.startDate) <= now.getTime();
    const isEnded = Date.parse(deal.endDate) <= now.getTime();
    if (!isStarted) {
      throw new Error(`Deal "${deal.title}" has not started yet.`);
    }
    if (isEnded) {
      this.emit("deal:expired", { dealId, title: deal.title });
      throw new Error(`Deal "${deal.title}" has already ended.`);
    }
    const userKey = `${dealId}_${userId}`;
    const userClaims = this.userClaimsMap.get(userKey) || 0;
    if (deal.maxClaimsPerUser && userClaims + quantity > deal.maxClaimsPerUser) {
      throw new Error(`Deal "${deal.title}" limit of ${deal.maxClaimsPerUser} claim(s) per customer reached.`);
    }
    const currentClaimed = deal.claimedCount || 0;
    if (deal.totalClaimLimit && currentClaimed + quantity > deal.totalClaimLimit) {
      this.emit("deal:sold_out", { dealId, title: deal.title, totalClaimLimit: deal.totalClaimLimit });
      throw new Error(`Deal "${deal.title}" claim limit reached. Sold out!`);
    }
    deal.claimedCount = currentClaimed + quantity;
    this.userClaimsMap.set(userKey, userClaims + quantity);
    const ttl = ttlSeconds || this.defaultTTL;
    const expiresAt = new Date(now.getTime() + ttl * 1e3).toISOString();
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const reservation = {
      reservationId,
      dealId,
      userId,
      quantity,
      reservedAt: now.toISOString(),
      expiresAt
    };
    this.reservationsMap.set(reservationId, reservation);
    this.emit("claim:reserved", {
      dealId,
      userId,
      reservationId,
      quantity,
      remainingClaims: deal.totalClaimLimit ? Math.max(0, deal.totalClaimLimit - deal.claimedCount) : void 0
    });
    if (deal.totalClaimLimit && deal.claimedCount >= deal.totalClaimLimit) {
      this.emit("deal:sold_out", { dealId, title: deal.title, totalClaimLimit: deal.totalClaimLimit });
    }
    return reservation;
  }
  /**
   * Explicitly release a reserved claim if customer leaves checkout.
   */
  releaseClaim(reservationId) {
    const res = this.reservationsMap.get(reservationId);
    if (!res) return false;
    const deal = this.dealsMap.get(res.dealId);
    if (deal && deal.claimedCount) {
      deal.claimedCount = Math.max(0, deal.claimedCount - res.quantity);
    }
    const userKey = `${res.dealId}_${res.userId}`;
    const userClaims = this.userClaimsMap.get(userKey) || 0;
    const newClaims = Math.max(0, userClaims - res.quantity);
    if (newClaims === 0) {
      this.userClaimsMap.delete(userKey);
    } else {
      this.userClaimsMap.set(userKey, newClaims);
    }
    this.reservationsMap.delete(reservationId);
    this.emit("claim:released", {
      dealId: res.dealId,
      reservationId,
      userId: res.userId,
      quantity: res.quantity,
      reason: "manual_cancel"
    });
    return true;
  }
  /**
   * Commit reservation upon successful payment/checkout.
   */
  commitClaim(reservationId) {
    const res = this.reservationsMap.get(reservationId);
    if (!res) return false;
    this.reservationsMap.delete(reservationId);
    this.emit("claim:committed", {
      dealId: res.dealId,
      reservationId,
      userId: res.userId,
      quantity: res.quantity
    });
    return true;
  }
  // --- Queries ---
  listActiveDeals() {
    this.sweepExpiredReservations();
    const now = (/* @__PURE__ */ new Date()).getTime();
    return Array.from(this.dealsMap.values()).filter((deal) => {
      const start = Date.parse(deal.startDate);
      const end = Date.parse(deal.endDate);
      const hasStock = !deal.totalClaimLimit || (deal.claimedCount || 0) < deal.totalClaimLimit;
      return now >= start && now <= end && hasStock;
    });
  }
  listUpcomingDeals() {
    const now = (/* @__PURE__ */ new Date()).getTime();
    return Array.from(this.dealsMap.values()).filter((deal) => {
      return Date.parse(deal.startDate) > now;
    });
  }
  computeProductDeal(productId, originalPrice, category) {
    const activeDeals = this.listActiveDeals();
    activeDeals.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    let bestDeal;
    let maxSavings = 0;
    let bestCalculation = {
      originalPrice,
      dealPrice: originalPrice,
      savings: 0,
      discountPercentage: 0
    };
    for (const deal of activeDeals) {
      const matchesProduct = !deal.applicableProductIds || deal.applicableProductIds.includes(productId);
      const matchesCategory = !deal.applicableCategories || category && deal.applicableCategories.includes(category);
      if (matchesProduct && matchesCategory) {
        const calc = DealsEngine.computeDealPrice(originalPrice, deal);
        if (deal.exclusive) {
          if (calc.savings > 0) {
            return { bestDeal: deal, calculation: calc };
          }
        }
        if (calc.savings > maxSavings) {
          maxSavings = calc.savings;
          bestDeal = deal;
          bestCalculation = calc;
        }
      }
    }
    return { bestDeal, calculation: bestCalculation };
  }
  /**
   * Evaluate deals across an entire shopping cart with Priority, Exclusivity, and Stacking rules.
   */
  evaluateCartDeals(cartItems) {
    const activeDeals = this.listActiveDeals();
    activeDeals.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const appliedDeals = [];
    const itemPriceOverrides = {};
    const itemAppliedDeals = /* @__PURE__ */ new Map();
    let originalSubtotal = 0;
    let totalSavings = 0;
    for (const item of cartItems) {
      originalSubtotal += item.unitPrice * item.quantity;
      itemPriceOverrides[item.productId] = item.unitPrice;
      itemAppliedDeals.set(item.productId, []);
    }
    const globalExclusiveDeal = activeDeals.find((d) => d.exclusive && d.type === "spend_threshold");
    if (globalExclusiveDeal && globalExclusiveDeal.spendThreshold && originalSubtotal >= globalExclusiveDeal.spendThreshold.minimumSpend) {
      const discount = globalExclusiveDeal.spendThreshold.discountAmount;
      return {
        originalSubtotal: Number(originalSubtotal.toFixed(2)),
        discountedSubtotal: Number((originalSubtotal - discount).toFixed(2)),
        totalSavings: Number(discount.toFixed(2)),
        appliedDeals: [{
          dealId: globalExclusiveDeal.id,
          dealTitle: globalExclusiveDeal.title,
          dealType: globalExclusiveDeal.type,
          discountAmount: discount,
          affectedProductIds: cartItems.map((i) => i.productId),
          details: `Exclusive Promotion: Saved $${discount.toFixed(2)}`,
          exclusive: true
        }],
        itemPriceOverrides
      };
    }
    for (const item of cartItems) {
      let itemDiscount = 0;
      for (const deal of activeDeals) {
        const matchesProduct = !deal.applicableProductIds || deal.applicableProductIds.includes(item.productId);
        const matchesCategory = !deal.applicableCategories || item.category && deal.applicableCategories.includes(item.category);
        if (!matchesProduct || !matchesCategory) continue;
        const alreadyApplied = itemAppliedDeals.get(item.productId) || [];
        const hasUnstackable = alreadyApplied.some((d) => d.stackable === false);
        if (hasUnstackable || alreadyApplied.length > 0 && deal.stackable === false) {
          continue;
        }
        if (deal.type === "bogo" && deal.bogoRule) {
          const rule = deal.bogoRule;
          const bundleSize = rule.buyQuantity + rule.getQuantity;
          const completeBundles = Math.floor(item.quantity / bundleSize);
          if (completeBundles > 0) {
            const freeUnits = completeBundles * rule.getQuantity;
            const savingsForDeal = freeUnits * item.unitPrice * (rule.discountPercentage / 100);
            itemDiscount += savingsForDeal;
            alreadyApplied.push(deal);
            appliedDeals.push({
              dealId: deal.id,
              dealTitle: deal.title,
              dealType: deal.type,
              discountAmount: Number(savingsForDeal.toFixed(2)),
              affectedProductIds: [item.productId],
              details: `BOGO: Buy ${rule.buyQuantity}, get ${rule.getQuantity} at ${rule.discountPercentage}% off`,
              exclusive: deal.exclusive
            });
            if (deal.exclusive) break;
          }
        } else if (deal.type === "tiered_volume" && deal.tiers && deal.tiers.length > 0) {
          const sortedTiers = [...deal.tiers].sort((a, b) => b.minQuantity - a.minQuantity);
          const matchedTier = sortedTiers.find((t) => item.quantity >= t.minQuantity);
          if (matchedTier) {
            const savingsForDeal = item.unitPrice * item.quantity * matchedTier.discountPercentage / 100;
            itemDiscount += savingsForDeal;
            alreadyApplied.push(deal);
            appliedDeals.push({
              dealId: deal.id,
              dealTitle: deal.title,
              dealType: deal.type,
              discountAmount: Number(savingsForDeal.toFixed(2)),
              affectedProductIds: [item.productId],
              details: `Volume Discount: ${matchedTier.discountPercentage}% off for buying ${item.quantity}+ units`,
              exclusive: deal.exclusive
            });
            if (deal.exclusive) break;
          }
        } else if (["percentage", "flash_sale", "fixed_discount"].includes(deal.type)) {
          const singleCalc = DealsEngine.computeDealPrice(item.unitPrice, deal);
          const totalDealSavings = singleCalc.savings * item.quantity;
          if (totalDealSavings > 0) {
            itemDiscount += totalDealSavings;
            alreadyApplied.push(deal);
            appliedDeals.push({
              dealId: deal.id,
              dealTitle: deal.title,
              dealType: deal.type,
              discountAmount: Number(totalDealSavings.toFixed(2)),
              affectedProductIds: [item.productId],
              details: `${deal.title}: Saved $${singleCalc.savings.toFixed(2)} per unit`,
              exclusive: deal.exclusive
            });
            if (deal.exclusive) break;
          }
        }
      }
      if (itemDiscount > 0) {
        totalSavings += itemDiscount;
        const newTotal = item.unitPrice * item.quantity - itemDiscount;
        itemPriceOverrides[item.productId] = Number((newTotal / item.quantity).toFixed(2));
      }
    }
    let currentSubtotal = originalSubtotal - totalSavings;
    for (const deal of activeDeals) {
      if (deal.type === "spend_threshold" && deal.spendThreshold) {
        const threshold = deal.spendThreshold;
        if (currentSubtotal >= threshold.minimumSpend) {
          let cartDiscount = threshold.discountAmount;
          if (threshold.discountPercentage) {
            cartDiscount = currentSubtotal * threshold.discountPercentage / 100;
          }
          if (cartDiscount > 0) {
            totalSavings += cartDiscount;
            currentSubtotal = Math.max(0, currentSubtotal - cartDiscount);
            appliedDeals.push({
              dealId: deal.id,
              dealTitle: deal.title,
              dealType: deal.type,
              discountAmount: Number(cartDiscount.toFixed(2)),
              affectedProductIds: cartItems.map((i) => i.productId),
              details: `Cart Promotion: Saved $${cartDiscount.toFixed(2)} on orders over $${threshold.minimumSpend}`,
              exclusive: deal.exclusive
            });
            if (deal.exclusive) break;
          }
        }
      }
    }
    const discountedSubtotal = Math.max(0, originalSubtotal - totalSavings);
    return {
      originalSubtotal: Number(originalSubtotal.toFixed(2)),
      discountedSubtotal: Number(discountedSubtotal.toFixed(2)),
      totalSavings: Number(totalSavings.toFixed(2)),
      appliedDeals,
      itemPriceOverrides
    };
  }
  // --- Universal Database Sync ---
  sync(records, mapper) {
    if (!Array.isArray(records)) {
      throw new Error("sync requires an array of records.");
    }
    let synced = 0;
    for (const rec of records) {
      try {
        const deal = mapper ? mapper(rec) : rec;
        if (deal && deal.id && deal.title && deal.type) {
          this.registerDeal(deal);
          synced++;
        }
      } catch (e) {
      }
    }
    return synced;
  }
};
var deals = new BoostDealsManager();

// src/agent.ts
var DealsAgentToolkit = class {
  manager;
  constructor(manager = deals) {
    this.manager = manager;
  }
  /**
   * Return array of tool definitions in universal JSON Schema format.
   */
  getTools() {
    return [
      {
        name: "list_active_deals",
        description: "List all currently active promotional deals, flash sales, BOGO, and volume discounts with claim limits and time remaining.",
        parameters: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "get_product_deal",
        description: "Find the best applicable deal and discounted price for a specific product item.",
        parameters: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Unique ID of the product." },
            originalPrice: { type: "number", description: "Original retail price of the product." },
            category: { type: "string", description: "Product category (optional)." }
          },
          required: ["productId", "originalPrice"]
        }
      },
      {
        name: "evaluate_cart_deals",
        description: "Evaluate optimal promotional savings across an entire shopping cart (Flash sales, BOGO, tiered volume, and spend thresholds).",
        parameters: {
          type: "object",
          properties: {
            items: {
              type: "array",
              description: "List of items in the cart to evaluate.",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string" },
                  unitPrice: { type: "number" },
                  quantity: { type: "number" },
                  category: { type: "string" },
                  title: { type: "string" }
                },
                required: ["productId", "unitPrice", "quantity"]
              }
            }
          },
          required: ["items"]
        }
      },
      {
        name: "reserve_deal_claim",
        description: "Temporarily lock and reserve a lightning deal claim for a user with TTL hold during checkout.",
        parameters: {
          type: "object",
          properties: {
            dealId: { type: "string", description: "ID of the deal to claim." },
            userId: { type: "string", description: "ID of the customer reserving the claim." },
            quantity: { type: "number", description: "Number of units claiming (default 1)." },
            ttlSeconds: { type: "number", description: "Hold duration in seconds (default 600s)." }
          },
          required: ["dealId", "userId"]
        }
      },
      {
        name: "release_deal_claim",
        description: "Release a previously reserved deal claim if checkout is cancelled.",
        parameters: {
          type: "object",
          properties: {
            reservationId: { type: "string", description: "Reservation ID to release." }
          },
          required: ["reservationId"]
        }
      }
    ];
  }
  /**
   * OpenAI Tool Specs
   */
  toOpenAITools() {
    return this.getTools().map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }
    }));
  }
  /**
   * Anthropic Claude Tool Specs
   */
  toClaudeTools() {
    return this.getTools().map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters
    }));
  }
  /**
   * Google Gemini Tool Declarations
   */
  toGeminiTools() {
    return [{
      functionDeclarations: this.getTools().map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }))
    }];
  }
  /**
   * Execute an agent tool call automatically.
   */
  async executeTool(name, args) {
    switch (name) {
      case "list_active_deals": {
        const deals2 = this.manager.listActiveDeals();
        return {
          count: deals2.length,
          deals: deals2.map((d) => ({
            id: d.id,
            title: d.title,
            type: d.type,
            discountValue: d.discountValue,
            startDate: d.startDate,
            endDate: d.endDate,
            claimedCount: d.claimedCount || 0,
            totalLimit: d.totalClaimLimit
          }))
        };
      }
      case "get_product_deal": {
        const { productId, originalPrice, category } = args;
        return this.manager.computeProductDeal(productId, Number(originalPrice), category);
      }
      case "evaluate_cart_deals": {
        const { items } = args;
        return this.manager.evaluateCartDeals(items || []);
      }
      case "reserve_deal_claim": {
        const { dealId, userId, quantity, ttlSeconds } = args;
        try {
          const reservation = this.manager.reserveClaim(dealId, userId, quantity || 1, ttlSeconds);
          return { success: true, reservation };
        } catch (err) {
          return { success: false, error: err.message };
        }
      }
      case "release_deal_claim": {
        const { reservationId } = args;
        const released = this.manager.releaseClaim(reservationId);
        return { success: released };
      }
      default:
        throw new Error(`Unknown deal agent tool: ${name}`);
    }
  }
};

export { BoostDealsManager, DealsAgentToolkit, DealsEngine, deals };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map