// ─── Return Status & Types ────────────────────────────────────────────────────

export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'received'
  | 'refund_initiated'
  | 'refunded'
  | 'exchange_dispatched';

export type ReturnReason =
  | 'defective'
  | 'wrong_item'
  | 'not_as_described'
  | 'changed_mind'
  | 'damaged_in_transit'
  | 'size_fit_issue'
  | 'other';

export type RefundMethod = 'original_payment' | 'store_credit' | 'bank_transfer' | 'upi';

export type ReturnType = 'return' | 'exchange' | 'partial_return';

// ─── Return Item ──────────────────────────────────────────────────────────────

export interface ReturnItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  reason: ReturnReason;
  reasonNote?: string;
  imageUrls?: string[];         // customer-uploaded photos
}

// ─── Pickup Info ──────────────────────────────────────────────────────────────

export interface PickupAddress {
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PickupSchedule {
  provider?: string;            // e.g. 'shiprocket', 'delhivery'
  awbNumber?: string;
  scheduledAt?: Date;
  pickedUpAt?: Date;
  trackingUrl?: string;
}

// ─── Return Request ───────────────────────────────────────────────────────────

export interface ReturnRequest {
  id: string;                   // RMA-XXXXXXXX
  orderId: string;
  customerId: string;
  type: ReturnType;
  status: ReturnStatus;
  items: ReturnItem[];
  refundAmount: number;         // calculated total
  refundMethod: RefundMethod;
  pickupAddress?: PickupAddress;
  pickup?: PickupSchedule;
  exchangeOrderId?: string;
  adminNote?: string;
  timeline: ReturnTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnTimeline {
  status: ReturnStatus;
  note?: string;
  timestamp: Date;
}

// ─── Return Policy ────────────────────────────────────────────────────────────

export interface ReturnPolicy {
  windowDays: number;           // default: 7
  allowedReasons: ReturnReason[];
  nonReturnableCategories: string[];
  autoApprove: boolean;         // auto-approve if reason is valid
  maxRefundPct: number;         // max % of order value refundable (default 100)
}

export const DEFAULT_RETURN_POLICY: ReturnPolicy = {
  windowDays: 7,
  allowedReasons: ['defective', 'wrong_item', 'not_as_described', 'damaged_in_transit', 'size_fit_issue', 'changed_mind', 'other'],
  nonReturnableCategories: [],
  autoApprove: false,
  maxRefundPct: 100,
};

// ─── Events ──────────────────────────────────────────────────────────────────

export interface ReturnsEvents {
  'return:created':        { returnId: string; orderId: string; customerId: string };
  'return:approved':       { returnId: string; refundAmount: number };
  'return:rejected':       { returnId: string; reason: string };
  'return:pickup_scheduled': { returnId: string; pickup: PickupSchedule };
  'return:picked_up':      { returnId: string };
  'return:received':       { returnId: string };
  'return:refunded':       { returnId: string; refundAmount: number; method: RefundMethod };
  'return:exchange_dispatched': { returnId: string; exchangeOrderId: string };
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface ReturnsStats {
  total: number;
  byStatus: Record<ReturnStatus, number>;
  totalRefunded: number;
  avgProcessingDays: number;
  topReasons: Array<{ reason: ReturnReason; count: number }>;
}
