/**
 * registerAllComponents — Ensures all BoostEngine Web Components are registered.
 * Call once at app entry if using dynamic imports or build optimizations.
 *
 * @example
 * ```ts
 * import { registerAllComponents } from '@boostengine/ui/web';
 * registerAllComponents();
 * ```
 */
export function registerAllComponents(): void {
  if (typeof customElements === 'undefined') return;
  // Components self-register via customElements.define() at import time.
  // This function guarantees the imports happen.
  void import('./components/boost-button');
  void import('./components/boost-badge');
}