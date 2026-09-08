interface StockLevel {
    sku: string;
    productId: string;
    variantId?: string;
    quantity: number;
    reserved?: number;
    warehouseId?: string;
    lowStockThreshold?: number;
}
interface StockUrgencyInfo {
    isOutOfStock: boolean;
    isLowStock: boolean;
    availableQuantity: number;
    badgeText: string;
    urgencyLevel: 'none' | 'low' | 'high' | 'critical';
}
interface Warehouse {
    id: string;
    name: string;
    pincode: string;
    state: string;
    isDefault?: boolean;
}
interface AllocationItem {
    sku: string;
    quantity: number;
}
interface AllocationResult {
    canFulfill: boolean;
    allocatedWarehouseId?: string;
    missingItems: Array<{
        sku: string;
        requested: number;
        available: number;
    }>;
}
interface StockReservation {
    reservationId: string;
    sku: string;
    quantity: number;
    expiresAt: number;
}

declare class BoostInventory {
    private stockMap;
    private reservations;
    constructor(initialStock?: StockLevel[]);
    private getKey;
    /**
     * Sets or updates stock quantity for an SKU
     */
    setStock(stock: StockLevel): void;
    /**
     * Gets current stock level for an SKU
     */
    getStock(sku: string, warehouseId?: string): StockLevel | null;
    /**
     * Calculates Low Stock Urgency details and high-converting marketing badge
     */
    getUrgency(sku: string, warehouseId?: string): StockUrgencyInfo;
    /**
     * Temporarily reserves stock during checkout to prevent overselling
     */
    reserveStock(items: AllocationItem[], ttlSeconds?: number): {
        success: boolean;
        reservationId?: string;
        missingItems?: AllocationItem[];
    };
    /**
     * Releases reserved stock (e.g. if customer abandons checkout or payment fails)
     */
    releaseReservation(reservationId: string): boolean;
    /**
     * Permanently deducts stock when payment succeeds
     */
    confirmDeduction(reservationId: string): boolean;
    /**
     * Intelligent Multi-Warehouse Allocation
     * Selects the warehouse that can fulfill all items and is closest to destination
     */
    allocateWarehouse(items: AllocationItem[], warehouses: Warehouse[], customerPincode?: string): AllocationResult;
}
declare function createBoostInventory(initialStock?: StockLevel[]): BoostInventory;

export { type AllocationItem, type AllocationResult, BoostInventory, type StockLevel, type StockReservation, type StockUrgencyInfo, type Warehouse, createBoostInventory };
