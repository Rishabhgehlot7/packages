import { EventEmitter } from 'events';
import {
  CustomerTier,
  TierPerks,
  LoyaltyProfile,
  LoyaltyTransaction,
  LoyaltyReward,
  LoyaltyChallenge,
  CustomerChallenge,
  RedemptionQuote,
  LeaderboardEntry,
  LoyaltyConfig,
  LoyaltyEvents,
  DEFAULT_LOYALTY_CONFIG,
  TIER_THRESHOLDS,
} from './types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uuid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Legacy Static Engine (100% backward compat) ─────────────────────────────

export class LoyaltyEngine {
  /** 1 SuperCoin = ₹1 INR value */
  static readonly COIN_VALUE_INR = 1;

  static getTierPerks(tier: CustomerTier): TierPerks {
    switch (tier) {
      case 'SuperStar':
        return { tier: 'SuperStar', coinMultiplier: 2.0, freeExpressShipping: true,  earlyAccessDeals: true,  cashbackPercentage: 5, birthdayBonusCoins: 500 };
      case 'Gold':
        return { tier: 'Gold',      coinMultiplier: 1.5, freeExpressShipping: true,  earlyAccessDeals: true,  cashbackPercentage: 3, birthdayBonusCoins: 250 };
      case 'Silver':
        return { tier: 'Silver',    coinMultiplier: 1.2, freeExpressShipping: false, earlyAccessDeals: false, cashbackPercentage: 2, birthdayBonusCoins: 100 };
      case 'Bronze':
      default:
        return { tier: 'Bronze',    coinMultiplier: 1.0, freeExpressShipping: false, earlyAccessDeals: false, cashbackPercentage: 1, birthdayBonusCoins: 50  };
    }
  }

  static determineTier(lifetimeCoins: number): CustomerTier {
    for (const threshold of TIER_THRESHOLDS) {
      if (lifetimeCoins >= threshold.minLifetimeCoins) return threshold.tier;
    }
    return 'Bronze';
  }

  static calculateCoinsEarned(
    orderTotal: number,
    tier: CustomerTier = 'Bronze',
    config: Pick<LoyaltyConfig, 'earnRatePerHundred' | 'coinValueInr'> = DEFAULT_LOYALTY_CONFIG
  ): number {
    const perks = this.getTierPerks(tier);
    const baseCoins = Math.floor((orderTotal / 100) * config.earnRatePerHundred);
    return Math.floor(baseCoins * perks.coinMultiplier);
  }

  static calculateRedemption(
    orderTotal: number,
    availableCoins: number,
    requestedCoinsToUse?: number,
    tier: CustomerTier = 'Bronze',
    config: Pick<LoyaltyConfig, 'maxRedemptionPct' | 'coinValueInr' | 'earnRatePerHundred'> = DEFAULT_LOYALTY_CONFIG
  ): RedemptionQuote {
    const maxCoinRupeeLimit   = Math.floor(orderTotal * (config.maxRedemptionPct / 100));
    const maxRedeemableCoins  = Math.min(availableCoins, maxCoinRupeeLimit);
    const coinsToRedeem       = requestedCoinsToUse !== undefined
      ? Math.max(0, Math.min(requestedCoinsToUse, maxRedeemableCoins))
      : maxRedeemableCoins;

    const rupeeDiscount          = coinsToRedeem * config.coinValueInr;
    const payableAfterDiscount   = Math.max(0, orderTotal - rupeeDiscount);
    const coinsEarnedOnThisOrder = this.calculateCoinsEarned(payableAfterDiscount, tier, config);

    return { orderTotal, availableCoins, maxRedeemableCoins, coinsToRedeem, rupeeDiscount, payableAfterDiscount, coinsEarnedOnThisOrder };
  }

  static createProfile(customerId: string, initialCoins: number = 50): LoyaltyProfile {
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
      lastActivityAt: new Date(),
      createdAt: new Date(),
    };
  }
}

// ─── BoostLoyaltyManager — Event-driven manager ──────────────────────────────

export class BoostLoyaltyManager extends EventEmitter {
  private profiles  = new Map<string, LoyaltyProfile>();
  private rewards   = new Map<string, LoyaltyReward>();
  private challenges= new Map<string, LoyaltyChallenge>();
  readonly config   : LoyaltyConfig;

  constructor(config: Partial<LoyaltyConfig> = {}) {
    super();
    this.config = { ...DEFAULT_LOYALTY_CONFIG, ...config };
  }

  // ── Profile Management ────────────────────────────────────────────────────

  createProfile(customerId: string): LoyaltyProfile {
    if (this.profiles.has(customerId)) return this.profiles.get(customerId)!;
    const profile = LoyaltyEngine.createProfile(customerId, this.config.welcomeCoins);
    this.profiles.set(customerId, profile);
    this.emit('profile:created', { customerId });
    return profile;
  }

  getProfile(customerId: string): LoyaltyProfile | undefined {
    return this.profiles.get(customerId);
  }

  getAllProfiles(): LoyaltyProfile[] {
    return Array.from(this.profiles.values());
  }

  // ── Coins: Earn ───────────────────────────────────────────────────────────

  earnCoins(customerId: string, orderTotal: number, orderId?: string): LoyaltyTransaction {
    const profile  = this._getOrCreate(customerId);
    const coins    = LoyaltyEngine.calculateCoinsEarned(orderTotal, profile.tier, this.config);
    const expiresAt= this.config.expiryDays > 0
      ? new Date(Date.now() + this.config.expiryDays * 86400_000)
      : undefined;

    profile.balance        += coins;
    profile.lifetimeEarned += coins;
    profile.lastActivityAt  = new Date();

    // streak tracking (simple daily streak)
    profile.streakDays += 1;

    const tx: LoyaltyTransaction = {
      id: uuid(), customerId, type: 'earn', coins, orderId,
      reason: `Earned from order${orderId ? ` #${orderId}` : ''}`,
      balanceAfter: profile.balance, createdAt: new Date(), expiresAt,
    };
    profile.transactions.push(tx);

    // tier upgrade check
    const newTier = LoyaltyEngine.determineTier(profile.lifetimeEarned);
    if (newTier !== profile.tier) {
      const oldTier = profile.tier;
      profile.tier  = newTier;
      profile.perks = LoyaltyEngine.getTierPerks(newTier);
      this.emit('tier:upgraded', { customerId, oldTier, newTier });
    }

    this.emit('coins:earned', { customerId, coins, orderId, newBalance: profile.balance });
    this._updateChallengesProgress(customerId, 'spend', orderTotal);
    return tx;
  }

  // ── Coins: Redeem ────────────────────────────────────────────────────────

  redeemCoins(customerId: string, coinsToRedeem: number, orderId?: string): LoyaltyTransaction {
    const profile = this._getOrCreate(customerId);
    if (coinsToRedeem > profile.balance) throw new Error(`Insufficient coins. Balance: ${profile.balance}`);

    profile.balance        -= coinsToRedeem;
    profile.lastActivityAt  = new Date();

    const tx: LoyaltyTransaction = {
      id: uuid(), customerId, type: 'redeem', coins: -coinsToRedeem, orderId,
      reason: `Redeemed at checkout${orderId ? ` for order #${orderId}` : ''}`,
      balanceAfter: profile.balance, createdAt: new Date(),
    };
    profile.transactions.push(tx);
    this.emit('coins:redeemed', { customerId, coins: coinsToRedeem, orderId, newBalance: profile.balance });
    return tx;
  }

  // ── Coins: Adjust (admin) ────────────────────────────────────────────────

  adjustCoins(customerId: string, coins: number, reason: string): LoyaltyTransaction {
    const profile = this._getOrCreate(customerId);
    profile.balance        += coins;
    profile.lastActivityAt  = new Date();
    if (coins > 0) profile.lifetimeEarned += coins;

    const tx: LoyaltyTransaction = {
      id: uuid(), customerId, type: 'adjust', coins,
      reason, balanceAfter: profile.balance, createdAt: new Date(),
    };
    profile.transactions.push(tx);
    this.emit('coins:adjusted', { customerId, coins, reason, newBalance: profile.balance });
    return tx;
  }

  // ── Coins: Expire ────────────────────────────────────────────────────────

  expireOldCoins(customerId: string): number {
    const profile = this.profiles.get(customerId);
    if (!profile) return 0;
    const now     = new Date();
    let expired   = 0;

    profile.transactions = profile.transactions.map(tx => {
      if (tx.type === 'earn' && tx.expiresAt && tx.expiresAt < now && tx.coins > 0) {
        expired  += tx.coins;
        return { ...tx, coins: 0 };
      }
      return tx;
    });

    if (expired > 0) {
      profile.balance = Math.max(0, profile.balance - expired);
      const tx: LoyaltyTransaction = {
        id: uuid(), customerId, type: 'expire', coins: -expired,
        reason: 'Coins expired per policy', balanceAfter: profile.balance, createdAt: new Date(),
      };
      profile.transactions.push(tx);
      this.emit('coins:expired', { customerId, coins: expired, newBalance: profile.balance });
    }
    return expired;
  }

  // ── Redemption Quote ─────────────────────────────────────────────────────

  getRedemptionQuote(customerId: string, orderTotal: number, requestedCoins?: number): RedemptionQuote {
    const profile = this._getOrCreate(customerId);
    return LoyaltyEngine.calculateRedemption(orderTotal, profile.balance, requestedCoins, profile.tier, this.config);
  }

  // ── Rewards Catalog ───────────────────────────────────────────────────────

  addReward(reward: LoyaltyReward): void {
    this.rewards.set(reward.id, reward);
  }

  getRewards(): LoyaltyReward[] {
    return Array.from(this.rewards.values()).filter(r => r.isActive);
  }

  redeemReward(customerId: string, rewardId: string): LoyaltyReward {
    const profile = this._getOrCreate(customerId);
    const reward  = this.rewards.get(rewardId);
    if (!reward || !reward.isActive) throw new Error(`Reward ${rewardId} not found or inactive`);
    if (profile.balance < reward.coinsRequired) throw new Error(`Insufficient coins. Need ${reward.coinsRequired}, have ${profile.balance}`);

    this.redeemCoins(customerId, reward.coinsRequired, `reward:${rewardId}`);
    this.emit('reward:redeemed', { customerId, rewardId, coinsSpent: reward.coinsRequired });
    return reward;
  }

  // ── Gamification: Challenges ──────────────────────────────────────────────

  addChallenge(challenge: LoyaltyChallenge): void {
    this.challenges.set(challenge.id, challenge);
  }

  joinChallenge(customerId: string, challengeId: string): CustomerChallenge {
    const profile   = this._getOrCreate(customerId);
    const challenge = this.challenges.get(challengeId);
    if (!challenge) throw new Error(`Challenge ${challengeId} not found`);

    const existing  = profile.challenges.find(c => c.challengeId === challengeId);
    if (existing) return existing;

    const entry: CustomerChallenge = { challengeId, currentValue: 0, status: 'active' };
    profile.challenges.push(entry);
    return entry;
  }

  getChallenges(customerId: string): Array<{ challenge: LoyaltyChallenge; progress: CustomerChallenge }> {
    const profile = this.profiles.get(customerId);
    if (!profile) return [];
    return profile.challenges.map(pc => ({
      progress: pc,
      challenge: this.challenges.get(pc.challengeId)!,
    })).filter(c => c.challenge);
  }

  // ── Leaderboard ───────────────────────────────────────────────────────────

  getLeaderboard(topN: number = 10): LeaderboardEntry[] {
    return Array.from(this.profiles.values())
      .sort((a, b) => b.lifetimeEarned - a.lifetimeEarned)
      .slice(0, topN)
      .map((p, i) => ({
        rank: i + 1,
        customerId: p.customerId,
        balance: p.balance,
        lifetimeEarned: p.lifetimeEarned,
        tier: p.tier,
      }));
  }

  // ── Universal Database Sync ───────────────────────────────────────────────

  sync(profiles: LoyaltyProfile[]): void {
    profiles.forEach(p => this.profiles.set(p.customerId, p));
  }

  export(): LoyaltyProfile[] {
    return this.getAllProfiles();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private _getOrCreate(customerId: string): LoyaltyProfile {
    if (!this.profiles.has(customerId)) this.createProfile(customerId);
    return this.profiles.get(customerId)!;
  }

  private _updateChallengesProgress(customerId: string, metric: 'orders' | 'spend' | 'referrals', value: number): void {
    const profile = this.profiles.get(customerId);
    if (!profile) return;

    profile.challenges.forEach(pc => {
      if (pc.status !== 'active') return;
      const challenge = this.challenges.get(pc.challengeId);
      if (!challenge || challenge.metric !== metric) return;

      pc.currentValue += value;
      if (pc.currentValue >= challenge.targetValue) {
        pc.status      = 'completed';
        pc.completedAt = new Date();
        this.adjustCoins(customerId, challenge.bonusCoins, `Challenge completed: ${challenge.name}`);
        this.emit('challenge:completed', { customerId, challengeId: pc.challengeId, bonusCoins: challenge.bonusCoins });
      }
    });
  }
}
