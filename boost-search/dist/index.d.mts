interface SearchableProduct {
    id: string;
    title: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    brand?: string;
    category?: string;
    tags?: string[];
    attributes?: Record<string, string | string[]>;
    inStock: boolean;
    rating?: number;
    createdAt?: string;
    [key: string]: any;
}
type SearchSortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
interface SearchFilters {
    query?: string;
    category?: string | string[];
    brand?: string | string[];
    minPrice?: number;
    maxPrice?: number;
    attributes?: Record<string, string | string[]>;
    inStockOnly?: boolean;
    minRating?: number;
    sortBy?: SearchSortOption;
    page?: number;
    pageSize?: number;
}
interface FacetValue {
    value: string;
    count: number;
}
interface SearchResult<T extends SearchableProduct = SearchableProduct> {
    products: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    facets: {
        categories: FacetValue[];
        brands: FacetValue[];
        attributes: Record<string, FacetValue[]>;
        priceRange: {
            min: number;
            max: number;
        };
    };
}

declare class BoostSearchEngine {
    /**
     * Performs typo-tolerant instant search, multi-faceted filtering, sorting, and facet extraction
     */
    static search<T extends SearchableProduct = SearchableProduct>(products: T[], filters?: SearchFilters): SearchResult<T>;
    /**
     * Serializes filter state into a clean URL query string (e.g. q=tee&minPrice=500&sort=price_asc)
     */
    static serializeToQuery(filters: SearchFilters): string;
    /**
     * Parses URL query string into SearchFilters object
     */
    static parseFromQuery(queryString: string): SearchFilters;
}

declare function levenshtein(a: string, b: string): number;
declare function matchesToken(target: string, token: string): {
    matches: boolean;
    score: number;
};

export { BoostSearchEngine, type FacetValue, type SearchFilters, type SearchResult, type SearchSortOption, type SearchableProduct, levenshtein, matchesToken };
