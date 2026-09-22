import { EventEmitter } from 'events';

type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'SuperStar';
interface TierThreshold {
    tier: CustomerTier;
    minLifetimeCoins: number;
}
declare const TIER_THRESHOLDS: TierThreshold[];
interface TierPerks {
    tier: CustomerTier;
    coinMultiplier: number;
    freeExpressShipping: boolean;
    earlyAccessDeals: boolean;
    cashbackPercentage: number;
    birthdayBonusCoins: number;
}
type TransactionType = 'earn' | 'redeem' | 'adjust' | 'expire' | 'bonus';
interface LoyaltyTransaction {
    id: string;
    customerId: string;
    type: TransactionType;
    coins: number;
    orderId?: string;
    reason: string;
    balanceAfter: number;
    createdAt: Date;
    expiresAt?: Date;
}
type RewardType = 'discount' | 'freeShipping' | 'gift' | 'cashback';
interface LoyaltyReward {
    id: string;
    name: string;
    description: string;
    type: RewardType;
    coinsRequired: number;
    value: number;
    isActive: boolean;
    expiresAt?: Date;
    limitPerCustomer?: number;
}
type ChallengeStatus = 'active' | 'completed' | 'expired';
interface LoyaltyChallenge {
    id: string;
    name: string;
    description: string;
    targetValue: number;
    metric: 'orders' | 'spend' | 'referrals';
    bonusCoins: number;
    startsAt: Date;
    endsAt: Date;
}
interface CustomerChallenge {
    challengeId: string;
    currentValue: number;
    status: ChallengeStatus;
    completedAt?: Date;
}
interface LoyaltyProfile {
    customerId: string;
    balance: number;
    lifetimeEarned: number;
    tier: CustomerTier;
    perks: TierPerks;
    transactions: LoyaltyTransaction[];
    challenges: CustomerChallenge[];
    streakDays: number;
    lastActivityAt: Date;
    createdAt: Date;
}
interface RedemptionQuote {
    orderTotal: number;
    availableCoins: number;
    maxRedeemableCoins: number;
    coinsToRedeem: number;
    rupeeDiscount: number;
    payableAfterDiscount: number;
    coinsEarnedOnThisOrder: number;
}
interface LoyaltyConfig {
    coinValueInr: number;
    earnRatePerHundred: number;
    maxRedemptionPct: number;
    expiryDays: number;
    welcomeCoins: number;
}
declare const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig;
interface LeaderboardEntry {
    rank: number;
    customerId: string;
    balance: number;
    lifetimeEarned: number;
    tier: CustomerTier;
}
interface LoyaltyEvents {
    'coins:earned': {
        customerId: string;
        coins: number;
        orderId?: string;
        newBalance: number;
    };
    'coins:redeemed': {
        customerId: string;
        coins: number;
        orderId?: string;
        newBalance: number;
    };
    'coins:adjusted': {
        customerId: string;
        coins: number;
        reason: string;
        newBalance: number;
    };
    'coins:expired': {
        customerId: string;
        coins: number;
        newBalance: number;
    };
    'tier:upgraded': {
        customerId: string;
        oldTier: CustomerTier;
        newTier: CustomerTier;
    };
    'challenge:completed': {
        customerId: string;
        challengeId: string;
        bonusCoins: number;
    };
    'profile:created': {
        customerId: string;
    };
    'reward:redeemed': {
        customerId: string;
        rewardId: string;
        coinsSpent: number;
    };
}

declare class LoyaltyEngine {
    /** 1 SuperCoin = ₹1 INR value */
    static readonly COIN_VALUE_INR = 1;
    static getTierPerks(tier: CustomerTier): TierPerks;
    static determineTier(lifetimeCoins: number): CustomerTier;
    static calculateCoinsEarned(orderTotal: number, tier?: CustomerTier, config?: Pick<LoyaltyConfig, 'earnRatePerHundred' | 'coinValueInr'>): number;
    static calculateRedemption(orderTotal: number, availableCoins: number, requestedCoinsToUse?: number, tier?: CustomerTier, config?: Pick<LoyaltyConfig, 'maxRedemptionPct' | 'coinValueInr' | 'earnRatePerHundred'>): RedemptionQuote;
    static createProfile(customerId: string, initialCoins?: number): LoyaltyProfile;
}
declare class BoostLoyaltyManager extends EventEmitter {
    private profiles;
    private rewards;
    private challenges;
    readonly config: LoyaltyConfig;
    constructor(config?: Partial<LoyaltyConfig>);
    createProfile(customerId: string): LoyaltyProfile;
    getProfile(customerId: string): LoyaltyProfile | undefined;
    getAllProfiles(): LoyaltyProfile[];
    earnCoins(customerId: string, orderTotal: number, orderId?: string): LoyaltyTransaction;
    redeemCoins(customerId: string, coinsToRedeem: number, orderId?: string): LoyaltyTransaction;
    adjustCoins(customerId: string, coins: number, reason: string): LoyaltyTransaction;
    expireOldCoins(customerId: string): number;
    getRedemptionQuote(customerId: string, orderTotal: number, requestedCoins?: number): RedemptionQuote;
    addReward(reward: LoyaltyReward): void;
    getRewards(): LoyaltyReward[];
    redeemReward(customerId: string, rewardId: string): LoyaltyReward;
    addChallenge(challenge: LoyaltyChallenge): void;
    joinChallenge(customerId: string, challengeId: string): CustomerChallenge;
    getChallenges(customerId: string): Array<{
        challenge: LoyaltyChallenge;
        progress: CustomerChallenge;
    }>;
    getLeaderboard(topN?: number): LeaderboardEntry[];
    sync(profiles: LoyaltyProfile[]): void;
    export(): LoyaltyProfile[];
    private _getOrCreate;
    private _updateChallengesProgress;
}

declare const loyaltyAgentTools: ({
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            customerId: {
                type: string;
                description: string;
            };
            orderTotal?: undefined;
            orderId?: undefined;
            requestedCoins?: undefined;
            topN?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            customerId: {
                type: string;
                description: string;
            };
            orderTotal: {
                type: string;
                description: string;
            };
            orderId: {
                type: string;
                description: string;
            };
            requestedCoins?: undefined;
            topN?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            customerId: {
                type: string;
                description: string;
            };
            orderTotal: {
                type: string;
                description: string;
            };
            requestedCoins: {
                type: string;
                description: string;
            };
            orderId?: undefined;
            topN?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            topN: {
                type: string;
                description: string;
            };
            customerId?: undefined;
            orderTotal?: undefined;
            orderId?: undefined;
            requestedCoins?: undefined;
        };
        required?: undefined;
    };
})[];
type LoyaltyAgentToolName = typeof loyaltyAgentTools[number]['name'];

export { BoostLoyaltyManager, type ChallengeStatus, type CustomerChallenge, type CustomerTier, DEFAULT_LOYALTY_CONFIG, type LeaderboardEntry, type LoyaltyAgentToolName, type LoyaltyChallenge, type LoyaltyConfig, LoyaltyEngine, type LoyaltyEvents, type LoyaltyProfile, type LoyaltyReward, type LoyaltyTransaction, type RedemptionQuote, type RewardType, TIER_THRESHOLDS, type TierPerks, type TierThreshold, type TransactionType, loyaltyAgentTools };
