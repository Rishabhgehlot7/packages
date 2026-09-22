import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  createElement,
  ReactNode,
} from 'react';
import { BoostInventory, inventory as defaultInventory, createBoostInventory } from '../manager';
import {
  StockUrgencyInfo,
  StockLevel,
  AllocationItem,
  CartAvailabilityResult,
  InventoryEvent,
} from '../types';

export interface InventoryContextValue {
  inventory: BoostInventory;
  defaultWarehouseId?: string;
  quickCheck: (sku: string, requestedQty?: number, warehouseId?: string) => boolean;
  quickReserve: (
    itemsOrSku: string | AllocationItem[],
    quantityOrTtl?: number,
    ttlSeconds?: number
  ) => { success: boolean; reservationId?: string };
  quickConfirm: (reservationId: string, orderId?: string) => boolean;
  quickRelease: (reservationId: string, reason?: string) => boolean;
}

const InventoryContext: any = createContext<InventoryContextValue | null>(null);

export interface InventoryProviderProps {
  children: ReactNode;
  inventory?: BoostInventory;
  initialStock?: StockLevel[];
  defaultWarehouseId?: string;
}

/**
 * Universal React Provider for Next.js, Vite, and React Native (Expo)
 * Provides shared inventory management and warehouse context across your application
 */
export function InventoryProvider({
  children,
  inventory: customInventory,
  initialStock,
  defaultWarehouseId,
}: InventoryProviderProps) {
  const inv = useMemo(() => {
    if (customInventory) return customInventory;
    if (initialStock && initialStock.length > 0) {
      return createBoostInventory(initialStock);
    }
    return defaultInventory;
  }, [customInventory, initialStock]);

  const value = useMemo<InventoryContextValue>(() => {
    return {
      inventory: inv,
      defaultWarehouseId,
      quickCheck: (sku: string, requestedQty = 1, warehouseId?: string) =>
        inv.quickCheck(sku, requestedQty, warehouseId || defaultWarehouseId),
      quickReserve: (itemsOrSku, qtyOrTtl, ttl) => inv.quickReserve(itemsOrSku, qtyOrTtl, ttl),
      quickConfirm: (resId, orderId) => inv.quickConfirm(resId, orderId),
      quickRelease: (resId, reason) => inv.quickRelease(resId, reason),
    };
  }, [inv, defaultWarehouseId]);

  return createElement(InventoryContext.Provider, { value }, children);
}

/**
 * Hook to access the current InventoryContext
 */
export function useInventory(): InventoryContextValue {
  const context = useContext(InventoryContext) as InventoryContextValue | null;
  if (context) return context;

  // Fallback to default singleton if Provider is omitted
  return {
    inventory: defaultInventory,
    quickCheck: (sku: string, requestedQty = 1, warehouseId?: string) =>
      defaultInventory.quickCheck(sku, requestedQty, warehouseId),
    quickReserve: (itemsOrSku, qtyOrTtl, ttl) => defaultInventory.quickReserve(itemsOrSku, qtyOrTtl, ttl),
    quickConfirm: (resId, orderId) => defaultInventory.quickConfirm(resId, orderId),
    quickRelease: (resId, reason) => defaultInventory.quickRelease(resId, reason),
  };
}

export interface UseStockUrgencyOptions {
  warehouseId?: string;
  inventory?: BoostInventory;
  refreshIntervalMs?: number;
  initialStock?: StockLevel[];
}

/**
 * React & React Native hook for real-time FOMO low-stock urgency and marketing badges
 * Automatically updates on real-time inventory events with optional interval polling
 */
export function useStockUrgency(
  sku: string,
  options: UseStockUrgencyOptions = {}
): StockUrgencyInfo & { refresh: () => void } {
  const context = useContext(InventoryContext) as InventoryContextValue | null;
  const inv = options.inventory || context?.inventory || defaultInventory;
  const targetWarehouse = options.warehouseId || context?.defaultWarehouseId;

  if (options.initialStock && options.initialStock.length > 0) {
    for (const item of options.initialStock) {
      inv.setStock(item);
    }
  }

  const computeUrgency = useCallback((): StockUrgencyInfo => {
    return inv.getUrgency(sku, targetWarehouse);
  }, [sku, targetWarehouse, inv]);

  const [urgency, setUrgency] = useState<StockUrgencyInfo>(computeUrgency);

  const refresh = useCallback((): void => {
    setUrgency(computeUrgency());
  }, [computeUrgency]);

  useEffect(() => {
    refresh();

    // Event subscription for instant reactive updates across components
    const unsubscribe = inv.subscribe((event: InventoryEvent) => {
      if (!event.sku || event.sku === sku) {
        refresh();
      }
    });

    if (options.refreshIntervalMs && options.refreshIntervalMs > 0) {
      const timer = setInterval(() => {
        refresh();
      }, options.refreshIntervalMs);

      return () => {
        clearInterval(timer);
        unsubscribe();
      };
    }

    return unsubscribe;
  }, [sku, targetWarehouse, options.refreshIntervalMs, computeUrgency, refresh, inv]);

  return {
    ...urgency,
    refresh,
  };
}

export interface UseStockLevelOptions {
  warehouseId?: string;
  inventory?: BoostInventory;
}

/**
 * React hook to observe raw and available stock counts for a specific SKU
 */
export function useStockLevel(
  sku: string,
  options: UseStockLevelOptions = {}
): {
  stock: StockLevel | null;
  availableQuantity: number;
  refresh: () => void;
} {
  const context = useContext(InventoryContext) as InventoryContextValue | null;
  const inv = options.inventory || context?.inventory || defaultInventory;
  const targetWarehouse = options.warehouseId || context?.defaultWarehouseId;

  const fetchStock = useCallback(() => {
    const stock = inv.getStock(sku, targetWarehouse);
    const available = inv.getAvailableQuantity(sku, targetWarehouse);
    return { stock, available };
  }, [sku, targetWarehouse, inv]);

  const [state, setState] = useState(fetchStock);

  const refresh = useCallback(() => {
    setState(fetchStock());
  }, [fetchStock]);

  useEffect(() => {
    refresh();

    const unsubscribe = inv.subscribe((event: InventoryEvent) => {
      if (!event.sku || event.sku === sku) {
        refresh();
      }
    });

    return unsubscribe;
  }, [sku, targetWarehouse, refresh, inv]);

  return {
    stock: state.stock,
    availableQuantity: state.available,
    refresh,
  };
}

export interface UseCartInventoryOptions {
  inventory?: BoostInventory;
  refreshIntervalMs?: number;
}

/**
 * React & React Native hook for real-time cart inventory validation
 * Detects sold out, low stock, or backordered items in customer checkout bags
 */
export function useCartInventory(
  items: AllocationItem[],
  options: UseCartInventoryOptions = {}
): CartAvailabilityResult & { refresh: () => void } {
  const context = useContext(InventoryContext) as InventoryContextValue | null;
  const inv = options.inventory || context?.inventory || defaultInventory;

  const checkAvailability = useCallback((): CartAvailabilityResult => {
    return inv.checkCartAvailability(items);
  }, [items, inv]);

  const [result, setResult] = useState<CartAvailabilityResult>(checkAvailability);

  const refresh = useCallback(() => {
    setResult(checkAvailability());
  }, [checkAvailability]);

  useEffect(() => {
    refresh();

    const unsubscribe = inv.subscribe((event: InventoryEvent) => {
      if (!event.sku || items.some((it) => it.sku === event.sku)) {
        refresh();
      }
    });

    if (options.refreshIntervalMs && options.refreshIntervalMs > 0) {
      const timer = setInterval(() => {
        refresh();
      }, options.refreshIntervalMs);

      return () => {
        clearInterval(timer);
        unsubscribe();
      };
    }

    return unsubscribe;
  }, [items, options.refreshIntervalMs, checkAvailability, refresh, inv]);

  return {
    ...result,
    refresh,
  };
}

export interface UseStockReservationOptions {
  ttlSeconds?: number;
  autoReserve?: boolean;
  onExpire?: () => void;
  inventory?: BoostInventory;
}

/**
 * React & React Native hook for managing checkout stock reservation locks with countdown timer
 * Ideal for high-conversion flash sales, countdown banners, and preventing overselling
 */
export function useStockReservation(
  items: AllocationItem[],
  options: UseStockReservationOptions = {}
): {
  reservationId: string | null;
  isReserved: boolean;
  expiresIn: number;
  isExpired: boolean;
  reserve: () => boolean;
  extend: (extraSeconds?: number) => boolean;
  release: () => boolean;
  confirm: (orderId?: string) => boolean;
} {
  const context = useContext(InventoryContext) as InventoryContextValue | null;
  const inv = options.inventory || context?.inventory || defaultInventory;
  const ttl = options.ttlSeconds || 900; // default 15 minutes

  const [reservationId, setReservationId] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const expiryRef = useRef<number>(0);

  const reserve = useCallback((): boolean => {
    if (!items || items.length === 0) return false;
    const res = inv.reserveStock(items, ttl);
    if (res.success && res.reservationId) {
      const expAt = Math.floor(Date.now() / 1000) + ttl;
      expiryRef.current = expAt;
      setReservationId(res.reservationId);
      setExpiresIn(ttl);
      setIsExpired(false);
      return true;
    }
    return false;
  }, [items, ttl, inv]);

  const extend = useCallback(
    (extraSeconds = 300): boolean => {
      if (!reservationId) return false;
      const ok = inv.extendReservation(reservationId, extraSeconds);
      if (ok) {
        expiryRef.current += extraSeconds;
        setExpiresIn((prev: number) => prev + extraSeconds);
        setIsExpired(false);
      }
      return ok;
    },
    [reservationId, inv]
  );

  const release = useCallback((): boolean => {
    if (!reservationId) return false;
    const ok = inv.releaseReservation(reservationId);
    if (ok) {
      setReservationId(null);
      setExpiresIn(0);
      setIsExpired(true);
    }
    return ok;
  }, [reservationId, inv]);

  const confirm = useCallback(
    (orderId?: string): boolean => {
      if (!reservationId) return false;
      const ok = inv.confirmDeduction(reservationId, orderId);
      if (ok) {
        setReservationId(null);
        setExpiresIn(0);
        setIsExpired(false);
      }
      return ok;
    },
    [reservationId, inv]
  );

  // Auto-reserve on mount if enabled
  useEffect(() => {
    if (options.autoReserve) {
      reserve();
    }
  }, [options.autoReserve, reserve]);

  // Live countdown timer for active reservation
  useEffect(() => {
    if (!reservationId || expiryRef.current <= 0) return undefined;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, expiryRef.current - now);
      setExpiresIn(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setIsExpired(true);
        if (options.onExpire) {
          options.onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [reservationId, options.onExpire]);

  return {
    reservationId,
    isReserved: !!reservationId && !isExpired,
    expiresIn,
    isExpired,
    reserve,
    extend,
    release,
    confirm,
  };
}
