export { A as AutocompleteSuggestion, B as BoostSearchEngine, a as BoostSearchIndex, D as DEFAULT_STOPWORDS, b as DEFAULT_WEIGHTS, c as DidYouMeanResult, F as FacetValue, d as FieldWeights, P as ProductDataMapper, S as SearchDatabaseAdapter, e as SearchFilters, f as SearchIndexOptions, g as SearchResult, h as SearchSortOption, i as SearchableProduct, j as SimilarProductOptions, k as SynonymDictionary, s as searchIndex } from './engine-CxzD7n8o.js';
export { AgentToolCallResult, SearchAgentToolkit } from './agent.js';
export { SearchContextValue, SearchProviderProps, UseProductSearchOptions, UseSearchAutocompleteOptions, UseURLSearchSyncOptions } from './react.js';
import 'react';

/**
 * Classic Levenshtein Distance
 */
declare function levenshtein(a: string, b: string): number;
/**
 * Damerau-Levenshtein Distance: includes character transpositions (adjacent character swaps)
 * Highly effective for mobile keyboard slip-ups (e.g. "hooid" -> "hoodie")
 */
declare function damerauLevenshtein(a: string, b: string): number;
/**
 * Simplified Soundex Phonetic Code for eCommerce spelling variations
 */
declare function soundex(str: string): string;
/**
 * Robust token matcher combining exact, prefix, substring, Damerau-Levenshtein, and Soundex
 */
declare function matchesToken(target: string, token: string): {
    matches: boolean;
    score: number;
};

export { damerauLevenshtein, levenshtein, matchesToken, soundex };
