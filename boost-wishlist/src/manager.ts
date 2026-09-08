import { WishlistItem, PriceDropAlert, WishlistSummary } from './types';

export class BoostWishlist {
  private items: WishlistItem[] = [];

  constructor(initialItems: WishlistItem[] = []) {
    this.items = initialItems.map((i) => ({ ...i }));
  }

  private getKey(productId: string, variantId?: string): string {
    return `${productId}_${variantId || 'default'}`;
  }

  /**
   * Adds an item to the wishlist if not already present
   */
  addItem(item: Omit<WishlistItem, 'id' | 'addedAt'> & { id?: string; addedAt?: string }): WishlistItem {
    const key = this.getKey(item.productId, item.variantId);
    const existing = this.items.find((i) => this.getKey(i.productId, i.variantId) === key);

    if (existing) {
      return existing;
    }

    const newItem: WishlistItem = {
      ...item,
      id: item.id || key,
      addedAt: item.addedAt || new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  /**
   * Removes an item from the wishlist
   */
  removeItem(productId: string, variantId?: string): boolean {
    const key = this.getKey(productId, variantId);
    const initialLen = this.items.length;
    this.items = this.items.filter((i) => this.getKey(i.productId, i.variantId) !== key);
    return this.items.length < initialLen;
  }

  /**
   * Checks if an item is already wishlisted
   */
  hasItem(productId: string, variantId?: string): boolean {
    const key = this.getKey(productId, variantId);
    return this.items.some((i) => this.getKey(i.productId, i.variantId) === key);
  }

  /**
   * Toggles item status (adds if absent, removes if present)
   */
  toggleItem(
    item: Omit<WishlistItem, 'id' | 'addedAt'> & { id?: string; addedAt?: string }
  ): { isWishlisted: boolean; item?: WishlistItem } {
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
  getItems(): WishlistItem[] {
    return [...this.items];
  }

  /**
   * Produces a summary with total count and value
   */
  getSummary(): WishlistSummary {
    const totalCount = this.items.length;
    const totalValue = Math.round(this.items.reduce((sum, i) => sum + i.price, 0) * 100) / 100;
    return {
      items: [...this.items],
      totalCount,
      totalValue,
    };
  }

  /**
   * Clears all items
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Merges guest browser wishlist into user account wishlist without duplicate entries
   */
  static mergeGuestWishlist(
    guestItems: WishlistItem[],
    userItems: WishlistItem[]
  ): { merged: WishlistItem[]; addedCount: number } {
    const map = new Map<string, WishlistItem>();

    for (const item of userItems) {
      const key = `${item.productId}_${item.variantId || 'default'}`;
      map.set(key, { ...item });
    }

    let addedCount = 0;
    for (const item of guestItems) {
      const key = `${item.productId}_${item.variantId || 'default'}`;
      if (!map.has(key)) {
        map.set(key, { ...item });
        addedCount++;
      }
    }

    return {
      merged: Array.from(map.values()),
      addedCount,
    };
  }

  /**
   * Compares wishlisted items against the live catalog to identify price drops
   */
  checkPriceDrops(currentCatalog: Array<{ id: string; price: number }>): PriceDropAlert[] {
    const catalogMap = new Map<string, number>();
    for (const c of currentCatalog) {
      catalogMap.set(c.id, c.price);
    }

    const alerts: PriceDropAlert[] = [];

    for (const item of this.items) {
      const currentPrice = catalogMap.get(item.productId);
      if (currentPrice !== undefined && currentPrice < item.price) {
        const savedAmount = Math.round((item.price - currentPrice) * 100) / 100;
        const discountPercentage = Math.round((savedAmount / item.price) * 100);

        alerts.push({
          item,
          originalPrice: item.price,
          currentPrice,
          savedAmount,
          discountPercentage,
        });
      }
    }

    return alerts;
  }

  toJSON(): WishlistItem[] {
    return this.items;
  }

  fromJSON(items: WishlistItem[]): void {
    if (Array.isArray(items)) {
      this.items = items.map((i) => ({ ...i }));
    }
  }
}

export function createBoostWishlist(initialItems?: WishlistItem[]): BoostWishlist {
  return new BoostWishlist(initialItems);
}
