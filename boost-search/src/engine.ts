import {
  SearchableProduct,
  SearchFilters,
  SearchResult,
  FacetValue,
  SearchIndexOptions,
  FieldWeights,
  SynonymDictionary,
  AutocompleteSuggestion,
  SimilarProductOptions,
  DidYouMeanResult,
  ProductDataMapper,
} from './types';
import { matchesToken, damerauLevenshtein } from './fuzzy';

export const DEFAULT_STOPWORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'of', 'to', 'from', 'by', 'is', 'it'
]);

export const DEFAULT_WEIGHTS: Required<FieldWeights> = {
  title: 3.0,
  sku: 2.5,
  brand: 2.0,
  category: 1.5,
  tags: 1.2,
  description: 0.5,
};

/**
 * High-performance In-Memory Inverted Search Index
 * Supports fast incremental additions, updates, multi-faceted filtering, suggestions, and recommendations
 */
export class BoostSearchIndex<T extends SearchableProduct = SearchableProduct> {
  private products = new Map<string, T>();
  private synonyms: SynonymDictionary;
  private weights: FieldWeights;
  private stopwords: Set<string>;
  private termFrequency = new Map<string, number>();

  constructor(options: SearchIndexOptions = {}, initialProducts: T[] = []) {
    this.synonyms = options.synonyms || {
      pants: ['trousers', 'jeans', 'bottoms'],
      trousers: ['pants', 'jeans'],
      jeans: ['pants', 'denim'],
      tee: ['t-shirt', 'tshirt', 'top'],
      tshirt: ['tee', 't-shirt'],
      hoodie: ['sweatshirt', 'pullover', 'jacket'],
      sneakers: ['shoes', 'trainers', 'kicks'],
      shoes: ['sneakers', 'footwear'],
      phone: ['mobile', 'smartphone', 'cellphone'],
      laptop: ['notebook', 'computer', 'macbook'],
    };
    this.weights = { ...DEFAULT_WEIGHTS, ...options.weights };
    this.stopwords = new Set(options.stopwords || DEFAULT_STOPWORDS);

    if (initialProducts.length > 0) {
      this.add(initialProducts);
    }
  }

  /**
   * Adds one or multiple products to the search index
   */
  add(productsOrItem: T | T[]): void {
    const items = Array.isArray(productsOrItem) ? productsOrItem : [productsOrItem];
    for (const item of items) {
      this.products.set(item.id, item);
      this.indexItemTerms(item);
    }
  }

  /**
   * Updates an existing product in the index
   */
  update(product: T): void {
    this.add(product);
  }

  /**
   * Upsert helper: adds or updates a product (e.g. from a database change stream, Prisma, or webhook)
   */
  upsert(product: T): void {
    this.add(product);
  }

  /**
   * Universal Database Sync: syncs products from ANY database (MongoDB, PostgreSQL, Prisma, Supabase, Firestore, Redis)
   * Accepts raw database documents or an async fetcher function, with an optional mapper to transform documents.
   */
  async sync<TRaw = any>(
    source: TRaw[] | (() => Promise<TRaw[]> | TRaw[]),
    mapper?: ProductDataMapper<TRaw, T>
  ): Promise<number> {
    const rawItems = typeof source === 'function' ? await source() : source;
    const transformed = mapper
      ? rawItems.map(mapper)
      : (rawItems as unknown as T[]);

    this.add(transformed);
    return transformed.length;
  }

  /**
   * Removes a product from the index by ID
   */
  remove(id: string): boolean {
    return this.products.delete(id);
  }

  /**
   * Retrieves a single product by ID
   */
  get(id: string): T | undefined {
    return this.products.get(id);
  }

  /**
   * Returns all indexed products
   */
  getAll(): T[] {
    return Array.from(this.products.values());
  }

  /**
   * Clears the entire index
   */
  clear(): void {
    this.products.clear();
    this.termFrequency.clear();
  }

  /**
   * Returns total number of indexed products
   */
  get size(): number {
    return this.products.size;
  }

  private indexItemTerms(item: T): void {
    const text = [
      item.title,
      item.brand,
      item.category,
      item.sku,
      ...(item.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const tokens = text.split(/\s+/).filter((t) => t.length > 2 && !this.stopwords.has(t));
    for (const token of tokens) {
      this.termFrequency.set(token, (this.termFrequency.get(token) || 0) + 1);
    }
  }

  /**
   * Expands query tokens using the configured synonym dictionary
   */
  private expandTokensWithSynonyms(token: string): string[] {
    const clean = token.toLowerCase().trim();
    const result = new Set<string>([clean]);

    if (this.synonyms[clean]) {
      for (const syn of this.synonyms[clean]) {
        result.add(syn.toLowerCase());
      }
    }

    return Array.from(result);
  }

  /**
   * Executes typo-tolerant instant search with multi-faceted filtering, sorting, and facet extractions
   */
  search(filters: SearchFilters = {}): SearchResult<T> {
    const rawQuery = filters.query ? filters.query.trim().toLowerCase() : '';
    const queryTokens = rawQuery
      ? rawQuery
          .split(/\s+/)
          .filter((t) => Boolean(t) && !this.stopwords.has(t))
      : [];

    let scoredItems: Array<{ item: T; score: number }> = [];

    const products = Array.from(this.products.values());

    for (const p of products) {
      let totalScore = 0;
      let matchedAllTokens = true;

      if (queryTokens.length > 0) {
        for (const token of queryTokens) {
          const expandedTokens = this.expandTokensWithSynonyms(token);
          let tokenMaxScore = 0;

          for (const expanded of expandedTokens) {
            // 1. Check title
            const titleWords = p.title.toLowerCase().split(/\s+/);
            for (const word of titleWords) {
              const m = matchesToken(word, expanded);
              if (m.matches) {
                tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.title || 3.0));
              }
            }

            // 2. Check SKU
            if (p.sku) {
              const m = matchesToken(p.sku, expanded);
              if (m.matches) {
                tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.sku || 2.5));
              }
            }

            // 3. Check Brand
            if (p.brand) {
              const m = matchesToken(p.brand, expanded);
              if (m.matches) {
                tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.brand || 2.0));
              }
            }

            // 4. Check Category
            if (p.category) {
              const m = matchesToken(p.category, expanded);
              if (m.matches) {
                tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.category || 1.5));
              }
            }

            // 5. Check Tags
            if (p.tags && p.tags.length > 0) {
              for (const tag of p.tags) {
                const m = matchesToken(tag, expanded);
                if (m.matches) {
                  tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.tags || 1.2));
                }
              }
            }

            // 6. Check Description
            if (p.description && p.description.toLowerCase().includes(expanded)) {
              tokenMaxScore = Math.max(tokenMaxScore, 2.0 * (this.weights.description || 0.5));
            }
          }

          if (tokenMaxScore === 0) {
            matchedAllTokens = false;
            break;
          }

          totalScore += tokenMaxScore;
        }

        if (!matchedAllTokens) {
          continue;
        }
      } else {
        totalScore = 1; // Base score when no query is specified
      }

      scoredItems.push({ item: p, score: totalScore });
    }

    // 2. Faceted Filters
    let filtered = scoredItems.filter(({ item }) => {
      // In-stock filter
      if (filters.inStockOnly && !item.inStock) {
        return false;
      }

      // Price filter
      if (filters.minPrice !== undefined && item.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && item.price > filters.maxPrice) {
        return false;
      }

      // Rating filter
      const itemRating = typeof item.rating === 'object' ? item.rating?.value || 0 : item.rating || 0;
      if (filters.minRating !== undefined && itemRating < filters.minRating) {
        return false;
      }

      // Category filter (string or array)
      if (filters.category) {
        const allowedCats = Array.isArray(filters.category)
          ? filters.category.map((c) => c.toLowerCase())
          : [filters.category.toLowerCase()];
        if (!item.category || !allowedCats.includes(item.category.toLowerCase())) {
          return false;
        }
      }

      // Brand filter (string or array)
      if (filters.brand) {
        const allowedBrands = Array.isArray(filters.brand)
          ? filters.brand.map((b) => b.toLowerCase())
          : [filters.brand.toLowerCase()];
        if (!item.brand || !allowedBrands.includes(item.brand.toLowerCase())) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags) {
        const reqTags = Array.isArray(filters.tags) ? filters.tags.map((t) => t.toLowerCase()) : [filters.tags.toLowerCase()];
        const itemTags = (item.tags || []).map((t) => t.toLowerCase());
        const hasTag = reqTags.some((t) => itemTags.includes(t));
        if (!hasTag) return false;
      }

      // Attributes filter (e.g. size, color)
      if (filters.attributes && item.attributes) {
        for (const [attrKey, attrVal] of Object.entries(filters.attributes)) {
          const itemAttrVal = item.attributes[attrKey];
          if (!itemAttrVal) return false;

          const requiredVals = Array.isArray(attrVal) ? attrVal : [attrVal];
          const availableVals = Array.isArray(itemAttrVal) ? itemAttrVal : [itemAttrVal];

          const hasOverlap = requiredVals.some((v) =>
            availableVals.map((av) => av.toLowerCase()).includes(v.toLowerCase())
          );
          if (!hasOverlap) return false;
        }
      }

      return true;
    });

    // 3. Sorting
    const sortBy = filters.sortBy || 'relevance';
    filtered.sort((a, b) => {
      if (sortBy === 'price_asc') return a.item.price - b.item.price;
      if (sortBy === 'price_desc') return b.item.price - a.item.price;
      if (sortBy === 'rating') {
        const rA = typeof a.item.rating === 'object' ? a.item.rating?.value || 0 : a.item.rating || 0;
        const rB = typeof b.item.rating === 'object' ? b.item.rating?.value || 0 : b.item.rating || 0;
        return rB - rA;
      }
      if (sortBy === 'newest') {
        const dateA = a.item.createdAt ? new Date(a.item.createdAt).getTime() : 0;
        const dateB = b.item.createdAt ? new Date(b.item.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      // 'relevance' (default)
      return b.score - a.score;
    });

    // 4. Facet Aggregations from the matched result set
    const catCounts: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};
    const attrCounts: Record<string, Record<string, number>> = {};
    let minPriceFound = Infinity;
    let maxPriceFound = 0;

    for (const { item } of filtered) {
      if (item.category) {
        catCounts[item.category] = (catCounts[item.category] || 0) + 1;
      }
      if (item.brand) {
        brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
      }
      if (item.price < minPriceFound) minPriceFound = item.price;
      if (item.price > maxPriceFound) maxPriceFound = item.price;

      if (item.attributes) {
        for (const [k, v] of Object.entries(item.attributes)) {
          if (!attrCounts[k]) attrCounts[k] = {};
          const vals = Array.isArray(v) ? v : [v];
          for (const val of vals) {
            attrCounts[k][val] = (attrCounts[k][val] || 0) + 1;
          }
        }
      }
    }

    const categories: FacetValue[] = Object.entries(catCounts).map(([value, count]) => ({
      value,
      count,
    }));
    const brands: FacetValue[] = Object.entries(brandCounts).map(([value, count]) => ({
      value,
      count,
    }));

    const formattedAttrs: Record<string, FacetValue[]> = {};
    for (const [attrName, valMap] of Object.entries(attrCounts)) {
      formattedAttrs[attrName] = Object.entries(valMap).map(([value, count]) => ({
        value,
        count,
      }));
    }

    // 5. Intelligent "Did You Mean" Suggestion on 0 matches
    let didYouMean: string | null = null;
    if (filtered.length === 0 && rawQuery.length > 2) {
      const dym = this.didYouMean(rawQuery);
      if (dym.hasMatch && dym.suggestedQuery) {
        didYouMean = dym.suggestedQuery;
      }
    }

    // 6. Pagination
    const page = Math.max(1, filters.page || 1);
    const pageSize = Math.max(1, filters.pageSize || 20);
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedItems = filtered
      .slice((page - 1) * pageSize, page * pageSize)
      .map(({ item }) => item);

    return {
      products: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
      query: rawQuery,
      didYouMean,
      facets: {
        categories,
        brands,
        attributes: formattedAttrs,
        priceRange: {
          min: minPriceFound === Infinity ? 0 : minPriceFound,
          max: maxPriceFound,
        },
      },
    };
  }

  /**
   * Real-time autocomplete suggestions with typeahead query completions, matching categories, and preview products
   */
  suggest(query: string, limit = 5): AutocompleteSuggestion<T> {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return { query, completions: [], categories: [], brands: [], products: [] };
    }

    // 1. Query Completions from indexed terms
    const completions: string[] = [];
    for (const [term, freq] of this.termFrequency.entries()) {
      if (term.startsWith(clean)) {
        completions.push(term);
      }
    }
    completions.sort((a, b) => (this.termFrequency.get(b) || 0) - (this.termFrequency.get(a) || 0));

    // 2. Matching search results
    const results = this.search({ query: clean, pageSize: limit });

    return {
      query,
      completions: completions.slice(0, limit),
      categories: results.facets.categories.slice(0, 3),
      brands: results.facets.brands.slice(0, 3),
      products: results.products.slice(0, limit),
    };
  }

  /**
   * Finds similar/related products based on category, brand, and shared tags
   */
  findSimilar(productId: string, options: SimilarProductOptions = {}): T[] {
    const target = this.get(productId);
    if (!target) return [];

    const limit = options.limit || 4;
    const matchCat = options.matchCategory !== false;
    const matchBrand = options.matchBrand || false;

    const scored: Array<{ item: T; score: number }> = [];
    const targetTags = new Set((target.tags || []).map((t) => t.toLowerCase()));

    for (const p of this.products.values()) {
      if (p.id === productId) continue;

      let score = 0;
      if (matchCat && p.category && target.category && p.category.toLowerCase() === target.category.toLowerCase()) {
        score += 5;
      }
      if (matchBrand && p.brand && target.brand && p.brand.toLowerCase() === target.brand.toLowerCase()) {
        score += 3;
      }

      if (p.tags && targetTags.size > 0) {
        for (const t of p.tags) {
          if (targetTags.has(t.toLowerCase())) score += 2;
        }
      }

      // Price proximity score (items within 25% price range get a boost)
      if (target.price > 0 && p.price > 0) {
        const ratio = Math.abs(target.price - p.price) / target.price;
        if (ratio <= 0.25) score += 2;
      }

      if (score >= (options.minSimilarityScore || 2)) {
        scored.push({ item: p, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.item);
  }

  /**
   * Detects typos and suggests corrections against indexed terms
   */
  didYouMean(query: string): DidYouMeanResult {
    const clean = query.trim().toLowerCase();
    const words = clean.split(/\s+/);
    let hasCorrection = false;

    const correctedWords = words.map((word) => {
      if (this.termFrequency.has(word) || word.length <= 2) {
        return word;
      }

      let bestMatch = word;
      let minDistance = Infinity;

      for (const indexedTerm of this.termFrequency.keys()) {
        const dist = damerauLevenshtein(word, indexedTerm);
        if (dist <= 2 && dist < minDistance) {
          minDistance = dist;
          bestMatch = indexedTerm;
          hasCorrection = true;
        }
      }

      return bestMatch;
    });

    const suggestedQuery = hasCorrection ? correctedWords.join(' ') : null;
    return {
      originalQuery: query,
      suggestedQuery,
      hasMatch: hasCorrection,
    };
  }
}

/**
 * Static Helper Class for Zero-Setup Stateless Searching (100% Backward Compatible)
 */
export class BoostSearchEngine {
  /**
   * Performs typo-tolerant instant search, multi-faceted filtering, sorting, and facet extraction
   */
  static search<T extends SearchableProduct = SearchableProduct>(
    products: T[],
    filters: SearchFilters = {},
    options: SearchIndexOptions = {}
  ): SearchResult<T> {
    const index = new BoostSearchIndex<T>(options, products);
    return index.search(filters);
  }

  /**
   * Real-time autocomplete suggestions
   */
  static suggest<T extends SearchableProduct = SearchableProduct>(
    products: T[],
    query: string,
    limit = 5
  ): AutocompleteSuggestion<T> {
    const index = new BoostSearchIndex<T>({}, products);
    return index.suggest(query, limit);
  }

  /**
   * Finds similar/related products from a list
   */
  static findSimilar<T extends SearchableProduct = SearchableProduct>(
    products: T[],
    productId: string,
    options: SimilarProductOptions = {}
  ): T[] {
    const index = new BoostSearchIndex<T>({}, products);
    return index.findSimilar(productId, options);
  }

  /**
   * Serializes filter state into a clean URL query string (e.g. q=tee&minPrice=500&sort=price_asc)
   */
  static serializeToQuery(filters: SearchFilters): string {
    const params = new URLSearchParams();

    if (filters.query) params.set('q', filters.query);
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.inStockOnly) params.set('inStock', 'true');
    if (filters.minRating) params.set('rating', filters.minRating.toString());
    if (filters.sortBy && filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    if (filters.pageSize && filters.pageSize !== 20) params.set('pageSize', filters.pageSize.toString());

    if (filters.category) {
      const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
      params.set('category', cats.join(','));
    }

    if (filters.brand) {
      const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
      params.set('brand', brands.join(','));
    }

    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      params.set('tags', tags.join(','));
    }

    return params.toString();
  }

  /**
   * Parses URL query string into SearchFilters object
   */
  static parseFromQuery(queryString: string): SearchFilters {
    const clean = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    const params = new URLSearchParams(clean);
    const filters: SearchFilters = {};

    if (params.has('q')) filters.query = params.get('q')!;
    if (params.has('minPrice')) filters.minPrice = parseFloat(params.get('minPrice')!);
    if (params.has('maxPrice')) filters.maxPrice = parseFloat(params.get('maxPrice')!);
    if (params.has('inStock')) filters.inStockOnly = params.get('inStock') === 'true';
    if (params.has('rating')) filters.minRating = parseFloat(params.get('rating')!);
    if (params.has('sort')) filters.sortBy = params.get('sort') as any;
    if (params.has('page')) filters.page = parseInt(params.get('page')!, 10);
    if (params.has('pageSize')) filters.pageSize = parseInt(params.get('pageSize')!, 10);

    if (params.has('category')) {
      filters.category = params.get('category')!.split(',');
    }
    if (params.has('brand')) {
      filters.brand = params.get('brand')!.split(',');
    }
    if (params.has('tags')) {
      filters.tags = params.get('tags')!.split(',');
    }

    return filters;
  }
}

/**
 * Global singleton index instance for zero-config quick usage
 */
export const searchIndex = new BoostSearchIndex();
