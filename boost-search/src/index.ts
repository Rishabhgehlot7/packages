export {
  BoostSearchEngine,
  BoostSearchIndex,
  searchIndex,
  DEFAULT_STOPWORDS,
  DEFAULT_WEIGHTS,
} from './engine';

export {
  levenshtein,
  damerauLevenshtein,
  soundex,
  matchesToken,
} from './fuzzy';

export { SearchAgentToolkit } from './agent';
export type { AgentToolCallResult } from './agent';

export type {
  SearchableProduct,
  SearchFilters,
  SearchSortOption,
  FacetValue,
  SearchResult,
  FieldWeights,
  SynonymDictionary,
  SearchIndexOptions,
  AutocompleteSuggestion,
  SimilarProductOptions,
  DidYouMeanResult,
  ProductDataMapper,
  SearchDatabaseAdapter,
} from './types';

// Export React Hook types for universal type-checking without forcing runtime React on Node.js backends
export type {
  SearchContextValue,
  SearchProviderProps,
  UseProductSearchOptions,
  UseSearchAutocompleteOptions,
  UseURLSearchSyncOptions,
} from './react';
