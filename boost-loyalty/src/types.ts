// ─── Customer Tiers ───────────────────────────────────────────────────────────

export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'SuperStar';

export interface TierThreshold {
  tier: CustomerTier;
  minLifetimeCoins: number;
}

export const TIER_THRESHOLDS: TierThreshold[] = [
  { tier: 'SuperStar', minLifetimeCoins: 1000 },
  { tier: 'Gold',      minLifetimeCoins: 500  },
  { tier: 'Silver',    minLifetimeCoins: 200  },
  { tier: 'Bronze',    minLifetimeCoins: 0    },
];

export interface TierPerks {
  tier: CustomerTier;
  coinMultiplier: number;       // e.g. 1x, 1.5x, 2x
  freeExpressShipping: boolean;
  earlyAccessDeals: boolean;
  cashbackPercentage: number;
  birthdayBonusCoins: number;   // bonus coins on birthday
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export type TransactionType = 'earn' | 'redeem' | 'adjust' | 'expire' | 'bonus';

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  type: TransactionType;
  coins: number;               // positive = credit, negative = debit
  orderId?: string;
  reason: string;
  balanceAfter: number;
  createdAt: Date;
  expiresAt?: Date;
}

// ─── Rewards Catalog ──────────────────────────────────────────────────────────

export type RewardType = 'discount' | 'freeShipping' | 'gift' | 'cashback';

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  coinsRequired: number;
  value: number;               // ₹ value or % discount
  isActive: boolean;
  expiresAt?: Date;
  limitPerCustomer?: number;
}

// ─── Gamification / Challenges ────────────────────────────────────────────────

export type ChallengeStatus = 'active' | 'completed' | 'expired';

export interface LoyaltyChallenge {
  id: string;
  name: string;
  description: string;
  targetValue: number;         // e.g. spend ₹5000 or place 3 orders
  metric: 'orders' | 'spend' | 'referrals';
  bonusCoins: number;
  startsAt: Date;
  endsAt: Date;
}

export interface CustomerChallenge {
  challengeId: string;
  currentValue: number;
  status: ChallengeStatus;
  completedAt?: Date;
}

// ─── Loyalty Profile ──────────────────────────────────────────────────────────

export interface LoyaltyProfile {
  customerId: string;
  balance: number;             // Current redeemable SuperCoins
  lifetimeEarned: number;
  tier: CustomerTier;
  perks: TierPerks;
  transactions: LoyaltyTransaction[];
  challenges: CustomerChallenge[];
  streakDays: number;          // consecutive purchase days
  lastActivityAt: Date;
  createdAt: Date;
}

// ─── Redemption ───────────────────────────────────────────────────────────────

export interface RedemptionQuote {
  orderTotal: number;
  availableCoins: number;
  maxRedeemableCoins: number;
  coinsToRedeem: number;
  rupeeDiscount: number;
  payableAfterDiscount: number;
  coinsEarnedOnThisOrder: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export interface LoyaltyConfig {
  coinValueInr: number;        // default: 1 coin = ₹1
  earnRatePerHundred: number;  // coins per ₹100 spent (default: 2)
  maxRedemptionPct: number;    // max % of order payable via coins (default: 20)
  expiryDays: number;          // coins expire after N days (0 = no expiry)
  welcomeCoins: number;        // coins for new customers (default: 50)
}

export const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig = {
  coinValueInr: 1,
  earnRatePerHundred: 2,
  maxRedemptionPct: 20,
  expiryDays: 365,
  welcomeCoins: 50,
};

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  customerId: string;
  balance: number;
  lifetimeEarned: number;
  tier: CustomerTier;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export interface LoyaltyEvents {
  'coins:earned':       { customerId: string; coins: number; orderId?: string; newBalance: number };
  'coins:redeemed':     { customerId: string; coins: number; orderId?: string; newBalance: number };
  'coins:adjusted':     { customerId: string; coins: number; reason: string; newBalance: number };
  'coins:expired':      { customerId: string; coins: number; newBalance: number };
  'tier:upgraded':      { customerId: string; oldTier: CustomerTier; newTier: CustomerTier };
  'challenge:completed':{ customerId: string; challengeId: string; bonusCoins: number };
  'profile:created':    { customerId: string };
  'reward:redeemed':    { customerId: string; rewardId: string; coinsSpent: number };
}
