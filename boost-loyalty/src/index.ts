// @boostengine/loyalty — Main Entry Point

// Core engine (backward-compat static class + new manager)
export { LoyaltyEngine, BoostLoyaltyManager } from './engine';

// Types
export type {
  CustomerTier,
  TierPerks,
  TierThreshold,
  LoyaltyProfile,
  LoyaltyTransaction,
  TransactionType,
  LoyaltyReward,
  RewardType,
  LoyaltyChallenge,
  CustomerChallenge,
  ChallengeStatus,
  RedemptionQuote,
  LoyaltyConfig,
  LeaderboardEntry,
  LoyaltyEvents,
} from './types';

export { TIER_THRESHOLDS, DEFAULT_LOYALTY_CONFIG } from './types';

// AI Agent Toolkit
export { loyaltyAgentTools } from './agent';
export type { LoyaltyAgentToolName } from './agent';
