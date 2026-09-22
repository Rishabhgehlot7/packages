import {
  ProductRecommendationItem,
  FrequentlyBoughtTogetherBundle,
  RecommendationScore,
  CartCrossSellRecommendation,
  ProductUpgradeRecommendation,
  OrderTransaction,
  RecommendationsManagerOptions,
} from './types';

export class RecommendationsEngine {
  /**
   * Generates an Amazon/Flipkart style "Frequently Bought Together" combo bundle
   * Combines the main product with 1 to 2 related/complementary products, applying a bundle discount.
   */
  static getFrequentlyBoughtTogether(
    mainProduct: ProductRecommendationItem,
    catalog: ProductRecommendationItem[],
    options: {
      maxItems?: number;
      discountPercentage?: number;
    } = {}
  ): FrequentlyBoughtTogetherBundle {
    const { maxItems = 2, discountPercentage = 10 } = options;

    // Filter out the main product itself and out of stock products
    const pool = catalog.filter((p) => p.id !== mainProduct.id && (p.stock === undefined || p.stock > 0));

    // Complementary scoring: Prefer products in same category or matching tags
    const ranked = pool.map((item) => {
      let score = 0;
      if ((item.category || '').toLowerCase() === (mainProduct.category || '').toLowerCase()) {
        score += 30;
      }
      if (mainProduct.tags && item.tags) {
        const matchingTags = item.tags.filter((t) => mainProduct.tags!.includes(t));
        score += matchingTags.length * 20;
      }
      // Price affinity: items that are cheaper or within 20%-80% of main item are classic accessories
      if (item.price <= mainProduct.price * 0.8) {
        score += 15;
      }
      // Social proof bonus
      if (item.rating && item.rating >= 4.0) {
        score += 10;
      }
      return { item, score };
    });

    ranked.sort((a, b) => b.score - a.score);

    const bundleItems = ranked.slice(0, maxItems).map((r) => r.item);
    const allProducts = [mainProduct, ...bundleItems];

    const totalRegularPrice = allProducts.reduce((sum, p) => sum + p.price, 0);
    const savingsAmount = Math.round((totalRegularPrice * discountPercentage) / 100);
    const bundlePrice = totalRegularPrice - savingsAmount;

    return {
      mainProduct,
      bundleItems,
      allProducts,
      totalRegularPrice,
      bundleDiscountPercentage: discountPercentage,
      bundlePrice,
      savingsAmount,
    };
  }

  /**
   * Finds similar products (Customers who viewed this also viewed)
   */
  static getSimilarProducts(
    targetProduct: ProductRecommendationItem,
    catalog: ProductRecommendationItem[],
    limit: number = 4
  ): ProductRecommendationItem[] {
    const pool = catalog.filter((p) => p.id !== targetProduct.id);

    const scored: RecommendationScore[] = pool.map((item) => {
      let score = 0;
      if ((item.category || '').toLowerCase() === (targetProduct.category || '').toLowerCase()) {
        score += 50;
      }
      if (targetProduct.tags && item.tags) {
        const overlap = item.tags.filter((t) => targetProduct.tags!.includes(t));
        score += overlap.length * 25;
      }
      // Proximity in price range (within 30%)
      const priceRatio = Math.abs(item.price - targetProduct.price) / targetProduct.price;
      if (priceRatio < 0.3) {
        score += 20;
      }
      return {
        item,
        score,
        reason: 'similar_category',
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.item);
  }

  /**
   * Generates personalized picks based on browsing history
   */
  static getPersonalizedPicks(
    viewHistoryIds: string[],
    catalog: ProductRecommendationItem[],
    limit: number = 4
  ): ProductRecommendationItem[] {
    if (!viewHistoryIds || viewHistoryIds.length === 0) {
      // Fallback to highest rated items
      return [...catalog]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
    }

    const viewedProducts = catalog.filter((p) => viewHistoryIds.includes(p.id));
    const viewedCategories = new Set(viewedProducts.map((p) => p.category.toLowerCase()));

    const candidates = catalog.filter((p) => !viewHistoryIds.includes(p.id));
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
}

/**
 * Universal Recommendations Manager
 * Supports In-Memory Transaction Collaborative Filtering, Co-occurrence Graph,
 * Cart Cross-Sells, Product Upgrades, and Database Syncing.
 */
export class BoostRecommendationsManager {
  // productId -> (pairedProductId -> count)
  private coOccurrenceMap: Map<string, Map<string, number>> = new Map();
  private catalog: Map<string, ProductRecommendationItem> = new Map();
  private options: RecommendationsManagerOptions;

  constructor(options: RecommendationsManagerOptions = {}) {
    this.options = {
      defaultBundleDiscount: options.defaultBundleDiscount || 10,
      maxBundleSize: options.maxBundleSize || 2,
      minCoOccurrenceThreshold: options.minCoOccurrenceThreshold || 1,
    };
  }

  /**
   * Ingest a single transaction order of purchased products to train the co-occurrence graph.
   */
  public recordOrder(productIds: string[]): void {
    if (!productIds || productIds.length < 2) return;

    const uniqueIds = Array.from(new Set(productIds));
    for (let i = 0; i < uniqueIds.length; i++) {
      const p1 = uniqueIds[i];
      if (!this.coOccurrenceMap.has(p1)) {
        this.coOccurrenceMap.set(p1, new Map());
      }
      const pairMap = this.coOccurrenceMap.get(p1)!;

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
  public recordOrders(orders: OrderTransaction[]): number {
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
  public setCatalog(products: ProductRecommendationItem[]): void {
    this.catalog.clear();
    for (const p of products) {
      this.catalog.set(p.id, p);
    }
  }

  /**
   * Real Collaborative Filtering: "Customers Who Bought This Also Bought"
   * Derived from actual historical transaction co-occurrences.
   */
  public getCustomersAlsoBought(
    productId: string,
    catalog: ProductRecommendationItem[] = Array.from(this.catalog.values()),
    limit: number = 4
  ): ProductRecommendationItem[] {
    const pairMap = this.coOccurrenceMap.get(productId);
    if (!pairMap || pairMap.size === 0) {
      // Fallback to similar products if no transaction history exists
      const current = catalog.find((p) => p.id === productId);
      if (!current) return [];
      return RecommendationsEngine.getSimilarProducts(current, catalog, limit);
    }

    const catalogMap = new Map(catalog.map((p) => [p.id, p]));
    const scored: Array<{ item: ProductRecommendationItem; count: number }> = [];

    for (const [pairedId, count] of pairMap.entries()) {
      const item = catalogMap.get(pairedId);
      if (item && (item.stock === undefined || item.stock > 0)) {
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
  public getFrequentlyBoughtTogether(
    mainProduct: ProductRecommendationItem,
    catalog: ProductRecommendationItem[] = Array.from(this.catalog.values()),
    options: { maxItems?: number; discountPercentage?: number } = {}
  ): FrequentlyBoughtTogetherBundle {
    const maxItems = options.maxItems || this.options.maxBundleSize || 2;
    const discount = options.discountPercentage || this.options.defaultBundleDiscount || 10;

    // 1. Try to find items using transaction co-occurrence graph
    const alsoBought = this.getCustomersAlsoBought(mainProduct.id, catalog, maxItems);

    if (alsoBought.length >= 1) {
      const bundleItems = alsoBought.slice(0, maxItems);
      const allProducts = [mainProduct, ...bundleItems];
      const totalRegularPrice = allProducts.reduce((sum, p) => sum + p.price, 0);
      const savingsAmount = Math.round((totalRegularPrice * discount) / 100);
      const bundlePrice = totalRegularPrice - savingsAmount;

      return {
        mainProduct,
        bundleItems,
        allProducts,
        totalRegularPrice,
        bundleDiscountPercentage: discount,
        bundlePrice,
        savingsAmount,
      };
    }

    // 2. Fallback to heuristic tag/category algorithm
    return RecommendationsEngine.getFrequentlyBoughtTogether(mainProduct, catalog, {
      maxItems,
      discountPercentage: discount,
    });
  }

  /**
   * Cart Cross-Sells & Impulse Add-ons.
   * Analyzes an active cart and recommends high-converting complementary accessories
   * (e.g. warranties, cables, socks, phone cases) that are NOT already in the cart.
   */
  public getCartCrossSells(
    cartItems: Array<{ id: string; category?: string; price?: number }>,
    catalog: ProductRecommendationItem[] = Array.from(this.catalog.values()),
    options: { limit?: number; maxPriceRatio?: number } = {}
  ): CartCrossSellRecommendation[] {
    const { limit = 3, maxPriceRatio = 0.5 } = options;
    const cartIds = new Set(cartItems.map((c) => c.id));
    const recommendations: CartCrossSellRecommendation[] = [];

    // Evaluate each cart item against catalog
    for (const cartItem of cartItems) {
      // 1. Check co-occurrence if orders exist
      const coOccurring = this.coOccurrenceMap.get(cartItem.id);
      if (coOccurring) {
        for (const [pairedId, count] of coOccurring.entries()) {
          if (!cartIds.has(pairedId)) {
            const product = catalog.find((p) => p.id === pairedId);
            if (product && (product.stock === undefined || product.stock > 0)) {
              recommendations.push({
                item: product,
                targetCartItemId: cartItem.id,
                reason: 'Frequently paired with items in your cart',
                priorityScore: 100 + count,
              });
            }
          }
        }
      }

      // 2. Add lower-priced complementary accessories in the same category
      const targetPrice = cartItem.price || 1000;
      const accessories = catalog.filter((p) => {
        return (
          !cartIds.has(p.id) &&
          (p.stock === undefined || p.stock > 0) &&
          p.price <= targetPrice * maxPriceRatio &&
          ((cartItem.category && p.category.toLowerCase() === cartItem.category.toLowerCase()) ||
            (p.tags && p.tags.some((t) => ['accessory', 'protection', 'addon', 'care'].includes(t.toLowerCase()))))
        );
      });

      for (const acc of accessories) {
        recommendations.push({
          item: acc,
          targetCartItemId: cartItem.id,
          reason: 'Popular add-on for this item',
          priorityScore: 50 + (acc.rating || 0) * 5,
        });
      }
    }

    // Deduplicate recommendations by product id, taking highest priority
    const dedupedMap = new Map<string, CartCrossSellRecommendation>();
    for (const rec of recommendations) {
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
  public getUpgrades(
    product: ProductRecommendationItem,
    catalog: ProductRecommendationItem[] = Array.from(this.catalog.values()),
    options: { maxPriceMultiplier?: number; limit?: number } = {}
  ): ProductUpgradeRecommendation[] {
    const { maxPriceMultiplier = 2.0, limit = 2 } = options;

    const candidates = catalog.filter((p) => {
      return (
        p.id !== product.id &&
        (p.stock === undefined || p.stock > 0) &&
        p.category.toLowerCase() === product.category.toLowerCase() &&
        p.price > product.price &&
        p.price <= product.price * maxPriceMultiplier
      );
    });

    const upgrades: ProductUpgradeRecommendation[] = candidates.map((cand) => {
      const priceDifference = cand.price - product.price;
      const percentagePriceIncrease = Math.round((priceDifference / product.price) * 100);
      const ratingIncrease = cand.rating && product.rating ? Number((cand.rating - product.rating).toFixed(1)) : undefined;

      return {
        originalProduct: product,
        upgradedProduct: cand,
        priceDifference,
        percentagePriceIncrease,
        ratingIncrease,
      };
    });

    // Prefer items with higher rating and reasonable price jump (15%-50%)
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
  public getPostPurchaseUpsells(
    purchasedProductIds: string[],
    catalog: ProductRecommendationItem[] = Array.from(this.catalog.values()),
    limit: number = 2
  ): ProductRecommendationItem[] {
    const purchasedSet = new Set(purchasedProductIds);
    const candidates: Array<{ item: ProductRecommendationItem; score: number }> = [];

    for (const pid of purchasedProductIds) {
      const alsoBought = this.getCustomersAlsoBought(pid, catalog, 5);
      for (const item of alsoBought) {
        if (!purchasedSet.has(item.id)) {
          candidates.push({ item, score: 50 + (item.rating || 0) * 5 });
        }
      }
    }

    if (candidates.length === 0) {
      // Fallback to top-rated items in catalog
      return catalog
        .filter((p) => !purchasedSet.has(p.id))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
    }

    // Deduplicate
    const map = new Map<string, { item: ProductRecommendationItem; score: number }>();
    for (const c of candidates) {
      const existing = map.get(c.item.id);
      if (!existing || c.score > existing.score) {
        map.set(c.item.id, c);
      }
    }

    const sorted = Array.from(map.values()).sort((a, b) => b.score - a.score);
    return sorted.slice(0, limit).map((s) => s.item);
  }

  /**
   * Universal Database Sync.
   * Ingests catalog products and past order transactions from MongoDB, PostgreSQL, Supabase, Prisma, DynamoDB, Firebase.
   */
  public sync<T = any, O = any>(
    catalogRecords: T[],
    orderRecords?: O[],
    mappers?: {
      catalogMapper?: (record: T) => ProductRecommendationItem;
      orderMapper?: (order: O) => OrderTransaction;
    }
  ): { syncedProducts: number; syncedOrders: number } {
    let syncedProducts = 0;
    let syncedOrders = 0;

    if (Array.isArray(catalogRecords)) {
      const items: ProductRecommendationItem[] = [];
      for (const rec of catalogRecords) {
        try {
          const item = mappers?.catalogMapper ? mappers.catalogMapper(rec) : (rec as unknown as ProductRecommendationItem);
          if (item && item.id && item.title && item.price !== undefined) {
            items.push(item);
            syncedProducts++;
          }
        } catch (e) {
          // Skip malformed
        }
      }
      this.setCatalog(items);
    }

    if (Array.isArray(orderRecords)) {
      for (const ord of orderRecords) {
        try {
          const order = mappers?.orderMapper ? mappers.orderMapper(ord) : (ord as unknown as OrderTransaction);
          if (order && Array.isArray(order.productIds)) {
            this.recordOrder(order.productIds);
            syncedOrders++;
          }
        } catch (e) {
          // Skip malformed
        }
      }
    }

    return { syncedProducts, syncedOrders };
  }
}

export const recommendations = new BoostRecommendationsManager();
