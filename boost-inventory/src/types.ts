export interface StockLevel {
  sku: string;
  productId: string;
  variantId?: string;
  quantity: number;
  reserved?: number;
  safetyStock?: number; // buffer stock held back from public sales
  warehouseId?: string;
  lowStockThreshold?: number; // default: 5
  allowBackorder?: boolean;
  backorderLimit?: number;
  backorderedCount?: number;
  estimatedRestockDate?: string; // ISO date string e.g. '2026-10-01'
}

export interface StockUrgencyInfo {
  isOutOfStock: boolean;
  isLowStock: boolean;
  isBackorder: boolean;
  availableQuantity: number;
  badgeText: string;
  urgencyLevel: 'none' | 'low' | 'high' | 'critical';
  estimatedRestockDate?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  pincode: string;
  state: string;
  zone?: string; // e.g. 'north' | 'south' | 'east' | 'west'
  priority?: number; // lower number = higher priority
  isDefault?: boolean;
}

export interface AllocationItem {
  sku: string;
  quantity: number;
}

export interface AllocationResult {
  canFulfill: boolean;
  allocatedWarehouseId?: string;
  missingItems: Array<{ sku: string; requested: number; available: number }>;
}

export interface SplitShipmentAllocation {
  warehouseId: string;
  warehouseName?: string;
  items: AllocationItem[];
}

export interface SplitAllocationPlan {
  canFulfill: boolean;
  shipments: SplitShipmentAllocation[];
  unfulfilledItems: Array<{ sku: string; requested: number; available: number }>;
  isSplit: boolean;
}

export interface StockReservation {
  reservationId: string;
  sku: string;
  quantity: number;
  expiresAt: number; // Unix timestamp in seconds
  extendedAt?: number;
  cartId?: string;
  metadata?: Record<string, any>;
}

export interface LowStockAlert {
  sku: string;
  productId: string;
  warehouseId?: string;
  availableQuantity: number;
  threshold: number;
  severity: 'warning' | 'critical';
  recommendedReorderQty: number;
}

export interface CartItemAvailability {
  sku: string;
  requestedQuantity: number;
  availableQuantity: number;
  canFulfill: boolean;
  isBackorder: boolean;
  shortfall: number;
  estimatedRestockDate?: string;
}

export interface CartAvailabilityResult {
  allAvailable: boolean;
  hasBackorders: boolean;
  items: CartItemAvailability[];
}

export interface StockMovementLog {
  id: string;
  timestamp: number;
  type: 'inbound' | 'deduction' | 'reservation' | 'release' | 'adjustment' | 'backorder';
  sku: string;
  quantity: number;
  warehouseId?: string;
  reason?: string;
  reservationId?: string;
}

export interface InventoryStorageAdapter {
  getStock(key: string): Promise<StockLevel | null> | StockLevel | null;
  setStock(key: string, stock: StockLevel): Promise<void> | void;
  getAllStock?(): Promise<StockLevel[]> | StockLevel[];
  getReservations(key: string): Promise<StockReservation[]> | StockReservation[];
  setReservations(key: string, reservations: StockReservation[]): Promise<void> | void;
  getAllReservations?(): Promise<StockReservation[]> | StockReservation[];
}

export type InventoryEventType =
  | 'stock_updated'
  | 'stock_reserved'
  | 'reservation_released'
  | 'deduction_confirmed'
  | 'low_stock_triggered'
  | 'restocked';

export interface InventoryEvent {
  type: InventoryEventType;
  sku?: string;
  warehouseId?: string;
  quantity?: number;
  availableQuantity?: number;
  reservationId?: string;
  timestamp: number;
}

export type InventoryEventListener = (event: InventoryEvent) => void;
