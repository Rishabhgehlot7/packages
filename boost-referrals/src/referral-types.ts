// ─── Referral Types ───────────────────────────────────────────────────────────

export type ReferralStatus = 'active' | 'converted' | 'expired' | 'fraud_flagged';
export type ConversionStatus = 'pending' | 'confirmed' | 'rewarded' | 'reversed';
export type RewardType = 'coins' | 'coupon' | 'cashback' | 'credit';

// ─── Referral Link ────────────────────────────────────────────────────────────

export interface ReferralLink {
  id: string;
  referrerId: string;
  code: string;                // unique short code e.g. "RISHABH50"
  clicks: number;
  conversions: number;
  totalRevenueGenerated: number;
  status: ReferralStatus;
  createdAt: Date;
  expiresAt?: Date;
}

// ─── Referral Conversion ──────────────────────────────────────────────────────

export interface ReferralConversion {
  id: string;
  referralCode: string;
  referrerId: string;
  newCustomerId: string;
  orderId?: string;
  orderTotal: number;
  status: ConversionStatus;
  referrerReward: ReferralReward;
  refereeReward: ReferralReward;
  fraudFlags: string[];
  createdAt: Date;
  confirmedAt?: Date;
}

export interface ReferralReward {
  type: RewardType;
  value: number;              // coins / ₹ cashback / % coupon
  couponCode?: string;
  issued: boolean;
}

// ─── Program Config ───────────────────────────────────────────────────────────

export interface ReferralProgram {
  name: string;
  referrerRewardType: RewardType;
  referrerRewardValue: number;   // coins or ₹
  refereeRewardType: RewardType;
  refereeRewardValue: number;
  minOrderAmount: number;        // min order to qualify (default: 0)
  expiryDays: number;            // referral link expiry (default: 30)
  maxConversionsPerReferrer: number; // anti-abuse (default: 100)
  codePrefix?: string;           // e.g. "REF"
}

export const DEFAULT_REFERRAL_PROGRAM: ReferralProgram = {
  name: 'Refer & Earn',
  referrerRewardType: 'coins',
  referrerRewardValue: 200,
  refereeRewardType: 'coupon',
  refereeRewardValue: 10,         // 10% off
  minOrderAmount: 0,
  expiryDays: 30,
  maxConversionsPerReferrer: 100,
};

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface ReferralStats {
  referrerId: string;
  totalClicks: number;
  totalConversions: number;
  totalRevenueGenerated: number;
  totalRewardEarned: number;
  conversionRate: number;
}

export interface ReferralLeaderboardEntry {
  rank: number;
  referrerId: string;
  conversions: number;
  revenueGenerated: number;
}

// ─── Share Links ─────────────────────────────────────────────────────────────

export interface ShareLinks {
  whatsapp: string;
  twitter: string;
  copyLink: string;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export interface ReferralsEvents {
  'referral:created':    { referrerId: string; code: string };
  'referral:clicked':    { code: string };
  'referral:converted':  { referrerId: string; newCustomerId: string; orderId?: string };
  'referral:rewarded':   { referrerId: string; reward: ReferralReward };
  'fraud:detected':      { code: string; newCustomerId: string; flags: string[] };
}
