export * from './types';
export * from './engine';
export * from './agent';

// Type-only exports for pure Node.js runtime safety
// For full React hooks and <DealsProvider>, import from '@boostengine/deals/react'
export type {
  DealsContextValue,
  DealsProviderProps,
} from './react';
