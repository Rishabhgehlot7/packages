/**
 * @boostengine/ui - Design Tokens & Tailwind Preset
 * Universal design tokens exportable to Tailwind CSS, Figma Tokens, or CSS-in-JS.
 */

import tokensJson from './tokens.json';

export const boostTokens = tokensJson;

/**
 * Generates a Tailwind CSS configuration preset object.
 * Usage in tailwind.config.js:
 * ```js
 * const { createTailwindPreset } = require('@boostengine/ui');
 * module.exports = {
 *   presets: [createTailwindPreset()],
 *   // ...
 * };
 * ```
 */
export function createTailwindPreset() {
  return {
    theme: {
      extend: {
        colors: {
          boost: {
            primary: 'var(--boost-primary, #2563eb)',
            'primary-hover': 'var(--boost-primary-hover, #1d4ed8)',
            bg: 'var(--boost-bg, #ffffff)',
            surface: 'var(--boost-surface, #f8fafc)',
            'surface-secondary': 'var(--boost-surface-secondary, #f1f5f9)',
            text: 'var(--boost-text, #0f172a)',
            'text-muted': 'var(--boost-text-muted, #64748b)',
            border: 'var(--boost-border, #e2e8f0)',
          },
        },
        borderRadius: {
          boost: 'var(--boost-radius, 12px)',
        },
        boxShadow: {
          'boost-sm': 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
          'boost-md': 'var(--boost-shadow-md, 0 4px 16px -2px rgba(0, 0, 0, 0.08))',
          'boost-lg': 'var(--boost-shadow-lg, 0 12px 32px -4px rgba(0, 0, 0, 0.12))',
          'boost-glow': 'var(--boost-shadow-glow, 0 0 24px rgba(37, 99, 235, 0.22))',
        },
      },
    },
  };
}
