import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  ProductRecommendationItem,
  FrequentlyBoughtTogetherBundle,
  CartCrossSellRecommendation,
  ProductUpgradeRecommendation,
} from '../types';
import { BoostRecommendationsManager, recommendations as defaultRecommendations, RecommendationsEngine } from '../engine';

export interface RecommendationsContextValue {
  manager: BoostRecommendationsManager;
  catalog: ProductRecommendationItem[];
  setCatalog: (items: ProductRecommendationItem[]) => void;
  recordOrder: (productIds: string[]) => void;
}

const RecommendationsContext = createContext<RecommendationsContextValue | null>(null);

export interface RecommendationsProviderProps {
  initialCatalog?: ProductRecommendationItem[];
  manager?: BoostRecommendationsManager;
  children: any;
}

export const RecommendationsProvider: React.FC<RecommendationsProviderProps> = ({
  initialCatalog = [],
  manager: customManager,
  children,
}) => {
  const manager = useMemo(() => customManager || defaultRecommendations, [customManager]);
  const [catalog, setCatalogState] = useState<ProductRecommendationItem[]>(() => {
    if (initialCatalog.length > 0) {
      manager.setCatalog(initialCatalog);
    }
    return initialCatalog;
  });

  const setCatalog = useCallback((items: ProductRecommendationItem[]) => {
    manager.setCatalog(items);
    setCatalogState([...items]);
  }, [manager]);

  const recordOrder = useCallback((productIds: string[]) => {
    manager.recordOrder(productIds);
  }, [manager]);

  const value: RecommendationsContextValue = useMemo(() => ({
    manager,
    catalog,
    setCatalog,
    recordOrder,
  }), [manager, catalog, setCatalog, recordOrder]);

  return React.createElement(RecommendationsContext.Provider, { value }, children);
};

/**
 * Access the global recommendations manager & catalog state in any component.
 */
export function useRecommendations(): RecommendationsContextValue {
  const context = useContext(RecommendationsContext) as RecommendationsContextValue | null;
  if (!context) {
    return {
      manager: defaultRecommendations,
      catalog: [],
      setCatalog: (items) => defaultRecommendations.setCatalog(items),
      recordOrder: (pIds) => defaultRecommendations.recordOrder(pIds),
    };
  }
  return context;
}

/**
 * Hook to retrieve an Amazon-style Frequently Bought Together bundle combo.
 */
export function useFrequentlyBoughtTogether(
  mainProduct: ProductRecommendationItem,
  customCatalog?: ProductRecommendationItem[],
  options?: { maxItems?: number; discountPercentage?: number }
): FrequentlyBoughtTogetherBundle {
  const { manager, catalog: ctxCatalog } = useRecommendations();
  const pool = customCatalog || ctxCatalog;

  return useMemo(() => {
    return manager.getFrequentlyBoughtTogether(mainProduct, pool, options);
  }, [manager, mainProduct, pool, options?.maxItems, options?.discountPercentage]);
}

/**
 * Hook to retrieve high-converting impulse cross-sells for items in the customer cart.
 */
export function useCartCrossSells(
  cartItems: Array<{ id: string; category?: string; price?: number }>,
  customCatalog?: ProductRecommendationItem[],
  options?: { limit?: number; maxPriceRatio?: number }
): CartCrossSellRecommendation[] {
  const { manager, catalog: ctxCatalog } = useRecommendations();
  const pool = customCatalog || ctxCatalog;

  return useMemo(() => {
    return manager.getCartCrossSells(cartItems, pool, options);
  }, [manager, cartItems, pool, options?.limit, options?.maxPriceRatio]);
}

/**
 * Hook to find similar products for PDP carousels.
 */
export function useSimilarProducts(
  targetProduct: ProductRecommendationItem,
  customCatalog?: ProductRecommendationItem[],
  limit: number = 4
): ProductRecommendationItem[] {
  const { catalog: ctxCatalog } = useRecommendations();
  const pool = customCatalog || ctxCatalog;

  return useMemo(() => {
    return RecommendationsEngine.getSimilarProducts(targetProduct, pool, limit);
  }, [targetProduct, pool, limit]);
}

/**
 * Hook to generate personalized product recommendations based on browsing/view history.
 */
export function usePersonalizedPicks(
  viewHistoryIds: string[],
  customCatalog?: ProductRecommendationItem[],
  limit: number = 4
): ProductRecommendationItem[] {
  const { catalog: ctxCatalog } = useRecommendations();
  const pool = customCatalog || ctxCatalog;

  return useMemo(() => {
    return RecommendationsEngine.getPersonalizedPicks(viewHistoryIds, pool, limit);
  }, [viewHistoryIds, pool, limit]);
}

/**
 * Hook to find higher-tier product upgrade options (Upsell).
 */
export function useProductUpgrades(
  product: ProductRecommendationItem,
  customCatalog?: ProductRecommendationItem[],
  options?: { maxPriceMultiplier?: number; limit?: number }
): ProductUpgradeRecommendation[] {
  const { manager, catalog: ctxCatalog } = useRecommendations();
  const pool = customCatalog || ctxCatalog;

  return useMemo(() => {
    return manager.getUpgrades(product, pool, options);
  }, [manager, product, pool, options?.maxPriceMultiplier, options?.limit]);
}
