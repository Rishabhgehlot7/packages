import {
  BundleDefinition,
  BundleCalculationResult,
  TieredVolumeRule,
  VolumeTierCalculationResult,
  BundleCartTransformItem,
  BundleItem,
} from './types';

/**
 * Calculates pricing, savings, and validation for any product bundle.
 */
export function calculateBundlePrice(
  bundle: BundleDefinition,
  selectedItemIds?: string[]
): BundleCalculationResult {
  const errors: string[] = [];

  // Default selection: if not provided, take defaultSelected or all items
  const activeSelectedIds = selectedItemIds
    ? new Set(selectedItemIds)
    : new Set(
        bundle.items
          .filter((item) => item.isDefaultSelected !== false || item.isRequired)
          .map((item) => item.id)
      );

  // Auto-include required items
  bundle.items.forEach((item) => {
    if (item.isRequired) {
      activeSelectedIds.add(item.id);
    }
  });

  const selectedCount = activeSelectedIds.size;

  // Validation: Min & Max constraints
  if (bundle.minSelectCount && selectedCount < bundle.minSelectCount) {
    errors.push(
      `Please select at least ${bundle.minSelectCount} items (currently selected: ${selectedCount}).`
    );
  }
  if (bundle.maxSelectCount && selectedCount > bundle.maxSelectCount) {
    errors.push(
      `You can select a maximum of ${bundle.maxSelectCount} items (currently selected: ${selectedCount}).`
    );
  }

  // Calculate base original total of selected items
  let originalTotal = 0;
  const processedItems = bundle.items.map((item) => {
    const isSelected = activeSelectedIds.has(item.id);
    const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
    const linePrice = item.price * qty;

    if (isSelected) {
      originalTotal += linePrice;
    }

    return {
      ...item,
      isSelected,
      finalPrice: item.price,
      lineTotal: linePrice,
    };
  });

  if (selectedCount === 0 || originalTotal <= 0) {
    return {
      bundleId: bundle.id,
      bundleTitle: bundle.title,
      bundleType: bundle.type,
      isValid: false,
      selectedCount: 0,
      originalTotal: 0,
      discountedTotal: 0,
      savingsAmount: 0,
      savingsPercentage: 0,
      appliedDiscountType: 'none',
      appliedDiscountValue: 0,
      items: processedItems,
      validationErrors: ['No items selected.'],
    };
  }

  // Calculate discounted total based on discount rule
  let discountedTotal = originalTotal;
  const discountType = bundle.discountType || 'none';
  const discountVal = bundle.discountValue || 0;

  if (discountType === 'percentage' && discountVal > 0) {
    const discountAmount = (originalTotal * Math.min(discountVal, 100)) / 100;
    discountedTotal = Math.max(0, originalTotal - discountAmount);
  } else if (discountType === 'fixed_amount' && discountVal > 0) {
    discountedTotal = Math.max(0, originalTotal - discountVal);
  } else if (discountType === 'set_price' && discountVal > 0) {
    discountedTotal = discountVal;
  }

  // Rounding
  discountedTotal = Math.round(discountedTotal * 100) / 100;
  const savingsAmount = Math.max(0, Math.round((originalTotal - discountedTotal) * 100) / 100);
  const savingsPercentage = originalTotal > 0
    ? Math.round((savingsAmount / originalTotal) * 1000) / 10
    : 0;

  // Proportional final price distribution on selected items
  const finalItems = processedItems.map((item) => {
    if (!item.isSelected) {
      return { ...item, finalPrice: item.price, lineTotal: 0 };
    }
    const itemShare = originalTotal > 0 ? (item.price * (item.quantity || 1)) / originalTotal : 0;
    const itemDiscountedLine = Math.round(discountedTotal * itemShare * 100) / 100;
    const itemFinalUnit = Math.round((itemDiscountedLine / (item.quantity || 1)) * 100) / 100;

    return {
      ...item,
      finalPrice: itemFinalUnit,
      lineTotal: itemDiscountedLine,
    };
  });

  return {
    bundleId: bundle.id,
    bundleTitle: bundle.title,
    bundleType: bundle.type,
    isValid: errors.length === 0,
    selectedCount,
    originalTotal: Math.round(originalTotal * 100) / 100,
    discountedTotal,
    savingsAmount,
    savingsPercentage,
    appliedDiscountType: discountType,
    appliedDiscountValue: discountVal,
    items: finalItems,
    validationErrors: errors,
  };
}

/**
 * Calculates volume & tiered quantity pricing (e.g., Buy 2 get 10%, Buy 3 get 20%).
 */
export function calculateVolumeTierPrice(
  productId: string,
  baseUnitPrice: number,
  quantity: number,
  rules: TieredVolumeRule[]
): VolumeTierCalculationResult {
  const originalSubtotal = baseUnitPrice * quantity;

  if (!rules || rules.length === 0 || quantity <= 0) {
    return {
      productId,
      quantity,
      baseUnitPrice,
      effectiveUnitPrice: baseUnitPrice,
      originalSubtotal,
      discountedSubtotal: originalSubtotal,
      totalSavings: 0,
      savingsPercentage: 0,
      appliedTier: null,
      nextTier: null,
    };
  }

  // Sort rules ascending by minQuantity
  const sortedRules = [...rules].sort((a, b) => a.minQuantity - b.minQuantity);

  // Find matching tier
  let appliedTier: TieredVolumeRule | null = null;
  for (const rule of sortedRules) {
    if (quantity >= rule.minQuantity) {
      if (!rule.maxQuantity || quantity <= rule.maxQuantity) {
        appliedTier = rule;
      }
    }
  }

  let discountedSubtotal = originalSubtotal;

  if (appliedTier) {
    if (appliedTier.discountType === 'percentage') {
      const discount = (originalSubtotal * Math.min(appliedTier.discountValue, 100)) / 100;
      discountedSubtotal = originalSubtotal - discount;
    } else if (appliedTier.discountType === 'fixed_amount') {
      discountedSubtotal = Math.max(0, originalSubtotal - (appliedTier.discountValue * quantity));
    } else if (appliedTier.discountType === 'fixed_unit_price') {
      discountedSubtotal = appliedTier.discountValue * quantity;
    }
  }

  discountedSubtotal = Math.round(discountedSubtotal * 100) / 100;
  const totalSavings = Math.max(0, Math.round((originalSubtotal - discountedSubtotal) * 100) / 100);
  const effectiveUnitPrice = quantity > 0 ? Math.round((discountedSubtotal / quantity) * 100) / 100 : baseUnitPrice;
  const savingsPercentage = originalSubtotal > 0
    ? Math.round((totalSavings / originalSubtotal) * 1000) / 10
    : 0;

  // Find next tier upsell
  let nextTierInfo: VolumeTierCalculationResult['nextTier'] = null;
  const nextTier = sortedRules.find((r) => r.minQuantity > quantity);

  if (nextTier) {
    const nextQty = nextTier.minQuantity;
    const nextOriginal = baseUnitPrice * nextQty;
    let nextDiscounted = nextOriginal;

    if (nextTier.discountType === 'percentage') {
      nextDiscounted = nextOriginal - (nextOriginal * nextTier.discountValue) / 100;
    } else if (nextTier.discountType === 'fixed_amount') {
      nextDiscounted = nextOriginal - (nextTier.discountValue * nextQty);
    } else if (nextTier.discountType === 'fixed_unit_price') {
      nextDiscounted = nextTier.discountValue * nextQty;
    }

    const nextSavings = Math.max(0, nextOriginal - nextDiscounted);
    const nextSavingsPct = Math.round((nextSavings / nextOriginal) * 100);

    nextTierInfo = {
      neededQuantity: nextQty - quantity,
      potentialSavings: Math.round(nextSavings * 100) / 100,
      potentialSavingsPercentage: nextSavingsPct,
      label: nextTier.label || `Buy ${nextQty} & Save ${nextSavingsPct}%`,
    };
  }

  return {
    productId,
    quantity,
    baseUnitPrice,
    effectiveUnitPrice,
    originalSubtotal,
    discountedSubtotal,
    totalSavings,
    savingsPercentage,
    appliedTier,
    nextTier: nextTierInfo,
  };
}

/**
 * Transforms a calculated bundle result into a format ready for cart dispatch.
 */
export function transformBundleToCartItem(
  result: BundleCalculationResult
): BundleCartTransformItem {
  const selectedItems = result.items.filter((i) => i.isSelected);

  return {
    bundleId: result.bundleId,
    bundleType: result.bundleType,
    bundleTitle: result.bundleTitle,
    bundleDiscountTotal: result.savingsAmount,
    bundleTotalPrice: result.discountedTotal,
    bundleItems: selectedItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      quantity: item.quantity || 1,
      unitPrice: item.price,
      finalPrice: item.finalPrice,
      image: item.image,
    })),
  };
}

/**
 * Suggests complementary bundle items based on category/tags for "Frequently Bought Together".
 */
export function suggestBundleComplements(
  mainProduct: { id: string; category?: string; tags?: string[]; price: number },
  catalog: Array<{ id: string; category?: string; tags?: string[]; price: number; title: string; image?: string }>,
  maxCount: number = 3
): BundleItem[] {
  const candidates = catalog.filter((item) => item.id !== mainProduct.id);

  // Score candidates by tag match and cross-category affinity
  const scored = candidates.map((item) => {
    let score = 0;
    if (mainProduct.category && item.category && item.category !== mainProduct.category) {
      score += 2; // Cross-category items are good add-ons (e.g. Jeans + Belt)
    }
    if (mainProduct.tags && item.tags) {
      const commonTags = item.tags.filter((t) => mainProduct.tags?.includes(t));
      score += commonTags.length * 3;
    }
    // Price heuristics: add-ons usually cost less than main item
    if (item.price < mainProduct.price * 0.8) {
      score += 2;
    }
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxCount).map(({ item }) => ({
    id: `item-${item.id}`,
    productId: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    isRequired: false,
    isDefaultSelected: true,
    quantity: 1,
  }));
}
