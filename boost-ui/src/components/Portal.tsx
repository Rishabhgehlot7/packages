'use client';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
}

/**
 * Portal — Renders children into a DOM node outside the current DOM hierarchy (typically document.body).
 * Fully SSR-safe and hydration safe.
 *
 * @example
 * <Portal>
 *   <div className="custom-overlay">Floating content</div>
 * </Portal>
 */
export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const target = container || document.body;
  return ReactDOM.createPortal(children, target);
};

Portal.displayName = 'Portal';
