export type ReferralRewardType =
  | 'FLAT_RUPEES'
  | 'PERCENT_DISCOUNT'
  | 'SUPERCOINS'
  | 'STORE_WALLET';

export interface ReferralRewardConfig {
  /** Referee incentive (the friend who is buying) */
  refereeReward: {
    type: ReferralRewardType;
    value: number; // e.g. 200 for ₹200 off or 15 for 15% off
    minOrderValue: number; // e.g. 999
  };
  /** Referrer reward (the user who invited them) */
  referrerReward: {
    type: ReferralRewardType;
    value: number; // e.g. 200 for ₹200 wallet cashback or 200 SuperCoins
    triggerEvent: 'ON_ORDER_PLACED' | 'ON_ORDER_DELIVERED' | 'AFTER_RETURN_WINDOW';
  };
  /** Max lifetime referrals allowed per customer (default: 50) */
  maxReferralsPerUser: number;
}

export interface CustomerIdentifier {
  customerId: string;
  name: string;
  phone?: string;
  email?: string;
  ipAddress?: string;
  deviceId?: string;
}

export interface ReferralCodeInfo {
  code: string; // e.g. REF-AJAY-98
  ownerId: string;
  ownerName: string;
  createdAt: string;
  totalUses: number;
  totalEarnings: number;
}

export interface ReferralValidationResult {
  isValid: boolean;
  code?: string;
  discountAmount?: number;
  error?: string;
  errorCode?: 'SELF_REFERRAL' | 'CODE_NOT_FOUND' | 'MIN_ORDER_NOT_MET' | 'MAX_USES_REACHED' | 'NOT_FIRST_ORDER';
}

export interface SharePayloads {
  code: string;
  referralLink: string;
  whatsappUrl: string;
  telegramUrl: string;
  twitterUrl: string;
  shareText: string;
}
