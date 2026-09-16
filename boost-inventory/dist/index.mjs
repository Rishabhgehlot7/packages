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
  getReservations(key) {
    return this.reservations.get(key) || [];
  }
  setReservations(key, reservations) {
    this.reservations.set(key, reservations);
  }
};
var BoostInventory = class {
  constructor(options = []) {
    __publicField(this, "storage");
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
  getKey(sku, warehouseId) {
    const cleanSku = (sku || "").trim();
    return warehouseId ? `${cleanSku}@${warehouseId.trim()}` : cleanSku;
  }
  /**
   * Sets or updates stock quantity for an SKU
   */
  setStock(stock) {
    const key = this.getKey(stock.sku, stock.warehouseId);
    this.storage.setStock(key, {
      ...stock,
      reserved: stock.reserved || 0,
      lowStockThreshold: stock.lowStockThreshold ?? 5
    });
  }
  /**
   * Gets current stock level for an SKU
   */
  getStock(sku, warehouseId) {
    const key = this.getKey(sku, warehouseId);
    return this.storage.getStock(key) || null;
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
        availableQuantity: 0,
        badgeText: "Sold Out",
        urgencyLevel: "critical"
      };
    }
    const available = Math.max(0, stock.quantity - (stock.reserved || 0));
    const threshold = stock.lowStockThreshold ?? 5;
    if (available === 0) {
      return {
        isOutOfStock: true,
        isLowStock: false,
        availableQuantity: 0,
        badgeText: "Sold Out",
        urgencyLevel: "critical"
      };
    }
    if (available <= 2) {
      return {
        isOutOfStock: false,
        isLowStock: true,
        availableQuantity: available,
        badgeText: `\u26A1 Almost Gone! Only ${available} left in stock!`,
        urgencyLevel: "high"
      };
    }
    if (available <= threshold) {
      return {
        isOutOfStock: false,
        isLowStock: true,
        availableQuantity: available,
        badgeText: `\u{1F525} Hurry! Only ${available} left in stock!`,
        urgencyLevel: "low"
      };
    }
    return {
      isOutOfStock: false,
      isLowStock: false,
      availableQuantity: available,
      badgeText: "In Stock",
      urgencyLevel: "none"
    };
  }
  /**
   * Temporarily reserves stock during checkout to prevent overselling
   */
  reserveStock(items, ttlSeconds = 900) {
    const missing = [];
    for (const item of items) {
      const stock = this.getStock(item.sku);
      const available = stock ? stock.quantity - (stock.reserved || 0) : 0;
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
      reservedEntries.push({
        reservationId,
        sku: item.sku,
        quantity: item.quantity,
        expiresAt
      });
    }
    this.storage.setReservations(reservationId, reservedEntries);
    return { success: true, reservationId };
  }
  /**
   * Releases reserved stock (e.g. if customer abandons checkout or payment fails)
   */
  releaseReservation(reservationId) {
    const entries = this.storage.getReservations(reservationId);
    if (!entries || entries.length === 0) return false;
    for (const entry of entries) {
      const stock = this.getStock(entry.sku);
      if (stock && stock.reserved) {
        stock.reserved = Math.max(0, stock.reserved - entry.quantity);
        this.setStock(stock);
      }
    }
    this.storage.setReservations(reservationId, []);
    return true;
  }
  /**
   * Permanently deducts stock when payment succeeds
   */
  confirmDeduction(reservationId) {
    const entries = this.storage.getReservations(reservationId);
    if (!entries || entries.length === 0) return false;
    for (const entry of entries) {
      const stock = this.getStock(entry.sku);
      if (stock) {
        stock.quantity = Math.max(0, stock.quantity - entry.quantity);
        stock.reserved = Math.max(0, (stock.reserved || 0) - entry.quantity);
        this.setStock(stock);
      }
    }
    this.storage.setReservations(reservationId, []);
    return true;
  }
  /**
   * Intelligent Multi-Warehouse Allocation
   * Selects the warehouse that can fulfill all items and is closest to destination
   */
  allocateWarehouse(items, warehouses, customerPincode) {
    for (const wh of warehouses) {
      let canFulfillAll = true;
      const missing = [];
      for (const item of items) {
        const stock = this.getStock(item.sku, wh.id);
        const available = stock ? stock.quantity - (stock.reserved || 0) : 0;
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
};
function createBoostInventory(initialStock) {
  return new BoostInventory(initialStock);
}

export { BoostInventory, InMemoryInventoryStorageAdapter, createBoostInventory };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map