import { ReviewsEngine } from './engine';
import { ProductReview, ReviewSubmissionInput } from './types';

export interface AgentToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * ReviewsAgentToolkit
 *
 * Provides ready-to-use function calling schemas and execution methods for:
 * - OpenAI Function Calling / Tools
 * - Anthropic Claude Tools
 * - Google Gemini Function Declarations
 * - Vercel AI SDK / LangChain / Cursor / Windsurf
 */
export class ReviewsAgentToolkit {
  /**
   * Universal Agent Tool Definitions (JSON Schema compliant)
   */
  public getDeclarations(): AgentToolDeclaration[] {
    return [
      {
        name: 'analyze_product_reviews',
        description:
          'Analyze an array of customer reviews for a product to calculate statistical star ratings, sentiment percentages, key positive/negative tags, and generate an executive summary.',
        parameters: {
          type: 'object',
          properties: {
            reviews: {
              type: 'array',
              description: 'List of product review objects.',
              items: {
                type: 'object',
                properties: {
                  rating: { type: 'number' },
                  author: { type: 'string' },
                  body: { type: 'string' },
                  title: { type: 'string' },
                },
                required: ['rating', 'author', 'body'],
              },
            },
          },
          required: ['reviews'],
        },
      },
      {
        name: 'submit_customer_review',
        description:
          'Submit a new customer product review with automated profanity check, spam detection, and star rating validation.',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID being reviewed.' },
            author: { type: 'string', description: 'Reviewer name or nickname.' },
            rating: { type: 'number', minimum: 1, maximum: 5, description: 'Star rating from 1 to 5.' },
            title: { type: 'string', description: 'Review headline or short title.' },
            body: { type: 'string', description: 'Detailed review content.' },
            verifiedBuyer: { type: 'boolean', description: 'Whether the reviewer has verified order purchase history.' },
            images: { type: 'array', items: { type: 'string' }, description: 'URLs of uploaded review photos.' },
            videos: { type: 'array', items: { type: 'string' }, description: 'URLs of uploaded review videos.' },
          },
          required: ['productId', 'author', 'rating', 'body'],
        },
      },
      {
        name: 'moderate_review',
        description:
          'Scan and sanitize review content for abusive profanity, offensive language, spam URLs, and repeated characters.',
        parameters: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'The review title or body text to audit.' },
          },
          required: ['text'],
        },
      },
      {
        name: 'generate_merchant_reply',
        description:
          'Craft a professional, brand-aligned merchant reply addressing customer praise, concerns, or defects.',
        parameters: {
          type: 'object',
          properties: {
            author: { type: 'string', description: 'Customer name.' },
            rating: { type: 'number', description: 'Customer rating (1-5).' },
            reviewBody: { type: 'string', description: 'Customer review text.' },
            merchantName: { type: 'string', description: 'Brand or Store Name.' },
          },
          required: ['author', 'rating', 'reviewBody'],
        },
      },
      {
        name: 'generate_rich_snippets',
        description:
          'Generate valid Schema.org Product and AggregateRating JSON-LD for Google Search Rich Results (star ratings in SERP).',
        parameters: {
          type: 'object',
          properties: {
            productName: { type: 'string', description: 'Name of the product.' },
            price: { type: 'number', description: 'Price in local currency.' },
            currency: { type: 'string', description: 'Currency code (e.g. INR, USD).' },
            reviews: {
              type: 'array',
              description: 'Array of customer reviews.',
              items: {
                type: 'object',
                properties: {
                  rating: { type: 'number' },
                  author: { type: 'string' },
                  body: { type: 'string' },
                  createdAt: { type: 'string' },
                },
                required: ['rating', 'author', 'body'],
              },
            },
          },
          required: ['productName', 'reviews'],
        },
      },
    ];
  }

  /**
   * OpenAI Tools Format
   */
  public getOpenAITools() {
    return this.getDeclarations().map((tool) => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }

  /**
   * Anthropic Claude Tools Format
   */
  public getAnthropicTools() {
    return this.getDeclarations().map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters,
    }));
  }

  /**
   * Google Gemini API Tool Declarations Format
   */
  public getGeminiTools() {
    return [
      {
        functionDeclarations: this.getDeclarations().map((tool) => ({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        })),
      },
    ];
  }

  /**
   * Vercel AI SDK Tool Format
   */
  public getVercelAITools() {
    const toolsObj: Record<string, any> = {};
    for (const tool of this.getDeclarations()) {
      toolsObj[tool.name] = {
        description: tool.description,
        parameters: tool.parameters,
        execute: async (args: any) => this.execute(tool.name, args),
      };
    }
    return toolsObj;
  }

  /**
   * Execute an Agent Tool Invocation by Name
   */
  public async execute(toolName: string, args: Record<string, any>): Promise<any> {
    switch (toolName) {
      case 'analyze_product_reviews': {
        const reviews = (args.reviews || []) as ProductReview[];
        const breakdown = ReviewsEngine.calculateBreakdown(reviews);
        const sentiment = ReviewsEngine.analyzeSentiment(reviews);
        return {
          breakdown,
          sentiment,
        };
      }

      case 'submit_customer_review': {
        const input = args as ReviewSubmissionInput;
        return ReviewsEngine.quickSubmit(input);
      }

      case 'moderate_review': {
        return ReviewsEngine.moderateReview(args.text || '');
      }

      case 'generate_merchant_reply': {
        const { author, rating, reviewBody, merchantName } = args;
        const brand = merchantName || 'Store Team';
        let replyText = '';

        if (rating >= 4) {
          replyText = `Thank you so much for your wonderful feedback, ${author}! We are thrilled to hear that you loved your purchase. Warm regards, ${brand}.`;
        } else if (rating === 3) {
          replyText = `Hi ${author}, thank you for your honest feedback! We strive for 100% satisfaction and would love to make this even better for you. Please reach out to our support team so we can assist. - ${brand}`;
        } else {
          replyText = `Hi ${author}, we are truly sorry that your experience did not meet expectations. Your satisfaction is our top priority. Please contact our dedicated resolution team directly so we can make this right immediately. - ${brand}`;
        }

        return {
          reply: {
            author: brand,
            body: replyText,
            date: new Date().toISOString().split('T')[0],
          },
        };
      }

      case 'generate_rich_snippets': {
        const { productName, price, currency, reviews } = args;
        return ReviewsEngine.generateFullJSONLD({
          product: {
            name: productName,
            price,
            currency: currency || 'INR',
          },
          reviews: (reviews || []) as ProductReview[],
        });
      }

      default:
        throw new Error(`Unknown reviews agent tool: ${toolName}`);
    }
  }
}

export const agentToolkit = new ReviewsAgentToolkit();
