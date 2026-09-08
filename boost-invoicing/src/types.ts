export interface BusinessEntity {
  name: string;
  tradeName?: string;
  gstin?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export interface CustomerEntity {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
  gstin?: string; // Optional B2B GSTIN
}

export interface InvoiceItem {
  name: string;
  sku?: string;
  hsn: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate: number; // Percentage e.g. 18
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD
  orderId: string;
  orderDate?: string;
  paymentMethod: 'PREPAID' | 'COD';
  paymentTxnId?: string;
  seller: BusinessEntity;
  buyer: CustomerEntity;
  shippingAddress?: CustomerEntity;
  items: InvoiceItem[];
  shippingFee?: number;
  termsAndConditions?: string[];
}

export interface ShippingLabelData {
  awb: string;
  courierName: string;
  routingCode?: string;
  orderId: string;
  invoiceNumber?: string;
  seller: BusinessEntity;
  buyer: CustomerEntity;
  paymentMethod: 'PREPAID' | 'COD';
  collectibleAmount: number; // 0 for prepaid, total amount for COD
  weightKg: number;
  dimensionsCm?: { length: number; width: number; height: number };
  itemSummary: Array<{ name: string; quantity: number }>;
}
