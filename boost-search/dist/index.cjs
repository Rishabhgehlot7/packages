'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/fuzzy.ts
function levenshtein(a, b) {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const matrix = [];
  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[al][bl];
}
function damerauLevenshtein(a, b) {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const d = [];
  for (let i = 0; i <= al; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (let j = 0; j <= bl; j++) {
    d[0][j] = j;
  }
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        // deletion
        d[i][j - 1] + 1,
        // insertion
        d[i - 1][j - 1] + cost
        // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[al][bl];
}
function soundex(str) {
  const clean = str.toUpperCase().replace(/[^A-Z]/g, "");
  if (!clean) return "";
  const firstLetter = clean[0];
  const mappings = {
    B: "1",
    F: "1",
    P: "1",
    V: "1",
    C: "2",
    G: "2",
    J: "2",
    K: "2",
    Q: "2",
    S: "2",
    X: "2",
    Z: "2",
    D: "3",
    T: "3",
    L: "4",
    M: "5",
    N: "5",
    R: "6"
  };
  let code = firstLetter;
  let prev = mappings[firstLetter] || "0";
  for (let i = 1; i < clean.length && code.length < 4; i++) {
    const char = clean[i];
    const mapping = mappings[char] || "0";
    if (mapping !== "0" && mapping !== prev) {
      code += mapping;
    }
    prev = mapping;
  }
  return (code + "000").slice(0, 4);
}
function matchesToken(target, token) {
  const cleanTarget = target.toLowerCase().trim();
  const cleanToken = token.toLowerCase().trim();
  if (!cleanTarget || !cleanToken) return { matches: false, score: 0 };
  if (cleanTarget === cleanToken) {
    return { matches: true, score: 10 };
  }
  if (cleanTarget.startsWith(cleanToken)) {
    const ratio = cleanToken.length / cleanTarget.length;
    return { matches: true, score: 7 + ratio * 2 };
  }
  if (cleanTarget.includes(cleanToken)) {
    return { matches: true, score: 5 };
  }
  const maxDistance = cleanToken.length > 6 ? 2 : cleanToken.length > 3 ? 1 : 0;
  if (maxDistance > 0) {
    const dist = damerauLevenshtein(cleanTarget, cleanToken);
    if (dist <= maxDistance) {
      return { matches: true, score: Math.max(1, 4.5 - dist) };
    }
  }
  if (cleanToken.length >= 4 && cleanTarget.length >= 4) {
    if (soundex(cleanTarget) === soundex(cleanToken)) {
      return { matches: true, score: 3.5 };
    }
  }
  return { matches: false, score: 0 };
}

// src/engine.ts
var DEFAULT_STOPWORDS = /* @__PURE__ */ new Set([
  "a",
  "an",
  "the",
  "in",
  "on",
  "at",
  "for",
  "with",
  "and",
  "or",
  "of",
  "to",
  "from",
  "by",
  "is",
  "it"
]);
var DEFAULT_WEIGHTS = {
  title: 3,
  sku: 2.5,
  brand: 2,
  category: 1.5,
  tags: 1.2,
  description: 0.5
};
var BoostSearchIndex = class {
  constructor(options = {}, initialProducts = []) {
    __publicField(this, "products", /* @__PURE__ */ new Map());
    __publicField(this, "synonyms");
    __publicField(this, "weights");
    __publicField(this, "stopwords");
    __publicField(this, "termFrequency", /* @__PURE__ */ new Map());
    this.synonyms = options.synonyms || {
      pants: ["trousers", "jeans", "bottoms"],
      trousers: ["pants", "jeans"],
      jeans: ["pants", "denim"],
      tee: ["t-shirt", "tshirt", "top"],
      tshirt: ["tee", "t-shirt"],
      hoodie: ["sweatshirt", "pullover", "jacket"],
      sneakers: ["shoes", "trainers", "kicks"],
      shoes: ["sneakers", "footwear"],
      phone: ["mobile", "smartphone", "cellphone"],
      laptop: ["notebook", "computer", "macbook"]
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
  add(productsOrItem) {
    const items = Array.isArray(productsOrItem) ? productsOrItem : [productsOrItem];
    for (const item of items) {
      this.products.set(item.id, item);
      this.indexItemTerms(item);
    }
  }
  /**
   * Updates an existing product in the index
   */
  update(product) {
    this.add(product);
  }
  /**
   * Upsert helper: adds or updates a product (e.g. from a database change stream, Prisma, or webhook)
   */
  upsert(product) {
    this.add(product);
  }
  /**
   * Universal Database Sync: syncs products from ANY database (MongoDB, PostgreSQL, Prisma, Supabase, Firestore, Redis)
   * Accepts raw database documents or an async fetcher function, with an optional mapper to transform documents.
   */
  async sync(source, mapper) {
    const rawItems = typeof source === "function" ? await source() : source;
    const transformed = mapper ? rawItems.map(mapper) : rawItems;
    this.add(transformed);
    return transformed.length;
  }
  /**
   * Removes a product from the index by ID
   */
  remove(id) {
    return this.products.delete(id);
  }
  /**
   * Retrieves a single product by ID
   */
  get(id) {
    return this.products.get(id);
  }
  /**
   * Returns all indexed products
   */
  getAll() {
    return Array.from(this.products.values());
  }
  /**
   * Clears the entire index
   */
  clear() {
    this.products.clear();
    this.termFrequency.clear();
  }
  /**
   * Returns total number of indexed products
   */
  get size() {
    return this.products.size;
  }
  indexItemTerms(item) {
    const text = [
      item.title,
      item.brand,
      item.category,
      item.sku,
      ...item.tags || []
    ].filter(Boolean).join(" ").toLowerCase();
    const tokens = text.split(/\s+/).filter((t) => t.length > 2 && !this.stopwords.has(t));
    for (const token of tokens) {
      this.termFrequency.set(token, (this.termFrequency.get(token) || 0) + 1);
    }
  }
  /**
   * Expands query tokens using the configured synonym dictionary
   */
  expandTokensWithSynonyms(token) {
    const clean = token.toLowerCase().trim();
    const result = /* @__PURE__ */ new Set([clean]);
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
  search(filters = {}) {
    const rawQuery = filters.query ? filters.query.trim().toLowerCase() : "";
    const queryTokens = rawQuery ? rawQuery.split(/\s+/).filter((t) => Boolean(t) && !this.stopwords.has(t)) : [];
    let scoredItems = [];
    const products = Array.from(this.products.values());
    for (const p of products) {
      let totalScore = 0;
      let matchedAllTokens = true;
      if (queryTokens.length > 0) {
        for (const token of queryTokens) {
          const expandedTokens = this.expandTokensWithSynonyms(token);
          let tokenMaxScore = 0;
          for (const expanded of expandedTokens) {
            const titleWords = p.title.toLowerCase().split(/\s+/);
            for (const word of titleWords) {
              const m = matchesToken(word, expanded);
              if (m.matches) {
                tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.title || 3));
              }
            }
            if (p.sku) {
              const m = matchesToken(p.sku, expanded);
              if (m.matches) {
                tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.sku || 2.5));
              }
            }
            if (p.brand) {
              const m = matchesToken(p.brand, expanded);
              if (m.matches) {
                tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.brand || 2));
              }
            }
            if (p.category) {
              const m = matchesToken(p.category, expanded);
              if (m.matches) {
                tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.category || 1.5));
              }
            }
            if (p.tags && p.tags.length > 0) {
              for (const tag of p.tags) {
                const m = matchesToken(tag, expanded);
                if (m.matches) {
                  tokenMaxScore = Math.max(tokenMaxScore, m.score * (this.weights.tags || 1.2));
                }
              }
            }
            if (p.description && p.description.toLowerCase().includes(expanded)) {
              tokenMaxScore = Math.max(tokenMaxScore, 2 * (this.weights.description || 0.5));
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
        totalScore = 1;
      }
      scoredItems.push({ item: p, score: totalScore });
    }
    let filtered = scoredItems.filter(({ item }) => {
      if (filters.inStockOnly && !item.inStock) {
        return false;
      }
      if (filters.minPrice !== void 0 && item.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== void 0 && item.price > filters.maxPrice) {
        return false;
      }
      const itemRating = typeof item.rating === "object" ? item.rating?.value || 0 : item.rating || 0;
      if (filters.minRating !== void 0 && itemRating < filters.minRating) {
        return false;
      }
      if (filters.category) {
        const allowedCats = Array.isArray(filters.category) ? filters.category.map((c) => c.toLowerCase()) : [filters.category.toLowerCase()];
        if (!item.category || !allowedCats.includes(item.category.toLowerCase())) {
          return false;
        }
      }
      if (filters.brand) {
        const allowedBrands = Array.isArray(filters.brand) ? filters.brand.map((b) => b.toLowerCase()) : [filters.brand.toLowerCase()];
        if (!item.brand || !allowedBrands.includes(item.brand.toLowerCase())) {
          return false;
        }
      }
      if (filters.tags) {
        const reqTags = Array.isArray(filters.tags) ? filters.tags.map((t) => t.toLowerCase()) : [filters.tags.toLowerCase()];
        const itemTags = (item.tags || []).map((t) => t.toLowerCase());
        const hasTag = reqTags.some((t) => itemTags.includes(t));
        if (!hasTag) return false;
      }
      if (filters.attributes && item.attributes) {
        for (const [attrKey, attrVal] of Object.entries(filters.attributes)) {
          const itemAttrVal = item.attributes[attrKey];
          if (!itemAttrVal) return false;
          const requiredVals = Array.isArray(attrVal) ? attrVal : [attrVal];
          const availableVals = Array.isArray(itemAttrVal) ? itemAttrVal : [itemAttrVal];
          const hasOverlap = requiredVals.some(
            (v) => availableVals.map((av) => av.toLowerCase()).includes(v.toLowerCase())
          );
          if (!hasOverlap) return false;
        }
      }
      return true;
    });
    const sortBy = filters.sortBy || "relevance";
    filtered.sort((a, b) => {
      if (sortBy === "price_asc") return a.item.price - b.item.price;
      if (sortBy === "price_desc") return b.item.price - a.item.price;
      if (sortBy === "rating") {
        const rA = typeof a.item.rating === "object" ? a.item.rating?.value || 0 : a.item.rating || 0;
        const rB = typeof b.item.rating === "object" ? b.item.rating?.value || 0 : b.item.rating || 0;
        return rB - rA;
      }
      if (sortBy === "newest") {
        const dateA = a.item.createdAt ? new Date(a.item.createdAt).getTime() : 0;
        const dateB = b.item.createdAt ? new Date(b.item.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      return b.score - a.score;
    });
    const catCounts = {};
    const brandCounts = {};
    const attrCounts = {};
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
    const categories = Object.entries(catCounts).map(([value, count]) => ({
      value,
      count
    }));
    const brands = Object.entries(brandCounts).map(([value, count]) => ({
      value,
      count
    }));
    const formattedAttrs = {};
    for (const [attrName, valMap] of Object.entries(attrCounts)) {
      formattedAttrs[attrName] = Object.entries(valMap).map(([value, count]) => ({
        value,
        count
      }));
    }
    let didYouMean = null;
    if (filtered.length === 0 && rawQuery.length > 2) {
      const dym = this.didYouMean(rawQuery);
      if (dym.hasMatch && dym.suggestedQuery) {
        didYouMean = dym.suggestedQuery;
      }
    }
    const page = Math.max(1, filters.page || 1);
    const pageSize = Math.max(1, filters.pageSize || 20);
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedItems = filtered.slice((page - 1) * pageSize, page * pageSize).map(({ item }) => item);
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
          max: maxPriceFound
        }
      }
    };
  }
  /**
   * Real-time autocomplete suggestions with typeahead query completions, matching categories, and preview products
   */
  suggest(query, limit = 5) {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return { query, completions: [], categories: [], brands: [], products: [] };
    }
    const completions = [];
    for (const [term, freq] of this.termFrequency.entries()) {
      if (term.startsWith(clean)) {
        completions.push(term);
      }
    }
    completions.sort((a, b) => (this.termFrequency.get(b) || 0) - (this.termFrequency.get(a) || 0));
    const results = this.search({ query: clean, pageSize: limit });
    return {
      query,
      completions: completions.slice(0, limit),
      categories: results.facets.categories.slice(0, 3),
      brands: results.facets.brands.slice(0, 3),
      products: results.products.slice(0, limit)
    };
  }
  /**
   * Finds similar/related products based on category, brand, and shared tags
   */
  findSimilar(productId, options = {}) {
    const target = this.get(productId);
    if (!target) return [];
    const limit = options.limit || 4;
    const matchCat = options.matchCategory !== false;
    const matchBrand = options.matchBrand || false;
    const scored = [];
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
  didYouMean(query) {
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
    const suggestedQuery = hasCorrection ? correctedWords.join(" ") : null;
    return {
      originalQuery: query,
      suggestedQuery,
      hasMatch: hasCorrection
    };
  }
};
var BoostSearchEngine = class {
  /**
   * Performs typo-tolerant instant search, multi-faceted filtering, sorting, and facet extraction
   */
  static search(products, filters = {}, options = {}) {
    const index = new BoostSearchIndex(options, products);
    return index.search(filters);
  }
  /**
   * Real-time autocomplete suggestions
   */
  static suggest(products, query, limit = 5) {
    const index = new BoostSearchIndex({}, products);
    return index.suggest(query, limit);
  }
  /**
   * Finds similar/related products from a list
   */
  static findSimilar(products, productId, options = {}) {
    const index = new BoostSearchIndex({}, products);
    return index.findSimilar(productId, options);
  }
  /**
   * Serializes filter state into a clean URL query string (e.g. q=tee&minPrice=500&sort=price_asc)
   */
  static serializeToQuery(filters) {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.minPrice !== void 0) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== void 0) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.inStockOnly) params.set("inStock", "true");
    if (filters.minRating) params.set("rating", filters.minRating.toString());
    if (filters.sortBy && filters.sortBy !== "relevance") params.set("sort", filters.sortBy);
    if (filters.page && filters.page > 1) params.set("page", filters.page.toString());
    if (filters.pageSize && filters.pageSize !== 20) params.set("pageSize", filters.pageSize.toString());
    if (filters.category) {
      const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
      params.set("category", cats.join(","));
    }
    if (filters.brand) {
      const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
      params.set("brand", brands.join(","));
    }
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      params.set("tags", tags.join(","));
    }
    return params.toString();
  }
  /**
   * Parses URL query string into SearchFilters object
   */
  static parseFromQuery(queryString) {
    const clean = queryString.startsWith("?") ? queryString.slice(1) : queryString;
    const params = new URLSearchParams(clean);
    const filters = {};
    if (params.has("q")) filters.query = params.get("q");
    if (params.has("minPrice")) filters.minPrice = parseFloat(params.get("minPrice"));
    if (params.has("maxPrice")) filters.maxPrice = parseFloat(params.get("maxPrice"));
    if (params.has("inStock")) filters.inStockOnly = params.get("inStock") === "true";
    if (params.has("rating")) filters.minRating = parseFloat(params.get("rating"));
    if (params.has("sort")) filters.sortBy = params.get("sort");
    if (params.has("page")) filters.page = parseInt(params.get("page"), 10);
    if (params.has("pageSize")) filters.pageSize = parseInt(params.get("pageSize"), 10);
    if (params.has("category")) {
      filters.category = params.get("category").split(",");
    }
    if (params.has("brand")) {
      filters.brand = params.get("brand").split(",");
    }
    if (params.has("tags")) {
      filters.tags = params.get("tags").split(",");
    }
    return filters;
  }
};
var searchIndex = new BoostSearchIndex();

// src/agent.ts
var SearchAgentToolkit = class _SearchAgentToolkit {
  /**
   * Universal tool definitions formatted for OpenAI Function Calling
   */
  static getOpenAITools() {
    return [
      {
        type: "function",
        function: {
          name: "search_products",
          description: "Search eCommerce products with typo tolerance, category/brand filters, price range, and sort options.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: 'Search keywords or product name (e.g. "oversized black hoodie")' },
              category: { type: "string", description: 'Filter by product category (e.g. "Hoodies", "Footwear")' },
              brand: { type: "string", description: "Filter by brand name" },
              minPrice: { type: "number", description: "Minimum price filter" },
              maxPrice: { type: "number", description: "Maximum price filter" },
              inStockOnly: { type: "boolean", description: "Whether to restrict to in-stock items only" },
              minRating: { type: "number", description: "Minimum customer star rating (e.g. 4.0)" },
              sortBy: {
                type: "string",
                enum: ["relevance", "price_asc", "price_desc", "newest", "rating"],
                description: "Sorting criteria"
              },
              page: { type: "number", description: "Page number for pagination (default: 1)" },
              pageSize: { type: "number", description: "Number of items per page (default: 20)" }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "autocomplete_suggestions",
          description: "Get instant typeahead suggestions, matching search terms, top categories, and preview products for a partial query.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: 'Partial query prefix typed by user (e.g. "den")' },
              limit: { type: "number", description: "Maximum suggestions to return (default: 5)" }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_filter_facets",
          description: "Retrieve dynamic catalog facet breakdowns (available categories, brands, price boundaries, and attributes).",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Optional search query to scope facets to matched products" }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "find_similar_products",
          description: "Find similar and recommended products based on category, brand, and shared tags of a target item.",
          parameters: {
            type: "object",
            properties: {
              productId: { type: "string", description: "Target product ID to find alternatives or recommendations for" },
              limit: { type: "number", description: "Number of recommendations to return (default: 4)" },
              matchCategory: { type: "boolean", description: "Require category matching (default: true)" },
              matchBrand: { type: "boolean", description: "Prefer same brand (default: false)" }
            },
            required: ["productId"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "did_you_mean",
          description: "Detect typing errors or phonetic slips and suggest corrected search terms against catalog keywords.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search phrase that produced few or zero results" }
            },
            required: ["query"]
          }
        }
      }
    ];
  }
  /**
   * Tool definitions formatted for Anthropic Claude
   */
  static getClaudeTools() {
    return this.getOpenAITools().map((tool) => ({
      name: tool.function.name,
      description: tool.function.description,
      input_schema: tool.function.parameters
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
          parameters: tool.function.parameters
        }))
      }
    ];
  }
  /**
   * Tool definitions for Vercel AI SDK (`ai`)
   */
  static getVercelAITools(indexInstance) {
    const idx = indexInstance || searchIndex;
    return {
      search_products: {
        description: "Search eCommerce products with typo tolerance and facets.",
        execute: async (params) => {
          return _SearchAgentToolkit.executeTool("search_products", params, idx);
        }
      },
      autocomplete_suggestions: {
        description: "Typeahead query suggestions and preview products.",
        execute: async (params) => {
          return _SearchAgentToolkit.executeTool("autocomplete_suggestions", params, idx);
        }
      },
      get_filter_facets: {
        description: "Extract available categories, brands, and price bounds.",
        execute: async (params) => {
          return _SearchAgentToolkit.executeTool("get_filter_facets", params, idx);
        }
      },
      find_similar_products: {
        description: "Recommend products similar to a target item.",
        execute: async (params) => {
          return _SearchAgentToolkit.executeTool("find_similar_products", params, idx);
        }
      },
      did_you_mean: {
        description: "Check spelling and propose typo corrections.",
        execute: async (params) => {
          return _SearchAgentToolkit.executeTool("did_you_mean", params, idx);
        }
      }
    };
  }
  /**
   * Universal Tool Executor for AI Agents
   */
  static async executeTool(toolName, params, indexInstance) {
    const idx = indexInstance || searchIndex;
    try {
      switch (toolName) {
        case "search_products": {
          const result = idx.search(params);
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
                rating: p.rating
              })),
              facets: result.facets
            }
          };
        }
        case "autocomplete_suggestions": {
          const suggestions = idx.suggest(params.query || "", params.limit || 5);
          return {
            toolName,
            success: true,
            data: suggestions
          };
        }
        case "get_filter_facets": {
          const searchRes = idx.search({ query: params.query, pageSize: 1 });
          return {
            toolName,
            success: true,
            data: searchRes.facets
          };
        }
        case "find_similar_products": {
          const similar = idx.findSimilar(params.productId, params);
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
                category: p.category
              }))
            }
          };
        }
        case "did_you_mean": {
          const dym = idx.didYouMean(params.query || "");
          return {
            toolName,
            success: true,
            data: dym
          };
        }
        default:
          return {
            toolName,
            success: false,
            error: `Unknown tool name: ${toolName}`
          };
      }
    } catch (err) {
      return {
        toolName,
        success: false,
        error: err?.message || String(err)
      };
    }
  }
};

exports.BoostSearchEngine = BoostSearchEngine;
exports.BoostSearchIndex = BoostSearchIndex;
exports.DEFAULT_STOPWORDS = DEFAULT_STOPWORDS;
exports.DEFAULT_WEIGHTS = DEFAULT_WEIGHTS;
exports.SearchAgentToolkit = SearchAgentToolkit;
exports.damerauLevenshtein = damerauLevenshtein;
exports.levenshtein = levenshtein;
exports.matchesToken = matchesToken;
exports.searchIndex = searchIndex;
exports.soundex = soundex;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map