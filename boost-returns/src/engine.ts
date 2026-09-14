import {
  ReturnReason,
  ReturnStatus,
  ReturnResolution,
  ReturnItemRequest,
  ReturnPolicyConfig,
  PickupAddress,
  ReturnRequest,
  EligibilityResult,
  RefundQuote,
  ReversePickupManifest,
} from './types';

export class ReturnEngine {
  static readonly DEFAULT_POLICY: ReturnPolicyConfig = {
    returnWindowDays: 7,
    nonReturnableCategories: ['innerwear', 'lingerie', 'clearance-sale', 'perfumes'],
    replacementOnlyCategories: ['electronics-accessories', 'footwear-size-swap'],
    reversePickupDeductionFee: 100, // ₹100 deducted if customer changed their mind
    allowInstantRefundOnPickup: false,
  };

  /**
   * Check if an item in an order is eligible for return/replacement
   */
  static checkEligibility(
    deliveredAt: string | Date,
    categorySlug: string,
    orderStatus: string,
    policy: Partial<ReturnPolicyConfig> = {}
  ): EligibilityResult {
    const activePolicy = { ...this.DEFAULT_POLICY, ...policy };

    if (orderStatus.toUpperCase() !== 'DELIVERED') {
      return {
        isEligible: false,
        reason: 'Return is only available once the order is Delivered.',
        allowedResolutions: [],
      };
    }

    const deliveryDate = new Date(deliveredAt);
    const now = new Date();
    const diffMs = now.getTime() - deliveryDate.getTime();
    const daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const daysRemaining = activePolicy.returnWindowDays - daysElapsed;

    if (daysRemaining < 0) {
      return {
        isEligible: false,
        reason: `Return window expired. Orders can only be returned within ${activePolicy.returnWindowDays} days of delivery.`,
        daysRemaining: 0,
        allowedResolutions: [],
      };
    }

    const isNonReturnable = activePolicy.nonReturnableCategories.some((cat) =>
      categorySlug.toLowerCase().includes(cat.toLowerCase())
    );

    if (isNonReturnable) {
      return {
        isEligible: false,
        reason: 'This category is marked as non-returnable due to hygiene and safety guidelines.',
        daysRemaining,
        allowedResolutions: [],
      };
    }

    const isReplacementOnly = activePolicy.replacementOnlyCategories.some((cat) =>
      categorySlug.toLowerCase().includes(cat.toLowerCase())
    );

    if (isReplacementOnly) {
      return {
        isEligible: true,
        daysRemaining,
        allowedResolutions: ['REPLACEMENT', 'STORE_CREDIT'],
      };
    }

    return {
      isEligible: true,
      daysRemaining,
      allowedResolutions: ['REFUND', 'REPLACEMENT', 'STORE_CREDIT'],
    };
  }

  /**
   * Calculate detailed refund quote based on reason and policy deductions
   */
  static calculateRefundQuote(
    items: ReturnItemRequest[],
    policy: Partial<ReturnPolicyConfig> = {}
  ): RefundQuote {
    const activePolicy = { ...this.DEFAULT_POLICY, ...policy };

    const itemSubtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    // If reason is CHANGED_MIND, apply reverse pickup deduction fee
    const hasChangedMind = items.some((it) => it.reason === 'CHANGED_MIND');
    const reversePickupFeeDeducted = hasChangedMind
      ? activePolicy.reversePickupDeductionFee
      : 0;

    const netRefundAmount = Math.max(0, itemSubtotal - reversePickupFeeDeducted);

    return {
      itemSubtotal,
      reversePickupFeeDeducted,
      netRefundAmount,
      refundDestination: 'ORIGINAL_PAYMENT_SOURCE',
      estimatedSettlementDays: 3, // 3-5 business days for Indian PG/UPI
    };
  }

  /**
   * Create a new structured return request
   */
  static createReturnRequest(payload: {
    orderId: string;
    customerId: string;
    items: ReturnItemRequest[];
    pickupAddress: PickupAddress;
    policy?: Partial<ReturnPolicyConfig>;
  }): ReturnRequest {
    const now = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `RET-${new Date().getFullYear()}-${randomSuffix}`;
    const quote = this.calculateRefundQuote(payload.items, payload.policy);

    return {
      id,
      orderId: payload.orderId,
      customerId: payload.customerId,
      status: 'REQUESTED',
      items: payload.items,
      pickupAddress: payload.pickupAddress,
      createdAt: now,
      updatedAt: now,
      refundDestination: 'ORIGINAL_PAYMENT_SOURCE',
      refundAmount: quote.netRefundAmount,
      deductionFee: quote.reversePickupFeeDeducted,
    };
  }

  /**
   * Generate reverse pickup manifest compatible with Shiprocket / Delhivery
   */
  static generateReversePickupManifest(
    returnReq: ReturnRequest,
    warehouse: {
      hubName: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    },
    courierPartner: 'Shiprocket' | 'Delhivery' | 'Shadowfax' = 'Shiprocket'
  ): ReversePickupManifest {
    const awbPrefix = courierPartner === 'Shiprocket' ? 'SRR' : 'DELR';
    const awbNumber = `${awbPrefix}${Math.floor(100000000 + Math.random() * 900000000)}`;

    const totalWeightKg = returnReq.items.reduce(
      (sum, item) => sum + (0.4 * item.quantity),
      0
    );

    const declaredValue = returnReq.refundAmount || 0;

    // Pickup scheduled for next day
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 1);

    return {
      returnRequestId: returnReq.id,
      orderId: returnReq.orderId,
      courierPartner,
      awbNumber,
      pickupDate: pickupDate.toISOString().split('T')[0],
      sender: returnReq.pickupAddress,
      recipientWarehouse: warehouse,
      packageDetails: {
        weightKg: Number(totalWeightKg.toFixed(2)),
        dimensionsCm: { length: 25, width: 20, height: 10 },
        declaredValue,
      },
    };
  }

  /**
   * Transition state machine for Return lifecycle
   */
  static transitionStatus(
    currentStatus: ReturnStatus,
    targetStatus: ReturnStatus,
    notes?: string
  ): { allowed: boolean; newStatus: ReturnStatus; error?: string } {
    const validTransitions: Record<ReturnStatus, ReturnStatus[]> = {
      REQUESTED: ['APPROVED', 'REJECTED'],
      APPROVED: ['PICKUP_SCHEDULED', 'REJECTED'],
      REJECTED: ['CLOSED'],
      PICKUP_SCHEDULED: ['PICKED_UP'],
      PICKED_UP: ['IN_TRANSIT', 'REFUND_INITIATED'], // instant refund option
      IN_TRANSIT: ['RECEIVED_AT_HUB'],
      RECEIVED_AT_HUB: ['QC_PASSED', 'QC_FAILED'],
      QC_PASSED: ['REFUND_INITIATED', 'REPLACEMENT_SHIPPED'],
      QC_FAILED: ['CLOSED'],
      REFUND_INITIATED: ['REFUND_COMPLETED'],
      REFUND_COMPLETED: ['CLOSED'],
      REPLACEMENT_SHIPPED: ['CLOSED'],
      CLOSED: [],
    };

    const allowedTargets = validTransitions[currentStatus] || [];
    if (!allowedTargets.includes(targetStatus)) {
      return {
        allowed: false,
        newStatus: currentStatus,
        error: `Cannot transition return from ${currentStatus} to ${targetStatus}`,
      };
    }

    return {
      allowed: true,
      newStatus: targetStatus,
    };
  }
}
