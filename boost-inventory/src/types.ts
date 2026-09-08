export interface StockLevel {
  sku: string;
  productId: string;
  variantId?: string;
  quantity: number;
  reserved?: number;
  warehouseId?: string;
  lowStockThreshold?: number; // default: 5
}

export interface StockUrgencyInfo {
  isOutOfStock: boolean;
  isLowStock: boolean;
  availableQuantity: number;
  badgeText: string;
  urgencyLevel: 'none' | 'low' | 'high' | 'critical';
}

export interface Warehouse {
  id: string;
  name: string;
  pincode: string;
  state: string;
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

export interface StockReservation {
  reservationId: string;
  sku: string;
  quantity: number;
  expiresAt: number; // Unix timestamp in seconds
}
