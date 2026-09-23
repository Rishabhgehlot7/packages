import { useState, useMemo, useCallback } from 'react';
import {
  BundleDefinition,
  BundleCalculationResult,
  TieredVolumeRule,
  VolumeTierCalculationResult,
  BundleCartTransformItem,
} from './types';
import {
  calculateBundlePrice,
  calculateVolumeTierPrice,
  transformBundleToCartItem,
} from './engine';

export interface UseBundleOptions {
  bundle: BundleDefinition;
  initialSelectedIds?: string[];
  onSelectionChange?: (result: BundleCalculationResult) => void;
}

export interface UseBundleReturn {
  bundle: BundleDefinition;
  selectedIds: string[];
  calculation: BundleCalculationResult;
  isValid: boolean;
  totalPrice: number;
  originalTotal: number;
  savingsAmount: number;
  savingsPercentage: number;
  toggleItem: (itemId: string) => void;
  selectItem: (itemId: string) => void;
  deselectItem: (itemId: string) => void;
  selectAll: () => void;
  resetSelection: () => void;
  getCartPayload: () => BundleCartTransformItem;
}

/**
 * React Hook for interactive product bundles (Fixed, FBT, Mix & Match).
 */
export function useBundle({
  bundle,
  initialSelectedIds,
  onSelectionChange,
}: UseBundleOptions): UseBundleReturn {
  const defaultSelected = useMemo(() => {
    if (initialSelectedIds) return initialSelectedIds;
    return bundle.items
      .filter((item) => item.isDefaultSelected !== false || item.isRequired)
      .map((item) => item.id);
  }, [bundle.items, initialSelectedIds]);

  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelected);

  const calculation = useMemo(() => {
    const res = calculateBundlePrice(bundle, selectedIds);
    if (onSelectionChange) onSelectionChange(res);
    return res;
  }, [bundle, selectedIds, onSelectionChange]);

  const toggleItem = useCallback(
    (itemId: string) => {
      const targetItem = bundle.items.find((i) => i.id === itemId);
      if (targetItem?.isRequired) return; // Cannot toggle required items

      setSelectedIds((prev) => {
        if (prev.includes(itemId)) {
          return prev.filter((id) => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    },
    [bundle.items]
  );

  const selectItem = useCallback((itemId: string) => {
    setSelectedIds((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
  }, []);

  const deselectItem = useCallback(
    (itemId: string) => {
      const targetItem = bundle.items.find((i) => i.id === itemId);
      if (targetItem?.isRequired) return;
      setSelectedIds((prev) => prev.filter((id) => id !== itemId));
    },
    [bundle.items]
  );

  const selectAll = useCallback(() => {
    setSelectedIds(bundle.items.map((i) => i.id));
  }, [bundle.items]);

  const resetSelection = useCallback(() => {
    setSelectedIds(defaultSelected);
  }, [defaultSelected]);

  const getCartPayload = useCallback(() => {
    return transformBundleToCartItem(calculation);
  }, [calculation]);

  return {
    bundle,
    selectedIds,
    calculation,
    isValid: calculation.isValid,
    totalPrice: calculation.discountedTotal,
    originalTotal: calculation.originalTotal,
    savingsAmount: calculation.savingsAmount,
    savingsPercentage: calculation.savingsPercentage,
    toggleItem,
    selectItem,
    deselectItem,
    selectAll,
    resetSelection,
    getCartPayload,
  };
}

export interface UseVolumeDiscountOptions {
  productId: string;
  baseUnitPrice: number;
  rules: TieredVolumeRule[];
  initialQuantity?: number;
}

export interface UseVolumeDiscountReturn {
  quantity: number;
  setQuantity: (qty: number) => void;
  increment: () => void;
  decrement: () => void;
  calculation: VolumeTierCalculationResult;
  effectiveUnitPrice: number;
  discountedSubtotal: number;
  totalSavings: number;
  savingsPercentage: number;
  appliedTier: TieredVolumeRule | null;
  nextTier: VolumeTierCalculationResult['nextTier'];
}

/**
 * React Hook for Tiered Volume / Quantity Pricing.
 */
export function useVolumeDiscount({
  productId,
  baseUnitPrice,
  rules,
  initialQuantity = 1,
}: UseVolumeDiscountOptions): UseVolumeDiscountReturn {
  const [quantity, setQuantityState] = useState<number>(Math.max(1, initialQuantity));

  const setQuantity = useCallback((qty: number) => {
    setQuantityState(Math.max(1, Math.floor(qty)));
  }, []);

  const increment = useCallback(() => {
    setQuantityState((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setQuantityState((prev) => Math.max(1, prev - 1));
  }, []);

  const calculation = useMemo(() => {
    return calculateVolumeTierPrice(productId, baseUnitPrice, quantity, rules);
  }, [productId, baseUnitPrice, quantity, rules]);

  return {
    quantity,
    setQuantity,
    increment,
    decrement,
    calculation,
    effectiveUnitPrice: calculation.effectiveUnitPrice,
    discountedSubtotal: calculation.discountedSubtotal,
    totalSavings: calculation.totalSavings,
    savingsPercentage: calculation.savingsPercentage,
    appliedTier: calculation.appliedTier,
    nextTier: calculation.nextTier,
  };
}
