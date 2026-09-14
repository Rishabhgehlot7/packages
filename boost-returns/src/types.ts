export type ReturnReason =
  | 'SIZE_FIT_ISSUE'
  | 'DEFECTIVE_PRODUCT'
  | 'WRONG_ITEM_DELIVERED'
  | 'NOT_AS_PICTURED'
  | 'DAMAGED_IN_TRANSIT'
  | 'CHANGED_MIND'
  | 'QUALITY_NOT_SATISFACTORY';

export type ReturnStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'RECEIVED_AT_HUB'
  | 'QC_PASSED'
  | 'QC_FAILED'
  | 'REFUND_INITIATED'
  | 'REFUND_COMPLETED'
  | 'REPLACEMENT_SHIPPED'
  | 'CLOSED';

export type ReturnResolution = 'REFUND' | 'REPLACEMENT' | 'STORE_CREDIT';

export type RefundDestination =
  | 'ORIGINAL_PAYMENT_SOURCE'
  | 'UPI'
  | 'BANK_ACCOUNT'
  | 'STORE_WALLET';

export interface ReturnItemRequest {
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  reason: ReturnReason;
  comment?: string;
  imageUrls?: string[];
  requestedResolution: ReturnResolution;
  replacementVariantId?: string;
}

export interface ReturnPolicyConfig {
  /** Maximum days from delivery date allowed for return (default: 7) */
  returnWindowDays: number;
  /** Categories that cannot be returned (e.g. underwear, clearance) */
  nonReturnableCategories: string[];
  /** Allow replacement only, no cash refund for certain items */
  replacementOnlyCategories: string[];
  /** Reverse pickup fee in INR to deduct if return reason is 'CHANGED_MIND' */
  reversePickupDeductionFee: number;
  /** Allow instant refund upon pickup vs after QC at warehouse */
  allowInstantRefundOnPickup: boolean;
}

export interface PickupAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ReturnRequest {
  id: string; // e.g. RET-2026-9812
  orderId: string;
  customerId: string;
  status: ReturnStatus;
  items: ReturnItemRequest[];
  pickupAddress: PickupAddress;
  createdAt: string;
  updatedAt: string;
  refundDestination?: RefundDestination;
  refundDetails?: {
    upiId?: string;
    bankAccount?: string;
    ifsc?: string;
  };
  reverseTrackingNumber?: string;
  reverseCourierName?: string;
  qcNotes?: string;
  refundAmount?: number;
  deductionFee?: number;
}

export interface EligibilityResult {
  isEligible: boolean;
  reason?: string;
  daysRemaining?: number;
  allowedResolutions: ReturnResolution[];
}

export interface RefundQuote {
  itemSubtotal: number;
  reversePickupFeeDeducted: number;
  netRefundAmount: number;
  refundDestination: RefundDestination;
  estimatedSettlementDays: number;
}

export interface ReversePickupManifest {
  returnRequestId: string;
  orderId: string;
  courierPartner: 'Shiprocket' | 'Delhivery' | 'Shadowfax';
  awbNumber: string;
  pickupDate: string;
  sender: PickupAddress;
  recipientWarehouse: {
    hubName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  packageDetails: {
    weightKg: number;
    dimensionsCm: { length: number; width: number; height: number };
    declaredValue: number;
  };
}
