export {
  BoostInventory,
  createBoostInventory,
  InMemoryInventoryStorageAdapter,
  inventory,
} from './manager';

export { InventoryAgentToolkit } from './agent';
export type { AgentToolCallResult } from './agent';

export type {
  StockLevel,
  StockUrgencyInfo,
  Warehouse,
  AllocationItem,
  AllocationResult,
  SplitShipmentAllocation,
  SplitAllocationPlan,
  StockReservation,
  LowStockAlert,
  CartItemAvailability,
  CartAvailabilityResult,
  StockMovementLog,
  InventoryStorageAdapter,
  InventoryEventType,
  InventoryEvent,
  InventoryEventListener,
} from './types';

// Export React Hook types for universal type-checking without forcing runtime React on Node.js backends
export type {
  InventoryProvider,
  useInventory,
  useStockUrgency,
  useStockLevel,
  useCartInventory,
  useStockReservation,
  InventoryContextValue,
  InventoryProviderProps,
  UseStockUrgencyOptions,
  UseStockLevelOptions,
  UseCartInventoryOptions,
  UseStockReservationOptions,
} from './react';
