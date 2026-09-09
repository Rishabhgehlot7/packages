'use strict';

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
function matchesToken(target, token) {
  const cleanTarget = target.toLowerCase().trim();
  const cleanToken = token.toLowerCase().trim();
  if (!cleanTarget || !cleanToken) return { matches: false, score: 0 };
  if (cleanTarget === cleanToken) {
    return { matches: true, score: 10 };
  }
  if (cleanTarget.startsWith(cleanToken)) {
    return { matches: true, score: 7 };
  }
  if (cleanTarget.includes(cleanToken)) {
    return { matches: true, score: 5 };
  }
  const maxDistance = cleanToken.length > 6 ? 2 : cleanToken.length > 3 ? 1 : 0;
  if (maxDistance > 0) {
    const dist = levenshtein(cleanTarget, cleanToken);
    if (dist <= maxDistance) {
      return { matches: true, score: Math.max(1, 4 - dist) };
    }
  }
  return { matches: false, score: 0 };
}

// src/engine.ts
var BoostSearchEngine = class {
  /**
   * Performs typo-tolerant instant search, multi-faceted filtering, sorting, and facet extraction
   */
  static search(products, filters = {}) {
    const query = filters.query ? filters.query.trim().toLowerCase() : "";
    const queryTokens = query ? query.split(/\s+/).filter(Boolean) : [];
    let scoredItems = [];
    for (const p of products) {
      let totalScore = 0;
      let matchedAllTokens = true;
      if (queryTokens.length > 0) {
        for (const token of queryTokens) {
          let tokenMaxScore = 0;
          const titleWords = p.title.toLowerCase().split(/\s+/);
          for (const word of titleWords) {
            const m = matchesToken(word, token);
            if (m.matches) tokenMaxScore = Math.max(tokenMaxScore, m.score * 3);
          }
          if (p.brand) {
            const m = matchesToken(p.brand, token);
            if (m.matches) tokenMaxScore = Math.max(tokenMaxScore, m.score * 2);
          }
          if (p.category) {
            const m = matchesToken(p.category, token);
            if (m.matches) tokenMaxScore = Math.max(tokenMaxScore, m.score * 1.5);
          }
          if (p.tags && p.tags.length > 0) {
            for (const tag of p.tags) {
              const m = matchesToken(tag, token);
              if (m.matches) tokenMaxScore = Math.max(tokenMaxScore, m.score * 1.2);
            }
          }
          if (p.description) {
            if (p.description.toLowerCase().includes(token)) {
              tokenMaxScore = Math.max(tokenMaxScore, 2);
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
    if (filters.category) {
      const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
      params.set("category", cats.join(","));
    }
    if (filters.brand) {
      const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
      params.set("brand", brands.join(","));
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
    if (params.has("category")) {
      filters.category = params.get("category").split(",");
    }
    if (params.has("brand")) {
      filters.brand = params.get("brand").split(",");
    }
    return filters;
  }
};

exports.BoostSearchEngine = BoostSearchEngine;
exports.levenshtein = levenshtein;
exports.matchesToken = matchesToken;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map