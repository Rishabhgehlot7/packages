import {
  StockLevel,
  StockUrgencyInfo,
  Warehouse,
  AllocationItem,
  AllocationResult,
  SplitAllocationPlan,
  SplitShipmentAllocation,
  StockReservation,
  LowStockAlert,
  CartAvailabilityResult,
  CartItemAvailability,
  StockMovementLog,
  InventoryStorageAdapter,
  InventoryEvent,
  InventoryEventListener,
} from './types';

export class InMemoryInventoryStorageAdapter implements InventoryStorageAdapter {
  private stockMap = new Map<string, StockLevel>();
  private reservations = new Map<string, StockReservation[]>();

  getStock(key: string): StockLevel | null {
    return this.stockMap.get(key) || null;
  }

  setStock(key: string, stock: StockLevel): void {
    this.stockMap.set(key, stock);
  }

  getAllStock(): StockLevel[] {
    return Array.from(this.stockMap.values());
  }

  getReservations(key: string): StockReservation[] {
    return this.reservations.get(key) || [];
  }

  setReservations(key: string, reservations: StockReservation[]): void {
    if (reservations.length === 0) {
      this.reservations.delete(key);
    } else {
      this.reservations.set(key, reservations);
    }
  }

  getAllReservations(): StockReservation[] {
    const all: StockReservation[] = [];
    for (const list of this.reservations.values()) {
      all.push(...list);
    }
    return all;
  }
}

export class BoostInventory {
  private storage: InventoryStorageAdapter;
  private movements: StockMovementLog[] = [];
  private listeners = new Set<InventoryEventListener>();

  constructor(options: StockLevel[] | { initialStock?: StockLevel[]; storage?: InventoryStorageAdapter } = []) {
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
  subscribe(listener: InventoryEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(event: Omit<InventoryEvent, 'timestamp'>): void {
    const fullEvent: InventoryEvent = {
      ...event,
      timestamp: Date.now(),
    };
    for (const listener of this.listeners) {
      try {
        listener(fullEvent);
      } catch (e) {
        // Prevent listener crashes from breaking inventory operations
      }
    }
  }

  private getKey(sku?: string, warehouseId?: string): string {
    const cleanSku = (sku || '').trim();
    return warehouseId ? `${cleanSku}@${warehouseId.trim()}` : cleanSku;
  }

  private recordMovement(
    type: StockMovementLog['type'],
    sku: string,
    quantity: number,
    warehouseId?: string,
    reason?: string,
    reservationId?: string
  ): void {
    this.movements.push({
      id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      type,
      sku,
      quantity,
      warehouseId,
      reason,
      reservationId,
    });
  }

  /**
   * Sets or updates stock quantity and configuration for an SKU
   */
  setStock(stock: StockLevel): void {
    const key = this.getKey(stock.sku, stock.warehouseId);
    this.storage.setStock(key, {
      ...stock,
      reserved: stock.reserved || 0,
      safetyStock: stock.safetyStock || 0,
      lowStockThreshold: stock.lowStockThreshold ?? 5,
      backorderedCount: stock.backorderedCount || 0,
    });

    this.emit({
      type: 'stock_updated',
      sku: stock.sku,
      warehouseId: stock.warehouseId,
      quantity: stock.quantity,
      availableQuantity: this.getAvailableQuantity(stock.sku, stock.warehouseId),
    });
  }

  /**
   * Inbound restock method to add new stock and record audit ledger
   */
  restock(sku: string, quantity: number, warehouseId?: string, reason = 'Inbound shipment'): StockLevel {
    const existing = this.getStock(sku, warehouseId);
    const updated: StockLevel = existing
      ? { ...existing, quantity: existing.quantity + quantity }
      : { sku, productId: sku, quantity, warehouseId, reserved: 0, safetyStock: 0, lowStockThreshold: 5 };

    this.setStock(updated);
    this.recordMovement('inbound', sku, quantity, warehouseId, reason);
    return updated;
  }

  /**
   * Gets current stock level for an SKU
   */
  getStock(sku: string, warehouseId?: string): StockLevel | null {
    const key = this.getKey(sku, warehouseId);
    return (this.storage.getStock(key) as StockLevel | null) || null;
  }

  /**
   * Returns all stock records currently registered in the inventory
   */
  getAllStock(): StockLevel[] {
    if (this.storage.getAllStock) {
      return this.storage.getAllStock() as StockLevel[];
    }
    return [];
  }

  /**
   * Calculates net available quantity after deducting reservations and safety stock
   */
  getAvailableQuantity(sku: string, warehouseId?: string): number {
    const stock = this.getStock(sku, warehouseId);
    if (!stock) return 0;
    const reserved = stock.reserved || 0;
    const safety = stock.safetyStock || 0;
    return Math.max(0, stock.quantity - reserved - safety);
  }

  /**
   * Calculates Low Stock Urgency details and high-converting marketing badge
   */
  getUrgency(sku: string, warehouseId?: string): StockUrgencyInfo {
    const stock = this.getStock(sku, warehouseId);

    if (!stock) {
      return {
        isOutOfStock: true,
        isLowStock: false,
        isBackorder: false,
        availableQuantity: 0,
        badgeText: 'Sold Out',
        urgencyLevel: 'critical',
      };
    }

    const available = this.getAvailableQuantity(sku, warehouseId);
    const threshold = stock.lowStockThreshold ?? 5;

    if (available === 0) {
      if (stock.allowBackorder) {
        const restockNotice = stock.estimatedRestockDate ? ` (Ships by ${stock.estimatedRestockDate})` : '';
        return {
          isOutOfStock: false,
          isLowStock: false,
          isBackorder: true,
          availableQuantity: 0,
          badgeText: `📦 Available on Backorder${restockNotice}`,
          urgencyLevel: 'low',
          estimatedRestockDate: stock.estimatedRestockDate,
        };
      }

      return {
        isOutOfStock: true,
        isLowStock: false,
        isBackorder: false,
        availableQuantity: 0,
        badgeText: 'Sold Out',
        urgencyLevel: 'critical',
      };
    }

    if (available <= 2) {
      return {
        isOutOfStock: false,
        isLowStock: true,
        isBackorder: false,
        availableQuantity: available,
        badgeText: `⚡ Almost Gone! Only ${available} left in stock!`,
        urgencyLevel: 'high',
      };
    }

    if (available <= threshold) {
      return {
        isOutOfStock: false,
        isLowStock: true,
        isBackorder: false,
        availableQuantity: available,
        badgeText: `🔥 Hurry! Only ${available} left in stock!`,
        urgencyLevel: 'low',
      };
    }

    return {
      isOutOfStock: false,
      isLowStock: false,
      isBackorder: false,
      availableQuantity: available,
      badgeText: 'In Stock',
      urgencyLevel: 'none',
    };
  }

  /**
   * Temporarily reserves stock during checkout/flash sale to prevent overselling
   */
  reserveStock(
    items: AllocationItem[],
    ttlSeconds = 900, // default: 15 minutes
    metadata?: Record<string, any>
  ): { success: boolean; reservationId?: string; missingItems?: AllocationItem[] } {
    // 1. Auto-clean expired reservations first to free locked stock
    this.cleanupExpiredReservations();

    const missing: AllocationItem[] = [];

    // 2. Verify availability against availableQuantity (accounting for safety stock & reservations)
    for (const item of items) {
      const available = this.getAvailableQuantity(item.sku);
      if (available < item.quantity) {
        missing.push({ sku: item.sku, quantity: item.quantity - available });
      }
    }

    if (missing.length > 0) {
      return { success: false, missingItems: missing };
    }

    // 3. Apply reservation
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
    const reservedEntries: StockReservation[] = [];

    for (const item of items) {
      const stock = this.getStock(item.sku)!;
      stock.reserved = (stock.reserved || 0) + item.quantity;
      this.setStock(stock);

      reservedEntries.push({
        reservationId,
        sku: item.sku,
        quantity: item.quantity,
        expiresAt,
        metadata,
      });

      this.recordMovement('reservation', item.sku, item.quantity, stock.warehouseId, 'Hold for checkout', reservationId);
      this.emit({
        type: 'stock_reserved',
        sku: item.sku,
        quantity: item.quantity,
        reservationId,
        availableQuantity: this.getAvailableQuantity(item.sku),
      });
    }

    this.storage.setReservations(reservationId, reservedEntries);

    return { success: true, reservationId };
  }

  /**
   * Extends the TTL of an active reservation (e.g. customer is entering payment details)
   */
  extendReservation(reservationId: string, extraSeconds = 300): boolean {
    const entries = this.storage.getReservations(reservationId) as StockReservation[] | undefined;
    if (!entries || entries.length === 0) return false;

    const now = Math.floor(Date.now() / 1000);
    const updated = entries.map((entry) => ({
      ...entry,
      expiresAt: Math.max(entry.expiresAt, now) + extraSeconds,
      extendedAt: now,
    }));

    this.storage.setReservations(reservationId, updated);
    return true;
  }

  /**
   * Releases reserved stock (e.g. if customer abandons checkout or payment fails)
   */
  releaseReservation(reservationId: string, reason = 'Checkout abandoned or expired'): boolean {
    const entries = this.storage.getReservations(reservationId) as StockReservation[] | undefined;
    if (!entries || entries.length === 0) return false;

    for (const entry of entries) {
      const stock = this.getStock(entry.sku);
      if (stock && stock.reserved) {
        stock.reserved = Math.max(0, stock.reserved - entry.quantity);
        this.setStock(stock);
        this.recordMovement('release', entry.sku, entry.quantity, stock.warehouseId, reason, reservationId);
        this.emit({
          type: 'reservation_released',
          sku: entry.sku,
          quantity: entry.quantity,
          reservationId,
          availableQuantity: this.getAvailableQuantity(entry.sku),
        });
      }
    }

    this.storage.setReservations(reservationId, []);
    return true;
  }

  /**
   * Permanently deducts stock when payment succeeds
   */
  confirmDeduction(reservationId: string, orderId?: string): boolean {
    const entries = this.storage.getReservations(reservationId) as StockReservation[] | undefined;
    if (!entries || entries.length === 0) return false;

    for (const entry of entries) {
      const stock = this.getStock(entry.sku);
      if (stock) {
        stock.quantity = Math.max(0, stock.quantity - entry.quantity);
        stock.reserved = Math.max(0, (stock.reserved || 0) - entry.quantity);
        this.setStock(stock);
        this.recordMovement('deduction', entry.sku, entry.quantity, stock.warehouseId, `Order captured: ${orderId || 'Direct'}`, reservationId);
        this.emit({
          type: 'deduction_confirmed',
          sku: entry.sku,
          quantity: entry.quantity,
          reservationId,
          availableQuantity: this.getAvailableQuantity(entry.sku),
        });
      }
    }

    this.storage.setReservations(reservationId, []);
    return true;
  }

  /**
   * Auto-sweep expired reservations whose TTL has lapsed and restore stock
   */
  cleanupExpiredReservations(nowSeconds?: number): string[] {
    const now = nowSeconds ?? Math.floor(Date.now() / 1000);
    const cleanedIds: string[] = [];

    if (!this.storage.getAllReservations) return cleanedIds;

    const all = this.storage.getAllReservations() as StockReservation[];
    const reservationGroups = new Map<string, StockReservation[]>();

    for (const r of all) {
      const list = reservationGroups.get(r.reservationId) || [];
      list.push(r);
      reservationGroups.set(r.reservationId, list);
    }

    for (const [resId, list] of reservationGroups.entries()) {
      const isExpired = list.some((entry) => entry.expiresAt <= now);
      if (isExpired) {
        this.releaseReservation(resId, 'Automatic TTL expiration sweep');
        cleanedIds.push(resId);
      }
    }

    return cleanedIds;
  }

  /**
   * Validates cart availability for multi-item checkout (Direct bridge for @boostengine/cart)
   */
  checkCartAvailability(items: AllocationItem[]): CartAvailabilityResult {
    let allAvailable = true;
    let hasBackorders = false;
    const itemResults: CartItemAvailability[] = [];

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
          shortfall: 0,
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
            estimatedRestockDate: stock?.estimatedRestockDate,
          });
        } else {
          allAvailable = false;
          itemResults.push({
            sku: item.sku,
            requestedQuantity: item.quantity,
            availableQuantity: available,
            canFulfill: false,
            isBackorder: false,
            shortfall,
          });
        }
      }
    }

    return {
      allAvailable,
      hasBackorders,
      items: itemResults,
    };
  }

  /**
   * Scans all inventory for low-stock warnings and critical shortages
   */
  getLowStockAlerts(warehouseId?: string): LowStockAlert[] {
    const allStock = this.getAllStock();
    const alerts: LowStockAlert[] = [];

    for (const stock of allStock) {
      if (warehouseId && stock.warehouseId && stock.warehouseId !== warehouseId) {
        continue;
      }

      const available = Math.max(0, stock.quantity - (stock.reserved || 0) - (stock.safetyStock || 0));
      const threshold = stock.lowStockThreshold ?? 5;

      if (available <= threshold) {
        const severity = available === 0 ? 'critical' : 'warning';
        // Recommended reorder: restore to 3x threshold or at least 20 units
        const recommendedReorderQty = Math.max(20, threshold * 3 - available);

        alerts.push({
          sku: stock.sku,
          productId: stock.productId,
          warehouseId: stock.warehouseId,
          availableQuantity: available,
          threshold,
          severity,
          recommendedReorderQty,
        });
      }
    }

    return alerts.sort((a, b) => a.availableQuantity - b.availableQuantity);
  }

  /**
   * Intelligent Multi-Warehouse Allocation
   * Selects the single warehouse that can fulfill all items and is closest to destination
   */
  allocateWarehouse(
    items: AllocationItem[],
    warehouses: Warehouse[],
    customerPincode?: string
  ): AllocationResult {
    // Sort warehouses by proximity / priority
    const sortedWarehouses = this.sortWarehousesByProximity(warehouses, customerPincode);

    for (const wh of sortedWarehouses) {
      let canFulfillAll = true;
      const missing: Array<{ sku: string; requested: number; available: number }> = [];

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
          missingItems: [],
        };
      }
    }

    return {
      canFulfill: false,
      missingItems: items.map((i) => ({ sku: i.sku, requested: i.quantity, available: 0 })),
    };
  }

  /**
   * Multi-Origin Split Fulfillment Plan
   * If no single warehouse has all items, splits shipment across minimal warehouses
   */
  allocateSplitShipment(
    items: AllocationItem[],
    warehouses: Warehouse[],
    customerPincode?: string
  ): SplitAllocationPlan {
    // 1. Try single warehouse first
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
            items,
          },
        ],
        unfulfilledItems: [],
      };
    }

    // 2. Greedy Multi-Origin split allocation
    const sortedWarehouses = this.sortWarehousesByProximity(warehouses, customerPincode);
    const needed = new Map<string, number>();
    for (const it of items) {
      needed.set(it.sku, it.quantity);
    }

    const shipments: SplitShipmentAllocation[] = [];

    for (const wh of sortedWarehouses) {
      const allocatedHere: AllocationItem[] = [];

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
          items: allocatedHere,
        });
      }

      // Check if all needed items are fulfilled
      const remainingTotal = Array.from(needed.values()).reduce((a, b) => a + b, 0);
      if (remainingTotal === 0) break;
    }

    const unfulfilled: Array<{ sku: string; requested: number; available: number }> = [];
    for (const [sku, remaining] of needed.entries()) {
      if (remaining > 0) {
        const originalReq = items.find((i) => i.sku === sku)?.quantity || remaining;
        unfulfilled.push({
          sku,
          requested: originalReq,
          available: originalReq - remaining,
        });
      }
    }

    return {
      canFulfill: unfulfilled.length === 0,
      isSplit: shipments.length > 1,
      shipments,
      unfulfilledItems: unfulfilled,
    };
  }

  private sortWarehousesByProximity(warehouses: Warehouse[], customerPincode?: string): Warehouse[] {
    const list = [...warehouses];
    if (!customerPincode) {
      return list.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));
    }

    const cleanPin = customerPincode.trim();
    const pinPrefix2 = cleanPin.substring(0, 2);
    const pinPrefix1 = cleanPin.substring(0, 1);

    return list.sort((a, b) => {
      const aPin = (a.pincode || '').trim();
      const bPin = (b.pincode || '').trim();

      // Exact match
      if (aPin === cleanPin && bPin !== cleanPin) return -1;
      if (bPin === cleanPin && aPin !== cleanPin) return 1;

      // First 2 digits match
      const aMatch2 = aPin.startsWith(pinPrefix2);
      const bMatch2 = bPin.startsWith(pinPrefix2);
      if (aMatch2 && !bMatch2) return -1;
      if (bMatch2 && !aMatch2) return 1;

      // First digit match
      const aMatch1 = aPin.startsWith(pinPrefix1);
      const bMatch1 = bPin.startsWith(pinPrefix1);
      if (aMatch1 && !bMatch1) return -1;
      if (bMatch1 && !aMatch1) return 1;

      // Default warehouse flag
      if (a.isDefault && !b.isDefault) return -1;
      if (b.isDefault && !a.isDefault) return 1;

      // Configured priority
      return (a.priority ?? 10) - (b.priority ?? 10);
    });
  }

  /**
   * Retrieves stock movements audit log
   */
  getMovements(sku?: string): StockMovementLog[] {
    if (!sku) return [...this.movements];
    return this.movements.filter((m) => m.sku === sku);
  }

  // --- Quick 1-Liners for Developers ---
  quickCheck(sku: string, requestedQty = 1, warehouseId?: string): boolean {
    return this.getAvailableQuantity(sku, warehouseId) >= requestedQty;
  }

  quickReserve(
    itemsOrSku: string | AllocationItem[],
    quantityOrTtl: number = 1,
    ttlSeconds = 900
  ): { success: boolean; reservationId?: string } {
    if (typeof itemsOrSku === 'string') {
      return this.reserveStock([{ sku: itemsOrSku, quantity: quantityOrTtl }], ttlSeconds);
    }
    return this.reserveStock(itemsOrSku, quantityOrTtl);
  }

  quickConfirm(reservationId: string, orderId?: string): boolean {
    return this.confirmDeduction(reservationId, orderId);
  }

  quickRelease(reservationId: string, reason?: string): boolean {
    return this.releaseReservation(reservationId, reason);
  }
}

export function createBoostInventory(initialStock?: StockLevel[]): BoostInventory {
  return new BoostInventory(initialStock);
}

/**
 * Global singleton inventory instance for zero-config quick usage
 */
export const inventory = new BoostInventory();
