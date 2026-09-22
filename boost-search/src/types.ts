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
  rating?: number | { value: number; count?: number };
  createdAt?: string;
  sku?: string;
  image?: string;
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
  tags?: string | string[];
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
  query?: string;
  didYouMean?: string | null;
  facets: {
    categories: FacetValue[];
    brands: FacetValue[];
    attributes: Record<string, FacetValue[]>;
    priceRange: { min: number; max: number };
  };
}

export interface FieldWeights {
  title?: number; // default: 3.0
  sku?: number; // default: 2.5
  brand?: number; // default: 2.0
  category?: number; // default: 1.5
  tags?: number; // default: 1.2
  description?: number; // default: 0.5
  [customField: string]: number | undefined;
}

export type SynonymDictionary = Record<string, string[]>;

export interface SearchIndexOptions {
  weights?: FieldWeights;
  synonyms?: SynonymDictionary;
  stopwords?: string[];
  fuzzyThreshold?: number; // max edit distance
}

export interface AutocompleteSuggestion<T extends SearchableProduct = SearchableProduct> {
  query: string;
  completions: string[];
  categories: FacetValue[];
  brands: FacetValue[];
  products: T[];
}

export interface SimilarProductOptions {
  limit?: number;
  matchCategory?: boolean;
  matchBrand?: boolean;
  minSimilarityScore?: number;
}

export interface DidYouMeanResult {
  originalQuery: string;
  suggestedQuery: string | null;
  hasMatch: boolean;
}

export type ProductDataMapper<TRaw = any, TProduct extends SearchableProduct = SearchableProduct> = (
  raw: TRaw
) => TProduct;

export interface SearchDatabaseAdapter<T extends SearchableProduct = SearchableProduct> {
  fetchProducts(): Promise<T[]> | T[];
}
