import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  createElement,
  ReactNode,
} from 'react';
import { BoostSearchIndex, BoostSearchEngine, searchIndex as defaultIndex } from '../engine';
import {
  SearchableProduct,
  SearchFilters,
  SearchResult,
  AutocompleteSuggestion,
  SearchIndexOptions,
  SimilarProductOptions,
} from '../types';

export interface SearchContextValue<T extends SearchableProduct = SearchableProduct> {
  index: BoostSearchIndex<T>;
  search: (filters?: SearchFilters) => SearchResult<T>;
  suggest: (query: string, limit?: number) => AutocompleteSuggestion<T>;
  findSimilar: (productId: string, options?: SimilarProductOptions) => T[];
}

const SearchContext: any = createContext<SearchContextValue | null>(null);

export interface SearchProviderProps<T extends SearchableProduct = SearchableProduct> {
  children: ReactNode;
  index?: BoostSearchIndex<T>;
  initialProducts?: T[];
  options?: SearchIndexOptions;
}

/**
 * Universal React Provider for Next.js, Vite, and React Native (Expo)
 * Shares high-throughput catalog search indexing across your entire app
 */
export function SearchProvider<T extends SearchableProduct = SearchableProduct>({
  children,
  index: customIndex,
  initialProducts,
  options,
}: SearchProviderProps<T>) {
  const index = useMemo(() => {
    if (customIndex) return customIndex;
    if (initialProducts && initialProducts.length > 0) {
      return new BoostSearchIndex<T>(options, initialProducts);
    }
    return defaultIndex as unknown as BoostSearchIndex<T>;
  }, [customIndex, initialProducts, options]);

  const value = useMemo<SearchContextValue<T>>(() => {
    return {
      index,
      search: (filters: SearchFilters = {}) => index.search(filters),
      suggest: (query: string, limit?: number) => index.suggest(query, limit),
      findSimilar: (productId: string, opts?: SimilarProductOptions) => index.findSimilar(productId, opts),
    };
  }, [index]);

  return createElement(SearchContext.Provider, { value }, children);
}

/**
 * Hook to access current search context or default singleton index
 */
export function useSearch<T extends SearchableProduct = SearchableProduct>(): SearchContextValue<T> {
  const context = useContext(SearchContext) as SearchContextValue<T> | null;
  if (context) return context;

  // Fallback to default singleton if no provider is used
  const idx = defaultIndex as unknown as BoostSearchIndex<T>;
  return {
    index: idx,
    search: (filters: SearchFilters = {}) => idx.search(filters),
    suggest: (query: string, limit?: number) => idx.suggest(query, limit),
    findSimilar: (productId: string, opts?: SimilarProductOptions) => idx.findSimilar(productId, opts),
  };
}

export interface UseProductSearchOptions<T extends SearchableProduct = SearchableProduct> {
  index?: BoostSearchIndex<T>;
  initialProducts?: T[];
  debounceMs?: number;
  initialFilters?: SearchFilters;
}

/**
 * Comprehensive hook for eCommerce search bar, facet sidebars, and grid pagination
 */
export function useProductSearch<T extends SearchableProduct = SearchableProduct>(
  options: UseProductSearchOptions<T> = {}
) {
  const context = useContext(SearchContext) as SearchContextValue<T> | null;
  const idx = useMemo(() => {
    if (options.index) return options.index;
    if (context?.index) return context.index;
    if (options.initialProducts && options.initialProducts.length > 0) {
      return new BoostSearchIndex<T>({}, options.initialProducts);
    }
    return defaultIndex as unknown as BoostSearchIndex<T>;
  }, [options.index, options.initialProducts, context]);

  const [filters, setFilters] = useState<SearchFilters>(options.initialFilters || {});
  const [debouncedQuery, setDebouncedQuery] = useState<string>(filters.query || '');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const debounceMs = options.debounceMs ?? 250;
  const queryTimerRef = useRef<any>(null);

  // Debounce text query changes
  const setQuery = useCallback(
    (newQuery: string) => {
      setFilters((prev: SearchFilters) => ({ ...prev, query: newQuery, page: 1 }));

      if (queryTimerRef.current) clearTimeout(queryTimerRef.current);
      setIsSearching(true);

      queryTimerRef.current = setTimeout(() => {
        setDebouncedQuery(newQuery);
        setIsSearching(false);
      }, debounceMs);
    },
    [debounceMs]
  );

  const activeFilters = useMemo<SearchFilters>(() => {
    return {
      ...filters,
      query: debouncedQuery,
    };
  }, [filters, debouncedQuery]);

  const results = useMemo<SearchResult<T>>(() => {
    return idx.search(activeFilters);
  }, [idx, activeFilters]);

  // Filter Helper Methods
  const toggleCategory = useCallback((cat: string) => {
    setFilters((prev: SearchFilters) => {
      const current = Array.isArray(prev.category)
        ? prev.category
        : prev.category
        ? [prev.category]
        : [];
      const exists = current.includes(cat);
      const updated = exists ? current.filter((c) => c !== cat) : [...current, cat];
      return { ...prev, category: updated, page: 1 };
    });
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    setFilters((prev: SearchFilters) => {
      const current = Array.isArray(prev.brand) ? prev.brand : prev.brand ? [prev.brand] : [];
      const exists = current.includes(brand);
      const updated = exists ? current.filter((b) => b !== brand) : [...current, brand];
      return { ...prev, brand: updated, page: 1 };
    });
  }, []);

  const setPriceRange = useCallback((min?: number, max?: number) => {
    setFilters((prev: SearchFilters) => ({ ...prev, minPrice: min, maxPrice: max, page: 1 }));
  }, []);

  const setSortBy = useCallback((sortBy: SearchFilters['sortBy']) => {
    setFilters((prev: SearchFilters) => ({ ...prev, sortBy, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev: SearchFilters) => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    setFilters((prev: SearchFilters) => {
      const current = prev.page || 1;
      return current < results.totalPages ? { ...prev, page: current + 1 } : prev;
    });
  }, [results.totalPages]);

  const prevPage = useCallback(() => {
    setFilters((prev: SearchFilters) => {
      const current = prev.page || 1;
      return current > 1 ? { ...prev, page: current - 1 } : prev;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setDebouncedQuery('');
  }, []);

  return {
    query: filters.query || '',
    setQuery,
    debouncedQuery,
    isSearching,
    filters,
    setFilters,
    results,
    products: results.products,
    total: results.total,
    facets: results.facets,
    page: results.page,
    totalPages: results.totalPages,
    didYouMean: results.didYouMean,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    setSortBy,
    setPage,
    nextPage,
    prevPage,
    resetFilters,
  };
}

export interface UseSearchAutocompleteOptions<T extends SearchableProduct = SearchableProduct> {
  index?: BoostSearchIndex<T>;
  limit?: number;
}

/**
 * Hook for live autocomplete popups with keyboard arrow navigation and preview items
 */
export function useSearchAutocomplete<T extends SearchableProduct = SearchableProduct>(
  query: string,
  options: UseSearchAutocompleteOptions<T> = {}
) {
  const context = useContext(SearchContext) as SearchContextValue<T> | null;
  const idx = options.index || context?.index || (defaultIndex as unknown as BoostSearchIndex<T>);
  const limit = options.limit || 5;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const suggestions = useMemo<AutocompleteSuggestion<T>>(() => {
    if (!query || query.trim().length === 0) {
      return { query, completions: [], categories: [], brands: [], products: [] };
    }
    return idx.suggest(query, limit);
  }, [idx, query, limit]);

  useEffect(() => {
    if (query && query.trim().length > 0 && suggestions.completions.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setActiveIndex(-1);
  }, [query, suggestions.completions.length]);

  const handleKeyDown = useCallback(
    (e: { key: string; preventDefault: () => void }) => {
      if (!isOpen) return;

      const totalItems = suggestions.completions.length;
      if (totalItems === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev: number) => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev: number) => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    },
    [isOpen, suggestions.completions.length]
  );

  return {
    suggestions,
    completions: suggestions.completions,
    categories: suggestions.categories,
    brands: suggestions.brands,
    previewProducts: suggestions.products,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
}

export interface UseURLSearchSyncOptions {
  pushState?: boolean;
}

/**
 * Universal hook to sync SearchFilters with browser URL query parameters
 * Fully SSR safe for Next.js (App Router / Pages Router), Remix, and Vite
 */
export function useURLSearchSync(
  filters: SearchFilters,
  onFilterChange?: (parsedFilters: SearchFilters) => void,
  options: UseURLSearchSyncOptions = {}
): {
  queryString: string;
  updateURL: (newFilters?: SearchFilters) => void;
  parseCurrentURL: () => SearchFilters;
} {
  const isBrowser = typeof window !== 'undefined';

  const queryString = useMemo(() => {
    return BoostSearchEngine.serializeToQuery(filters);
  }, [filters]);

  const parseCurrentURL = useCallback((): SearchFilters => {
    if (!isBrowser) return {};
    return BoostSearchEngine.parseFromQuery(window.location.search);
  }, [isBrowser]);

  const updateURL = useCallback(
    (newFilters?: SearchFilters) => {
      if (!isBrowser) return;
      const targetFilters = newFilters || filters;
      const qs = BoostSearchEngine.serializeToQuery(targetFilters);
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;

      if (options.pushState !== false && window.history?.pushState) {
        window.history.pushState(null, '', newUrl);
      } else if (window.history?.replaceState) {
        window.history.replaceState(null, '', newUrl);
      }
    },
    [isBrowser, filters, options.pushState]
  );

  useEffect(() => {
    if (isBrowser && onFilterChange && window.location.search) {
      const parsed = parseCurrentURL();
      onFilterChange(parsed);
    }
  }, [isBrowser, parseCurrentURL, onFilterChange]);

  return {
    queryString,
    updateURL,
    parseCurrentURL,
  };
}
