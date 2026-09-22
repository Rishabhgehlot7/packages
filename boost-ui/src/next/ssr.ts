/**
 * injectNextCss — Inlines BoostEngine CSS variables for SSR (prevents FOUC).
 * Use in app/layout.tsx <head>.
 *
 * @example
 * ```tsx
 * import { injectNextCss } from '@boostengine/ui/next';
 * // <style dangerouslySetInnerHTML={{ __html: injectNextCss() }} />
 * ```
 */
export function injectNextCss(): string {
  return [
    `:root, [data-theme="light"] {`,
    `  --boost-primary: #2563eb;`,
    `  --boost-bg: #ffffff;`,
    `  --boost-surface: #f8fafc;`,
    `  --boost-text: #0f172a;`,
    `  --boost-text-muted: #64748b;`,
    `  --boost-border: #e2e8f0;`,
    `  --boost-radius: 12px;`,
    `}`,
    `[data-theme="dark"], .dark {`,
    `  --boost-primary: #3b82f6;`,
    `  --boost-bg: #090d16;`,
    `  --boost-surface: #0f172a;`,
    `  --boost-text: #f8fafc;`,
    `  --boost-text-muted: #94a3b8;`,
    `  --boost-border: #1e293b;`,
    `  color-scheme: dark;`,
    `}`,
  ].join('\n');
}