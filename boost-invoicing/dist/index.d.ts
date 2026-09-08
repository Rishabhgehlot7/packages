interface BusinessEntity {
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
interface CustomerEntity {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email?: string;
    gstin?: string;
}
interface InvoiceItem {
    name: string;
    sku?: string;
    hsn: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate: number;
}
interface InvoiceData {
    invoiceNumber: string;
    invoiceDate: string;
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
interface ShippingLabelData {
    awb: string;
    courierName: string;
    routingCode?: string;
    orderId: string;
    invoiceNumber?: string;
    seller: BusinessEntity;
    buyer: CustomerEntity;
    paymentMethod: 'PREPAID' | 'COD';
    collectibleAmount: number;
    weightKg: number;
    dimensionsCm?: {
        length: number;
        width: number;
        height: number;
    };
    itemSummary: Array<{
        name: string;
        quantity: number;
    }>;
}

declare class InvoiceGenerator {
    /**
     * Generates a fully compliant, print-ready Indian GST Tax Invoice HTML
     */
    static generateTaxInvoiceHtml(data: InvoiceData): string;
    /**
     * Generates a 4x6 inch thermal shipping label HTML with barcode and COD alert
     */
    static generateShippingLabelHtml(data: ShippingLabelData): string;
}

/**
 * Converts a number into Indian Currency Words (e.g. 1499.50 -> "One Thousand Four Hundred Ninety-Nine Rupees and Fifty Paise Only")
 */
declare function numberToIndianWords(amount: number): string;
/**
 * Generates an SVG pseudo-Code128 barcode representation for shipping labels
 */
declare function generateBarcodeSvg(text: string, height?: number): string;

export { type BusinessEntity, type CustomerEntity, type InvoiceData, InvoiceGenerator, type InvoiceItem, type ShippingLabelData, generateBarcodeSvg, numberToIndianWords };
