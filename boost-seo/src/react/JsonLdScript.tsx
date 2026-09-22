// ============================================================
// @boostengine/seo — v1.1.0 — JSON-LD Script Component
// SSR-safe <script type="application/ld+json"> injector
// ============================================================

import React from 'react';

export interface JsonLdScriptProps {
  schema: Record<string, any>;
  id?: string;
}

/**
 * Safely renders a <script type="application/ld+json"> tag with the
 * provided schema object. Safe for both React 18/19 and Next.js SSR.
 *
 * Escapes </script> sequences to prevent XSS and HTML injection.
 *
 * @example
 * ```tsx
 * <JsonLdScript schema={productSchema} id="product-jsonld" />
 * ```
 */
export function JsonLdScript({ schema, id }: JsonLdScriptProps): React.JSX.Element {
  const json = JSON.stringify(schema);
  // Escape </script> sequences for safety
  const safeJson = json.replace(/<\/script>/gi, '<\\/script>');

  return React.createElement('script', {
    type: 'application/ld+json',
    id: id || undefined,
    dangerouslySetInnerHTML: { __html: safeJson },
  });
}