export interface SearchableProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  brand?: string;
  category?: string;
  tags?: string[];
  attributes?: Record<string, string | string[]>; // e.g. size: ['S', 'M', 'L'], color: 'Black'
  inStock: boolean;
  rating?: number;
  createdAt?: string;
  [key: string]: any;
}

export type SearchSortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';

export interface SearchFilters {
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

export interface FacetValue {
  value: string;
  count: number;
}

export interface SearchResult<T extends SearchableProduct = SearchableProduct> {
  products: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: {
    categories: FacetValue[];
    brands: FacetValue[];
    attributes: Record<string, FacetValue[]>;
    priceRange: { min: number; max: number };
  };
}
