// @boostengine/referrals — Updated Entry Point
export { BoostReferralsManager } from './referral-manager';
export type {
  ReferralLink, ReferralConversion, ReferralProgram, ReferralReward,
  ReferralStatus, ConversionStatus, RewardType, ShareLinks,
  ReferralStats, ReferralLeaderboardEntry, ReferralsEvents,
} from './referral-types';
export { DEFAULT_REFERRAL_PROGRAM } from './referral-types';
export { referralsAgentTools } from './referral-agent';
export type { ReferralsAgentToolName } from './referral-agent';
// Backward compat
export * from './engine';
