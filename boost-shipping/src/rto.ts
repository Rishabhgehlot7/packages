/**
 * RTO (Return-to-Origin) Risk & COD Fraud Predictor
 * Protects Indian D2C brands & eCommerce stores from high COD rejection rates and fake orders.
 */

import { PincodeIntelligence } from './pincode';

export type RTORiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type RTOActionSuggestion =
  | 'SAFE_TO_DISPATCH'
  | 'OFFER_PREPAID_DISCOUNT'
  | 'REQUIRE_OTP_VERIFICATION'
  | 'CALL_CONFIRMATION_REQUIRED'
  | 'DISABLE_COD_RESTRICT_PREPAID';

export interface RTOEvaluationInput {
  pincode: string;
  paymentMode: 'Prepaid' | 'COD';
  totalAmount: number;
  customerPhone?: string;
  addressText?: string;
  isPhoneVerified?: boolean;
  pastOrderCount?: number;
  pastRtoCount?: number;
}

export interface RTORiskAssessment {
  riskScore: number; // 0 (safest) to 100 (highest risk)
  riskLevel: RTORiskLevel;
  riskReasons: string[];
  suggestedAction: RTOActionSuggestion;
  prepaidIncentiveAmount?: number;
  canSafelyAutoFulfill: boolean;
}

export class RTORiskEngine {
  /**
   * Evaluates order risk factors and returns a calculated RTO risk score and mitigation suggestions.
   */
  public static evaluateOrder(input: RTOEvaluationInput): RTORiskAssessment {
    let score = 0;
    const reasons: string[] = [];

    // 1. Payment Mode Factor (Prepaid orders have ~98% successful delivery rate in India)
    if (input.paymentMode === 'Prepaid') {
      score = 5; // Negligible base risk
      return {
        riskScore: score,
        riskLevel: 'LOW',
        riskReasons: ['Prepaid payment confirmed. Minimal RTO risk.'],
        suggestedAction: 'SAFE_TO_DISPATCH',
        canSafelyAutoFulfill: true,
      };
    }

    // COD Baseline Risk
    score += 25;
    reasons.push('Payment mode is Cash on Delivery (COD).');

    // 2. Order Value Factor (High ticket COD orders have significantly higher refusal rates)
    if (input.totalAmount > 6000) {
      score += 35;
      reasons.push(`High value COD order (₹${input.totalAmount} > ₹6,000). High customer hesitation risk.`);
    } else if (input.totalAmount > 3000) {
      score += 20;
      reasons.push(`Moderate-high COD value (₹${input.totalAmount}).`);
    } else if (input.totalAmount < 299) {
      score += 15;
      reasons.push(`Very low COD value (₹${input.totalAmount}). Impulse purchase risk.`);
    }

    // 3. Indian Pincode Tier Analysis
    const pinInfo = PincodeIntelligence.resolvePincode(input.pincode);
    if (!pinInfo.isValid) {
      score += 40;
      reasons.push(`Invalid or unrecognized postal pincode (${input.pincode}).`);
    } else if (pinInfo.tier === 'REMOTE') {
      score += 25;
      reasons.push(`Delivery location is Remote tier (${pinInfo.state || 'Undetected'}). Transit delays increase RTO.`);
    } else if (pinInfo.tier === 'TIER_2') {
      score += 10;
    } else if (pinInfo.tier === 'METRO') {
      score -= 10; // Metro COD is comparatively more reliable
    }

    // 4. Phone Number Health
    if (input.customerPhone) {
      const cleanPhone = input.customerPhone.replace(/[^0-9]/g, '');
      const validIndianPhone = /^[6-9][0-9]{9}$/.test(cleanPhone.slice(-10));
      if (!validIndianPhone) {
        score += 30;
        reasons.push('Invalid or suspicious mobile phone number format.');
      } else if (!input.isPhoneVerified) {
        score += 10;
        reasons.push('Customer phone number has not completed OTP verification.');
      }
    } else {
      score += 25;
      reasons.push('Missing customer phone number.');
    }

    // 5. Address Completeness
    if (input.addressText) {
      const trimmed = input.addressText.trim();
      if (trimmed.length < 15) {
        score += 25;
        reasons.push('Very short or vague shipping address. Courier field agent may not locate recipient.');
      }
    }

    // 6. Customer Delivery History
    if (input.pastRtoCount && input.pastRtoCount > 0) {
      score += Math.min(input.pastRtoCount * 25, 50);
      reasons.push(`Customer has ${input.pastRtoCount} previous recorded RTO non-delivery incident(s).`);
    }

    // Normalize bounds (0 - 100)
    score = Math.max(0, Math.min(100, score));

    // Determine Risk Level & Actionable Strategy
    let riskLevel: RTORiskLevel = 'LOW';
    let suggestedAction: RTOActionSuggestion = 'SAFE_TO_DISPATCH';
    let prepaidIncentive: number | undefined;

    if (score >= 65) {
      riskLevel = 'HIGH';
      if (score >= 85) {
        suggestedAction = 'DISABLE_COD_RESTRICT_PREPAID';
        prepaidIncentive = 100;
      } else {
        suggestedAction = 'REQUIRE_OTP_VERIFICATION';
        prepaidIncentive = 50;
      }
    } else if (score >= 35) {
      riskLevel = 'MEDIUM';
      suggestedAction = 'OFFER_PREPAID_DISCOUNT';
      prepaidIncentive = 40;
    } else {
      riskLevel = 'LOW';
      suggestedAction = 'SAFE_TO_DISPATCH';
    }

    return {
      riskScore: score,
      riskLevel,
      riskReasons: reasons,
      suggestedAction,
      prepaidIncentiveAmount: prepaidIncentive,
      canSafelyAutoFulfill: riskLevel === 'LOW',
    };
  }
}
