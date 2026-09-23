/**
 * @boostengine/bundles - Core Types & Interfaces
 */

export type BundleType =
  | 'fixed'
  | 'frequently_bought_together'
  | 'mix_and_match'
  | 'volume_tiered'
  | 'bogo_kit';

export type DiscountType =
  | 'percentage'
  | 'fixed_amount'
  | 'set_price'
  | 'free_shipping';

export interface BundleItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  quantity?: number;
  isRequired?: boolean;
  isDefaultSelected?: boolean;
  image?: string;
  category?: string;
  options?: Record<string, string>;
  stock?: number;
}

export interface TieredVolumeRule {
  minQuantity: number;
  maxQuantity?: number;
  discountType: 'percentage' | 'fixed_amount' | 'fixed_unit_price';
  discountValue: number;
  label?: string;
  badge?: string;
  isPopular?: boolean;
}

export interface BundleDefinition {
  id: string;
  title: string;
  description?: string;
  type: BundleType;
  discountType?: DiscountType;
  discountValue?: number;
  items: BundleItem[];
  minSelectCount?: number;
  maxSelectCount?: number;
  tieredRules?: TieredVolumeRule[];
  badge?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface BundleSelectedProduct {
  productId: string;
  variantId?: string;
  quantity: number;
  selectedPrice?: number;
}

export interface BundleCalculationResult {
  bundleId: string;
  bundleTitle: string;
  bundleType: BundleType;
  isValid: boolean;
  selectedCount: number;
  originalTotal: number;
  discountedTotal: number;
  savingsAmount: number;
  savingsPercentage: number;
  appliedDiscountType: DiscountType | 'none';
  appliedDiscountValue: number;
  items: Array<BundleItem & { finalPrice: number; lineTotal: number; isSelected: boolean }>;
  validationErrors: string[];
}

export interface VolumeTierCalculationResult {
  productId: string;
  quantity: number;
  baseUnitPrice: number;
  effectiveUnitPrice: number;
  originalSubtotal: number;
  discountedSubtotal: number;
  totalSavings: number;
  savingsPercentage: number;
  appliedTier: TieredVolumeRule | null;
  nextTier: {
    neededQuantity: number;
    potentialSavings: number;
    potentialSavingsPercentage: number;
    label: string;
  } | null;
}

export interface BundleCartTransformItem {
  bundleId: string;
  bundleType: BundleType;
  bundleTitle: string;
  bundleDiscountTotal: number;
  bundleTotalPrice: number;
  bundleItems: Array<{
    productId: string;
    variantId?: string;
    title: string;
    quantity: number;
    unitPrice: number;
    finalPrice: number;
    image?: string;
  }>;
}
