import { 
  WishlistItem, 
  PriceDropAlert, 
  WishlistSummary, 
  WishlistBoard, 
  BackInStockAlert, 
  TargetPriceReachedAlert, 
  WishlistMoveToCartResult, 
  WishlistOptions, 
  WishlistEventType, 
  WishlistEventHandler 
} from './types';

export class BoostWishlist {
  private items: WishlistItem[] = [];
  private boards: Map<string, WishlistBoard> = new Map();
  private eventListeners: Map<WishlistEventType, Set<WishlistEventHandler>> = new Map();
  private options: WishlistOptions;

  constructor(initialItems: WishlistItem[] = [], options: WishlistOptions = {}) {
    this.options = {
      autoRemoveOnMoveToCart: options.autoRemoveOnMoveToCart !== false,
      storageKey: options.storageKey || 'boost_wishlist_items',
    };

    // Initialize default board
    this.boards.set('default', {
      id: 'default',
      name: 'My Wishlist',
      isDefault: true,
      privacy: 'private',
      createdAt: new Date().toISOString(),
    });

    this.items = initialItems.map((i) => ({
      ...i,
      boardId: i.boardId || 'default',
      originalAddedPrice: i.originalAddedPrice || i.price,
    }));
  }

  // --- Real-Time Event Emitter ---

  public on(event: WishlistEventType, handler: WishlistEventHandler): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  public off(event: WishlistEventType, handler: WishlistEventHandler): void {
    const set = this.eventListeners.get(event);
    if (set) {
      set.delete(handler);
    }
  }

  private emit(event: WishlistEventType, payload: any): void {
    const set = this.eventListeners.get(event);
    if (set) {
      for (const handler of set) {
        try {
          handler(payload);
        } catch (e) {
          console.error(`[BoostWishlist] Error in "${event}" event listener:`, e);
        }
      }
    }
  }

  private getKey(productId: string, variantId?: string): string {
    return `${productId}_${variantId || 'default'}`;
  }

  // --- Core Item Management (100% Backward Compatible) ---

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
      boardId: item.boardId || 'default',
      originalAddedPrice: item.originalAddedPrice || item.price,
    };

    this.items.push(newItem);
    this.emit('item:added', { item: newItem, totalCount: this.items.length });
    return newItem;
  }

  /**
   * Removes an item from the wishlist
   */
  removeItem(productId: string, variantId?: string): boolean {
    const key = this.getKey(productId, variantId);
    const removedItem = this.items.find((i) => this.getKey(i.productId, i.variantId) === key);
    const initialLen = this.items.length;

    this.items = this.items.filter((i) => this.getKey(i.productId, i.variantId) !== key);
    const success = this.items.length < initialLen;

    if (success && removedItem) {
      this.emit('item:removed', { item: removedItem, totalCount: this.items.length });
    }
    return success;
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
   * Gets list of all wishlisted items (optional filter by boardId)
   */
  getItems(boardId?: string): WishlistItem[] {
    if (boardId) {
      return this.items.filter((i) => i.boardId === boardId);
    }
    return [...this.items];
  }

  /**
   * Produces a summary with total count, value, and boards
   */
  getSummary(boardId?: string): WishlistSummary {
    const filtered = boardId ? this.items.filter((i) => i.boardId === boardId) : this.items;
    const totalCount = filtered.length;
    const totalValue = Math.round(filtered.reduce((sum, i) => sum + i.price, 0) * 100) / 100;

    return {
      items: [...filtered],
      totalCount,
      totalValue,
      boardCount: this.boards.size,
    };
  }

  /**
   * Clears all items
   */
  clear(boardId?: string): void {
    if (boardId) {
      this.items = this.items.filter((i) => i.boardId !== boardId);
    } else {
      this.items = [];
    }
  }

  // --- Multi-Board / Named Lists Management ---

  /**
   * Create a new custom board (e.g. "Birthday Ideas", "Living Room Decor")
   */
  createBoard(
    name: string, 
    options: { description?: string; privacy?: 'public' | 'private' | 'unlisted' } = {}
  ): WishlistBoard {
    const id = `board_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const board: WishlistBoard = {
      id,
      name,
      description: options.description,
      isDefault: false,
      privacy: options.privacy || 'private',
      shareToken: `share_${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString(),
    };

    this.boards.set(id, board);
    this.emit('board:created', board);
    return board;
  }

  /**
   * Delete a custom board and reassign its items to default board
   */
  deleteBoard(boardId: string): boolean {
    if (boardId === 'default' || !this.boards.has(boardId)) {
      return false;
    }

    const deleted = this.boards.get(boardId);
    this.boards.delete(boardId);

    // Reassign items to default board
    for (const item of this.items) {
      if (item.boardId === boardId) {
        item.boardId = 'default';
      }
    }

    this.emit('board:deleted', deleted);
    return true;
  }

  /**
   * Get all wishlist boards
   */
  getBoards(): WishlistBoard[] {
    return Array.from(this.boards.values());
  }

  /**
   * Move an item to another board
   */
  moveToBoard(productId: string, targetBoardId: string, variantId?: string): boolean {
    if (!this.boards.has(targetBoardId)) {
      return false;
    }

    const key = this.getKey(productId, variantId);
    const item = this.items.find((i) => this.getKey(i.productId, i.variantId) === key);
    if (!item) return false;

    item.boardId = targetBoardId;
    return true;
  }

  // --- Move-to-Cart Helpers ---

  /**
   * Converts a wishlisted item to cart item format for checkout integration
   */
  moveToCart(
    productId: string, 
    variantId?: string, 
    options?: { autoRemove?: boolean; quantity?: number }
  ): WishlistMoveToCartResult | null {
    const key = this.getKey(productId, variantId);
    const item = this.items.find((i) => this.getKey(i.productId, i.variantId) === key);
    if (!item) return null;

    const autoRemove = options?.autoRemove !== undefined ? options.autoRemove : this.options.autoRemoveOnMoveToCart;
    const quantity = options?.quantity || 1;

    const cartItem = {
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      price: item.price,
      quantity,
      image: item.image,
      metadata: item.metadata,
    };

    if (autoRemove) {
      this.removeItem(productId, variantId);
    }

    this.emit('item:moved_to_cart', { item, cartItem, autoRemoved: autoRemove });

    return {
      cartItem,
      remainingWishlistCount: this.items.length,
    };
  }

  /**
   * Move all items or all items in a board to cart
   */
  moveAllToCart(boardId?: string): WishlistMoveToCartResult[] {
    const targetItems = boardId ? this.items.filter((i) => i.boardId === boardId) : [...this.items];
    const results: WishlistMoveToCartResult[] = [];

    for (const item of targetItems) {
      const res = this.moveToCart(item.productId, item.variantId);
      if (res) results.push(res);
    }

    return results;
  }

  // --- Shareable Wishlist Links ---

  /**
   * Generates a shareable URL and token for public/unlisted wishlists
   */
  generateShareLink(boardId: string = 'default', baseUrl: string = 'https://mystore.com/wishlist/share/'): {
    board: WishlistBoard;
    shareUrl: string;
    shareToken: string;
  } {
    const board = this.boards.get(boardId) || this.boards.get('default')!;
    if (!board.shareToken) {
      board.shareToken = `share_${Math.random().toString(36).substring(2, 12)}`;
    }
    board.privacy = 'public';

    return {
      board,
      shareUrl: `${baseUrl}${board.shareToken}`,
      shareToken: board.shareToken,
    };
  }

  /**
   * Import or merge shared items from a friend's wishlist
   */
  importSharedWishlist(sharedItems: WishlistItem[], targetBoardName?: string): {
    board: WishlistBoard;
    importedCount: number;
  } {
    let board: WishlistBoard;
    if (targetBoardName) {
      board = this.createBoard(targetBoardName);
    } else {
      board = this.boards.get('default')!;
    }

    let importedCount = 0;
    for (const item of sharedItems) {
      if (!this.hasItem(item.productId, item.variantId)) {
        this.addItem({
          ...item,
          boardId: board.id,
        });
        importedCount++;
      }
    }

    return { board, importedCount };
  }

  // --- Alerts: Price Drop & Restock Detection ---

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

        const alert: PriceDropAlert = {
          item,
          originalPrice: item.price,
          currentPrice,
          savedAmount,
          discountPercentage,
        };

        alerts.push(alert);
        this.emit('price_drop', alert);
      }
    }

    return alerts;
  }

  /**
   * Checks catalog for items that were out of stock and are now back in stock
   */
  checkRestockAlerts(currentCatalog: Array<{ id: string; inStock: boolean }>): BackInStockAlert[] {
    const catalogMap = new Map<string, boolean>();
    for (const c of currentCatalog) {
      catalogMap.set(c.id, c.inStock);
    }

    const alerts: BackInStockAlert[] = [];

    for (const item of this.items) {
      const currentStock = catalogMap.get(item.productId);
      // Was marked out-of-stock (inStock === false), now true
      if (item.inStock === false && currentStock === true) {
        const alert: BackInStockAlert = {
          item,
          previousStock: false,
          currentStock: true,
          restockedAt: new Date().toISOString(),
        };

        item.inStock = true; // Update internal state
        alerts.push(alert);
        this.emit('back_in_stock', alert);
      }
    }

    return alerts;
  }

  /**
   * Checks if any items have reached the customer's specified target price
   */
  checkTargetPriceAlerts(currentCatalog: Array<{ id: string; price: number }>): TargetPriceReachedAlert[] {
    const catalogMap = new Map<string, number>();
    for (const c of currentCatalog) {
      catalogMap.set(c.id, c.price);
    }

    const alerts: TargetPriceReachedAlert[] = [];

    for (const item of this.items) {
      if (item.targetPrice !== undefined) {
        const currentPrice = catalogMap.get(item.productId);
        if (currentPrice !== undefined && currentPrice <= item.targetPrice) {
          const discountPercentage = Math.round(((item.price - currentPrice) / item.price) * 100);
          alerts.push({
            item,
            targetPrice: item.targetPrice,
            currentPrice,
            discountPercentage,
          });
        }
      }
    }

    return alerts;
  }

  // --- Guest Wishlist Merge (Static 100% Backward Compatible) ---

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

  // --- Universal Database Sync ---

  /**
   * Sync wishlist from any database (MongoDB, PostgreSQL, Supabase, Prisma, DynamoDB, Firebase)
   */
  public sync<T = any>(records: T[], mapper?: (record: T) => WishlistItem): number {
    if (!Array.isArray(records)) {
      throw new Error('sync requires an array of records.');
    }

    let synced = 0;
    for (const rec of records) {
      try {
        const item: WishlistItem = mapper ? mapper(rec) : (rec as unknown as WishlistItem);
        if (item && item.productId && item.title) {
          this.addItem(item);
          synced++;
        }
      } catch (e) {
        // Skip malformed records
      }
    }
    return synced;
  }

  // --- Serialization ---

  toJSON(): WishlistItem[] {
    return this.items;
  }

  fromJSON(items: WishlistItem[]): void {
    if (Array.isArray(items)) {
      this.items = items.map((i) => ({ ...i }));
    }
  }
}

export function createBoostWishlist(initialItems?: WishlistItem[], options?: WishlistOptions): BoostWishlist {
  return new BoostWishlist(initialItems, options);
}

export const wishlist = new BoostWishlist();
