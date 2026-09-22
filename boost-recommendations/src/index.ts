export * from './types';
export * from './engine';
export * from './agent';

// Type-only exports for pure Node.js environments
// For React hooks and <RecommendationsProvider>, import from '@boostengine/recommendations/react'
export type {
  RecommendationsContextValue,
  RecommendationsProviderProps,
} from './react';
