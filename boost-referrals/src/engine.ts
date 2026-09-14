import {
  ReferralRewardConfig,
  CustomerIdentifier,
  ReferralCodeInfo,
  ReferralValidationResult,
  SharePayloads,
} from './types';

export class ReferralEngine {
  static readonly DEFAULT_CONFIG: ReferralRewardConfig = {
    refereeReward: {
      type: 'FLAT_RUPEES',
      value: 200, // Friend gets ₹200 off
      minOrderValue: 999,
    },
    referrerReward: {
      type: 'STORE_WALLET',
      value: 200, // You get ₹200 wallet cashback
      triggerEvent: 'AFTER_RETURN_WINDOW',
    },
    maxReferralsPerUser: 50,
  };

  /**
   * Generate a human-readable clean referral code
   * e.g. "AJAY200" or "REF-ROHIT-78"
   */
  static generateCode(name: string, userId: string): string {
    const cleanName = name.trim().replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) || 'BOOST';
    const cleanSuffix = userId.replace(/[^a-zA-Z0-9]/g, '').slice(-3).toUpperCase() || '77';
    return `REF-${cleanName}-${cleanSuffix}`;
  }

  /**
   * Validate applying a referral code at checkout
   * Prevents self-referrals (same phone, email, deviceId, or IP)
   */
  static validateReferralApplication(
    code: string,
    referrer: CustomerIdentifier,
    referee: CustomerIdentifier,
    orderTotal: number,
    isRefereeFirstOrder: boolean = true,
    config: Partial<ReferralRewardConfig> = {}
  ): ReferralValidationResult {
    const activeConfig = { ...this.DEFAULT_CONFIG, ...config };

    // 1. First order check
    if (!isRefereeFirstOrder) {
      return {
        isValid: false,
        error: 'Referral codes can only be used on your first purchase.',
        errorCode: 'NOT_FIRST_ORDER',
      };
    }

    // 2. Self referral fraud prevention
    if (referrer.customerId === referee.customerId) {
      return {
        isValid: false,
        error: 'You cannot use your own referral code.',
        errorCode: 'SELF_REFERRAL',
      };
    }

    if (referrer.phone && referee.phone && referrer.phone === referee.phone) {
      return {
        isValid: false,
        error: 'Self-referral detected via matching phone number.',
        errorCode: 'SELF_REFERRAL',
      };
    }

    if (referrer.email && referee.email && referrer.email.toLowerCase() === referee.email.toLowerCase()) {
      return {
        isValid: false,
        error: 'Self-referral detected via matching email.',
        errorCode: 'SELF_REFERRAL',
      };
    }

    if (referrer.deviceId && referee.deviceId && referrer.deviceId === referee.deviceId) {
      return {
        isValid: false,
        error: 'Self-referral detected on the same device.',
        errorCode: 'SELF_REFERRAL',
      };
    }

    // 3. Minimum order value
    if (orderTotal < activeConfig.refereeReward.minOrderValue) {
      return {
        isValid: false,
        error: `Minimum order value of ₹${activeConfig.refereeReward.minOrderValue} required to apply this referral code.`,
        errorCode: 'MIN_ORDER_NOT_MET',
      };
    }

    // Calculate discount
    let discountAmount = 0;
    if (activeConfig.refereeReward.type === 'FLAT_RUPEES') {
      discountAmount = Math.min(orderTotal, activeConfig.refereeReward.value);
    } else if (activeConfig.refereeReward.type === 'PERCENT_DISCOUNT') {
      discountAmount = Math.floor((orderTotal * activeConfig.refereeReward.value) / 100);
    }

    return {
      isValid: true,
      code,
      discountAmount,
    };
  }

  /**
   * Generate 1-click shareable URLs for WhatsApp, Telegram, Twitter
   */
  static generateSharePayloads(
    code: string,
    baseUrl: string,
    brandName: string = 'Boost Store',
    refereeDiscount: number = 200
  ): SharePayloads {
    const referralLink = `${baseUrl.replace(/\/$/, '')}/?ref=${encodeURIComponent(code)}`;
    const shareText = `Hey! Use my referral code ${code} on ${brandName} and get instant ₹${refereeDiscount} OFF on your first order. Check it out: ${referralLink}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(`Get ₹${refereeDiscount} OFF with code ${code}`)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

    return {
      code,
      referralLink,
      whatsappUrl,
      telegramUrl,
      twitterUrl,
      shareText,
    };
  }
}
