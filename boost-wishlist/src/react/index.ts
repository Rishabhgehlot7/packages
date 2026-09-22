import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  WishlistItem, 
  WishlistSummary, 
  WishlistBoard, 
  PriceDropAlert, 
  BackInStockAlert, 
  WishlistMoveToCartResult 
} from '../types';
import { BoostWishlist, wishlist as defaultWishlist } from '../manager';

export interface WishlistContextValue {
  manager: BoostWishlist;
  items: WishlistItem[];
  totalCount: number;
  totalValue: number;
  boards: WishlistBoard[];
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'> & { id?: string; addedAt?: string }) => WishlistItem;
  removeItem: (productId: string, variantId?: string) => boolean;
  hasItem: (productId: string, variantId?: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, 'id' | 'addedAt'> & { id?: string; addedAt?: string }) => { isWishlisted: boolean; item?: WishlistItem };
  moveToCart: (productId: string, variantId?: string, options?: { autoRemove?: boolean; quantity?: number }) => WishlistMoveToCartResult | null;
  createBoard: (name: string, options?: { description?: string; privacy?: 'public' | 'private' | 'unlisted' }) => WishlistBoard;
  refresh: () => void;
  syncWishlist: <T = any>(records: T[], mapper?: (record: T) => WishlistItem) => number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export interface WishlistProviderProps {
  initialItems?: WishlistItem[];
  manager?: BoostWishlist;
  storageKey?: string;
  children: any;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  initialItems,
  manager: customManager,
  storageKey = 'boost_wishlist_items',
  children,
}) => {
  const manager = useMemo(() => customManager || defaultWishlist, [customManager]);

  const [summary, setSummary] = useState<WishlistSummary>(() => {
    if (initialItems && initialItems.length > 0) {
      for (const item of initialItems) {
        manager.addItem(item);
      }
    }
    return manager.getSummary();
  });

  const [boards, setBoards] = useState<WishlistBoard[]>(() => manager.getBoards());

  const refresh = useCallback(() => {
    setSummary(manager.getSummary());
    setBoards(manager.getBoards());
  }, [manager]);

  // Sync with browser localStorage if available
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cached = window.localStorage.getItem(storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0 && manager.getItems().length === 0) {
            manager.fromJSON(parsed);
            refresh();
          }
        }
      }
    } catch (e) {
      // Ignore storage read errors
    }
  }, [manager, storageKey, refresh]);

  // Subscribe to real-time events & persist on change
  useEffect(() => {
    const handleUpdate = () => {
      refresh();
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(storageKey, JSON.stringify(manager.toJSON()));
        }
      } catch (e) {
        // Ignore storage write errors
      }
    };

    const unsubAdded = manager.on('item:added', handleUpdate);
    const unsubRemoved = manager.on('item:removed', handleUpdate);
    const unsubMoved = manager.on('item:moved_to_cart', handleUpdate);
    const unsubBoardCreated = manager.on('board:created', handleUpdate);
    const unsubBoardDeleted = manager.on('board:deleted', handleUpdate);

    return () => {
      unsubAdded();
      unsubRemoved();
      unsubMoved();
      unsubBoardCreated();
      unsubBoardDeleted();
    };
  }, [manager, storageKey, refresh]);

  const value: WishlistContextValue = useMemo(() => ({
    manager,
    items: summary.items,
    totalCount: summary.totalCount,
    totalValue: summary.totalValue,
    boards,
    addItem: (item) => manager.addItem(item),
    removeItem: (pId, vId) => manager.removeItem(pId, vId),
    hasItem: (pId, vId) => manager.hasItem(pId, vId),
    toggleItem: (item) => manager.toggleItem(item),
    moveToCart: (pId, vId, opt) => manager.moveToCart(pId, vId, opt),
    createBoard: (name, opt) => manager.createBoard(name, opt),
    refresh,
    syncWishlist: (records, mapper) => {
      const count = manager.sync(records, mapper);
      refresh();
      return count;
    }
  }), [manager, summary, boards, refresh]);

  return React.createElement(WishlistContext.Provider, { value }, children);
};

/**
 * Access wishlist state and manager methods in any React component.
 */
export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext) as WishlistContextValue | null;
  if (!context) {
    // Fallback to singleton manager
    const currentSummary = defaultWishlist.getSummary();
    return {
      manager: defaultWishlist,
      items: currentSummary.items,
      totalCount: currentSummary.totalCount,
      totalValue: currentSummary.totalValue,
      boards: defaultWishlist.getBoards(),
      addItem: (item) => defaultWishlist.addItem(item),
      removeItem: (pId, vId) => defaultWishlist.removeItem(pId, vId),
      hasItem: (pId, vId) => defaultWishlist.hasItem(pId, vId),
      toggleItem: (item) => defaultWishlist.toggleItem(item),
      moveToCart: (pId, vId, opt) => defaultWishlist.moveToCart(pId, vId, opt),
      createBoard: (name, opt) => defaultWishlist.createBoard(name, opt),
      refresh: () => {},
      syncWishlist: (records, mapper) => defaultWishlist.sync(records, mapper),
    };
  }
  return context;
}

/**
 * Hook for individual Wishlist Toggle Buttons on Product Cards or PDPs.
 */
export function useWishlistButton(productId: string, variantId?: string) {
  const { hasItem, toggleItem } = useWishlist();
  const isWishlisted = hasItem(productId, variantId);

  const toggle = useCallback((itemData: { title: string; price: number; image?: string; boardId?: string }) => {
    return toggleItem({
      productId,
      variantId,
      ...itemData
    });
  }, [productId, variantId, toggleItem]);

  return {
    isWishlisted,
    toggle,
  };
}

/**
 * Hook for managing multiple boards / collections.
 */
export function useWishlistBoards() {
  const { manager, boards, refresh } = useWishlist();

  const create = useCallback((name: string, options?: { description?: string; privacy?: 'public' | 'private' | 'unlisted' }) => {
    const board = manager.createBoard(name, options);
    refresh();
    return board;
  }, [manager, refresh]);

  const remove = useCallback((boardId: string) => {
    const res = manager.deleteBoard(boardId);
    refresh();
    return res;
  }, [manager, refresh]);

  const move = useCallback((productId: string, targetBoardId: string, variantId?: string) => {
    const res = manager.moveToBoard(productId, targetBoardId, variantId);
    refresh();
    return res;
  }, [manager, refresh]);

  return {
    boards,
    createBoard: create,
    deleteBoard: remove,
    moveToBoard: move,
  };
}

/**
 * Reactive price drop alerts hook
 */
export function usePriceDropAlerts(catalog: Array<{ id: string; price: number; inStock?: boolean }>): {
  priceDrops: PriceDropAlert[];
  restocks: BackInStockAlert[];
} {
  const { manager } = useWishlist();

  const priceDrops = useMemo(() => {
    return manager.checkPriceDrops(catalog);
  }, [manager, catalog]);

  const restocks = useMemo(() => {
    const inStockCatalog = catalog
      .filter((c) => c.inStock !== undefined)
      .map((c) => ({ id: c.id, inStock: c.inStock! }));
    return manager.checkRestockAlerts(inStockCatalog);
  }, [manager, catalog]);

  return {
    priceDrops,
    restocks,
  };
}
