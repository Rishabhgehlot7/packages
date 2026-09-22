import { validateGSTIN, determineTaxType } from './gst';
import { calculateGstBreakdown, COMMON_HSN_DIRECTORY } from './tax';
import { InvoiceGenerator } from './invoice';
import {
  InvoiceData,
  CreditNoteData,
  ThermalReceiptData,
  BillOfSupplyData,
  NonGstInvoiceData,
  ProformaInvoiceData,
} from './types';

export class InvoicingAgentToolkit {
  /**
   * Generates JSON Schema definitions compatible with OpenAI, Claude, Gemini, LangChain, Vercel AI SDK
   */
  getFunctionSchemas() {
    return [
      {
        type: 'function',
        function: {
          name: 'validateGstin',
          description:
            'Validates an Indian 15-character GSTIN number, returning entity type, PAN, and state jurisdiction.',
          parameters: {
            type: 'object',
            properties: {
              gstin: { type: 'string', description: 'The 15-digit GSTIN number (e.g. 27AAAAA0000A1Z5)' },
            },
            required: ['gstin'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'calculateTaxBreakdown',
          description:
            'Calculates Indian GST (CGST, SGST, IGST) breakdown and HSN summary based on seller and buyer locations.',
          parameters: {
            type: 'object',
            properties: {
              sellerState: { type: 'string', description: 'Seller state or GSTIN (e.g. Maharashtra or 27AAAAA0000A1Z5)' },
              buyerState: { type: 'string', description: 'Buyer state or GSTIN (e.g. Karnataka or 29BBBBB1111B2Z6)' },
              shippingFee: { type: 'number', description: 'Shipping charge in Rupees' },
              taxMode: { type: 'string', enum: ['INCLUSIVE', 'EXCLUSIVE'], description: 'Default is INCLUSIVE for D2C' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    hsn: { type: 'string' },
                    quantity: { type: 'number' },
                    unitPrice: { type: 'number' },
                    taxRate: { type: 'number' },
                  },
                  required: ['name', 'quantity', 'unitPrice'],
                },
              },
            },
            required: ['sellerState', 'buyerState', 'items'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'lookupHsnCode',
          description:
            'Looks up standard GST tax rate and product description for an Indian HSN code (e.g. 6109 for T-Shirts).',
          parameters: {
            type: 'object',
            properties: {
              hsn: { type: 'string', description: 'HSN code to query (e.g. 6109, 8517, 3304)' },
            },
            required: ['hsn'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'generateInvoiceHtml',
          description:
            'Generates a print-ready, legally compliant Indian GST Tax Invoice HTML for customer orders.',
          parameters: {
            type: 'object',
            properties: {
              invoiceNumber: { type: 'string' },
              invoiceDate: { type: 'string' },
              orderId: { type: 'string' },
              paymentMethod: { type: 'string' },
              seller: { type: 'object' },
              buyer: { type: 'object' },
              items: { type: 'array' },
            },
            required: ['invoiceNumber', 'invoiceDate', 'orderId', 'seller', 'buyer', 'items'],
          },
        },
      },
    ];
  }

  /**
   * Validates a GSTIN number
   */
  validateGstin(args: { gstin: string }) {
    return validateGSTIN(args.gstin);
  }

  /**
   * Looks up an HSN code
   */
  lookupHsn(args: { hsn: string }) {
    const entry = COMMON_HSN_DIRECTORY[args.hsn.trim()];
    if (entry) {
      return { found: true, ...entry };
    }
    return {
      found: false,
      hsn: args.hsn,
      standardGstRate: 18,
      description: 'General Merchandise / Services',
    };
  }

  /**
   * Calculates GST breakdown
   */
  calculateTaxBreakdown(args: {
    sellerState: string;
    buyerState: string;
    shippingFee?: number;
    taxMode?: 'INCLUSIVE' | 'EXCLUSIVE';
    items: Array<{
      name: string;
      hsn?: string;
      quantity: number;
      unitPrice: number;
      discount?: number;
      taxRate?: number;
    }>;
  }) {
    const taxResolution = determineTaxType(args.sellerState, args.buyerState);
    return calculateGstBreakdown(args.items, args.shippingFee || 0, {
      taxMode: args.taxMode || 'INCLUSIVE',
      isIntraState: taxResolution.isIntraState,
    });
  }

  /**
   * Generates invoice HTML
   */
  generateInvoiceHtml(data: InvoiceData) {
    return InvoiceGenerator.generateTaxInvoiceHtml(data);
  }

  /**
   * Generates credit note HTML
   */
  generateCreditNoteHtml(data: CreditNoteData) {
    return InvoiceGenerator.generateCreditNoteHtml(data);
  }

  /**
   * Generates bill of supply HTML for composition or exempt supplies
   */
  generateBillOfSupplyHtml(data: BillOfSupplyData) {
    return InvoiceGenerator.generateBillOfSupplyHtml(data);
  }

  /**
   * Generates non-GST / retail invoice / cash memo HTML for unregistered sellers
   */
  generateNonGstInvoiceHtml(data: NonGstInvoiceData) {
    return InvoiceGenerator.generateNonGstInvoiceHtml(data);
  }

  /**
   * Generates proforma invoice (estimate / quotation) HTML
   */
  generateProformaInvoiceHtml(data: ProformaInvoiceData) {
    return InvoiceGenerator.generateProformaInvoiceHtml(data);
  }

  /**
   * Generates thermal receipt HTML
   */
  generateThermalReceiptHtml(data: ThermalReceiptData, widthMm: 80 | 58 = 80) {
    return InvoiceGenerator.generateThermalReceiptHtml(data, widthMm);
  }
}
