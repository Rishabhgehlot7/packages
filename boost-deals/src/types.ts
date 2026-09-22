export type DealType = 
  | 'percentage' 
  | 'fixed_discount' 
  | 'flash_sale' 
  | 'bogo' 
  | 'tiered_volume' 
  | 'spend_threshold';

export interface DealClaimReservation {
  reservationId: string;
  dealId: string;
  userId: string;
  quantity: number;
  reservedAt: string;
  expiresAt: string;
}

export interface BOGORule {
  buyQuantity: number;
  getQuantity: number;
  discountPercentage: number; // 100 for free item, 50 for 50% off second item
}

export interface TieredDiscountTier {
  minQuantity: number;
  discountPercentage: number;
}

export interface SpendThresholdRule {
  minimumSpend: number;
  discountAmount: number;
  discountPercentage?: number;
}

export interface Deal {
  id: string;
  title: string;
  description?: string;
  type: DealType;
  discountValue: number; // e.g. 20 for 20% or flat discount amount
  startDate: string; // ISO 8601 string
  endDate: string;   // ISO 8601 string
  applicableProductIds?: string[];
  applicableCategories?: string[];
  totalClaimLimit?: number;
  claimedCount?: number;
  maxClaimsPerUser?: number; // Bot & scalper protection (e.g. max 1 per user)
  stackable?: boolean;       // If false, cannot combine with other deals (default true)
  exclusive?: boolean;       // If true and applied, overrides/suppresses all other deals (default false)
  priority?: number;         // Higher number evaluated first (default 0)
  bogoRule?: BOGORule;
  tiers?: TieredDiscountTier[];
  spendThreshold?: SpendThresholdRule;
  metadata?: Record<string, any>;
}

export interface ClaimInfo {
  totalLimit?: number;
  claimedCount: number;
  percentageClaimed: number;
  isSoldOut: boolean;
  remainingClaims?: number;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface DealPriceCalculation {
  originalPrice: number;
  dealPrice: number;
  savings: number;
  discountPercentage: number;
}

export interface CartItemForDeals {
  productId: string;
  unitPrice: number;
  quantity: number;
  category?: string;
  title?: string;
}

export interface AppliedDealSummary {
  dealId: string;
  dealTitle: string;
  dealType: DealType;
  discountAmount: number;
  affectedProductIds: string[];
  details: string;
  exclusive?: boolean;
}

export interface CartDealEvaluationResult {
  originalSubtotal: number;
  discountedSubtotal: number;
  totalSavings: number;
  appliedDeals: AppliedDealSummary[];
  itemPriceOverrides: Record<string, number>; // productId -> new discounted unit price
}

export interface ProductDataMapper<T = any> {
  (rawProduct: T): {
    id: string;
    originalPrice: number;
    category?: string;
    title?: string;
  };
}

export interface DealsManagerOptions {
  ttlSeconds?: number;
}

export type DealEventType = 
  | 'claim:reserved' 
  | 'claim:released' 
  | 'claim:committed' 
  | 'deal:sold_out' 
  | 'deal:expired' 
  | 'deal:registered';

export type DealEventHandler = (payload: any) => void;
