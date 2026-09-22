export interface BusinessEntity {
  name: string;
  tradeName?: string;
  gstin?: string;
  pan?: string;
  address: string;
  city: string;
  state: string;
  stateCode?: string;
  pincode: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  signatureUrl?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifsc: string;
    branch?: string;
    upiId?: string;
  };
}

export interface CustomerEntity {
  name: string;
  tradeName?: string;
  address: string;
  city: string;
  state: string;
  stateCode?: string;
  pincode: string;
  phone: string;
  email?: string;
  gstin?: string; // B2B GSTIN
  pan?: string;
}

export interface InvoiceItem {
  name: string;
  sku?: string;
  hsn?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate?: number; // e.g. 5, 12, 18, 28 (default: 18)
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD or DD/MM/YYYY
  orderId: string;
  orderDate?: string;
  paymentMethod: 'PREPAID' | 'COD' | string;
  paymentTxnId?: string;
  taxMode?: 'INCLUSIVE' | 'EXCLUSIVE';
  seller: BusinessEntity;
  buyer: CustomerEntity;
  shippingAddress?: CustomerEntity;
  items: InvoiceItem[];
  shippingFee?: number;
  discountAmount?: number;
  termsAndConditions?: string[];
  notes?: string;
  isReverseChargeApplicable?: boolean;
}

export interface NonGstInvoiceData {
  invoiceTitle?: 'RETAIL INVOICE' | 'SALES INVOICE' | 'CASH MEMO' | string;
  invoiceNumber: string;
  invoiceDate: string;
  orderId: string;
  orderDate?: string;
  paymentMethod: 'PREPAID' | 'COD' | string;
  paymentTxnId?: string;
  seller: BusinessEntity;
  buyer: CustomerEntity;
  shippingAddress?: CustomerEntity;
  items: Array<{
    name: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
  shippingFee?: number;
  discountAmount?: number;
  termsAndConditions?: string[];
  notes?: string;
}

export interface ProformaInvoiceData extends InvoiceData {
  validUntil?: string;
}

export interface BillOfSupplyData extends Omit<InvoiceData, 'taxMode'> {
  compositionSchemeDeclaration?: string;
}

export interface CreditNoteData {
  creditNoteNumber: string;
  creditNoteDate: string;
  originalInvoiceNumber: string;
  originalInvoiceDate: string;
  reasonForReturn: 'Order Cancelled' | 'Defective Product' | 'Product Returned' | 'Price Correction' | string;
  seller: BusinessEntity;
  buyer: CustomerEntity;
  items: InvoiceItem[];
  refundShippingFee?: number;
  totalRefundAmount?: number;
  notes?: string;
}

export interface ThermalReceiptData {
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  gstin?: string;
  receiptNumber: string;
  date: string;
  orderId: string;
  cashierOrAgent?: string;
  customerName?: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount?: number;
  tax?: number;
  shippingFee?: number;
  total: number;
  paymentMethod: string;
  upiQrPayload?: string; // Optional UPI string for dynamic payment QR
  footerMessage?: string;
}

export interface ShippingLabelData {
  awb: string;
  courierName: string;
  routingCode?: string;
  orderId: string;
  invoiceNumber?: string;
  seller: BusinessEntity;
  buyer: CustomerEntity;
  paymentMethod: 'PREPAID' | 'COD' | string;
  collectibleAmount: number; // 0 for prepaid, total amount for COD
  weightKg: number;
  dimensionsCm?: { length: number; width: number; height: number };
  itemSummary: Array<{ name: string; quantity: number }>;
}

/**
 * Compatible bridge interface for @boostengine/cart
 */
export interface BoostCartLike {
  items: Array<{
    id?: string;
    productId?: string;
    name?: string;
    title?: string;
    price: number;
    quantity: number;
    sku?: string;
    category?: string;
    hsn?: string;
    taxRate?: number;
    discount?: number;
  }>;
  total?: number;
  subtotal?: number;
  shippingFee?: number;
  discountTotal?: number;
}
