'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/manager.ts
var InMemoryInventoryStorageAdapter = class {
  constructor() {
    __publicField(this, "stockMap", /* @__PURE__ */ new Map());
    __publicField(this, "reservations", /* @__PURE__ */ new Map());
  }
  getStock(key) {
    return this.stockMap.get(key) || null;
  }
  setStock(key, stock) {
    this.stockMap.set(key, stock);
  }
  getAllStock() {
    return Array.from(this.stockMap.values());
  }
  getReservations(key) {
    return this.reservations.get(key) || [];
  }
  setReservations(key, reservations) {
    if (reservations.length === 0) {
      this.reservations.delete(key);
    } else {
      this.reservations.set(key, reservations);
    }
  }
  getAllReservations() {
    const all = [];
    for (const list of this.reservations.values()) {
      all.push(...list);
    }
    return all;
  }
};
var BoostInventory = class {
  constructor(options = []) {
    __publicField(this, "storage");
    __publicField(this, "movements", []);
    __publicField(this, "listeners", /* @__PURE__ */ new Set());
    if (Array.isArray(options)) {
      this.storage = new InMemoryInventoryStorageAdapter();
      for (const item of options) {
        this.setStock(item);
      }
    } else {
      this.storage = options.storage || new InMemoryInventoryStorageAdapter();
      if (options.initialStock) {
        for (const item of options.initialStock) {
          this.setStock(item);
        }
      }
    }
  }
  /**
   * Subscribe to real-time inventory events (stock updates, reservations, deductions, restocks)
   * Returns an unsubscribe function.
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  emit(event) {
    const fullEvent = {
      ...event,
      timestamp: Date.now()
    };
    for (const listener of this.listeners) {
      try {
        listener(fullEvent);
      } catch (e) {
      }
    }
  }
  getKey(sku, warehouseId) {
    const cleanSku = (sku || "").trim();
    return warehouseId ? `${cleanSku}@${warehouseId.trim()}` : cleanSku;
  }
  recordMovement(type, sku, quantity, warehouseId, reason, reservationId) {
    this.movements.push({
      id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      type,
      sku,
      quantity,
      warehouseId,
      reason,
      reservationId
    });
  }
  /**
   * Sets or updates stock quantity and configuration for an SKU
   */
  setStock(stock) {
    const key = this.getKey(stock.sku, stock.warehouseId);
    this.storage.setStock(key, {
      ...stock,
      reserved: stock.reserved || 0,
      safetyStock: stock.safetyStock || 0,
      lowStockThreshold: stock.lowStockThreshold ?? 5,
      backorderedCount: stock.backorderedCount || 0
    });
    this.emit({
      type: "stock_updated",
      sku: stock.sku,
      warehouseId: stock.warehouseId,
      quantity: stock.quantity,
      availableQuantity: this.getAvailableQuantity(stock.sku, stock.warehouseId)
    });
  }
  /**
   * Inbound restock method to add new stock and record audit ledger
   */
  restock(sku, quantity, warehouseId, reason = "Inbound shipment") {
    const existing = this.getStock(sku, warehouseId);
    const updated = existing ? { ...existing, quantity: existing.quantity + quantity } : { sku, productId: sku, quantity, warehouseId, reserved: 0, safetyStock: 0, lowStockThreshold: 5 };
    this.setStock(updated);
    this.recordMovement("inbound", sku, quantity, warehouseId, reason);
    return updated;
  }
  /**
   * Gets current stock level for an SKU
   */
  getStock(sku, warehouseId) {
    const key = this.getKey(sku, warehouseId);
    return this.storage.getStock(key) || null;
  }
  /**
   * Returns all stock records currently registered in the inventory
   */
  getAllStock() {
    if (this.storage.getAllStock) {
      return this.storage.getAllStock();
    }
    return [];
  }
  /**
   * Calculates net available quantity after deducting reservations and safety stock
   */
  getAvailableQuantity(sku, warehouseId) {
    const stock = this.getStock(sku, warehouseId);
    if (!stock) return 0;
    const reserved = stock.reserved || 0;
    const safety = stock.safetyStock || 0;
    return Math.max(0, stock.quantity - reserved - safety);
  }
  /**
   * Calculates Low Stock Urgency details and high-converting marketing badge
   */
  getUrgency(sku, warehouseId) {
    const stock = this.getStock(sku, warehouseId);
    if (!stock) {
      return {
        isOutOfStock: true,
        isLowStock: false,
        isBackorder: false,
        availableQuantity: 0,
        badgeText: "Sold Out",
        urgencyLevel: "critical"
      };
    }
    const available = this.getAvailableQuantity(sku, warehouseId);
    const threshold = stock.lowStockThreshold ?? 5;
    if (available === 0) {
      if (stock.allowBackorder) {
        const restockNotice = stock.estimatedRestockDate ? ` (Ships by ${stock.estimatedRestockDate})` : "";
        return {
          isOutOfStock: false,
          isLowStock: false,
          isBackorder: true,
          availableQuantity: 0,
          badgeText: `\u{1F4E6} Available on Backorder${restockNotice}`,
          urgencyLevel: "low",
          estimatedRestockDate: stock.estimatedRestockDate
        };
      }
      return {
        isOutOfStock: true,
        isLowStock: false,
        isBackorder: false,
        availableQuantity: 0,
        badgeText: "Sold Out",
        urgencyLevel: "critical"
      };
    }
    if (available <= 2) {
      return {
        isOutOfStock: false,
        isLowStock: true,
        isBackorder: false,
        availableQuantity: available,
        badgeText: `\u26A1 Almost Gone! Only ${available} left in stock!`,
        urgencyLevel: "high"
      };
    }
    if (available <= threshold) {
      return {
        isOutOfStock: false,
        isLowStock: true,
        isBackorder: false,
        availableQuantity: available,
        badgeText: `\u{1F525} Hurry! Only ${available} left in stock!`,
        urgencyLevel: "low"
      };
    }
    return {
      isOutOfStock: false,
      isLowStock: false,
      isBackorder: false,
      availableQuantity: available,
      badgeText: "In Stock",
      urgencyLevel: "none"
    };
  }
  /**
   * Temporarily reserves stock during checkout/flash sale to prevent overselling
   */
  reserveStock(items, ttlSeconds = 900, metadata) {
    this.cleanupExpiredReservations();
    const missing = [];
    for (const item of items) {
      const available = this.getAvailableQuantity(item.sku);
      if (available < item.quantity) {
        missing.push({ sku: item.sku, quantity: item.quantity - available });
      }
    }
    if (missing.length > 0) {
      return { success: false, missingItems: missing };
    }
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = Math.floor(Date.now() / 1e3) + ttlSeconds;
    const reservedEntries = [];
    for (const item of items) {
      const stock = this.getStock(item.sku);
      stock.reserved = (stock.reserved || 0) + item.quantity;
      this.setStock(stock);
      reservedEntries.push({
        reservationId,
        sku: item.sku,
        quantity: item.quantity,
        expiresAt,
        metadata
      });
      this.recordMovement("reservation", item.sku, item.quantity, stock.warehouseId, "Hold for checkout", reservationId);
      this.emit({
        type: "stock_reserved",
        sku: item.sku,
        quantity: item.quantity,
        reservationId,
        availableQuantity: this.getAvailableQuantity(item.sku)
      });
    }
    this.storage.setReservations(reservationId, reservedEntries);
    return { success: true, reservationId };
  }
  /**
   * Extends the TTL of an active reservation (e.g. customer is entering payment details)
   */
  extendReservation(reservationId, extraSeconds = 300) {
    const entries = this.storage.getReservations(reservationId);
    if (!entries || entries.length === 0) return false;
    const now = Math.floor(Date.now() / 1e3);
    const updated = entries.map((entry) => ({
      ...entry,
      expiresAt: Math.max(entry.expiresAt, now) + extraSeconds,
      extendedAt: now
    }));
    this.storage.setReservations(reservationId, updated);
    return true;
  }
  /**
   * Releases reserved stock (e.g. if customer abandons checkout or payment fails)
   */
  releaseReservation(reservationId, reason = "Checkout abandoned or expired") {
    const entries = this.storage.getReservations(reservationId);
    if (!entries || entries.length === 0) return false;
    for (const entry of entries) {
      const stock = this.getStock(entry.sku);
      if (stock && stock.reserved) {
        stock.reserved = Math.max(0, stock.reserved - entry.quantity);
        this.setStock(stock);
        this.recordMovement("release", entry.sku, entry.quantity, stock.warehouseId, reason, reservationId);
        this.emit({
          type: "reservation_released",
          sku: entry.sku,
          quantity: entry.quantity,
          reservationId,
          availableQuantity: this.getAvailableQuantity(entry.sku)
        });
      }
    }
    this.storage.setReservations(reservationId, []);
    return true;
  }
  /**
   * Permanently deducts stock when payment succeeds
   */
  confirmDeduction(reservationId, orderId) {
    const entries = this.storage.getReservations(reservationId);
    if (!entries || entries.length === 0) return false;
    for (const entry of entries) {
      const stock = this.getStock(entry.sku);
      if (stock) {
        stock.quantity = Math.max(0, stock.quantity - entry.quantity);
        stock.reserved = Math.max(0, (stock.reserved || 0) - entry.quantity);
        this.setStock(stock);
        this.recordMovement("deduction", entry.sku, entry.quantity, stock.warehouseId, `Order captured: ${orderId || "Direct"}`, reservationId);
        this.emit({
          type: "deduction_confirmed",
          sku: entry.sku,
          quantity: entry.quantity,
          reservationId,
          availableQuantity: this.getAvailableQuantity(entry.sku)
        });
      }
    }
    this.storage.setReservations(reservationId, []);
    return true;
  }
  /**
   * Auto-sweep expired reservations whose TTL has lapsed and restore stock
   */
  cleanupExpiredReservations(nowSeconds) {
    const now = nowSeconds ?? Math.floor(Date.now() / 1e3);
    const cleanedIds = [];
    if (!this.storage.getAllReservations) return cleanedIds;
    const all = this.storage.getAllReservations();
    const reservationGroups = /* @__PURE__ */ new Map();
    for (const r of all) {
      const list = reservationGroups.get(r.reservationId) || [];
      list.push(r);
      reservationGroups.set(r.reservationId, list);
    }
    for (const [resId, list] of reservationGroups.entries()) {
      const isExpired = list.some((entry) => entry.expiresAt <= now);
      if (isExpired) {
        this.releaseReservation(resId, "Automatic TTL expiration sweep");
        cleanedIds.push(resId);
      }
    }
    return cleanedIds;
  }
  /**
   * Validates cart availability for multi-item checkout (Direct bridge for @boostengine/cart)
   */
  checkCartAvailability(items) {
    let allAvailable = true;
    let hasBackorders = false;
    const itemResults = [];
    for (const item of items) {
      const stock = this.getStock(item.sku);
      const available = this.getAvailableQuantity(item.sku);
      if (available >= item.quantity) {
        itemResults.push({
          sku: item.sku,
          requestedQuantity: item.quantity,
          availableQuantity: available,
          canFulfill: true,
          isBackorder: false,
          shortfall: 0
        });
      } else {
        const shortfall = item.quantity - available;
        const allowBackorder = !!stock?.allowBackorder;
        if (allowBackorder) {
          hasBackorders = true;
          itemResults.push({
            sku: item.sku,
            requestedQuantity: item.quantity,
            availableQuantity: available,
            canFulfill: true,
            isBackorder: true,
            shortfall,
            estimatedRestockDate: stock?.estimatedRestockDate
          });
        } else {
          allAvailable = false;
          itemResults.push({
            sku: item.sku,
            requestedQuantity: item.quantity,
            availableQuantity: available,
            canFulfill: false,
            isBackorder: false,
            shortfall
          });
        }
      }
    }
    return {
      allAvailable,
      hasBackorders,
      items: itemResults
    };
  }
  /**
   * Scans all inventory for low-stock warnings and critical shortages
   */
  getLowStockAlerts(warehouseId) {
    const allStock = this.getAllStock();
    const alerts = [];
    for (const stock of allStock) {
      if (warehouseId && stock.warehouseId && stock.warehouseId !== warehouseId) {
        continue;
      }
      const available = Math.max(0, stock.quantity - (stock.reserved || 0) - (stock.safetyStock || 0));
      const threshold = stock.lowStockThreshold ?? 5;
      if (available <= threshold) {
        const severity = available === 0 ? "critical" : "warning";
        const recommendedReorderQty = Math.max(20, threshold * 3 - available);
        alerts.push({
          sku: stock.sku,
          productId: stock.productId,
          warehouseId: stock.warehouseId,
          availableQuantity: available,
          threshold,
          severity,
          recommendedReorderQty
        });
      }
    }
    return alerts.sort((a, b) => a.availableQuantity - b.availableQuantity);
  }
  /**
   * Intelligent Multi-Warehouse Allocation
   * Selects the single warehouse that can fulfill all items and is closest to destination
   */
  allocateWarehouse(items, warehouses, customerPincode) {
    const sortedWarehouses = this.sortWarehousesByProximity(warehouses, customerPincode);
    for (const wh of sortedWarehouses) {
      let canFulfillAll = true;
      const missing = [];
      for (const item of items) {
        const stock = this.getStock(item.sku, wh.id);
        const available = stock ? Math.max(0, stock.quantity - (stock.reserved || 0) - (stock.safetyStock || 0)) : 0;
        if (available < item.quantity) {
          canFulfillAll = false;
          missing.push({ sku: item.sku, requested: item.quantity, available });
        }
      }
      if (canFulfillAll) {
        return {
          canFulfill: true,
          allocatedWarehouseId: wh.id,
          missingItems: []
        };
      }
    }
    return {
      canFulfill: false,
      missingItems: items.map((i) => ({ sku: i.sku, requested: i.quantity, available: 0 }))
    };
  }
  /**
   * Multi-Origin Split Fulfillment Plan
   * If no single warehouse has all items, splits shipment across minimal warehouses
   */
  allocateSplitShipment(items, warehouses, customerPincode) {
    const singleAlloc = this.allocateWarehouse(items, warehouses, customerPincode);
    if (singleAlloc.canFulfill && singleAlloc.allocatedWarehouseId) {
      const wh = warehouses.find((w) => w.id === singleAlloc.allocatedWarehouseId);
      return {
        canFulfill: true,
        isSplit: false,
        shipments: [
          {
            warehouseId: singleAlloc.allocatedWarehouseId,
            warehouseName: wh?.name,
            items
          }
        ],
        unfulfilledItems: []
      };
    }
    const sortedWarehouses = this.sortWarehousesByProximity(warehouses, customerPincode);
    const needed = /* @__PURE__ */ new Map();
    for (const it of items) {
      needed.set(it.sku, it.quantity);
    }
    const shipments = [];
    for (const wh of sortedWarehouses) {
      const allocatedHere = [];
      for (const [sku, qtyNeeded] of needed.entries()) {
        if (qtyNeeded <= 0) continue;
        const stock = this.getStock(sku, wh.id);
        const available = stock ? Math.max(0, stock.quantity - (stock.reserved || 0) - (stock.safetyStock || 0)) : 0;
        if (available > 0) {
          const take = Math.min(available, qtyNeeded);
          allocatedHere.push({ sku, quantity: take });
          needed.set(sku, qtyNeeded - take);
        }
      }
      if (allocatedHere.length > 0) {
        shipments.push({
          warehouseId: wh.id,
          warehouseName: wh.name,
          items: allocatedHere
        });
      }
      const remainingTotal = Array.from(needed.values()).reduce((a, b) => a + b, 0);
      if (remainingTotal === 0) break;
    }
    const unfulfilled = [];
    for (const [sku, remaining] of needed.entries()) {
      if (remaining > 0) {
        const originalReq = items.find((i) => i.sku === sku)?.quantity || remaining;
        unfulfilled.push({
          sku,
          requested: originalReq,
          available: originalReq - remaining
        });
      }
    }
    return {
      canFulfill: unfulfilled.length === 0,
      isSplit: shipments.length > 1,
      shipments,
      unfulfilledItems: unfulfilled
    };
  }
  sortWarehousesByProximity(warehouses, customerPincode) {
    const list = [...warehouses];
    if (!customerPincode) {
      return list.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));
    }
    const cleanPin = customerPincode.trim();
    const pinPrefix2 = cleanPin.substring(0, 2);
    const pinPrefix1 = cleanPin.substring(0, 1);
    return list.sort((a, b) => {
      const aPin = (a.pincode || "").trim();
      const bPin = (b.pincode || "").trim();
      if (aPin === cleanPin && bPin !== cleanPin) return -1;
      if (bPin === cleanPin && aPin !== cleanPin) return 1;
      const aMatch2 = aPin.startsWith(pinPrefix2);
      const bMatch2 = bPin.startsWith(pinPrefix2);
      if (aMatch2 && !bMatch2) return -1;
      if (bMatch2 && !aMatch2) return 1;
      const aMatch1 = aPin.startsWith(pinPrefix1);
      const bMatch1 = bPin.startsWith(pinPrefix1);
      if (aMatch1 && !bMatch1) return -1;
      if (bMatch1 && !aMatch1) return 1;
      if (a.isDefault && !b.isDefault) return -1;
      if (b.isDefault && !a.isDefault) return 1;
      return (a.priority ?? 10) - (b.priority ?? 10);
    });
  }
  /**
   * Retrieves stock movements audit log
   */
  getMovements(sku) {
    if (!sku) return [...this.movements];
    return this.movements.filter((m) => m.sku === sku);
  }
  // --- Quick 1-Liners for Developers ---
  quickCheck(sku, requestedQty = 1, warehouseId) {
    return this.getAvailableQuantity(sku, warehouseId) >= requestedQty;
  }
  quickReserve(itemsOrSku, quantityOrTtl = 1, ttlSeconds = 900) {
    if (typeof itemsOrSku === "string") {
      return this.reserveStock([{ sku: itemsOrSku, quantity: quantityOrTtl }], ttlSeconds);
    }
    return this.reserveStock(itemsOrSku, quantityOrTtl);
  }
  quickConfirm(reservationId, orderId) {
    return this.confirmDeduction(reservationId, orderId);
  }
  quickRelease(reservationId, reason) {
    return this.releaseReservation(reservationId, reason);
  }
};
function createBoostInventory(initialStock) {
  return new BoostInventory(initialStock);
}
var inventory = new BoostInventory();

// src/agent.ts
var InventoryAgentToolkit = class _InventoryAgentToolkit {
  /**
   * Universal tool definitions formatted for OpenAI Function Calling
   */
  static getOpenAITools() {
    return [
      {
        type: "function",
        function: {
          name: "check_stock_availability",
          description: "Check available quantity, low stock urgency, and backorder status for one or more product SKUs.",
          parameters: {
            type: "object",
            properties: {
              items: {
                type: "array",
                description: "Array of items with SKU and quantity to check",
                items: {
                  type: "object",
                  properties: {
                    sku: { type: "string", description: "Product variant SKU" },
                    quantity: { type: "number", description: "Desired purchase quantity (default: 1)" }
                  },
                  required: ["sku"]
                }
              },
              warehouseId: { type: "string", description: "Optional warehouse ID filter" }
            },
            required: ["items"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "reserve_order_stock",
          description: "Temporarily lock and reserve inventory for checkout or flash sale with an auto-expiring TTL.",
          parameters: {
            type: "object",
            properties: {
              items: {
                type: "array",
                description: "Items to reserve with SKU and quantity",
                items: {
                  type: "object",
                  properties: {
                    sku: { type: "string", description: "SKU identifier" },
                    quantity: { type: "number", description: "Quantity to reserve" }
                  },
                  required: ["sku", "quantity"]
                }
              },
              ttlSeconds: { type: "number", description: "Lock duration in seconds (default: 900 / 15 minutes)" },
              cartId: { type: "string", description: "Optional associated cart ID" }
            },
            required: ["items"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "release_stock_reservation",
          description: "Release a previously held stock reservation if checkout is abandoned or payment failed.",
          parameters: {
            type: "object",
            properties: {
              reservationId: { type: "string", description: "The unique reservation ID returned by reserve_order_stock" },
              reason: { type: "string", description: "Reason for releasing reservation" }
            },
            required: ["reservationId"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "confirm_stock_deduction",
          description: "Permanently deduct reserved stock when payment succeeds and order is confirmed.",
          parameters: {
            type: "object",
            properties: {
              reservationId: { type: "string", description: "The reservation ID to confirm" },
              orderId: { type: "string", description: "Confirmed order ID" }
            },
            required: ["reservationId"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "find_fulfillment_warehouse",
          description: "Calculate the optimal warehouse fulfillment routing (or split shipment plan) for order items.",
          parameters: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    sku: { type: "string" },
                    quantity: { type: "number" }
                  },
                  required: ["sku", "quantity"]
                }
              },
              warehouses: {
                type: "array",
                description: "List of available warehouses",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    pincode: { type: "string" },
                    state: { type: "string" },
                    priority: { type: "number" },
                    isDefault: { type: "boolean" }
                  },
                  required: ["id", "name", "pincode", "state"]
                }
              },
              customerPincode: { type: "string", description: "Destination customer postal/pincode" },
              allowSplit: { type: "boolean", description: "Whether multi-origin split shipments are permitted" }
            },
            required: ["items", "warehouses"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_low_stock_reorder_list",
          description: "Scan inventory to retrieve critical shortages and low stock items needing replenishment.",
          parameters: {
            type: "object",
            properties: {
              warehouseId: { type: "string", description: "Optional specific warehouse ID" }
            }
          }
        }
      }
    ];
  }
  /**
   * Tool definitions formatted for Anthropic Claude
   */
  static getClaudeTools() {
    return this.getOpenAITools().map((tool) => ({
      name: tool.function.name,
      description: tool.function.description,
      input_schema: tool.function.parameters
    }));
  }
  /**
   * Tool definitions formatted for Google Gemini function calling
   */
  static getGeminiTools() {
    return [
      {
        functionDeclarations: this.getOpenAITools().map((tool) => ({
          name: tool.function.name,
          description: tool.function.description,
          parameters: tool.function.parameters
        }))
      }
    ];
  }
  /**
   * Tool definitions for Vercel AI SDK (`ai`)
   */
  static getVercelAITools(inventoryInstance) {
    const inv = inventoryInstance || inventory;
    return {
      check_stock_availability: {
        description: "Check available quantity, low stock urgency, and backorder status for product SKUs.",
        execute: async (params) => {
          return _InventoryAgentToolkit.executeTool("check_stock_availability", params, inv);
        }
      },
      reserve_order_stock: {
        description: "Temporarily lock and reserve inventory for checkout or flash sale.",
        execute: async (params) => {
          return _InventoryAgentToolkit.executeTool("reserve_order_stock", params, inv);
        }
      },
      release_stock_reservation: {
        description: "Release a previously held stock reservation.",
        execute: async (params) => {
          return _InventoryAgentToolkit.executeTool("release_stock_reservation", params, inv);
        }
      },
      confirm_stock_deduction: {
        description: "Permanently deduct reserved stock upon order confirmation.",
        execute: async (params) => {
          return _InventoryAgentToolkit.executeTool("confirm_stock_deduction", params, inv);
        }
      },
      find_fulfillment_warehouse: {
        description: "Route items to nearest warehouse or calculate multi-origin split plan.",
        execute: async (params) => {
          return _InventoryAgentToolkit.executeTool("find_fulfillment_warehouse", params, inv);
        }
      },
      get_low_stock_reorder_list: {
        description: "Scan inventory for low stock reorder alerts.",
        execute: async (params) => {
          return _InventoryAgentToolkit.executeTool("get_low_stock_reorder_list", params, inv);
        }
      }
    };
  }
  /**
   * Universal Tool Executor for AI Agents
   */
  static async executeTool(toolName, params, inventoryInstance) {
    const inv = inventoryInstance || inventory;
    try {
      switch (toolName) {
        case "check_stock_availability": {
          const items = (params.items || []).map((it) => ({
            sku: it.sku,
            quantity: it.quantity || 1
          }));
          const cartCheck = inv.checkCartAvailability(items);
          const urgencyList = items.map((it) => ({
            sku: it.sku,
            ...inv.getUrgency(it.sku, params.warehouseId)
          }));
          return {
            toolName,
            success: true,
            data: {
              allAvailable: cartCheck.allAvailable,
              hasBackorders: cartCheck.hasBackorders,
              items: cartCheck.items,
              urgencies: urgencyList
            }
          };
        }
        case "reserve_order_stock": {
          const items = params.items || [];
          const ttl = params.ttlSeconds ?? 900;
          const result = inv.reserveStock(items, ttl, { cartId: params.cartId });
          return {
            toolName,
            success: result.success,
            data: result
          };
        }
        case "release_stock_reservation": {
          const ok = inv.releaseReservation(params.reservationId, params.reason);
          return {
            toolName,
            success: ok,
            data: { released: ok, reservationId: params.reservationId }
          };
        }
        case "confirm_stock_deduction": {
          const ok = inv.confirmDeduction(params.reservationId, params.orderId);
          return {
            toolName,
            success: ok,
            data: { confirmed: ok, reservationId: params.reservationId, orderId: params.orderId }
          };
        }
        case "find_fulfillment_warehouse": {
          const items = params.items || [];
          const warehouses = params.warehouses || [];
          const customerPincode = params.customerPincode;
          const allowSplit = params.allowSplit !== false;
          if (allowSplit) {
            const splitPlan = inv.allocateSplitShipment(items, warehouses, customerPincode);
            return {
              toolName,
              success: splitPlan.canFulfill,
              data: splitPlan
            };
          } else {
            const singlePlan = inv.allocateWarehouse(items, warehouses, customerPincode);
            return {
              toolName,
              success: singlePlan.canFulfill,
              data: singlePlan
            };
          }
        }
        case "get_low_stock_reorder_list": {
          const alerts = inv.getLowStockAlerts(params.warehouseId);
          return {
            toolName,
            success: true,
            data: {
              totalAlerts: alerts.length,
              alerts
            }
          };
        }
        default:
          return {
            toolName,
            success: false,
            error: `Unknown tool name: ${toolName}`
          };
      }
    } catch (err) {
      return {
        toolName,
        success: false,
        error: err?.message || String(err)
      };
    }
  }
};

exports.BoostInventory = BoostInventory;
exports.InMemoryInventoryStorageAdapter = InMemoryInventoryStorageAdapter;
exports.InventoryAgentToolkit = InventoryAgentToolkit;
exports.createBoostInventory = createBoostInventory;
exports.inventory = inventory;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map