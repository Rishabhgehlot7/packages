export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'SuperStar';

export interface TierPerks {
  tier: CustomerTier;
  coinMultiplier: number; // e.g. 1x, 1.5x, 2x
  freeExpressShipping: boolean;
  earlyAccessDeals: boolean;
  cashbackPercentage: number;
}

export interface LoyaltyProfile {
  customerId: string;
  balance: number; // Current redeemable SuperCoins
  lifetimeEarned: number;
  tier: CustomerTier;
  perks: TierPerks;
}

export interface RedemptionQuote {
  orderTotal: number;
  availableCoins: number;
  maxRedeemableCoins: number;
  coinsToRedeem: number;
  rupeeDiscount: number;
  payableAfterDiscount: number;
  coinsEarnedOnThisOrder: number;
}
