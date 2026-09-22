import { BoostDealsManager, deals as defaultDeals } from './engine';

export interface DealsAgentToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * Autonomous AI Agent Toolkit for Deals & Promotions.
 * Compatible with OpenAI Function Calling, Anthropic Claude Tools, Google Gemini, and Vercel AI SDK.
 */
export class DealsAgentToolkit {
  private manager: BoostDealsManager;

  constructor(manager: BoostDealsManager = defaultDeals) {
    this.manager = manager;
  }

  /**
   * Return array of tool definitions in universal JSON Schema format.
   */
  public getTools(): DealsAgentToolDefinition[] {
    return [
      {
        name: 'list_active_deals',
        description: 'List all currently active promotional deals, flash sales, BOGO, and volume discounts with claim limits and time remaining.',
        parameters: {
          type: 'object',
          properties: {},
        }
      },
      {
        name: 'get_product_deal',
        description: 'Find the best applicable deal and discounted price for a specific product item.',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Unique ID of the product.' },
            originalPrice: { type: 'number', description: 'Original retail price of the product.' },
            category: { type: 'string', description: 'Product category (optional).' }
          },
          required: ['productId', 'originalPrice']
        }
      },
      {
        name: 'evaluate_cart_deals',
        description: 'Evaluate optimal promotional savings across an entire shopping cart (Flash sales, BOGO, tiered volume, and spend thresholds).',
        parameters: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              description: 'List of items in the cart to evaluate.',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  unitPrice: { type: 'number' },
                  quantity: { type: 'number' },
                  category: { type: 'string' },
                  title: { type: 'string' }
                },
                required: ['productId', 'unitPrice', 'quantity']
              }
            }
          },
          required: ['items']
        }
      },
      {
        name: 'reserve_deal_claim',
        description: 'Temporarily lock and reserve a lightning deal claim for a user with TTL hold during checkout.',
        parameters: {
          type: 'object',
          properties: {
            dealId: { type: 'string', description: 'ID of the deal to claim.' },
            userId: { type: 'string', description: 'ID of the customer reserving the claim.' },
            quantity: { type: 'number', description: 'Number of units claiming (default 1).' },
            ttlSeconds: { type: 'number', description: 'Hold duration in seconds (default 600s).' }
          },
          required: ['dealId', 'userId']
        }
      },
      {
        name: 'release_deal_claim',
        description: 'Release a previously reserved deal claim if checkout is cancelled.',
        parameters: {
          type: 'object',
          properties: {
            reservationId: { type: 'string', description: 'Reservation ID to release.' }
          },
          required: ['reservationId']
        }
      }
    ];
  }

  /**
   * OpenAI Tool Specs
   */
  public toOpenAITools() {
    return this.getTools().map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }
    }));
  }

  /**
   * Anthropic Claude Tool Specs
   */
  public toClaudeTools() {
    return this.getTools().map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters
    }));
  }

  /**
   * Google Gemini Tool Declarations
   */
  public toGeminiTools() {
    return [{
      functionDeclarations: this.getTools().map(t => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }))
    }];
  }

  /**
   * Execute an agent tool call automatically.
   */
  public async executeTool(name: string, args: Record<string, any>): Promise<any> {
    switch (name) {
      case 'list_active_deals': {
        const deals = this.manager.listActiveDeals();
        return {
          count: deals.length,
          deals: deals.map(d => ({
            id: d.id,
            title: d.title,
            type: d.type,
            discountValue: d.discountValue,
            startDate: d.startDate,
            endDate: d.endDate,
            claimedCount: d.claimedCount || 0,
            totalLimit: d.totalClaimLimit
          }))
        };
      }

      case 'get_product_deal': {
        const { productId, originalPrice, category } = args;
        return this.manager.computeProductDeal(productId, Number(originalPrice), category);
      }

      case 'evaluate_cart_deals': {
        const { items } = args;
        return this.manager.evaluateCartDeals(items || []);
      }

      case 'reserve_deal_claim': {
        const { dealId, userId, quantity, ttlSeconds } = args;
        try {
          const reservation = this.manager.reserveClaim(dealId, userId, quantity || 1, ttlSeconds);
          return { success: true, reservation };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      }

      case 'release_deal_claim': {
        const { reservationId } = args;
        const released = this.manager.releaseClaim(reservationId);
        return { success: released };
      }

      default:
        throw new Error(`Unknown deal agent tool: ${name}`);
    }
  }
}
