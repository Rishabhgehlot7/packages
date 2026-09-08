'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);

// src/manager.ts
var BoostWishlist = class {
  constructor(initialItems = []) {
    __publicField(this, "items", []);
    this.items = initialItems.map((i) => ({ ...i }));
  }
  getKey(productId, variantId) {
    return `${productId}_${variantId || "default"}`;
  }
  /**
   * Adds an item to the wishlist if not already present
   */
  addItem(item) {
    const key = this.getKey(item.productId, item.variantId);
    const existing = this.items.find((i) => this.getKey(i.productId, i.variantId) === key);
    if (existing) {
      return existing;
    }
    const newItem = {
      ...item,
      id: item.id || key,
      addedAt: item.addedAt || (/* @__PURE__ */ new Date()).toISOString()
    };
    this.items.push(newItem);
    return newItem;
  }
  /**
   * Removes an item from the wishlist
   */
  removeItem(productId, variantId) {
    const key = this.getKey(productId, variantId);
    const initialLen = this.items.length;
    this.items = this.items.filter((i) => this.getKey(i.productId, i.variantId) !== key);
    return this.items.length < initialLen;
  }
  /**
   * Checks if an item is already wishlisted
   */
  hasItem(productId, variantId) {
    const key = this.getKey(productId, variantId);
    return this.items.some((i) => this.getKey(i.productId, i.variantId) === key);
  }
  /**
   * Toggles item status (adds if absent, removes if present)
   */
  toggleItem(item) {
    if (this.hasItem(item.productId, item.variantId)) {
      this.removeItem(item.productId, item.variantId);
      return { isWishlisted: false };
    }
    const added = this.addItem(item);
    return { isWishlisted: true, item: added };
  }
  /**
   * Gets list of all wishlisted items
   */
  getItems() {
    return [...this.items];
  }
  /**
   * Produces a summary with total count and value
   */
  getSummary() {
    const totalCount = this.items.length;
    const totalValue = Math.round(this.items.reduce((sum, i) => sum + i.price, 0) * 100) / 100;
    return {
      items: [...this.items],
      totalCount,
      totalValue
    };
  }
  /**
   * Clears all items
   */
  clear() {
    this.items = [];
  }
  /**
   * Merges guest browser wishlist into user account wishlist without duplicate entries
   */
  static mergeGuestWishlist(guestItems, userItems) {
    const map = /* @__PURE__ */ new Map();
    for (const item of userItems) {
      const key = `${item.productId}_${item.variantId || "default"}`;
      map.set(key, { ...item });
    }
    let addedCount = 0;
    for (const item of guestItems) {
      const key = `${item.productId}_${item.variantId || "default"}`;
      if (!map.has(key)) {
        map.set(key, { ...item });
        addedCount++;
      }
    }
    return {
      merged: Array.from(map.values()),
      addedCount
    };
  }
  /**
   * Compares wishlisted items against the live catalog to identify price drops
   */
  checkPriceDrops(currentCatalog) {
    const catalogMap = /* @__PURE__ */ new Map();
    for (const c of currentCatalog) {
      catalogMap.set(c.id, c.price);
    }
    const alerts = [];
    for (const item of this.items) {
      const currentPrice = catalogMap.get(item.productId);
      if (currentPrice !== void 0 && currentPrice < item.price) {
        const savedAmount = Math.round((item.price - currentPrice) * 100) / 100;
        const discountPercentage = Math.round(savedAmount / item.price * 100);
        alerts.push({
          item,
          originalPrice: item.price,
          currentPrice,
          savedAmount,
          discountPercentage
        });
      }
    }
    return alerts;
  }
  toJSON() {
    return this.items;
  }
  fromJSON(items) {
    if (Array.isArray(items)) {
      this.items = items.map((i) => ({ ...i }));
    }
  }
};
function createBoostWishlist(initialItems) {
  return new BoostWishlist(initialItems);
}

exports.BoostWishlist = BoostWishlist;
exports.createBoostWishlist = createBoostWishlist;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map