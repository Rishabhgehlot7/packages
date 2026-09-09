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
      if (item.category.toLowerCase() === mainProduct.category.toLowerCase()) {
        score += 30;
      }
      if (mainProduct.tags && item.tags) {
        const matchingTags = item.tags.filter((t) => mainProduct.tags.includes(t));
        score += matchingTags.length * 20;
      }
      if (item.price <= mainProduct.price * 0.8) {
        score += 15;
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
    const pool = catalog.filter((p) => p.id !== targetProduct.id);
    const scored = pool.map((item) => {
      let score = 0;
      if (item.category.toLowerCase() === targetProduct.category.toLowerCase()) {
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
      return [...catalog].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);
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
};
export {
  RecommendationsEngine
};
