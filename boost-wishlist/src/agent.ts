import { BoostWishlist, wishlist as defaultWishlist } from './manager';

export interface WishlistAgentToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * Autonomous AI Agent Toolkit for Wishlist & Save-for-Later.
 * Compatible with OpenAI Function Calling, Anthropic Claude Tools, Google Gemini, and Vercel AI SDK.
 */
export class WishlistAgentToolkit {
  private manager: BoostWishlist;

  constructor(manager: BoostWishlist = defaultWishlist) {
    this.manager = manager;
  }

  /**
   * Universal JSON Schema tool declarations
   */
  public getTools(): WishlistAgentToolDefinition[] {
    return [
      {
        name: 'get_wishlist_items',
        description: 'Get all wishlisted items for the customer, optionally filtered by board ID, along with total item count and valuation.',
        parameters: {
          type: 'object',
          properties: {
            boardId: { type: 'string', description: 'Optional board ID to filter items (e.g. "default", "board_123").' }
          }
        }
      },
      {
        name: 'toggle_wishlist_item',
        description: 'Toggle saving an item to the customer wishlist (adds if absent, removes if already present).',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Unique product ID.' },
            variantId: { type: 'string', description: 'Optional variant ID (e.g. size/color).' },
            title: { type: 'string', description: 'Product title.' },
            price: { type: 'number', description: 'Current unit price.' },
            image: { type: 'string', description: 'Product image URL.' },
            boardId: { type: 'string', description: 'Target board ID (default "default").' }
          },
          required: ['productId', 'title', 'price']
        }
      },
      {
        name: 'check_price_drops',
        description: 'Compare wishlisted items against the live product catalog to detect price reductions or restocked items.',
        parameters: {
          type: 'object',
          properties: {
            catalog: {
              type: 'array',
              description: 'Array of products with id and current price.',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  price: { type: 'number' },
                  inStock: { type: 'boolean' }
                },
                required: ['id', 'price']
              }
            }
          },
          required: ['catalog']
        }
      },
      {
        name: 'move_item_to_cart',
        description: 'Transfer a wishlisted item directly into cart format for checkout, with optional auto-removal from wishlist.',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID to move.' },
            variantId: { type: 'string', description: 'Variant ID if applicable.' },
            quantity: { type: 'number', description: 'Quantity to add to cart (default 1).' },
            autoRemove: { type: 'boolean', description: 'Whether to remove from wishlist after moving (default true).' }
          },
          required: ['productId']
        }
      },
      {
        name: 'create_wishlist_board',
        description: 'Create a custom named wishlist collection or board (e.g. "Birthday Ideas", "Living Room Decor").',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name of the new board.' },
            description: { type: 'string', description: 'Optional description of the board.' },
            privacy: { type: 'string', enum: ['public', 'private', 'unlisted'], description: 'Board privacy setting.' }
          },
          required: ['name']
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
   * Autonomous router for tool executions
   */
  public async executeTool(name: string, args: Record<string, any>): Promise<any> {
    switch (name) {
      case 'get_wishlist_items': {
        const summary = this.manager.getSummary(args.boardId);
        const boards = this.manager.getBoards();
        return {
          totalCount: summary.totalCount,
          totalValue: summary.totalValue,
          items: summary.items,
          boards
        };
      }

      case 'toggle_wishlist_item': {
        const res = this.manager.toggleItem({
          productId: args.productId,
          variantId: args.variantId,
          title: args.title,
          price: Number(args.price),
          image: args.image,
          boardId: args.boardId
        });
        return {
          success: true,
          isWishlisted: res.isWishlisted,
          item: res.item,
          totalCount: this.manager.getItems().length
        };
      }

      case 'check_price_drops': {
        const alerts = this.manager.checkPriceDrops(args.catalog || []);
        return {
          alertsCount: alerts.length,
          alerts
        };
      }

      case 'move_item_to_cart': {
        const result = this.manager.moveToCart(args.productId, args.variantId, {
          autoRemove: args.autoRemove !== false,
          quantity: args.quantity || 1
        });
        if (!result) {
          return { success: false, error: `Item "${args.productId}" not found in wishlist.` };
        }
        return {
          success: true,
          cartItem: result.cartItem,
          remainingWishlistCount: result.remainingWishlistCount
        };
      }

      case 'create_wishlist_board': {
        const board = this.manager.createBoard(args.name, {
          description: args.description,
          privacy: args.privacy
        });
        return {
          success: true,
          board
        };
      }

      default:
        throw new Error(`Unknown wishlist agent tool: "${name}"`);
    }
  }
}
