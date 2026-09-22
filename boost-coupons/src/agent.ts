/**
 * AI Agent Toolkit for eCommerce Coupons, Discounts & Promotions
 * Ready-to-use function calling schemas and execution handlers for AI Agents
 * (Google Gemini, OpenAI, Claude, LangChain, Antigravity).
 */

import { CouponEngine } from './engine';
import { BoostCartLike, CartContext, CouponRule } from './types';

export interface AgentToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export class CouponAgentToolkit {
  constructor(private readonly catalog: CouponRule[] = []) {}

  /**
   * Returns standard OpenAI/Gemini/JSON Schema tool declarations for LLM function calling
   */
  public getToolDefinitions(): AgentToolDefinition[] {
    return [
      {
        name: 'validateCouponCode',
        description: 'Verify if a promo code or coupon is valid for the customer shopping cart, and calculate the discount savings.',
        parameters: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Promo code entered by user (e.g. SAVE20, FIRST100, BOGO)' },
            subtotal: { type: 'number', description: 'Cart subtotal amount in Rupees' },
            paymentMode: { type: 'string', enum: ['Prepaid', 'COD'], description: 'Payment method selected' },
            isFirstOrder: { type: 'boolean', description: 'Whether customer is making their first purchase' },
          },
          required: ['code', 'subtotal'],
        },
      },
      {
        name: 'autoApplyBestCoupon',
        description: 'Automatically scan all active promotional offers and select the single best coupon that saves the customer the most money.',
        parameters: {
          type: 'object',
          properties: {
            subtotal: { type: 'number', description: 'Cart subtotal amount in Rupees' },
            paymentMode: { type: 'string', enum: ['Prepaid', 'COD'], description: 'Payment mode' },
          },
          required: ['subtotal'],
        },
      },
      {
        name: 'getMotivationalUpsellDeals',
        description: 'Recommend locked discounts and tell the customer exactly how much more to add to cart to unlock extra savings.',
        parameters: {
          type: 'object',
          properties: {
            subtotal: { type: 'number', description: 'Current cart subtotal' },
            itemCount: { type: 'number', description: 'Total quantity of items in cart' },
          },
          required: ['subtotal'],
        },
      },
    ];
  }

  /**
   * Executes a tool invoked by the AI agent
   */
  public async executeTool(name: string, args: Record<string, any>): Promise<any> {
    const cart: CartContext = {
      items: [
        {
          price: Number(args.subtotal) || 1000,
          quantity: Number(args.itemCount) || 1,
        },
      ],
      subtotal: Number(args.subtotal) || 0,
      paymentMode: args.paymentMode || 'Prepaid',
      customer: {
        isFirstOrder: args.isFirstOrder !== undefined ? Boolean(args.isFirstOrder) : undefined,
      },
    };

    switch (name) {
      case 'validateCouponCode': {
        const code = String(args.code).toUpperCase().trim();
        const rule = this.catalog.find((c) => c.code.toUpperCase() === code);

        if (!rule) {
          // If not in catalog, test standard simulation fallback
          return {
            isValid: false,
            couponCode: code,
            reason: `Promo code '${code}' is invalid or expired.`,
          };
        }

        return CouponEngine.apply(rule, cart);
      }

      case 'autoApplyBestCoupon': {
        const result = CouponEngine.autoApplyBest(this.catalog, cart);
        if (result.bestCoupon) {
          return {
            bestCouponCode: result.bestCoupon.couponCode,
            discountSavings: result.bestCoupon.discountAmount,
            finalCartTotal: result.bestCoupon.finalTotal,
            freeShippingApplied: result.bestCoupon.freeShippingApplied,
          };
        }
        return {
          bestCouponCode: null,
          message: 'No eligible coupons found for the current cart value.',
        };
      }

      case 'getMotivationalUpsellDeals': {
        return CouponEngine.getUpsellHints(this.catalog, cart);
      }

      default:
        throw new Error(`Unknown coupon agent tool: '${name}'`);
    }
  }

  /**
   * Generates sample active coupons for testing shopping bots offline
   */
  public static getSampleDeals(): CouponRule[] {
    return [
      {
        code: 'WELCOME100',
        discountType: 'FLAT',
        discountValue: 100,
        minSubtotal: 499,
        firstOrderOnly: true,
      },
      {
        code: 'MEGA20',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        maxDiscount: 500,
        minSubtotal: 1500,
      },
      {
        code: 'FREESHIP',
        discountType: 'FREE_SHIPPING',
        discountValue: 0,
        minSubtotal: 999,
      },
      {
        code: 'PREPAID50',
        discountType: 'FLAT',
        discountValue: 50,
        applicablePaymentMode: 'Prepaid',
      },
    ];
  }
}
