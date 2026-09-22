import { BoostSearchIndex, searchIndex as defaultIndex } from './engine';
import { SearchFilters, SimilarProductOptions } from './types';

export interface AgentToolCallResult {
  toolName: string;
  success: boolean;
  data?: any;
  error?: string;
}

export class SearchAgentToolkit {
  /**
   * Universal tool definitions formatted for OpenAI Function Calling
   */
  static getOpenAITools() {
    return [
      {
        type: 'function',
        function: {
          name: 'search_products',
          description: 'Search eCommerce products with typo tolerance, category/brand filters, price range, and sort options.',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search keywords or product name (e.g. "oversized black hoodie")' },
              category: { type: 'string', description: 'Filter by product category (e.g. "Hoodies", "Footwear")' },
              brand: { type: 'string', description: 'Filter by brand name' },
              minPrice: { type: 'number', description: 'Minimum price filter' },
              maxPrice: { type: 'number', description: 'Maximum price filter' },
              inStockOnly: { type: 'boolean', description: 'Whether to restrict to in-stock items only' },
              minRating: { type: 'number', description: 'Minimum customer star rating (e.g. 4.0)' },
              sortBy: {
                type: 'string',
                enum: ['relevance', 'price_asc', 'price_desc', 'newest', 'rating'],
                description: 'Sorting criteria',
              },
              page: { type: 'number', description: 'Page number for pagination (default: 1)' },
              pageSize: { type: 'number', description: 'Number of items per page (default: 20)' },
            },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'autocomplete_suggestions',
          description: 'Get instant typeahead suggestions, matching search terms, top categories, and preview products for a partial query.',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Partial query prefix typed by user (e.g. "den")' },
              limit: { type: 'number', description: 'Maximum suggestions to return (default: 5)' },
            },
            required: ['query'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_filter_facets',
          description: 'Retrieve dynamic catalog facet breakdowns (available categories, brands, price boundaries, and attributes).',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Optional search query to scope facets to matched products' },
            },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'find_similar_products',
          description: 'Find similar and recommended products based on category, brand, and shared tags of a target item.',
          parameters: {
            type: 'object',
            properties: {
              productId: { type: 'string', description: 'Target product ID to find alternatives or recommendations for' },
              limit: { type: 'number', description: 'Number of recommendations to return (default: 4)' },
              matchCategory: { type: 'boolean', description: 'Require category matching (default: true)' },
              matchBrand: { type: 'boolean', description: 'Prefer same brand (default: false)' },
            },
            required: ['productId'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'did_you_mean',
          description: 'Detect typing errors or phonetic slips and suggest corrected search terms against catalog keywords.',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search phrase that produced few or zero results' },
            },
            required: ['query'],
          },
        },
      },
    ];
  }

  /**
   * Tool definitions formatted for Anthropic Claude
   */
  static getClaudeTools() {
    return this.getOpenAITools().map((tool) => ({
      name: tool.function.name,
      description: tool.function.description,
      input_schema: tool.function.parameters,
    }));
  }

  /**
   * Tool definitions formatted for Google Gemini function calling
   */
  static getGeminiTools() {
    return [
      {
        functionDeclarations: this.getOpenAITools().map((tool) => ({
          name: tool.function.name,
          description: tool.function.description,
          parameters: tool.function.parameters,
        })),
      },
    ];
  }

  /**
   * Tool definitions for Vercel AI SDK (`ai`)
   */
  static getVercelAITools(indexInstance?: BoostSearchIndex) {
    const idx = indexInstance || defaultIndex;
    return {
      search_products: {
        description: 'Search eCommerce products with typo tolerance and facets.',
        execute: async (params: SearchFilters) => {
          return SearchAgentToolkit.executeTool('search_products', params, idx);
        },
      },
      autocomplete_suggestions: {
        description: 'Typeahead query suggestions and preview products.',
        execute: async (params: { query: string; limit?: number }) => {
          return SearchAgentToolkit.executeTool('autocomplete_suggestions', params, idx);
        },
      },
      get_filter_facets: {
        description: 'Extract available categories, brands, and price bounds.',
        execute: async (params: { query?: string }) => {
          return SearchAgentToolkit.executeTool('get_filter_facets', params, idx);
        },
      },
      find_similar_products: {
        description: 'Recommend products similar to a target item.',
        execute: async (params: { productId: string; limit?: number; matchCategory?: boolean; matchBrand?: boolean }) => {
          return SearchAgentToolkit.executeTool('find_similar_products', params, idx);
        },
      },
      did_you_mean: {
        description: 'Check spelling and propose typo corrections.',
        execute: async (params: { query: string }) => {
          return SearchAgentToolkit.executeTool('did_you_mean', params, idx);
        },
      },
    };
  }

  /**
   * Universal Tool Executor for AI Agents
   */
  static async executeTool(
    toolName: string,
    params: any,
    indexInstance?: BoostSearchIndex
  ): Promise<AgentToolCallResult> {
    const idx = indexInstance || defaultIndex;

    try {
      switch (toolName) {
        case 'search_products': {
          const result = idx.search(params as SearchFilters);
          return {
            toolName,
            success: true,
            data: {
              total: result.total,
              page: result.page,
              pageSize: result.pageSize,
              totalPages: result.totalPages,
              didYouMean: result.didYouMean,
              products: result.products.map((p) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                brand: p.brand,
                category: p.category,
                inStock: p.inStock,
                rating: p.rating,
              })),
              facets: result.facets,
            },
          };
        }

        case 'autocomplete_suggestions': {
          const suggestions = idx.suggest(params.query || '', params.limit || 5);
          return {
            toolName,
            success: true,
            data: suggestions,
          };
        }

        case 'get_filter_facets': {
          const searchRes = idx.search({ query: params.query, pageSize: 1 });
          return {
            toolName,
            success: true,
            data: searchRes.facets,
          };
        }

        case 'find_similar_products': {
          const similar = idx.findSimilar(params.productId, params as SimilarProductOptions);
          return {
            toolName,
            success: true,
            data: {
              targetProductId: params.productId,
              similarProducts: similar.map((p) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                brand: p.brand,
                category: p.category,
              })),
            },
          };
        }

        case 'did_you_mean': {
          const dym = idx.didYouMean(params.query || '');
          return {
            toolName,
            success: true,
            data: dym,
          };
        }

        default:
          return {
            toolName,
            success: false,
            error: `Unknown tool name: ${toolName}`,
          };
      }
    } catch (err: any) {
      return {
        toolName,
        success: false,
        error: err?.message || String(err),
      };
    }
  }
}
