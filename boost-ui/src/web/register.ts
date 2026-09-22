import { BoostButton } from './components/boost-button';
import { BoostBadge } from './components/boost-badge';

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
  if (!customElements.get('boost-button')) {
    customElements.define('boost-button', BoostButton);
  }
  if (!customElements.get('boost-badge')) {
    customElements.define('boost-badge', BoostBadge);
  }
}