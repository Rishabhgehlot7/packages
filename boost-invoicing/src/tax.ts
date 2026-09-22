/**
 * Directory of common Indian eCommerce HSN & SAC codes with default tax slabs
 */
export interface HsnDirectoryEntry {
  code: string;
  category: string;
  description: string;
  standardGstRate: number; // e.g. 5, 12, 18, 28
}

export const COMMON_HSN_DIRECTORY: Record<string, HsnDirectoryEntry> = {
  // Apparel & Textiles
  '6109': { code: '6109', category: 'Apparel', description: 'T-Shirts, Singlets and Other Vests (Knitted or Crocheted)', standardGstRate: 12 },
  '6203': { code: '6203', category: 'Apparel', description: "Men's Suits, Jackets, Blazers, Trousers, Shorts", standardGstRate: 12 },
  '6204': { code: '6204', category: 'Apparel', description: "Women's Suits, Ensembles, Jackets, Dresses, Skirts", standardGstRate: 12 },
  '6403': { code: '6403', category: 'Footwear', description: 'Footwear with outer soles of rubber, plastics, leather', standardGstRate: 18 },
  
  // Electronics & Mobile Accessories
  '8517': { code: '8517', category: 'Electronics', description: 'Mobile Phones, Smart Watches & Network Equipment', standardGstRate: 18 },
  '8518': { code: '8518', category: 'Electronics', description: 'Microphones, Headphones, Earphones & Speakers', standardGstRate: 18 },
  '8504': { code: '8504', category: 'Electronics', description: 'Power Adapters, Chargers & Inverters', standardGstRate: 18 },
  '8507': { code: '8507', category: 'Electronics', description: 'Electric Storage Batteries & Power Banks', standardGstRate: 18 },

  // Beauty, Personal Care & Cosmetics
  '3304': { code: '3304', category: 'Cosmetics', description: 'Beauty / Make-up preparations, Skincare, Sunscreen', standardGstRate: 18 },
  '3305': { code: '3305', category: 'Personal Care', description: 'Hair care preparations (Shampoo, Oil, Conditioners)', standardGstRate: 18 },
  '3307': { code: '3307', category: 'Personal Care', description: 'Perfumes, Deodorants, Shaving preparations', standardGstRate: 18 },

  // Jewelry & Watches
  '7117': { code: '7117', category: 'Fashion Accessories', description: 'Imitation Jewelry', standardGstRate: 3 },
  '9102': { code: '9102', category: 'Watches', description: 'Wrist Watches, Pocket Watches', standardGstRate: 18 },

  // Home, Kitchen & Decor
  '9403': { code: '9403', category: 'Furniture', description: 'Other Furniture and Parts thereof', standardGstRate: 18 },
  '6912': { code: '6912', category: 'Kitchenware', description: 'Ceramic Tableware, Kitchenware', standardGstRate: 12 },

  // Books & Stationery
  '4901': { code: '4901', category: 'Books', description: 'Printed Books, Brochures, Leaflets', standardGstRate: 0 },
  '4820': { code: '4820', category: 'Stationery', description: 'Notebooks, Registers, Diaries, Letter Pads', standardGstRate: 18 },

  // Logistics & Services (SAC)
  '9968': { code: '9968', category: 'Logistics', description: 'Courier, Express Cargo & Postal Services', standardGstRate: 18 },
  '9983': { code: '9983', category: 'Services', description: 'Other professional, technical and business services', standardGstRate: 18 },
};

export interface TaxCalculationOptions {
  taxMode?: 'INCLUSIVE' | 'EXCLUSIVE'; // Default: INCLUSIVE for eCommerce D2C
  isIntraState: boolean;
}

export interface CalculatedTaxItem {
  name: string;
  sku?: string;
  hsn: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
  taxableAmount: number;
  taxRate: number;
  totalTax: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface HsnSummaryEntry {
  hsn: string;
  taxableAmount: number;
  rate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

export interface TaxCalculationResult {
  items: CalculatedTaxItem[];
  subtotalTaxable: number;
  totalTax: number;
  totalDiscount: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  shippingTaxable: number;
  shippingTax: number;
  grandTotal: number;
  hsnSummary: Record<string, HsnSummaryEntry>;
}

/**
 * Calculates item-level and order-level GST breakdowns
 */
export function calculateGstBreakdown(
  rawItems: Array<{
    name: string;
    sku?: string;
    hsn?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate?: number;
  }>,
  shippingFee: number = 0,
  options: TaxCalculationOptions
): TaxCalculationResult {
  const isInclusive = options.taxMode !== 'EXCLUSIVE';
  const isIntraState = options.isIntraState;

  let subtotalTaxable = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  const hsnMap: Record<string, HsnSummaryEntry> = {};

  const calculatedItems: CalculatedTaxItem[] = rawItems.map((item) => {
    const qty = Math.max(1, item.quantity || 1);
    const rate = item.unitPrice || 0;
    const discount = item.discount || 0;
    const taxRate = item.taxRate !== undefined ? item.taxRate : 18;
    const hsn = item.hsn || '9983';

    let taxable = 0;
    let tax = 0;
    let lineTotal = 0;

    if (isInclusive) {
      // D2C Mode: Price entered already includes tax
      lineTotal = Math.round((qty * rate - discount) * 100) / 100;
      taxable = Math.round((lineTotal / (1 + taxRate / 100)) * 100) / 100;
      tax = Math.round((lineTotal - taxable) * 100) / 100;
    } else {
      // B2B Mode: Price is base, tax is added on top
      const baseTotal = qty * rate - discount;
      taxable = Math.round(baseTotal * 100) / 100;
      tax = Math.round(((taxable * taxRate) / 100) * 100) / 100;
      lineTotal = Math.round((taxable + tax) * 100) / 100;
    }

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isIntraState) {
      cgst = Math.round((tax / 2) * 100) / 100;
      sgst = Math.round((tax - cgst) * 100) / 100;
    } else {
      igst = tax;
    }

    subtotalTaxable = Math.round((subtotalTaxable + taxable) * 100) / 100;
    totalTax = Math.round((totalTax + tax) * 100) / 100;
    totalDiscount = Math.round((totalDiscount + discount) * 100) / 100;
    cgstTotal = Math.round((cgstTotal + cgst) * 100) / 100;
    sgstTotal = Math.round((sgstTotal + sgst) * 100) / 100;
    igstTotal = Math.round((igstTotal + igst) * 100) / 100;

    if (!hsnMap[hsn]) {
      hsnMap[hsn] = {
        hsn,
        taxableAmount: 0,
        rate: taxRate,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
      };
    }
    hsnMap[hsn].taxableAmount = Math.round((hsnMap[hsn].taxableAmount + taxable) * 100) / 100;
    hsnMap[hsn].cgst = Math.round((hsnMap[hsn].cgst + cgst) * 100) / 100;
    hsnMap[hsn].sgst = Math.round((hsnMap[hsn].sgst + sgst) * 100) / 100;
    hsnMap[hsn].igst = Math.round((hsnMap[hsn].igst + igst) * 100) / 100;
    hsnMap[hsn].totalTax = Math.round((hsnMap[hsn].totalTax + tax) * 100) / 100;

    return {
      name: item.name,
      sku: item.sku,
      hsn,
      quantity: qty,
      unitPrice: rate,
      discount,
      lineTotal,
      taxableAmount: taxable,
      taxRate,
      totalTax: tax,
      cgst,
      sgst,
      igst,
    };
  });

  // Shipping GST computation (standard 18% SAC 9968)
  let shippingTaxable = 0;
  let shippingTax = 0;
  if (shippingFee > 0) {
    if (isInclusive) {
      shippingTaxable = Math.round((shippingFee / 1.18) * 100) / 100;
      shippingTax = Math.round((shippingFee - shippingTaxable) * 100) / 100;
    } else {
      shippingTaxable = shippingFee;
      shippingTax = Math.round((shippingFee * 0.18) * 100) / 100;
    }
  }

  const grandTotal = Math.round((subtotalTaxable + totalTax + shippingFee) * 100) / 100;

  return {
    items: calculatedItems,
    subtotalTaxable,
    totalTax,
    totalDiscount,
    cgstTotal,
    sgstTotal,
    igstTotal,
    shippingTaxable,
    shippingTax,
    grandTotal,
    hsnSummary: hsnMap,
  };
}
