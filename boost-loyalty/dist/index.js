"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BoostLoyaltyManager: () => BoostLoyaltyManager,
  DEFAULT_LOYALTY_CONFIG: () => DEFAULT_LOYALTY_CONFIG,
  LoyaltyEngine: () => LoyaltyEngine,
  TIER_THRESHOLDS: () => TIER_THRESHOLDS,
  loyaltyAgentTools: () => loyaltyAgentTools
});
module.exports = __toCommonJS(src_exports);

// src/engine.ts
var import_events = require("events");

// src/types.ts
var TIER_THRESHOLDS = [
  { tier: "SuperStar", minLifetimeCoins: 1e3 },
  { tier: "Gold", minLifetimeCoins: 500 },
  { tier: "Silver", minLifetimeCoins: 200 },
  { tier: "Bronze", minLifetimeCoins: 0 }
];
var DEFAULT_LOYALTY_CONFIG = {
  coinValueInr: 1,
  earnRatePerHundred: 2,
  maxRedemptionPct: 20,
  expiryDays: 365,
  welcomeCoins: 50
};

// src/engine.ts
function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
var LoyaltyEngine = class {
  /** 1 SuperCoin = ₹1 INR value */
  static COIN_VALUE_INR = 1;
  static getTierPerks(tier) {
    switch (tier) {
      case "SuperStar":
        return { tier: "SuperStar", coinMultiplier: 2, freeExpressShipping: true, earlyAccessDeals: true, cashbackPercentage: 5, birthdayBonusCoins: 500 };
      case "Gold":
        return { tier: "Gold", coinMultiplier: 1.5, freeExpressShipping: true, earlyAccessDeals: true, cashbackPercentage: 3, birthdayBonusCoins: 250 };
      case "Silver":
        return { tier: "Silver", coinMultiplier: 1.2, freeExpressShipping: false, earlyAccessDeals: false, cashbackPercentage: 2, birthdayBonusCoins: 100 };
      case "Bronze":
      default:
        return { tier: "Bronze", coinMultiplier: 1, freeExpressShipping: false, earlyAccessDeals: false, cashbackPercentage: 1, birthdayBonusCoins: 50 };
    }
  }
  static determineTier(lifetimeCoins) {
    for (const threshold of TIER_THRESHOLDS) {
      if (lifetimeCoins >= threshold.minLifetimeCoins) return threshold.tier;
    }
    return "Bronze";
  }
  static calculateCoinsEarned(orderTotal, tier = "Bronze", config = DEFAULT_LOYALTY_CONFIG) {
    const perks = this.getTierPerks(tier);
    const baseCoins = Math.floor(orderTotal / 100 * config.earnRatePerHundred);
    return Math.floor(baseCoins * perks.coinMultiplier);
  }
  static calculateRedemption(orderTotal, availableCoins, requestedCoinsToUse, tier = "Bronze", config = DEFAULT_LOYALTY_CONFIG) {
    const maxCoinRupeeLimit = Math.floor(orderTotal * (config.maxRedemptionPct / 100));
    const maxRedeemableCoins = Math.min(availableCoins, maxCoinRupeeLimit);
    const coinsToRedeem = requestedCoinsToUse !== void 0 ? Math.max(0, Math.min(requestedCoinsToUse, maxRedeemableCoins)) : maxRedeemableCoins;
    const rupeeDiscount = coinsToRedeem * config.coinValueInr;
    const payableAfterDiscount = Math.max(0, orderTotal - rupeeDiscount);
    const coinsEarnedOnThisOrder = this.calculateCoinsEarned(payableAfterDiscount, tier, config);
    return { orderTotal, availableCoins, maxRedeemableCoins, coinsToRedeem, rupeeDiscount, payableAfterDiscount, coinsEarnedOnThisOrder };
  }
  static createProfile(customerId, initialCoins = 50) {
    const tier = this.determineTier(initialCoins);
    return {
      customerId,
      balance: initialCoins,
      lifetimeEarned: initialCoins,
      tier,
      perks: this.getTierPerks(tier),
      transactions: [],
      challenges: [],
      streakDays: 0,
      lastActivityAt: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date()
    };
  }
};
var BoostLoyaltyManager = class extends import_events.EventEmitter {
  profiles = /* @__PURE__ */ new Map();
  rewards = /* @__PURE__ */ new Map();
  challenges = /* @__PURE__ */ new Map();
  config;
  constructor(config = {}) {
    super();
    this.config = { ...DEFAULT_LOYALTY_CONFIG, ...config };
  }
  // ── Profile Management ────────────────────────────────────────────────────
  createProfile(customerId) {
    if (this.profiles.has(customerId)) return this.profiles.get(customerId);
    const profile = LoyaltyEngine.createProfile(customerId, this.config.welcomeCoins);
    this.profiles.set(customerId, profile);
    this.emit("profile:created", { customerId });
    return profile;
  }
  getProfile(customerId) {
    return this.profiles.get(customerId);
  }
  getAllProfiles() {
    return Array.from(this.profiles.values());
  }
  // ── Coins: Earn ───────────────────────────────────────────────────────────
  earnCoins(customerId, orderTotal, orderId) {
    const profile = this._getOrCreate(customerId);
    const coins = LoyaltyEngine.calculateCoinsEarned(orderTotal, profile.tier, this.config);
    const expiresAt = this.config.expiryDays > 0 ? new Date(Date.now() + this.config.expiryDays * 864e5) : void 0;
    profile.balance += coins;
    profile.lifetimeEarned += coins;
    profile.lastActivityAt = /* @__PURE__ */ new Date();
    profile.streakDays += 1;
    const tx = {
      id: uuid(),
      customerId,
      type: "earn",
      coins,
      orderId,
      reason: `Earned from order${orderId ? ` #${orderId}` : ""}`,
      balanceAfter: profile.balance,
      createdAt: /* @__PURE__ */ new Date(),
      expiresAt
    };
    profile.transactions.push(tx);
    const newTier = LoyaltyEngine.determineTier(profile.lifetimeEarned);
    if (newTier !== profile.tier) {
      const oldTier = profile.tier;
      profile.tier = newTier;
      profile.perks = LoyaltyEngine.getTierPerks(newTier);
      this.emit("tier:upgraded", { customerId, oldTier, newTier });
    }
    this.emit("coins:earned", { customerId, coins, orderId, newBalance: profile.balance });
    this._updateChallengesProgress(customerId, "spend", orderTotal);
    return tx;
  }
  // ── Coins: Redeem ────────────────────────────────────────────────────────
  redeemCoins(customerId, coinsToRedeem, orderId) {
    const profile = this._getOrCreate(customerId);
    if (coinsToRedeem > profile.balance) throw new Error(`Insufficient coins. Balance: ${profile.balance}`);
    profile.balance -= coinsToRedeem;
    profile.lastActivityAt = /* @__PURE__ */ new Date();
    const tx = {
      id: uuid(),
      customerId,
      type: "redeem",
      coins: -coinsToRedeem,
      orderId,
      reason: `Redeemed at checkout${orderId ? ` for order #${orderId}` : ""}`,
      balanceAfter: profile.balance,
      createdAt: /* @__PURE__ */ new Date()
    };
    profile.transactions.push(tx);
    this.emit("coins:redeemed", { customerId, coins: coinsToRedeem, orderId, newBalance: profile.balance });
    return tx;
  }
  // ── Coins: Adjust (admin) ────────────────────────────────────────────────
  adjustCoins(customerId, coins, reason) {
    const profile = this._getOrCreate(customerId);
    profile.balance += coins;
    profile.lastActivityAt = /* @__PURE__ */ new Date();
    if (coins > 0) profile.lifetimeEarned += coins;
    const tx = {
      id: uuid(),
      customerId,
      type: "adjust",
      coins,
      reason,
      balanceAfter: profile.balance,
      createdAt: /* @__PURE__ */ new Date()
    };
    profile.transactions.push(tx);
    this.emit("coins:adjusted", { customerId, coins, reason, newBalance: profile.balance });
    return tx;
  }
  // ── Coins: Expire ────────────────────────────────────────────────────────
  expireOldCoins(customerId) {
    const profile = this.profiles.get(customerId);
    if (!profile) return 0;
    const now = /* @__PURE__ */ new Date();
    let expired = 0;
    profile.transactions = profile.transactions.map((tx) => {
      if (tx.type === "earn" && tx.expiresAt && tx.expiresAt < now && tx.coins > 0) {
        expired += tx.coins;
        return { ...tx, coins: 0 };
      }
      return tx;
    });
    if (expired > 0) {
      profile.balance = Math.max(0, profile.balance - expired);
      const tx = {
        id: uuid(),
        customerId,
        type: "expire",
        coins: -expired,
        reason: "Coins expired per policy",
        balanceAfter: profile.balance,
        createdAt: /* @__PURE__ */ new Date()
      };
      profile.transactions.push(tx);
      this.emit("coins:expired", { customerId, coins: expired, newBalance: profile.balance });
    }
    return expired;
  }
  // ── Redemption Quote ─────────────────────────────────────────────────────
  getRedemptionQuote(customerId, orderTotal, requestedCoins) {
    const profile = this._getOrCreate(customerId);
    return LoyaltyEngine.calculateRedemption(orderTotal, profile.balance, requestedCoins, profile.tier, this.config);
  }
  // ── Rewards Catalog ───────────────────────────────────────────────────────
  addReward(reward) {
    this.rewards.set(reward.id, reward);
  }
  getRewards() {
    return Array.from(this.rewards.values()).filter((r) => r.isActive);
  }
  redeemReward(customerId, rewardId) {
    const profile = this._getOrCreate(customerId);
    const reward = this.rewards.get(rewardId);
    if (!reward || !reward.isActive) throw new Error(`Reward ${rewardId} not found or inactive`);
    if (profile.balance < reward.coinsRequired) throw new Error(`Insufficient coins. Need ${reward.coinsRequired}, have ${profile.balance}`);
    this.redeemCoins(customerId, reward.coinsRequired, `reward:${rewardId}`);
    this.emit("reward:redeemed", { customerId, rewardId, coinsSpent: reward.coinsRequired });
    return reward;
  }
  // ── Gamification: Challenges ──────────────────────────────────────────────
  addChallenge(challenge) {
    this.challenges.set(challenge.id, challenge);
  }
  joinChallenge(customerId, challengeId) {
    const profile = this._getOrCreate(customerId);
    const challenge = this.challenges.get(challengeId);
    if (!challenge) throw new Error(`Challenge ${challengeId} not found`);
    const existing = profile.challenges.find((c) => c.challengeId === challengeId);
    if (existing) return existing;
    const entry = { challengeId, currentValue: 0, status: "active" };
    profile.challenges.push(entry);
    return entry;
  }
  getChallenges(customerId) {
    const profile = this.profiles.get(customerId);
    if (!profile) return [];
    return profile.challenges.map((pc) => ({
      progress: pc,
      challenge: this.challenges.get(pc.challengeId)
    })).filter((c) => c.challenge);
  }
  // ── Leaderboard ───────────────────────────────────────────────────────────
  getLeaderboard(topN = 10) {
    return Array.from(this.profiles.values()).sort((a, b) => b.lifetimeEarned - a.lifetimeEarned).slice(0, topN).map((p, i) => ({
      rank: i + 1,
      customerId: p.customerId,
      balance: p.balance,
      lifetimeEarned: p.lifetimeEarned,
      tier: p.tier
    }));
  }
  // ── Universal Database Sync ───────────────────────────────────────────────
  sync(profiles) {
    profiles.forEach((p) => this.profiles.set(p.customerId, p));
  }
  export() {
    return this.getAllProfiles();
  }
  // ── Private helpers ───────────────────────────────────────────────────────
  _getOrCreate(customerId) {
    if (!this.profiles.has(customerId)) this.createProfile(customerId);
    return this.profiles.get(customerId);
  }
  _updateChallengesProgress(customerId, metric, value) {
    const profile = this.profiles.get(customerId);
    if (!profile) return;
    profile.challenges.forEach((pc) => {
      if (pc.status !== "active") return;
      const challenge = this.challenges.get(pc.challengeId);
      if (!challenge || challenge.metric !== metric) return;
      pc.currentValue += value;
      if (pc.currentValue >= challenge.targetValue) {
        pc.status = "completed";
        pc.completedAt = /* @__PURE__ */ new Date();
        this.adjustCoins(customerId, challenge.bonusCoins, `Challenge completed: ${challenge.name}`);
        this.emit("challenge:completed", { customerId, challengeId: pc.challengeId, bonusCoins: challenge.bonusCoins });
      }
    });
  }
};

// src/agent.ts
var loyaltyAgentTools = [
  {
    name: "get_customer_loyalty_profile",
    description: "Get the full loyalty profile for a customer including balance, tier, perks, transactions, and active challenges.",
    parameters: {
      type: "object",
      properties: {
        customerId: { type: "string", description: "Unique customer identifier" }
      },
      required: ["customerId"]
    }
  },
  {
    name: "earn_coins_for_order",
    description: "Award loyalty coins to a customer for a completed order. Automatically handles tier upgrades and challenge progress.",
    parameters: {
      type: "object",
      properties: {
        customerId: { type: "string", description: "Unique customer identifier" },
        orderTotal: { type: "number", description: "Order total in INR" },
        orderId: { type: "string", description: "Optional order ID for tracking" }
      },
      required: ["customerId", "orderTotal"]
    }
  },
  {
    name: "get_redemption_quote",
    description: "Calculate how many coins a customer can redeem at checkout and the resulting discount. Returns the full quote.",
    parameters: {
      type: "object",
      properties: {
        customerId: { type: "string", description: "Unique customer identifier" },
        orderTotal: { type: "number", description: "Current cart total in INR" },
        requestedCoins: { type: "number", description: "Optional: specific coins customer wants to use" }
      },
      required: ["customerId", "orderTotal"]
    }
  },
  {
    name: "get_loyalty_leaderboard",
    description: "Get the top N customers ranked by lifetime coins earned. Useful for display on loyalty dashboard.",
    parameters: {
      type: "object",
      properties: {
        topN: { type: "number", description: "Number of top customers to return (default: 10)" }
      }
    }
  },
  {
    name: "get_active_challenges",
    description: "Get all active gamification challenges for a customer with their current progress and bonus coins on completion.",
    parameters: {
      type: "object",
      properties: {
        customerId: { type: "string", description: "Unique customer identifier" }
      },
      required: ["customerId"]
    }
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BoostLoyaltyManager,
  DEFAULT_LOYALTY_CONFIG,
  LoyaltyEngine,
  TIER_THRESHOLDS,
  loyaltyAgentTools
});
