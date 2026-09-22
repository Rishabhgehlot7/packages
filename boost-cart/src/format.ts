import { CurrencyConfig, FormattedCartSummary } from './types';

export class CurrencyFormatter {
  private config: Required<CurrencyConfig>;

  constructor(config: CurrencyConfig = {}) {
    this.config = {
      code: config.code || 'INR',
      symbol: config.symbol || '₹',
      locale: config.locale || 'en-IN',
      fractionDigits: config.fractionDigits !== undefined ? config.fractionDigits : 2,
    };
  }

  /**
   * Formats a raw number into a localized currency string
   * Example: 1499.5 -> "₹1,499.50"
   */
  format(amount: number): string {
    const safeAmount = isNaN(amount) ? 0 : amount;
    try {
      const formattedNumber = new Intl.NumberFormat(this.config.locale, {
        minimumFractionDigits: this.config.fractionDigits,
        maximumFractionDigits: this.config.fractionDigits,
      }).format(safeAmount);

      return `${this.config.symbol}${formattedNumber}`;
    } catch {
      return `${this.config.symbol}${safeAmount.toFixed(this.config.fractionDigits)}`;
    }
  }

  /**
   * Generates formatted strings for all summary values
   */
  formatSummary(raw: {
    subtotal: number;
    totalMRP: number;
    totalSavings: number;
    discountAmount: number;
    shippingFee: number;
    codFee: number;
    prepaidDiscount: number;
    totalCustomFees: number;
    totalTax: number;
    cgst: number;
    sgst: number;
    igst: number;
    finalTotal: number;
  }): FormattedCartSummary {
    return {
      subtotal: this.format(raw.subtotal),
      totalMRP: this.format(raw.totalMRP),
      totalSavings: this.format(raw.totalSavings),
      discountAmount: this.format(raw.discountAmount),
      shippingFee: raw.shippingFee === 0 ? 'FREE' : this.format(raw.shippingFee),
      codFee: this.format(raw.codFee),
      prepaidDiscount: this.format(raw.prepaidDiscount),
      totalCustomFees: this.format(raw.totalCustomFees),
      totalTax: this.format(raw.totalTax),
      cgst: this.format(raw.cgst),
      sgst: this.format(raw.sgst),
      igst: this.format(raw.igst),
      finalTotal: this.format(raw.finalTotal),
    };
  }
}
