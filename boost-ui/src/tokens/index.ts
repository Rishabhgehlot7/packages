/**
 * @boostengine/tokens — Core Design Token System
 *
 * Framework-independent token definitions for the BoostEngine UI ecosystem.
 * Use these tokens to maintain consistent theming across React, Vue, Svelte,
 * React Native, or any other framework.
 *
 * @example
 * ```ts
 * import { lightTokens, darkTokens } from '@boostengine/tokens';
 * const styles = { backgroundColor: lightTokens.bg };
 * ```
 */

// ─── Token Types ───────────────────────────────────────────────────

export interface BoostTokens {
  /** Base background color */
  bg: string;
  /** Card/surface background color */
  surface: string;
  /** Secondary surface (hover states, input bg) */
  surfaceSecondary: string;
  /** Tertiary surface */
  surfaceTertiary: string;
  /** Primary text color */
  text: string;
  /** Muted/secondary text color */
  textMuted: string;
  /** Border color */
  border: string;
  /** Stronger border (high contrast) */
  borderStrong: string;
  /** Primary brand color */
  primary: string;
  /** Primary hover state */
  primaryHover: string;
  /** Color for text/icon on primary surfaces */
  onPrimary: string;
  /** Success feedback */
  success: string;
  /** Success background tint */
  successBg: string;
  /** Success border */
  successBorder: string;
  /** Success text */
  successText: string;
  /** Warning feedback */
  warning: string;
  /** Warning background tint */
  warningBg: string;
  /** Warning border */
  warningBorder: string;
  /** Warning text */
  warningText: string;
  /** Destructive/error feedback */
  destructive: string;
  /** Alias for destructive */
  danger: string;
  /** Destructive background tint */
  destructiveBg: string;
  /** Destructive border */
  destructiveBorder: string;
  /** Destructive text */
  destructiveText: string;
  /** Info feedback */
  info: string;
  /** Info background tint */
  infoBg: string;
  /** Info border */
  infoBorder: string;
  /** Info text */
  infoText: string;
  /** Base border radius */
  radius: string;
  /** Font family stack */
  fontFamily: string;
  /** Small shadow */
  shadowSm: string;
  /** Medium shadow */
  shadowMd: string;
  /** Large shadow */
  shadowLg: string;
  /** Glow shadow (for primary actions) */
  shadowGlow: string;
  /** Extra large shadow */
  shadowXl: string;
  /** Glassmorphism background blend */
  glassBg: string;
  /** Glassmorphism border */
  glassBorder: string;
  /** Glassmorphism shadow */
  glassShadow: string;
  /** Backdrop blur value */
  blur: string;
  /** Overlay/modal backdrop */
  overlayBackdrop: string;
  /** Overlay scrim (partial overlay) */
  overlayScrim: string;
  /** Disabled background */
  disabledBg: string;
  /** Disabled opacity */
  disabledOpacity: string;
  /** Neumorphism surface color */
  neuroSurface: string;
  /** Neumorphism outer shadow */
  neuroShadow: string;
  /** Neumorphism hover shadow */
  neuroShadowHover: string;
  /** Neumorphism inset shadow */
  neuroShadowInset: string;
  /** Card shadow (neurmorphism fallback) */
  cardShadow: string;
  /** Card hover shadow */
  cardShadowHover: string;
  /** Border width */
  borderWidth: string;
}

// ─── Light Tokens ──────────────────────────────────────────────────

export const lightTokens: BoostTokens = {
  bg: '#ffffff',
  surface: '#f8fafc',
  surfaceSecondary: '#f1f5f9',
  surfaceTertiary: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  onPrimary: '#ffffff',
  success: '#16a34a',
  successBg: 'rgba(22, 163, 74, 0.1)',
  successBorder: 'rgba(22, 163, 74, 0.25)',
  successText: '#15803d',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  warningBorder: 'rgba(245, 158, 11, 0.25)',
  warningText: '#b45309',
  destructive: '#ef4444',
  danger: '#ef4444',
  destructiveBg: 'rgba(239, 68, 68, 0.1)',
  destructiveBorder: 'rgba(239, 68, 68, 0.25)',
  destructiveText: '#dc2626',
  info: '#2563eb',
  infoBg: 'rgba(37, 99, 235, 0.1)',
  infoBorder: 'rgba(37, 99, 235, 0.25)',
  infoText: '#1d4ed8',
  radius: '12px',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  shadowSm: '0 1px 3px rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 16px -2px rgba(0, 0, 0, 0.08)',
  shadowLg: '0 12px 32px -4px rgba(0, 0, 0, 0.12)',
  shadowGlow: '0 0 24px rgba(37, 99, 235, 0.22)',
  shadowXl: '0 20px 40px -8px rgba(0, 0, 0, 0.15)',
  glassBg: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(226, 232, 240, 0.8)',
  glassShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  blur: '16px',
  overlayBackdrop: 'rgba(0, 0, 0, 0.56)',
  overlayScrim: 'rgba(0, 0, 0, 0.32)',
  disabledBg: 'rgba(0, 0, 0, 0.04)',
  disabledOpacity: '0.5',
  neuroSurface: '#e8ebf0',
  neuroShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
  neuroShadowHover: '12px 12px 24px #c5cad3, -12px -12px 24px #ffffff',
  neuroShadowInset: 'inset 4px 4px 8px #c5cad3, inset -4px -4px 8px #ffffff',
  cardShadow: '6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff',
  cardShadowHover: '8px 8px 18px #c5cad3, -8px -8px 18px #ffffff',
  borderWidth: '1px',
};

// ─── Dark Tokens ───────────────────────────────────────────────────

export const darkTokens: BoostTokens = {
  bg: '#090d16',
  surface: '#0f172a',
  surfaceSecondary: '#1e293b',
  surfaceTertiary: '#273040',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  border: '#1e293b',
  borderStrong: '#334155',
  primary: '#3b82f6',
  primaryHover: '#60a5fa',
  onPrimary: '#ffffff',
  success: '#22c55e',
  successBg: 'rgba(34, 197, 94, 0.15)',
  successBorder: 'rgba(34, 197, 94, 0.3)',
  successText: '#4ade80',
  warning: '#fbbf24',
  warningBg: 'rgba(251, 191, 36, 0.15)',
  warningBorder: 'rgba(251, 191, 36, 0.3)',
  warningText: '#fde047',
  destructive: '#f87171',
  danger: '#f87171',
  destructiveBg: 'rgba(248, 113, 113, 0.15)',
  destructiveBorder: 'rgba(248, 113, 113, 0.3)',
  destructiveText: '#fca5a5',
  info: '#60a5fa',
  infoBg: 'rgba(96, 165, 250, 0.15)',
  infoBorder: 'rgba(96, 165, 250, 0.3)',
  infoText: '#93c5fd',
  radius: '12px',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  shadowSm: '0 1px 3px rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 16px -2px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 12px 32px -4px rgba(0, 0, 0, 0.55)',
  shadowGlow: '0 0 24px rgba(59, 130, 246, 0.35)',
  shadowXl: '0 20px 40px -8px rgba(0, 0, 0, 0.6)',
  glassBg: 'rgba(15, 23, 42, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  blur: '16px',
  overlayBackdrop: 'rgba(0, 0, 0, 0.72)',
  overlayScrim: 'rgba(0, 0, 0, 0.5)',
  disabledBg: 'rgba(255, 255, 255, 0.06)',
  disabledOpacity: '0.5',
  neuroSurface: '#141c2a',
  neuroShadow: '8px 8px 16px #090d15, -8px -8px 16px #151d2c',
  neuroShadowHover: '12px 12px 24px #060a10, -12px -12px 24px #1a2435',
  neuroShadowInset: 'inset 4px 4px 8px #090d15, inset -4px -4px 8px #151d2c',
  cardShadow: '6px 6px 14px #090d15, -6px -6px 14px #151d2c',
  cardShadowHover: '8px 8px 18px #060a10, -8px -8px 18px #1a2435',
  borderWidth: '1px',
};

// ─── Helper Functions ──────────────────────────────────────────────

/**
 * resolveTokens — Picks the correct token set based on the current theme mode.
 * @example
 * const tokens = resolveTokens('dark');
 */
export function resolveTokens(mode: 'light' | 'dark'): BoostTokens {
  return mode === 'dark' ? darkTokens : lightTokens;
}

/**
 * tokensToCssVars — Converts a BoostTokens object to CSS custom property definitions.
 * @example
 * <style>{tokensToCssVars(lightTokens)}</style>
 */
export function tokensToCssVars(tokens: BoostTokens): string {
  const map: Record<string, string> = {
    bg: '--boost-bg',
    surface: '--boost-surface',
    surfaceSecondary: '--boost-surface-secondary',
    text: '--boost-text',
    textMuted: '--boost-text-muted',
    border: '--boost-border',
    primary: '--boost-primary',
    primaryHover: '--boost-primary-hover',
    success: '--boost-success',
    warning: '--boost-warning',
    destructive: '--boost-destructive',
    danger: '--boost-danger',
    info: '--boost-info',
    radius: '--boost-radius',
    fontFamily: '--boost-font',
    shadowSm: '--boost-shadow-sm',
    shadowMd: '--boost-shadow-md',
    shadowLg: '--boost-shadow-lg',
    glassBg: '--boost-glass-bg',
    glassBorder: '--boost-glass-border',
    overlayBackdrop: '--boost-overlay-backdrop',
    disabledBg: '--boost-disabled-bg',
    neuroSurface: '--boost-neuro-surface',
    neuroShadow: '--boost-neuro-shadow',
    cardShadow: '--card-shadow',
    cardShadowHover: '--card-shadow-hover',
  };

  const lines = Object.entries(map)
    .filter(([key]) => (tokens as any)[key] !== undefined)
    .map(([key, cssVar]) => `  ${cssVar}: ${(tokens as any)[key]};`);

  return `:root {\n${lines.join('\n')}\n}`;
}