import { CartItem, DiscountRule, CartSummary } from './types';
import { BoostCart } from './cart';

/**
 * AI Agent Introspection & Diagnostics Toolkit
 * Enables autonomous coding agents and LLM chatbots to inspect, validate,
 * and format cart state effortlessly.
 */
export class CartAgentToolkit {
  /**
   * Generates a concise, LLM-friendly markdown report of the current cart
   */
  static inspect(cart: BoostCart): string {
    const s = cart.getSummary();
    const itemsList = s.items
      .map(
        (i, idx) =>
          `  ${idx + 1}. [${i.id}] "${i.title}" x ${i.quantity} @ ${i.price} (HSN: ${i.hsnCode || 'N/A'}, GST: ${i.taxRate ?? 18}%)`
      )
      .join('\n');

    return [
      `🛒 **BoostCart State Report**`,
      `Items (${s.totalQuantity} units across ${s.itemCount} distinct products):`,
      itemsList || '  (Cart is empty)',
      `\n📊 **Financials**:`,
      `- Subtotal: ${s.formatted.subtotal}`,
      `- Total MRP: ${s.formatted.totalMRP}`,
      `- Total Customer Savings: ${s.formatted.totalSavings}`,
      s.discount ? `- Discount Applied: ${s.discount.code} (-${s.formatted.discountAmount})` : `- Discount: None`,
      `- Shipping Fee: ${s.formatted.shippingFee} (${s.freeShipping.message})`,
      s.codFee > 0 ? `- COD Fee: ${s.formatted.codFee}` : null,
      s.prepaidDiscount > 0 ? `- Prepaid Instant Cashback: -${s.formatted.prepaidDiscount}` : null,
      `- Indian GST (${s.gst.taxType}): ${s.formatted.totalTax} (CGST: ${s.formatted.cgst}, SGST: ${s.formatted.sgst}, IGST: ${s.formatted.igst})`,
      `---------------------------------`,
      `💰 **Final Payable Total: ${s.formatted.finalTotal}**`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  /**
   * Validates an item object before passing to addItem, giving agents actionable hints
   */
  static validateItem(item: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!item || typeof item !== 'object') {
      return { valid: false, errors: ['Item must be an object'] };
    }
    if (!item.productId) errors.push('Missing required property: "productId"');
    if (!item.title) errors.push('Missing required property: "title"');
    if (typeof item.price !== 'number' || isNaN(item.price) || item.price < 0) {
      errors.push('Property "price" must be a non-negative number');
    }
    if (item.quantity !== undefined && (typeof item.quantity !== 'number' || item.quantity < 1)) {
      errors.push('Property "quantity" must be an integer >= 1');
    }
    if (item.taxRate !== undefined && (typeof item.taxRate !== 'number' || item.taxRate < 0 || item.taxRate > 100)) {
      errors.push('Property "taxRate" must be a percentage between 0 and 100');
    }

    return { valid: errors.length === 0, errors };
  }
}
