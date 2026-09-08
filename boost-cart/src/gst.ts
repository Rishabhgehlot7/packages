import { CartItem, StoreOriginConfig, CustomerShippingAddress, GSTBreakdown, HSNTaxEntry } from './types';

const STATE_CODE_MAP: Record<string, string> = {
  mh: 'maharashtra',
  dl: 'delhi',
  ka: 'karnataka',
  tn: 'tamil nadu',
  gj: 'gujarat',
  up: 'uttar pradesh',
  wb: 'west bengal',
  rj: 'rajasthan',
  ts: 'telangana',
  tg: 'telangana',
  ap: 'andhra pradesh',
  kl: 'kerala',
  mp: 'madhya pradesh',
  hr: 'haryana',
  pb: 'punjab',
  br: 'bihar',
  or: 'odisha',
  od: 'odisha',
  as: 'assam',
  jh: 'jharkhand',
  ct: 'chhattisgarh',
  cg: 'chhattisgarh',
  ut: 'uttarakhand',
  uk: 'uttarakhand',
  hp: 'himachal pradesh',
  tr: 'tripura',
  ml: 'meghalaya',
  mn: 'manipur',
  nl: 'nagaland',
  ga: 'goa',
  ar: 'arunachal pradesh',
  mz: 'mizoram',
  sk: 'sikkim',
  py: 'puducherry',
  ch: 'chandigarh',
  jk: 'jammu and kashmir',
  la: 'ladakh',
  dn: 'dadra and nagar haveli and daman and diu',
  dd: 'dadra and nagar haveli and daman and diu',
  an: 'andaman and nicobar islands',
  ld: 'lakshadweep',
};

function normalizeState(state: string | undefined): string {
  if (!state) return '';
  const clean = state.trim().toLowerCase();
  return STATE_CODE_MAP[clean] || clean;
}

export class GSTCalculator {
  /**
   * Calculates detailed GST breakdown across cart items
   */
  static calculate(
    items: CartItem[],
    origin: StoreOriginConfig,
    destination?: CustomerShippingAddress
  ): GSTBreakdown {
    const originState = normalizeState(origin.state);
    const destState = destination ? normalizeState(destination.state) : originState;
    const isIntraState = Boolean(originState && destState && originState === destState);
    const taxMode = origin.taxMode || 'inclusive';

    let totalTaxable = 0;
    let totalTax = 0;
    const hsnMap = new Map<string, HSNTaxEntry>();

    for (const item of items) {
      const rate = item.taxRate !== undefined ? item.taxRate : 18; // Default 18% GST
      const itemTotalPrice = Math.round(item.price * item.quantity * 100) / 100;
      const hsn = item.hsnCode || 'GENERAL';

      let taxable = 0;
      let tax = 0;

      if (taxMode === 'inclusive') {
        // Price includes GST
        taxable = Math.round((itemTotalPrice / (1 + rate / 100)) * 100) / 100;
        tax = Math.round((itemTotalPrice - taxable) * 100) / 100;
      } else {
        // Price is exclusive of GST
        taxable = itemTotalPrice;
        tax = Math.round((itemTotalPrice * (rate / 100)) * 100) / 100;
      }

      totalTaxable += taxable;
      totalTax += tax;

      const existingHsn = hsnMap.get(hsn);
      if (existingHsn) {
        existingHsn.taxableAmount = Math.round((existingHsn.taxableAmount + taxable) * 100) / 100;
        existingHsn.taxAmount = Math.round((existingHsn.taxAmount + tax) * 100) / 100;
      } else {
        hsnMap.set(hsn, {
          hsnCode: hsn,
          taxRate: rate,
          taxableAmount: taxable,
          taxAmount: tax,
        });
      }
    }

    totalTaxable = Math.round(totalTaxable * 100) / 100;
    totalTax = Math.round(totalTax * 100) / 100;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isIntraState) {
      cgst = Math.round((totalTax / 2) * 100) / 100;
      sgst = Math.round((totalTax - cgst) * 100) / 100; // avoid 1-paisa rounding drift
      igst = 0;
    } else {
      cgst = 0;
      sgst = 0;
      igst = totalTax;
    }

    return {
      taxableAmount: totalTaxable,
      totalTax,
      cgst,
      sgst,
      igst,
      taxType: isIntraState ? 'INTRA_STATE' : 'INTER_STATE',
      hsnBreakdown: Array.from(hsnMap.values()),
    };
  }
}
