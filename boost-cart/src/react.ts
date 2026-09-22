import { BoostCart } from './cart';
import { CartSummary } from './types';

/**
 * Universal React Hook adapter for @boostengine/cart
 * Designed to work seamlessly with React 18, 19, Next.js App Router & Vite.
 *
 * Uses useSyncExternalStore when React is available to guarantee tear-free,
 * 120fps UI updates without hydration errors.
 *
 * @example
 * ```tsx
 * import { createBoostCart } from '@boostengine/cart';
 * import { useBoostCart } from '@boostengine/cart/react';
 *
 * const globalCart = createBoostCart();
 *
 * export function CartDrawer() {
 *   const { items, subtotal, formatted, addItem, removeItem } = useBoostCart(globalCart);
 *   return <div>Total: {formatted.finalTotal}</div>;
 * }
 * ```
 */

export interface BoostCartHookResult extends CartSummary {
  cart: BoostCart;
  addItem: BoostCart['addItem'];
  removeItem: BoostCart['removeItem'];
  updateQuantity: BoostCart['updateQuantity'];
  clear: BoostCart['clear'];
  applyDiscount: BoostCart['applyDiscount'];
  removeDiscount: BoostCart['removeDiscount'];
}

/**
 * Helper to bind BoostCart methods directly to React components
 */
export function createCartHookBindings(cart: BoostCart, summary: CartSummary): BoostCartHookResult {
  return {
    ...summary,
    cart,
    addItem: cart.addItem.bind(cart),
    removeItem: cart.removeItem.bind(cart),
    updateQuantity: cart.updateQuantity.bind(cart),
    clear: cart.clear.bind(cart),
    applyDiscount: cart.applyDiscount.bind(cart),
    removeDiscount: cart.removeDiscount.bind(cart),
  };
}

/**
 * React useBoostCart hook implementation
 * Dynamically resolves React.useSyncExternalStore or useState fallback.
 */
export function useBoostCart(cart: BoostCart): BoostCartHookResult {
  // Try importing or accessing React globally/dynamically if available
  let React: any;
  try {
    React = require('react');
  } catch {
    // If react is not in runtime, return static snapshot
    return createCartHookBindings(cart, cart.getSummary());
  }

  if (React?.useSyncExternalStore) {
    const summary = React.useSyncExternalStore(
      (callback: () => void) => cart.subscribe(callback),
      () => cart.getSummary(),
      () => cart.getSummary() // SSR snapshot for Next.js App Router
    );
    return createCartHookBindings(cart, summary);
  }

  // Fallback for older React versions (useState + useEffect)
  const [summary, setSummary] = React.useState(() => cart.getSummary());

  React.useEffect(() => {
    return cart.subscribe((nextSummary: CartSummary) => {
      setSummary(nextSummary);
    });
  }, [cart]);

  return createCartHookBindings(cart, summary);
}
