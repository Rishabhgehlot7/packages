interface WishlistItem {
    id: string;
    productId: string;
    variantId?: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    image?: string;
    inStock?: boolean;
    addedAt: string;
    metadata?: Record<string, any>;
}
interface PriceDropAlert {
    item: WishlistItem;
    originalPrice: number;
    currentPrice: number;
    savedAmount: number;
    discountPercentage: number;
}
interface WishlistSummary {
    items: WishlistItem[];
    totalCount: number;
    totalValue: number;
}

declare class BoostWishlist {
    private items;
    constructor(initialItems?: WishlistItem[]);
    private getKey;
    /**
     * Adds an item to the wishlist if not already present
     */
    addItem(item: Omit<WishlistItem, 'id' | 'addedAt'> & {
        id?: string;
        addedAt?: string;
    }): WishlistItem;
    /**
     * Removes an item from the wishlist
     */
    removeItem(productId: string, variantId?: string): boolean;
    /**
     * Checks if an item is already wishlisted
     */
    hasItem(productId: string, variantId?: string): boolean;
    /**
     * Toggles item status (adds if absent, removes if present)
     */
    toggleItem(item: Omit<WishlistItem, 'id' | 'addedAt'> & {
        id?: string;
        addedAt?: string;
    }): {
        isWishlisted: boolean;
        item?: WishlistItem;
    };
    /**
     * Gets list of all wishlisted items
     */
    getItems(): WishlistItem[];
    /**
     * Produces a summary with total count and value
     */
    getSummary(): WishlistSummary;
    /**
     * Clears all items
     */
    clear(): void;
    /**
     * Merges guest browser wishlist into user account wishlist without duplicate entries
     */
    static mergeGuestWishlist(guestItems: WishlistItem[], userItems: WishlistItem[]): {
        merged: WishlistItem[];
        addedCount: number;
    };
    /**
     * Compares wishlisted items against the live catalog to identify price drops
     */
    checkPriceDrops(currentCatalog: Array<{
        id: string;
        price: number;
    }>): PriceDropAlert[];
    toJSON(): WishlistItem[];
    fromJSON(items: WishlistItem[]): void;
}
declare function createBoostWishlist(initialItems?: WishlistItem[]): BoostWishlist;

export { BoostWishlist, type PriceDropAlert, type WishlistItem, type WishlistSummary, createBoostWishlist };
