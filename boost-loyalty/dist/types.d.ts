export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'SuperStar';
export interface TierPerks {
    tier: CustomerTier;
    coinMultiplier: number;
    freeExpressShipping: boolean;
    earlyAccessDeals: boolean;
    cashbackPercentage: number;
}
export interface LoyaltyProfile {
    customerId: string;
    balance: number;
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
//# sourceMappingURL=types.d.ts.map