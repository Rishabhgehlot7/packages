/**
 * @boostengine/ui/svelte — Svelte 5 adapter stores for BoostEngine theme and tokens.
 *
 * @example
 * ```svelte
 * <script>
 * import { theme, tokens } from '@boostengine/ui/svelte';
 * $: console.log($theme.resolvedMode, $tokens.bg);
 * </script>
 * ```
 */
export { themeStore } from './stores/theme';
export { tokenStore } from './stores/tokens';
export { presetStore } from './stores/preset';