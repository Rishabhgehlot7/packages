import { I as InvoiceData, B as BillOfSupplyData, N as NonGstInvoiceData, P as ProformaInvoiceData, C as CreditNoteData, S as ShippingLabelData, T as ThermalReceiptData, a as BoostCartLike, b as BusinessEntity, c as CustomerEntity } from './types-Cvo5QZOW.mjs';
export { d as COMMON_HSN_DIRECTORY, e as CalculatedTaxItem, H as HsnDirectoryEntry, f as HsnSummaryEntry, g as InvoiceItem, h as TaxCalculationOptions, i as TaxCalculationResult, j as calculateGstBreakdown } from './types-Cvo5QZOW.mjs';
export { G as GST_STATE_CODES, a as GstinValidationResult, I as InvoicingAgentToolkit, d as determineTaxType, r as resolveStateCode, v as validateGSTIN } from './agent-MrQpb4ne.mjs';
export { UseInvoiceOptions } from './react.mjs';

/**
 * PDF Rendering Options & Universal Adapter Interface
 */
interface PdfRendererOptions {
    format?: 'A4' | 'Letter' | 'Thermal4x6' | 'Thermal80mm' | string;
    margin?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
    };
    printBackground?: boolean;
    landscape?: boolean;
    adapter?: (html: string, options?: PdfRendererOptions) => Promise<Buffer | Uint8Array>;
}
/**
 * Universal Server-Side PDF Generator
 * Renders HTML invoices into binary PDF Buffers.
 * Supports Puppeteer, Playwright, or custom cloud PDF endpoints.
 */
declare function renderHtmlToPdfBuffer(html: string, options?: PdfRendererOptions): Promise<Buffer | Uint8Array>;
/**
 * Client-Side Instant PDF Download Helper (Triggers Browser Print / Save-to-PDF seamlessly)
 */
declare function downloadPdfInBrowser(html: string, filename?: string): void;

declare class InvoiceGenerator {
    /**
     * Generates a fully compliant, print-ready Indian GST Tax Invoice HTML (A4)
     */
    static generateTaxInvoiceHtml(data: InvoiceData): string;
    /**
     * Generates a legal Bill of Supply HTML (Rule 49 of CGST Rules) for Composition Dealers or Exempt items
     */
    static generateBillOfSupplyHtml(data: BillOfSupplyData): string;
    /**
     * Generates a Non-GST / Retail Invoice / Cash Memo HTML for unregistered sellers or non-GST transactions
     */
    static generateNonGstInvoiceHtml(data: NonGstInvoiceData): string;
    /**
     * Alias for generateNonGstInvoiceHtml
     */
    static generateRetailInvoiceHtml(data: NonGstInvoiceData): string;
    /**
     * Generates a Proforma Invoice (Quotation / Estimate) HTML before order confirmation
     */
    static generateProformaInvoiceHtml(data: ProformaInvoiceData): string;
    static generateCreditNoteHtml(data: CreditNoteData): string;
    /**
     * Generates a 4x6 inch thermal shipping label HTML with barcode and COD alert
     */
    static generateShippingLabelHtml(data: ShippingLabelData): string;
    /**
     * Generates a 3-inch (80mm) or 2-inch (58mm) Thermal POS / Delivery Receipt
     */
    static generateThermalReceiptHtml(data: ThermalReceiptData, widthMm?: 80 | 58): string;
    /**
     * Directly constructs InvoiceData from a @boostengine/cart instance
     */
    static fromCart(cart: BoostCartLike, context: {
        invoiceNumber: string;
        invoiceDate: string;
        orderId: string;
        seller: BusinessEntity;
        buyer: CustomerEntity;
        paymentMethod: 'PREPAID' | 'COD' | string;
        shippingFee?: number;
        taxMode?: 'INCLUSIVE' | 'EXCLUSIVE';
    }): InvoiceData;
    /**
     * Generates a binary PDF Buffer on the server (Node.js/Next.js Route Handlers)
     */
    static toPdfBuffer(html: string, options?: PdfRendererOptions): Promise<Buffer | Uint8Array>;
    /**
     * Programmatically triggers instant PDF download in client/browser environments
     */
    static downloadPdfInBrowser(html: string, filename?: string): void;
}

/**
 * Converts a number into Indian Currency Words (e.g. 1499.50 -> "One Thousand Four Hundred Ninety-Nine Rupees and Fifty Paise Only")
 */
declare function numberToIndianWords(amount: number): string;
/**
 * Generates an SVG pseudo-Code128 barcode representation for shipping labels
 */
declare function generateBarcodeSvg(text: string, height?: number): string;

export { BillOfSupplyData, BoostCartLike, BusinessEntity, CreditNoteData, CustomerEntity, InvoiceData, InvoiceGenerator, NonGstInvoiceData, type PdfRendererOptions, ProformaInvoiceData, ShippingLabelData, ThermalReceiptData, downloadPdfInBrowser, generateBarcodeSvg, numberToIndianWords, renderHtmlToPdfBuffer };
