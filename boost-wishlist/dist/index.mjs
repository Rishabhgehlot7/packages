var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/manager.ts
var BoostWishlist = class {
  constructor(initialItems = [], options = {}) {
    __publicField(this, "items", []);
    __publicField(this, "boards", /* @__PURE__ */ new Map());
    __publicField(this, "eventListeners", /* @__PURE__ */ new Map());
    __publicField(this, "options");
    this.options = {
      autoRemoveOnMoveToCart: options.autoRemoveOnMoveToCart !== false,
      storageKey: options.storageKey || "boost_wishlist_items"
    };
    this.boards.set("default", {
      id: "default",
      name: "My Wishlist",
      isDefault: true,
      privacy: "private",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.items = initialItems.map((i) => ({
      ...i,
      boardId: i.boardId || "default",
      originalAddedPrice: i.originalAddedPrice || i.price
    }));
  }
  // --- Real-Time Event Emitter ---
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
          console.error(`[BoostWishlist] Error in "${event}" event listener:`, e);
        }
      }
    }
  }
  getKey(productId, variantId) {
    return `${productId}_${variantId || "default"}`;
  }
  // --- Core Item Management (100% Backward Compatible) ---
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
      addedAt: item.addedAt || (/* @__PURE__ */ new Date()).toISOString(),
      boardId: item.boardId || "default",
      originalAddedPrice: item.originalAddedPrice || item.price
    };
    this.items.push(newItem);
    this.emit("item:added", { item: newItem, totalCount: this.items.length });
    return newItem;
  }
  /**
   * Removes an item from the wishlist
   */
  removeItem(productId, variantId) {
    const key = this.getKey(productId, variantId);
    const removedItem = this.items.find((i) => this.getKey(i.productId, i.variantId) === key);
    const initialLen = this.items.length;
    this.items = this.items.filter((i) => this.getKey(i.productId, i.variantId) !== key);
    const success = this.items.length < initialLen;
    if (success && removedItem) {
      this.emit("item:removed", { item: removedItem, totalCount: this.items.length });
    }
    return success;
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
   * Gets list of all wishlisted items (optional filter by boardId)
   */
  getItems(boardId) {
    if (boardId) {
      return this.items.filter((i) => i.boardId === boardId);
    }
    return [...this.items];
  }
  /**
   * Produces a summary with total count, value, and boards
   */
  getSummary(boardId) {
    const filtered = boardId ? this.items.filter((i) => i.boardId === boardId) : this.items;
    const totalCount = filtered.length;
    const totalValue = Math.round(filtered.reduce((sum, i) => sum + i.price, 0) * 100) / 100;
    return {
      items: [...filtered],
      totalCount,
      totalValue,
      boardCount: this.boards.size
    };
  }
  /**
   * Clears all items
   */
  clear(boardId) {
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
  createBoard(name, options = {}) {
    const id = `board_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const board = {
      id,
      name,
      description: options.description,
      isDefault: false,
      privacy: options.privacy || "private",
      shareToken: `share_${Math.random().toString(36).substring(2, 12)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.boards.set(id, board);
    this.emit("board:created", board);
    return board;
  }
  /**
   * Delete a custom board and reassign its items to default board
   */
  deleteBoard(boardId) {
    if (boardId === "default" || !this.boards.has(boardId)) {
      return false;
    }
    const deleted = this.boards.get(boardId);
    this.boards.delete(boardId);
    for (const item of this.items) {
      if (item.boardId === boardId) {
        item.boardId = "default";
      }
    }
    this.emit("board:deleted", deleted);
    return true;
  }
  /**
   * Get all wishlist boards
   */
  getBoards() {
    return Array.from(this.boards.values());
  }
  /**
   * Move an item to another board
   */
  moveToBoard(productId, targetBoardId, variantId) {
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
  moveToCart(productId, variantId, options) {
    const key = this.getKey(productId, variantId);
    const item = this.items.find((i) => this.getKey(i.productId, i.variantId) === key);
    if (!item) return null;
    const autoRemove = options?.autoRemove !== void 0 ? options.autoRemove : this.options.autoRemoveOnMoveToCart;
    const quantity = options?.quantity || 1;
    const cartItem = {
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      price: item.price,
      quantity,
      image: item.image,
      metadata: item.metadata
    };
    if (autoRemove) {
      this.removeItem(productId, variantId);
    }
    this.emit("item:moved_to_cart", { item, cartItem, autoRemoved: autoRemove });
    return {
      cartItem,
      remainingWishlistCount: this.items.length
    };
  }
  /**
   * Move all items or all items in a board to cart
   */
  moveAllToCart(boardId) {
    const targetItems = boardId ? this.items.filter((i) => i.boardId === boardId) : [...this.items];
    const results = [];
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
  generateShareLink(boardId = "default", baseUrl = "https://mystore.com/wishlist/share/") {
    const board = this.boards.get(boardId) || this.boards.get("default");
    if (!board.shareToken) {
      board.shareToken = `share_${Math.random().toString(36).substring(2, 12)}`;
    }
    board.privacy = "public";
    return {
      board,
      shareUrl: `${baseUrl}${board.shareToken}`,
      shareToken: board.shareToken
    };
  }
  /**
   * Import or merge shared items from a friend's wishlist
   */
  importSharedWishlist(sharedItems, targetBoardName) {
    let board;
    if (targetBoardName) {
      board = this.createBoard(targetBoardName);
    } else {
      board = this.boards.get("default");
    }
    let importedCount = 0;
    for (const item of sharedItems) {
      if (!this.hasItem(item.productId, item.variantId)) {
        this.addItem({
          ...item,
          boardId: board.id
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
        const alert = {
          item,
          originalPrice: item.price,
          currentPrice,
          savedAmount,
          discountPercentage
        };
        alerts.push(alert);
        this.emit("price_drop", alert);
      }
    }
    return alerts;
  }
  /**
   * Checks catalog for items that were out of stock and are now back in stock
   */
  checkRestockAlerts(currentCatalog) {
    const catalogMap = /* @__PURE__ */ new Map();
    for (const c of currentCatalog) {
      catalogMap.set(c.id, c.inStock);
    }
    const alerts = [];
    for (const item of this.items) {
      const currentStock = catalogMap.get(item.productId);
      if (item.inStock === false && currentStock === true) {
        const alert = {
          item,
          previousStock: false,
          currentStock: true,
          restockedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        item.inStock = true;
        alerts.push(alert);
        this.emit("back_in_stock", alert);
      }
    }
    return alerts;
  }
  /**
   * Checks if any items have reached the customer's specified target price
   */
  checkTargetPriceAlerts(currentCatalog) {
    const catalogMap = /* @__PURE__ */ new Map();
    for (const c of currentCatalog) {
      catalogMap.set(c.id, c.price);
    }
    const alerts = [];
    for (const item of this.items) {
      if (item.targetPrice !== void 0) {
        const currentPrice = catalogMap.get(item.productId);
        if (currentPrice !== void 0 && currentPrice <= item.targetPrice) {
          const discountPercentage = Math.round((item.price - currentPrice) / item.price * 100);
          alerts.push({
            item,
            targetPrice: item.targetPrice,
            currentPrice,
            discountPercentage
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
  // --- Universal Database Sync ---
  /**
   * Sync wishlist from any database (MongoDB, PostgreSQL, Supabase, Prisma, DynamoDB, Firebase)
   */
  sync(records, mapper) {
    if (!Array.isArray(records)) {
      throw new Error("sync requires an array of records.");
    }
    let synced = 0;
    for (const rec of records) {
      try {
        const item = mapper ? mapper(rec) : rec;
        if (item && item.productId && item.title) {
          this.addItem(item);
          synced++;
        }
      } catch (e) {
      }
    }
    return synced;
  }
  // --- Serialization ---
  toJSON() {
    return this.items;
  }
  fromJSON(items) {
    if (Array.isArray(items)) {
      this.items = items.map((i) => ({ ...i }));
    }
  }
};
function createBoostWishlist(initialItems, options) {
  return new BoostWishlist(initialItems, options);
}
var wishlist = new BoostWishlist();

// src/agent.ts
var WishlistAgentToolkit = class {
  constructor(manager = wishlist) {
    __publicField(this, "manager");
    this.manager = manager;
  }
  /**
   * Universal JSON Schema tool declarations
   */
  getTools() {
    return [
      {
        name: "get_wishlist_items",
        description: "Get all wishlisted items for the customer, optionally filtered by board ID, along with total item count and valuation.",
        parameters: {
          type: "object",
          properties: {
            boardId: { type: "string", description: 'Optional board ID to filter items (e.g. "default", "board_123").' }
          }
        }
      },
      {
        name: "toggle_wishlist_item",
        description: "Toggle saving an item to the customer wishlist (adds if absent, removes if already present).",
        parameters: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Unique product ID." },
            variantId: { type: "string", description: "Optional variant ID (e.g. size/color)." },
            title: { type: "string", description: "Product title." },
            price: { type: "number", description: "Current unit price." },
            image: { type: "string", description: "Product image URL." },
            boardId: { type: "string", description: 'Target board ID (default "default").' }
          },
          required: ["productId", "title", "price"]
        }
      },
      {
        name: "check_price_drops",
        description: "Compare wishlisted items against the live product catalog to detect price reductions or restocked items.",
        parameters: {
          type: "object",
          properties: {
            catalog: {
              type: "array",
              description: "Array of products with id and current price.",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  price: { type: "number" },
                  inStock: { type: "boolean" }
                },
                required: ["id", "price"]
              }
            }
          },
          required: ["catalog"]
        }
      },
      {
        name: "move_item_to_cart",
        description: "Transfer a wishlisted item directly into cart format for checkout, with optional auto-removal from wishlist.",
        parameters: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Product ID to move." },
            variantId: { type: "string", description: "Variant ID if applicable." },
            quantity: { type: "number", description: "Quantity to add to cart (default 1)." },
            autoRemove: { type: "boolean", description: "Whether to remove from wishlist after moving (default true)." }
          },
          required: ["productId"]
        }
      },
      {
        name: "create_wishlist_board",
        description: 'Create a custom named wishlist collection or board (e.g. "Birthday Ideas", "Living Room Decor").',
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the new board." },
            description: { type: "string", description: "Optional description of the board." },
            privacy: { type: "string", enum: ["public", "private", "unlisted"], description: "Board privacy setting." }
          },
          required: ["name"]
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
   * Autonomous router for tool executions
   */
  async executeTool(name, args) {
    switch (name) {
      case "get_wishlist_items": {
        const summary = this.manager.getSummary(args.boardId);
        const boards = this.manager.getBoards();
        return {
          totalCount: summary.totalCount,
          totalValue: summary.totalValue,
          items: summary.items,
          boards
        };
      }
      case "toggle_wishlist_item": {
        const res = this.manager.toggleItem({
          productId: args.productId,
          variantId: args.variantId,
          title: args.title,
          price: Number(args.price),
          image: args.image,
          boardId: args.boardId
        });
        return {
          success: true,
          isWishlisted: res.isWishlisted,
          item: res.item,
          totalCount: this.manager.getItems().length
        };
      }
      case "check_price_drops": {
        const alerts = this.manager.checkPriceDrops(args.catalog || []);
        return {
          alertsCount: alerts.length,
          alerts
        };
      }
      case "move_item_to_cart": {
        const result = this.manager.moveToCart(args.productId, args.variantId, {
          autoRemove: args.autoRemove !== false,
          quantity: args.quantity || 1
        });
        if (!result) {
          return { success: false, error: `Item "${args.productId}" not found in wishlist.` };
        }
        return {
          success: true,
          cartItem: result.cartItem,
          remainingWishlistCount: result.remainingWishlistCount
        };
      }
      case "create_wishlist_board": {
        const board = this.manager.createBoard(args.name, {
          description: args.description,
          privacy: args.privacy
        });
        return {
          success: true,
          board
        };
      }
      default:
        throw new Error(`Unknown wishlist agent tool: "${name}"`);
    }
  }
};

export { BoostWishlist, WishlistAgentToolkit, createBoostWishlist, wishlist };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map