// src/engine.ts
var LoyaltyEngine = class {
  /**
   * 1 SuperCoin = ₹1 INR value
   */
  static COIN_VALUE_INR = 1;
  /**
   * Get tier perks based on status
   */
  static getTierPerks(tier) {
    switch (tier) {
      case "SuperStar":
        return {
          tier: "SuperStar",
          coinMultiplier: 2,
          freeExpressShipping: true,
          earlyAccessDeals: true,
          cashbackPercentage: 5
        };
      case "Gold":
        return {
          tier: "Gold",
          coinMultiplier: 1.5,
          freeExpressShipping: true,
          earlyAccessDeals: true,
          cashbackPercentage: 3
        };
      case "Silver":
        return {
          tier: "Silver",
          coinMultiplier: 1.2,
          freeExpressShipping: false,
          earlyAccessDeals: false,
          cashbackPercentage: 2
        };
      case "Bronze":
      default:
        return {
          tier: "Bronze",
          coinMultiplier: 1,
          freeExpressShipping: false,
          earlyAccessDeals: false,
          cashbackPercentage: 1
        };
    }
  }
  /**
   * Determine tier based on lifetime earned coins
   */
  static determineTier(lifetimeCoins) {
    if (lifetimeCoins >= 1e3) return "SuperStar";
    if (lifetimeCoins >= 500) return "Gold";
    if (lifetimeCoins >= 200) return "Silver";
    return "Bronze";
  }
  /**
   * Calculate coins earned on an order
   * Base rate: 2 coins per ₹100 spent * tier multiplier
   */
  static calculateCoinsEarned(orderTotal, tier = "Bronze") {
    const perks = this.getTierPerks(tier);
    const baseCoins = Math.floor(orderTotal / 100 * 2);
    return Math.floor(baseCoins * perks.coinMultiplier);
  }
  /**
   * Calculate redemption quote for checkout
   * Allowed up to 20% of order value to be paid via coins
   */
  static calculateRedemption(orderTotal, availableCoins, requestedCoinsToUse, tier = "Bronze") {
    const maxCoinRupeeLimit = Math.floor(orderTotal * 0.2);
    const maxRedeemableCoins = Math.min(availableCoins, maxCoinRupeeLimit);
    const coinsToRedeem = requestedCoinsToUse !== void 0 ? Math.max(0, Math.min(requestedCoinsToUse, maxRedeemableCoins)) : maxRedeemableCoins;
    const rupeeDiscount = coinsToRedeem * this.COIN_VALUE_INR;
    const payableAfterDiscount = Math.max(0, orderTotal - rupeeDiscount);
    const coinsEarnedOnThisOrder = this.calculateCoinsEarned(payableAfterDiscount, tier);
    return {
      orderTotal,
      availableCoins,
      maxRedeemableCoins,
      coinsToRedeem,
      rupeeDiscount,
      payableAfterDiscount,
      coinsEarnedOnThisOrder
    };
  }
  /**
   * Create an initial profile for a customer
   */
  static createProfile(customerId, initialCoins = 50) {
    const tier = this.determineTier(initialCoins);
    return {
      customerId,
      balance: initialCoins,
      lifetimeEarned: initialCoins,
      tier,
      perks: this.getTierPerks(tier)
    };
  }
};
export {
  LoyaltyEngine
};
