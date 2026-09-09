import { CustomerTier, TierPerks, LoyaltyProfile, RedemptionQuote } from './types';
export declare class LoyaltyEngine {
    /**
     * 1 SuperCoin = ₹1 INR value
     */
    static readonly COIN_VALUE_INR = 1;
    /**
     * Get tier perks based on status
     */
    static getTierPerks(tier: CustomerTier): TierPerks;
    /**
     * Determine tier based on lifetime earned coins
     */
    static determineTier(lifetimeCoins: number): CustomerTier;
    /**
     * Calculate coins earned on an order
     * Base rate: 2 coins per ₹100 spent * tier multiplier
     */
    static calculateCoinsEarned(orderTotal: number, tier?: CustomerTier): number;
    /**
     * Calculate redemption quote for checkout
     * Allowed up to 20% of order value to be paid via coins
     */
    static calculateRedemption(orderTotal: number, availableCoins: number, requestedCoinsToUse?: number, tier?: CustomerTier): RedemptionQuote;
    /**
     * Create an initial profile for a customer
     */
    static createProfile(customerId: string, initialCoins?: number): LoyaltyProfile;
}
//# sourceMappingURL=engine.d.ts.map