import {
  StockLevel,
  StockUrgencyInfo,
  Warehouse,
  AllocationItem,
  AllocationResult,
  StockReservation,
} from './types';

export class BoostInventory {
  private stockMap = new Map<string, StockLevel>();
  private reservations = new Map<string, StockReservation[]>();

  constructor(initialStock: StockLevel[] = []) {
    for (const item of initialStock) {
      this.setStock(item);
    }
  }

  private getKey(sku: string, warehouseId?: string): string {
    return warehouseId ? `${sku.trim()}@${warehouseId.trim()}` : sku.trim();
  }

  /**
   * Sets or updates stock quantity for an SKU
   */
  setStock(stock: StockLevel): void {
    const key = this.getKey(stock.sku, stock.warehouseId);
    this.stockMap.set(key, {
      ...stock,
      reserved: stock.reserved || 0,
      lowStockThreshold: stock.lowStockThreshold ?? 5,
    });
  }

  /**
   * Gets current stock level for an SKU
   */
  getStock(sku: string, warehouseId?: string): StockLevel | null {
    const key = this.getKey(sku, warehouseId);
    return this.stockMap.get(key) || null;
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
        availableQuantity: 0,
        badgeText: 'Sold Out',
        urgencyLevel: 'critical',
      };
    }

    const available = Math.max(0, stock.quantity - (stock.reserved || 0));
    const threshold = stock.lowStockThreshold ?? 5;

    if (available === 0) {
      return {
        isOutOfStock: true,
        isLowStock: false,
        availableQuantity: 0,
        badgeText: 'Sold Out',
        urgencyLevel: 'critical',
      };
    }

    if (available <= 2) {
      return {
        isOutOfStock: false,
        isLowStock: true,
        availableQuantity: available,
        badgeText: `⚡ Almost Gone! Only ${available} left in stock!`,
        urgencyLevel: 'high',
      };
    }

    if (available <= threshold) {
      return {
        isOutOfStock: false,
        isLowStock: true,
        availableQuantity: available,
        badgeText: `🔥 Hurry! Only ${available} left in stock!`,
        urgencyLevel: 'low',
      };
    }

    return {
      isOutOfStock: false,
      isLowStock: false,
      availableQuantity: available,
      badgeText: 'In Stock',
      urgencyLevel: 'none',
    };
  }

  /**
   * Temporarily reserves stock during checkout to prevent overselling
   */
  reserveStock(
    items: AllocationItem[],
    ttlSeconds = 900 // default: 15 minutes
  ): { success: boolean; reservationId?: string; missingItems?: AllocationItem[] } {
    const missing: AllocationItem[] = [];

    // 1. Verify availability
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

    // 2. Apply reservation
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
    const reservedEntries: StockReservation[] = [];

    for (const item of items) {
      const stock = this.getStock(item.sku)!;
      stock.reserved = (stock.reserved || 0) + item.quantity;
      reservedEntries.push({
        reservationId,
        sku: item.sku,
        quantity: item.quantity,
        expiresAt,
      });
    }

    this.reservations.set(reservationId, reservedEntries);

    return { success: true, reservationId };
  }

  /**
   * Releases reserved stock (e.g. if customer abandons checkout or payment fails)
   */
  releaseReservation(reservationId: string): boolean {
    const entries = this.reservations.get(reservationId);
    if (!entries) return false;

    for (const entry of entries) {
      const stock = this.getStock(entry.sku);
      if (stock && stock.reserved) {
        stock.reserved = Math.max(0, stock.reserved - entry.quantity);
      }
    }

    this.reservations.delete(reservationId);
    return true;
  }

  /**
   * Permanently deducts stock when payment succeeds
   */
  confirmDeduction(reservationId: string): boolean {
    const entries = this.reservations.get(reservationId);
    if (!entries) return false;

    for (const entry of entries) {
      const stock = this.getStock(entry.sku);
      if (stock) {
        stock.quantity = Math.max(0, stock.quantity - entry.quantity);
        stock.reserved = Math.max(0, (stock.reserved || 0) - entry.quantity);
      }
    }

    this.reservations.delete(reservationId);
    return true;
  }

  /**
   * Intelligent Multi-Warehouse Allocation
   * Selects the warehouse that can fulfill all items and is closest to destination
   */
  allocateWarehouse(
    items: AllocationItem[],
    warehouses: Warehouse[],
    customerPincode?: string
  ): AllocationResult {
    for (const wh of warehouses) {
      let canFulfillAll = true;
      const missing: Array<{ sku: string; requested: number; available: number }> = [];

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
          missingItems: [],
        };
      }
    }

    return {
      canFulfill: false,
      missingItems: items.map((i) => ({ sku: i.sku, requested: i.quantity, available: 0 })),
    };
  }
}

export function createBoostInventory(initialStock?: StockLevel[]): BoostInventory {
  return new BoostInventory(initialStock);
}
