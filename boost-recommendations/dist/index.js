'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/engine.ts
var RecommendationsEngine = class {
  /**
   * Generates an Amazon/Flipkart style "Frequently Bought Together" combo bundle
   * Combines the main product with 1 to 2 related/complementary products, applying a bundle discount.
   */
  static getFrequentlyBoughtTogether(mainProduct, catalog, options = {}) {
    const { maxItems = 2, discountPercentage = 10 } = options;
    const pool = catalog.filter((p) => p.id !== mainProduct.id && (p.stock === void 0 || p.stock > 0));
    const ranked = pool.map((item) => {
      let score = 0;
      if ((item.category || "").toLowerCase() === (mainProduct.category || "").toLowerCase()) {
        score += 30;
      }
      if (mainProduct.tags && item.tags) {
        const matchingTags = item.tags.filter((t) => mainProduct.tags.includes(t));
        score += matchingTags.length * 20;
      }
      if (item.tags && item.tags.some((t) => ["accessory", "accessories", "protection", "addon", "care"].includes(t.toLowerCase()))) {
        score += 35;
      }
      if (item.price <= mainProduct.price * 0.8) {
        score += 15;
      }
      if (item.price >= mainProduct.price) {
        score -= 50;
      }
      if (item.rating && item.rating >= 4) {
        score += 10;
      }
      return { item, score };
    });
    ranked.sort((a, b) => b.score - a.score);
    const bundleItems = ranked.slice(0, maxItems).map((r) => r.item);
    const allProducts = [mainProduct, ...bundleItems];
    const totalRegularPrice = allProducts.reduce((sum, p) => sum + p.price, 0);
    const savingsAmount = Math.round(totalRegularPrice * discountPercentage / 100);
    const bundlePrice = totalRegularPrice - savingsAmount;
    return {
      mainProduct,
      bundleItems,
      allProducts,
      totalRegularPrice,
      bundleDiscountPercentage: discountPercentage,
      bundlePrice,
      savingsAmount
    };
  }
  /**
   * Finds similar products (Customers who viewed this also viewed)
   */
  static getSimilarProducts(targetProduct, catalog, limit = 4) {
    const pool = catalog.filter((p) => p.id !== targetProduct.id && (p.stock === void 0 || p.stock > 0));
    const scored = pool.map((item) => {
      let score = 0;
      if ((item.category || "").toLowerCase() === (targetProduct.category || "").toLowerCase()) {
        score += 50;
      }
      if (targetProduct.tags && item.tags) {
        const overlap = item.tags.filter((t) => targetProduct.tags.includes(t));
        score += overlap.length * 25;
      }
      const priceRatio = Math.abs(item.price - targetProduct.price) / targetProduct.price;
      if (priceRatio < 0.3) {
        score += 20;
      }
      return {
        item,
        score,
        reason: "similar_category"
      };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.item);
  }
  /**
   * Generates personalized picks based on browsing history
   */
  static getPersonalizedPicks(viewHistoryIds, catalog, limit = 4) {
    if (!viewHistoryIds || viewHistoryIds.length === 0) {
      return [...catalog].filter((p) => p.stock === void 0 || p.stock > 0).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);
    }
    const viewedProducts = catalog.filter((p) => viewHistoryIds.includes(p.id));
    const viewedCategories = new Set(viewedProducts.map((p) => p.category.toLowerCase()));
    const candidates = catalog.filter((p) => !viewHistoryIds.includes(p.id) && (p.stock === void 0 || p.stock > 0));
    const scored = candidates.map((item) => {
      let score = 0;
      if (viewedCategories.has(item.category.toLowerCase())) {
        score += 40;
      }
      if (item.rating && item.rating >= 4.2) {
        score += 20;
      }
      return { item, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.item);
  }
};
var BoostRecommendationsManager = class {
  constructor(options = {}) {
    // productId -> (pairedProductId -> count)
    __publicField(this, "coOccurrenceMap", /* @__PURE__ */ new Map());
    __publicField(this, "catalog", /* @__PURE__ */ new Map());
    __publicField(this, "options");
    this.options = {
      defaultBundleDiscount: options.defaultBundleDiscount || 10,
      maxBundleSize: options.maxBundleSize || 2,
      minCoOccurrenceThreshold: options.minCoOccurrenceThreshold || 1
    };
  }
  /**
   * Ingest a single transaction order of purchased products to train the co-occurrence graph.
   */
  recordOrder(productIds) {
    if (!productIds || productIds.length < 2) return;
    const uniqueIds = Array.from(new Set(productIds));
    for (let i = 0; i < uniqueIds.length; i++) {
      const p1 = uniqueIds[i];
      if (!this.coOccurrenceMap.has(p1)) {
        this.coOccurrenceMap.set(p1, /* @__PURE__ */ new Map());
      }
      const pairMap = this.coOccurrenceMap.get(p1);
      for (let j = 0; j < uniqueIds.length; j++) {
        if (i === j) continue;
        const p2 = uniqueIds[j];
        const currentCount = pairMap.get(p2) || 0;
        pairMap.set(p2, currentCount + 1);
      }
    }
  }
  /**
   * Bulk ingest multiple past order transactions.
   */
  recordOrders(orders) {
    let count = 0;
    for (const order of orders) {
      if (order && Array.isArray(order.productIds)) {
        this.recordOrder(order.productIds);
        count++;
      }
    }
    return count;
  }
  /**
   * Register or update catalog products.
   */
  setCatalog(products) {
    this.catalog.clear();
    for (const p of products) {
      this.catalog.set(p.id, p);
    }
  }
  /**
   * Real Collaborative Filtering: "Customers Who Bought This Also Bought"
   * Derived from actual historical transaction co-occurrences.
   */
  getCustomersAlsoBought(productId, catalog = Array.from(this.catalog.values()), limit = 4) {
    const pairMap = this.coOccurrenceMap.get(productId);
    if (!pairMap || pairMap.size === 0) {
      const current = catalog.find((p) => p.id === productId);
      if (!current) return [];
      return RecommendationsEngine.getSimilarProducts(current, catalog, limit);
    }
    const catalogMap = new Map(catalog.map((p) => [p.id, p]));
    const scored = [];
    for (const [pairedId, count] of pairMap.entries()) {
      const item = catalogMap.get(pairedId);
      if (item && (item.stock === void 0 || item.stock > 0)) {
        scored.push({ item, count });
      }
    }
    scored.sort((a, b) => b.count - a.count);
    return scored.slice(0, limit).map((s) => s.item);
  }
  /**
   * Generates Frequently Bought Together bundle.
   * Leverages real transaction co-occurrences if available, otherwise falls back to complementary scoring.
   */
  getFrequentlyBoughtTogether(mainProduct, catalog = Array.from(this.catalog.values()), options = {}) {
    const maxItems = options.maxItems || this.options.maxBundleSize || 2;
    const discount = options.discountPercentage || this.options.defaultBundleDiscount || 10;
    const alsoBought = this.getCustomersAlsoBought(mainProduct.id, catalog, maxItems);
    if (alsoBought.length >= 1) {
      const bundleItems = alsoBought.slice(0, maxItems);
      const allProducts = [mainProduct, ...bundleItems];
      const totalRegularPrice = allProducts.reduce((sum, p) => sum + p.price, 0);
      const savingsAmount = Math.round(totalRegularPrice * discount / 100);
      const bundlePrice = totalRegularPrice - savingsAmount;
      return {
        mainProduct,
        bundleItems,
        allProducts,
        totalRegularPrice,
        bundleDiscountPercentage: discount,
        bundlePrice,
        savingsAmount
      };
    }
    return RecommendationsEngine.getFrequentlyBoughtTogether(mainProduct, catalog, {
      maxItems,
      discountPercentage: discount
    });
  }
  /**
   * Cart Cross-Sells & Impulse Add-ons.
   * Analyzes an active cart and recommends high-converting complementary accessories
   * (e.g. warranties, cables, socks, phone cases) that are NOT already in the cart.
   */
  getCartCrossSells(cartItems, catalog = Array.from(this.catalog.values()), options = {}) {
    const { limit = 3, maxPriceRatio = 0.5 } = options;
    const cartIds = new Set(cartItems.map((c) => c.id));
    const recommendations2 = [];
    for (const cartItem of cartItems) {
      const coOccurring = this.coOccurrenceMap.get(cartItem.id);
      if (coOccurring) {
        for (const [pairedId, count] of coOccurring.entries()) {
          if (!cartIds.has(pairedId)) {
            const product = catalog.find((p) => p.id === pairedId);
            if (product && (product.stock === void 0 || product.stock > 0)) {
              recommendations2.push({
                item: product,
                targetCartItemId: cartItem.id,
                reason: "Frequently paired with items in your cart",
                priorityScore: 100 + count
              });
            }
          }
        }
      }
      const targetPrice = cartItem.price || 1e3;
      const accessories = catalog.filter((p) => {
        return !cartIds.has(p.id) && (p.stock === void 0 || p.stock > 0) && p.price <= targetPrice * maxPriceRatio && (cartItem.category && p.category.toLowerCase() === cartItem.category.toLowerCase() || p.tags && p.tags.some((t) => ["accessory", "protection", "addon", "care"].includes(t.toLowerCase())));
      });
      for (const acc of accessories) {
        recommendations2.push({
          item: acc,
          targetCartItemId: cartItem.id,
          reason: "Popular add-on for this item",
          priorityScore: 50 + (acc.rating || 0) * 5
        });
      }
    }
    const dedupedMap = /* @__PURE__ */ new Map();
    for (const rec of recommendations2) {
      const existing = dedupedMap.get(rec.item.id);
      if (!existing || rec.priorityScore > existing.priorityScore) {
        dedupedMap.set(rec.item.id, rec);
      }
    }
    const sorted = Array.from(dedupedMap.values()).sort((a, b) => b.priorityScore - a.priorityScore);
    return sorted.slice(0, limit);
  }
  /**
   * Smart Product Upgrades (Upsell).
   * Recommends higher-tier, premium alternatives within the same category (e.g. 128GB -> 256GB, Standard -> Pro).
   */
  getUpgrades(product, catalog = Array.from(this.catalog.values()), options = {}) {
    const { maxPriceMultiplier = 2, limit = 2 } = options;
    const candidates = catalog.filter((p) => {
      return p.id !== product.id && (p.stock === void 0 || p.stock > 0) && p.category.toLowerCase() === product.category.toLowerCase() && p.price > product.price && p.price <= product.price * maxPriceMultiplier;
    });
    const upgrades = candidates.map((cand) => {
      const priceDifference = cand.price - product.price;
      const percentagePriceIncrease = Math.round(priceDifference / product.price * 100);
      const ratingIncrease = cand.rating && product.rating ? Number((cand.rating - product.rating).toFixed(1)) : void 0;
      return {
        originalProduct: product,
        upgradedProduct: cand,
        priceDifference,
        percentagePriceIncrease,
        ratingIncrease
      };
    });
    upgrades.sort((a, b) => {
      const scoreA = (a.upgradedProduct.rating || 0) * 10 - a.percentagePriceIncrease * 0.1;
      const scoreB = (b.upgradedProduct.rating || 0) * 10 - b.percentagePriceIncrease * 0.1;
      return scoreB - scoreA;
    });
    return upgrades.slice(0, limit);
  }
  /**
   * Post-Purchase One-Click Upsells.
   * High-converting add-ons for the Order Confirmation / Thank You page.
   */
  getPostPurchaseUpsells(purchasedProductIds, catalog = Array.from(this.catalog.values()), limit = 2) {
    const purchasedSet = new Set(purchasedProductIds);
    const candidates = [];
    for (const pid of purchasedProductIds) {
      const alsoBought = this.getCustomersAlsoBought(pid, catalog, 5);
      for (const item of alsoBought) {
        if (!purchasedSet.has(item.id) && (item.stock === void 0 || item.stock > 0)) {
          candidates.push({ item, score: 50 + (item.rating || 0) * 5 });
        }
      }
    }
    if (candidates.length === 0) {
      return catalog.filter((p) => !purchasedSet.has(p.id) && (p.stock === void 0 || p.stock > 0)).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);
    }
    const map = /* @__PURE__ */ new Map();
    for (const c of candidates) {
      const existing = map.get(c.item.id);
      if (!existing || c.score > existing.score) {
        map.set(c.item.id, c);
      }
    }
    const sorted = Array.from(map.values()).sort((a, b) => b.score - a.score);
    const results = sorted.slice(0, limit).map((s) => s.item);
    if (results.length < limit) {
      const existingIds = /* @__PURE__ */ new Set([...purchasedSet, ...results.map((r) => r.id)]);
      const fallbacks = catalog.filter((p) => !existingIds.has(p.id) && (p.stock === void 0 || p.stock > 0)).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit - results.length);
      results.push(...fallbacks);
    }
    return results;
  }
  /**
   * Universal Database Sync.
   * Ingests catalog products and past order transactions from MongoDB, PostgreSQL, Supabase, Prisma, DynamoDB, Firebase.
   */
  sync(catalogRecords, orderRecords, mappers) {
    let syncedProducts = 0;
    let syncedOrders = 0;
    if (Array.isArray(catalogRecords)) {
      const items = [];
      for (const rec of catalogRecords) {
        try {
          const item = mappers?.catalogMapper ? mappers.catalogMapper(rec) : rec;
          if (item && item.id && item.title && item.price !== void 0) {
            items.push(item);
            syncedProducts++;
          }
        } catch (e) {
        }
      }
      this.setCatalog(items);
    }
    if (Array.isArray(orderRecords)) {
      for (const ord of orderRecords) {
        try {
          const order = mappers?.orderMapper ? mappers.orderMapper(ord) : ord;
          if (order && Array.isArray(order.productIds)) {
            this.recordOrder(order.productIds);
            syncedOrders++;
          }
        } catch (e) {
        }
      }
    }
    return { syncedProducts, syncedOrders };
  }
};
var recommendations = new BoostRecommendationsManager();

// src/agent.ts
var RecommendationsAgentToolkit = class {
  constructor(manager = recommendations) {
    __publicField(this, "manager");
    this.manager = manager;
  }
  /**
   * Universal JSON Schema tool declarations
   */
  getTools() {
    return [
      {
        name: "get_frequently_bought_together",
        description: "Generate an Amazon-style Frequently Bought Together bundle combo with combined bundle price, discount percentage, and total savings.",
        parameters: {
          type: "object",
          properties: {
            mainProduct: {
              type: "object",
              description: "The target product for which to build the bundle combo.",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                price: { type: "number" },
                category: { type: "string" },
                tags: { type: "array", items: { type: "string" } }
              },
              required: ["id", "title", "price", "category"]
            },
            catalog: {
              type: "array",
              description: "Product catalog to search for complementary items.",
              items: { type: "object" }
            },
            maxItems: { type: "number", description: "Maximum bundle accessories to attach (default 2)." },
            discountPercentage: { type: "number", description: "Bundle discount percentage (default 10%)." }
          },
          required: ["mainProduct"]
        }
      },
      {
        name: "get_cart_cross_sells",
        description: "Recommend high-converting impulse add-ons, accessories, and warranties for products currently in the customer cart.",
        parameters: {
          type: "object",
          properties: {
            cartItems: {
              type: "array",
              description: "Items currently in the customer cart.",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  category: { type: "string" },
                  price: { type: "number" }
                },
                required: ["id"]
              }
            },
            catalog: {
              type: "array",
              description: "Product catalog.",
              items: { type: "object" }
            },
            limit: { type: "number", description: "Number of cross-sells to return (default 3)." }
          },
          required: ["cartItems"]
        }
      },
      {
        name: "get_similar_products",
        description: "Find alternative products similar to a target product (Customers who viewed this also viewed).",
        parameters: {
          type: "object",
          properties: {
            targetProduct: {
              type: "object",
              description: "Target product to find alternatives for.",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                price: { type: "number" },
                category: { type: "string" }
              },
              required: ["id", "price", "category"]
            },
            catalog: {
              type: "array",
              description: "Product catalog.",
              items: { type: "object" }
            },
            limit: { type: "number", description: "Number of items to return (default 4)." }
          },
          required: ["targetProduct"]
        }
      },
      {
        name: "get_personalized_picks",
        description: "Generate personalized product recommendations based on a user browsing or view history.",
        parameters: {
          type: "object",
          properties: {
            viewHistoryIds: {
              type: "array",
              description: "List of product IDs the user recently viewed.",
              items: { type: "string" }
            },
            catalog: {
              type: "array",
              description: "Product catalog.",
              items: { type: "object" }
            },
            limit: { type: "number", description: "Number of recommendations (default 4)." }
          },
          required: ["viewHistoryIds", "catalog"]
        }
      },
      {
        name: "get_product_upgrades",
        description: "Find higher-tier, premium upsell alternatives within the same product category (e.g. 128GB -> 256GB, Standard -> Pro).",
        parameters: {
          type: "object",
          properties: {
            product: {
              type: "object",
              description: "Current product being considered.",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                price: { type: "number" },
                category: { type: "string" },
                rating: { type: "number" }
              },
              required: ["id", "price", "category"]
            },
            catalog: {
              type: "array",
              description: "Product catalog.",
              items: { type: "object" }
            },
            limit: { type: "number", description: "Max upgrades to return (default 2)." }
          },
          required: ["product"]
        }
      }
    ];
  }
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
  toClaudeTools() {
    return this.getTools().map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters
    }));
  }
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
   * Autonomous router for tool execution
   */
  async executeTool(name, args) {
    switch (name) {
      case "get_frequently_bought_together": {
        const { mainProduct, catalog, maxItems, discountPercentage } = args;
        return this.manager.getFrequentlyBoughtTogether(mainProduct, catalog, {
          maxItems,
          discountPercentage
        });
      }
      case "get_cart_cross_sells": {
        const { cartItems, catalog, limit } = args;
        return this.manager.getCartCrossSells(cartItems, catalog, { limit });
      }
      case "get_similar_products": {
        const { targetProduct, catalog, limit } = args;
        return RecommendationsEngine.getSimilarProducts(targetProduct, catalog, limit || 4);
      }
      case "get_personalized_picks": {
        const { viewHistoryIds, catalog, limit } = args;
        return RecommendationsEngine.getPersonalizedPicks(viewHistoryIds, catalog, limit || 4);
      }
      case "get_product_upgrades": {
        const { product, catalog, limit } = args;
        return this.manager.getUpgrades(product, catalog, { limit });
      }
      default:
        throw new Error(`Unknown recommendations agent tool: "${name}"`);
    }
  }
};

exports.BoostRecommendationsManager = BoostRecommendationsManager;
exports.RecommendationsAgentToolkit = RecommendationsAgentToolkit;
exports.RecommendationsEngine = RecommendationsEngine;
exports.recommendations = recommendations;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map