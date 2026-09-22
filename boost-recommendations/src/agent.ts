import { BoostRecommendationsManager, recommendations as defaultRecommendations, RecommendationsEngine } from './engine';
import { ProductRecommendationItem } from './types';

export interface RecommendationsAgentToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * Autonomous AI Agent Toolkit for Product Recommendations & Upsells.
 * Compatible with OpenAI Function Calling, Anthropic Claude Tools, Google Gemini, and Vercel AI SDK.
 */
export class RecommendationsAgentToolkit {
  private manager: BoostRecommendationsManager;

  constructor(manager: BoostRecommendationsManager = defaultRecommendations) {
    this.manager = manager;
  }

  /**
   * Universal JSON Schema tool declarations
   */
  public getTools(): RecommendationsAgentToolDefinition[] {
    return [
      {
        name: 'get_frequently_bought_together',
        description: 'Generate an Amazon-style Frequently Bought Together bundle combo with combined bundle price, discount percentage, and total savings.',
        parameters: {
          type: 'object',
          properties: {
            mainProduct: {
              type: 'object',
              description: 'The target product for which to build the bundle combo.',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                price: { type: 'number' },
                category: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } }
              },
              required: ['id', 'title', 'price', 'category']
            },
            catalog: {
              type: 'array',
              description: 'Product catalog to search for complementary items.',
              items: { type: 'object' }
            },
            maxItems: { type: 'number', description: 'Maximum bundle accessories to attach (default 2).' },
            discountPercentage: { type: 'number', description: 'Bundle discount percentage (default 10%).' }
          },
          required: ['mainProduct']
        }
      },
      {
        name: 'get_cart_cross_sells',
        description: 'Recommend high-converting impulse add-ons, accessories, and warranties for products currently in the customer cart.',
        parameters: {
          type: 'object',
          properties: {
            cartItems: {
              type: 'array',
              description: 'Items currently in the customer cart.',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  category: { type: 'string' },
                  price: { type: 'number' }
                },
                required: ['id']
              }
            },
            catalog: {
              type: 'array',
              description: 'Product catalog.',
              items: { type: 'object' }
            },
            limit: { type: 'number', description: 'Number of cross-sells to return (default 3).' }
          },
          required: ['cartItems']
        }
      },
      {
        name: 'get_similar_products',
        description: 'Find alternative products similar to a target product (Customers who viewed this also viewed).',
        parameters: {
          type: 'object',
          properties: {
            targetProduct: {
              type: 'object',
              description: 'Target product to find alternatives for.',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                price: { type: 'number' },
                category: { type: 'string' }
              },
              required: ['id', 'price', 'category']
            },
            catalog: {
              type: 'array',
              description: 'Product catalog.',
              items: { type: 'object' }
            },
            limit: { type: 'number', description: 'Number of items to return (default 4).' }
          },
          required: ['targetProduct']
        }
      },
      {
        name: 'get_personalized_picks',
        description: 'Generate personalized product recommendations based on a user browsing or view history.',
        parameters: {
          type: 'object',
          properties: {
            viewHistoryIds: {
              type: 'array',
              description: 'List of product IDs the user recently viewed.',
              items: { type: 'string' }
            },
            catalog: {
              type: 'array',
              description: 'Product catalog.',
              items: { type: 'object' }
            },
            limit: { type: 'number', description: 'Number of recommendations (default 4).' }
          },
          required: ['viewHistoryIds', 'catalog']
        }
      },
      {
        name: 'get_product_upgrades',
        description: 'Find higher-tier, premium upsell alternatives within the same product category (e.g. 128GB -> 256GB, Standard -> Pro).',
        parameters: {
          type: 'object',
          properties: {
            product: {
              type: 'object',
              description: 'Current product being considered.',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                price: { type: 'number' },
                category: { type: 'string' },
                rating: { type: 'number' }
              },
              required: ['id', 'price', 'category']
            },
            catalog: {
              type: 'array',
              description: 'Product catalog.',
              items: { type: 'object' }
            },
            limit: { type: 'number', description: 'Max upgrades to return (default 2).' }
          },
          required: ['product']
        }
      }
    ];
  }

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

  public toClaudeTools() {
    return this.getTools().map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters
    }));
  }

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
   * Autonomous router for tool execution
   */
  public async executeTool(name: string, args: Record<string, any>): Promise<any> {
    switch (name) {
      case 'get_frequently_bought_together': {
        const { mainProduct, catalog, maxItems, discountPercentage } = args;
        return this.manager.getFrequentlyBoughtTogether(mainProduct, catalog, {
          maxItems,
          discountPercentage
        });
      }

      case 'get_cart_cross_sells': {
        const { cartItems, catalog, limit } = args;
        return this.manager.getCartCrossSells(cartItems, catalog, { limit });
      }

      case 'get_similar_products': {
        const { targetProduct, catalog, limit } = args;
        return RecommendationsEngine.getSimilarProducts(targetProduct, catalog, limit || 4);
      }

      case 'get_personalized_picks': {
        const { viewHistoryIds, catalog, limit } = args;
        return RecommendationsEngine.getPersonalizedPicks(viewHistoryIds, catalog, limit || 4);
      }

      case 'get_product_upgrades': {
        const { product, catalog, limit } = args;
        return this.manager.getUpgrades(product, catalog, { limit });
      }

      default:
        throw new Error(`Unknown recommendations agent tool: "${name}"`);
    }
  }
}
