/**
 * @boostengine/ui/native — React Native adapter.
 * Provides design tokens as JS objects (since RN has no CSS variables).
 *
 * @example
 * ```tsx
 * import { BoostNativeProvider, useDesignTokens } from '@boostengine/ui/native';
 * ```
 */
export { BoostNativeProvider } from './BoostNativeProvider';
export type { BoostNativeProviderProps } from './BoostNativeProvider';
export { useDesignTokens } from './useDesignTokens';
export { lightNativeTokens, darkNativeTokens } from './tokens';
export type { NativeTokens } from './tokens';