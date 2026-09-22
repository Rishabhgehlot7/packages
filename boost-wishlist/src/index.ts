export * from './types';
export * from './manager';
export * from './agent';

// Type-only exports for pure Node.js environments
// For React hooks and <WishlistProvider>, import from '@boostengine/wishlist/react'
export type {
  WishlistContextValue,
  WishlistProviderProps,
} from './react';
