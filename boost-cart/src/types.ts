export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image?: string;
  sku?: string;
  weightGrams?: number;
  hsnCode?: string;
  taxRate?: number; // GST rate percentage (e.g., 0, 5, 12, 18, 28). Default: 18
  metadata?: Record<string, any>;
}

export interface StoreOriginConfig {
  state: string; // e.g. "Maharashtra" or "MH"
  pincode?: string;
  gstin?: string;
  taxMode?: 'inclusive' | 'exclusive'; // default: 'inclusive'
}

export interface CustomerShippingAddress {
  state: string; // e.g. "Karnataka" or "KA"
  pincode?: string;
  country?: string;
}

export interface ShippingConfig {
  freeShippingThreshold?: number; // e.g. 999
  flatShippingRate?: number; // e.g. 79
}

export interface PaymentConfig {
  paymentMethod?: 'prepaid' | 'cod';
  codFee?: number; // e.g. 49
  prepaidDiscountPercentage?: number; // e.g. 5 for 5% off on prepaid
  prepaidDiscountMax?: number; // e.g. 200
}

export interface AppliedDiscount {
  code: string;
  amount: number;
  description?: string;
}

export interface HSNTaxEntry {
  hsnCode: string;
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface GSTBreakdown {
  taxableAmount: number;
  totalTax: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxType: 'INTRA_STATE' | 'INTER_STATE';
  hsnBreakdown: HSNTaxEntry[];
}

export interface FreeShippingProgress {
  threshold: number;
  currentAmount: number;
  amountRemaining: number;
  percentage: number; // 0 to 100
  isEligible: boolean;
  message: string;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number; // Unique items count
  totalQuantity: number; // Total units count
  subtotal: number;
  totalMRP: number;
  totalSavings: number;
  discount: AppliedDiscount | null;
  shippingFee: number;
  codFee: number;
  prepaidDiscount: number;
  gst: GSTBreakdown;
  freeShipping: FreeShippingProgress;
  finalTotal: number;
}
