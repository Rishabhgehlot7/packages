import { SearchableProduct, SearchFilters, SearchResult, FacetValue } from './types';
import { matchesToken } from './fuzzy';

export class BoostSearchEngine {
  /**
   * Performs typo-tolerant instant search, multi-faceted filtering, sorting, and facet extraction
   */
  static search<T extends SearchableProduct = SearchableProduct>(
    products: T[],
    filters: SearchFilters = {}
  ): SearchResult<T> {
    const query = filters.query ? filters.query.trim().toLowerCase() : '';
    const queryTokens = query ? query.split(/\s+/).filter(Boolean) : [];

    // 1. Scoring & Query Filtering
    let scoredItems: Array<{ item: T; score: number }> = [];

    for (const p of products) {
      let totalScore = 0;
      let matchedAllTokens = true;

      if (queryTokens.length > 0) {
        for (const token of queryTokens) {
          let tokenMaxScore = 0;

          // Check title (weight: 3.0)
          const titleWords = p.title.toLowerCase().split(/\s+/);
          for (const word of titleWords) {
            const m = matchesToken(word, token);
            if (m.matches) tokenMaxScore = Math.max(tokenMaxScore, m.score * 3.0);
          }

          // Check brand (weight: 2.0)
          if (p.brand) {
            const m = matchesToken(p.brand, token);
            if (m.matches) tokenMaxScore = Math.max(tokenMaxScore, m.score * 2.0);
          }

          // Check category (weight: 1.5)
          if (p.category) {
            const m = matchesToken(p.category, token);
            if (m.matches) tokenMaxScore = Math.max(tokenMaxScore, m.score * 1.5);
          }

          // Check tags (weight: 1.2)
          if (p.tags && p.tags.length > 0) {
            for (const tag of p.tags) {
              const m = matchesToken(tag, token);
              if (m.matches) tokenMaxScore = Math.max(tokenMaxScore, m.score * 1.2);
            }
          }

          // Check description (weight: 0.5)
          if (p.description) {
            if (p.description.toLowerCase().includes(token)) {
              tokenMaxScore = Math.max(tokenMaxScore, 2.0);
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
        totalScore = 1; // Base score when no query
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
      if (filters.minRating !== undefined && (item.rating || 0) < filters.minRating) {
        return false;
      }

      // Category filter
      if (filters.category) {
        const allowedCats = Array.isArray(filters.category)
          ? filters.category.map((c) => c.toLowerCase())
          : [filters.category.toLowerCase()];
        if (!item.category || !allowedCats.includes(item.category.toLowerCase())) {
          return false;
        }
      }

      // Brand filter
      if (filters.brand) {
        const allowedBrands = Array.isArray(filters.brand)
          ? filters.brand.map((b) => b.toLowerCase())
          : [filters.brand.toLowerCase()];
        if (!item.brand || !allowedBrands.includes(item.brand.toLowerCase())) {
          return false;
        }
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
      if (sortBy === 'rating') return (b.item.rating || 0) - (a.item.rating || 0);
      if (sortBy === 'newest') {
        const dateA = a.item.createdAt ? new Date(a.item.createdAt).getTime() : 0;
        const dateB = b.item.createdAt ? new Date(b.item.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      // 'relevance'
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

    // 5. Pagination
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

    if (filters.category) {
      const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
      params.set('category', cats.join(','));
    }

    if (filters.brand) {
      const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
      params.set('brand', brands.join(','));
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

    if (params.has('category')) {
      filters.category = params.get('category')!.split(',');
    }
    if (params.has('brand')) {
      filters.brand = params.get('brand')!.split(',');
    }

    return filters;
  }
}
