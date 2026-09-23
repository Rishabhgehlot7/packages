import {
  BundleDefinition,
  TieredVolumeRule,
} from './types';
import {
  calculateBundlePrice,
  calculateVolumeTierPrice,
  suggestBundleComplements,
} from './engine';

/**
 * AI Agent Tool: Calculates bundle total and customer savings.
 */
export function calculateBundleSavingsTool(params: {
  bundle: BundleDefinition;
  selectedItemIds?: string[];
}) {
  const result = calculateBundlePrice(params.bundle, params.selectedItemIds);
  return {
    success: result.isValid,
    originalPrice: `₹${result.originalTotal.toFixed(2)}`,
    dealPrice: `₹${result.discountedTotal.toFixed(2)}`,
    savings: `₹${result.savingsAmount.toFixed(2)} (${result.savingsPercentage}% OFF)`,
    selectedItemCount: result.selectedCount,
    items: result.items
      .filter((i) => i.isSelected)
      .map((i) => `${i.title} (₹${i.finalPrice.toFixed(2)})`),
    errors: result.validationErrors,
  };
}

/**
 * AI Agent Tool: Finds best volume tier recommendation for customer's desired budget.
 */
export function evaluateVolumeDiscountTool(params: {
  productId: string;
  basePrice: number;
  quantity: number;
  tiers: TieredVolumeRule[];
}) {
  const result = calculateVolumeTierPrice(
    params.productId,
    params.basePrice,
    params.quantity,
    params.tiers
  );

  return {
    currentQuantity: result.quantity,
    baseUnitPrice: `₹${result.baseUnitPrice}`,
    effectiveUnitPrice: `₹${result.effectiveUnitPrice}`,
    totalPrice: `₹${result.discountedSubtotal}`,
    savings: `₹${result.totalSavings} (${result.savingsPercentage}% OFF)`,
    tierApplied: result.appliedTier?.label || 'Standard Price',
    upsellSuggestion: result.nextTier
      ? `Add ${result.nextTier.neededQuantity} more to unlock ${result.nextTier.potentialSavingsPercentage}% OFF!`
      : null,
  };
}

/**
 * AI Agent Tool: Recommends cross-sell items to form a high-converting combo.
 */
export function generateSmartComboTool(params: {
  mainProduct: { id: string; title: string; category?: string; tags?: string[]; price: number };
  catalog: Array<{ id: string; title: string; category?: string; tags?: string[]; price: number }>;
  discountPercentage?: number;
}) {
  const complements = suggestBundleComplements(params.mainProduct, params.catalog, 2);
  const bundleItems = [
    {
      id: `main-${params.mainProduct.id}`,
      productId: params.mainProduct.id,
      title: params.mainProduct.title,
      price: params.mainProduct.price,
      isRequired: true,
      isDefaultSelected: true,
    },
    ...complements,
  ];

  const bundleDef: BundleDefinition = {
    id: `auto-combo-${params.mainProduct.id}`,
    title: `Complete the Look / Combo Set`,
    type: 'frequently_bought_together',
    discountType: 'percentage',
    discountValue: params.discountPercentage || 15,
    items: bundleItems,
  };

  const calculated = calculateBundlePrice(bundleDef);

  return {
    comboTitle: bundleDef.title,
    bundleDiscount: `${bundleDef.discountValue}% OFF Combo`,
    originalTotal: `₹${calculated.originalTotal.toFixed(2)}`,
    comboPrice: `₹${calculated.discountedTotal.toFixed(2)}`,
    savings: `₹${calculated.savingsAmount.toFixed(2)}`,
    products: calculated.items.map((i) => i.title),
  };
}
