import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { presetTokens } from '../types/presets';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeTokens {
  primary?: string;
  primaryHover?: string;
  background?: string;
  surface?: string;
  text?: string;
  textMuted?: string;
  border?: string;
  radius?: string;
  fontFamily?: string;
}

export interface BoostThemeConfig {
  mode?: ThemeMode;
  tokens?: ThemeTokens;
  darkTokens?: ThemeTokens;
  stylePreset?: UIStylePreset;
}

interface BoostThemeContextType {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  tokens: ThemeTokens;
  currency: string;
  locale: string;
  stylePreset: UIStylePreset;
  setStylePreset: (preset: UIStylePreset) => void;
}

const defaultLightTokens: ThemeTokens = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  radius: '8px',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const defaultDarkTokens: ThemeTokens = {
  primary: '#3b82f6',
  primaryHover: '#60a5fa',
  background: '#090d16',
  surface: '#0f172a',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  border: '#1e293b',
  radius: '8px',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const BoostThemeContext = React.createContext<BoostThemeContextType | undefined>(undefined);

// Injects fallback CSS vars + keyframes safely on demand (no module-load side-effects)
export function injectBoostGlobalStyles() {
  if (typeof document === 'undefined') return;
  const STYLE_ID = '__boost_ui_defaults__';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      :root, [data-theme="light"] {
        --boost-primary: #2563eb;
        --boost-primary-hover: #1d4ed8;
        --boost-bg: #ffffff;
        --boost-surface: #f8fafc;
        --boost-text: #0f172a;
        --boost-text-muted: #64748b;
        --boost-muted: #64748b;
        --boost-border: #e2e8f0;
        --boost-radius: 12px;
        --boost-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --boost-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
        --boost-shadow-md: 0 4px 16px -2px rgba(0, 0, 0, 0.08);
        --boost-shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.12);
        --boost-shadow-glow: 0 0 24px rgba(37, 99, 235, 0.22);
        --boost-glass-bg: rgba(255, 255, 255, 0.85);
        --boost-glass-border: rgba(226, 232, 240, 0.8);
      }
      [data-theme="dark"], .dark {
        --boost-primary: #3b82f6;
        --boost-primary-hover: #60a5fa;
        --boost-bg: #090d16;
        --boost-surface: #0f172a;
        --boost-text: #f8fafc;
        --boost-text-muted: #94a3b8;
        --boost-muted: #94a3b8;
        --boost-border: #1e293b;
        --boost-radius: 12px;
        --boost-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --boost-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
        --boost-shadow-md: 0 4px 16px -2px rgba(0, 0, 0, 0.4);
        --boost-shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.55);
        --boost-shadow-glow: 0 0 24px rgba(59, 130, 246, 0.35);
        --boost-glass-bg: rgba(15, 23, 42, 0.85);
        --boost-glass-border: rgba(255, 255, 255, 0.1);
        color-scheme: dark;
      }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          --boost-primary: #3b82f6;
          --boost-primary-hover: #60a5fa;
          --boost-bg: #090d16;
          --boost-surface: #0f172a;
          --boost-text: #f8fafc;
          --boost-text-muted: #94a3b8;
          --boost-muted: #94a3b8;
          --boost-border: #1e293b;
          --boost-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
          --boost-shadow-md: 0 4px 16px -2px rgba(0, 0, 0, 0.4);
          --boost-shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.55);
          --boost-shadow-glow: 0 0 24px rgba(59, 130, 246, 0.35);
          --boost-glass-bg: rgba(15, 23, 42, 0.85);
          --boost-glass-border: rgba(255, 255, 255, 0.1);
          color-scheme: dark;
        }
      }

      /* Dark theme contrast safety guards */
      [data-theme="dark"] .boost-btn-secondary,
      .dark .boost-btn-secondary {
        background-color: var(--boost-surface, #0f172a) !important;
        color: var(--boost-text, #f8fafc) !important;
        border-color: var(--boost-border, #1e293b) !important;
      }
      [data-theme="dark"] .boost-btn-outline,
      .dark .boost-btn-outline {
        color: var(--boost-text, #f8fafc) !important;
        border-color: var(--boost-border, #334155) !important;
      }
      [data-theme="dark"] .boost-btn-ghost,
      .dark .boost-btn-ghost {
        color: var(--boost-text, #f8fafc) !important;
      }
      [data-theme="dark"] input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]),
      .dark input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]),
      [data-theme="dark"] textarea,
      .dark textarea,
      [data-theme="dark"] select,
      .dark select {
        background-color: var(--boost-surface, #0f172a);
        color: var(--boost-text, #f8fafc);
        border-color: var(--boost-border, #1e293b);
      }
      [data-theme="dark"] .boost-badge-success, .dark .boost-badge-success { color: #4ade80 !important; }
      [data-theme="dark"] .boost-badge-warning, .dark .boost-badge-warning { color: #fbbf24 !important; }
      [data-theme="dark"] .boost-badge-destructive, .dark .boost-badge-destructive { color: #f87171 !important; }
      @keyframes boost-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes boost-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes boost-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes boost-fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes boost-slideUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes boost-slideDown {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes boost-scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes boost-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
    `;
    document.head.appendChild(style);
  }
}

export interface BoostProviderProps {
  children: React.ReactNode;
  mode?: ThemeMode;
  defaultMode?: ThemeMode;
  storageKey?: string;
  syncDocumentClass?: boolean;
  tokens?: ThemeTokens;
  darkTokens?: ThemeTokens;
  currency?: string;
  locale?: string;
  className?: string;
  stylePreset?: UIStylePreset;
  defaultStylePreset?: UIStylePreset;
  syncDocumentPreset?: boolean;
}

export const BoostProvider: React.FC<BoostProviderProps> = ({
  children,
  mode: controlledMode,
  defaultMode = 'system',
  storageKey = 'boost-theme',
  syncDocumentClass = true,
  tokens = {},
  darkTokens = {},
  currency = '$',
  locale = 'en-US',
  className = '',
  stylePreset: controlledStylePreset,
  defaultStylePreset = 'minimal',
  syncDocumentPreset = true,
}) => {
  // Inject default animations and CSS variables on mount without top-level evaluation side effects
  React.useEffect(() => {
    injectBoostGlobalStyles();
  }, []);
  const [internalMode, setInternalMode] = React.useState<ThemeMode>(() => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          return stored as ThemeMode;
        }
      } catch {
        // Safe fallback on localStorage access error
      }
    }
    return defaultMode;
  });

const mode = controlledMode !== undefined ? controlledMode : internalMode;
  const [systemIsDark, setSystemIsDark] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedMode = mode === 'system' ? (systemIsDark ? 'dark' : 'light') : mode;

  // Synchronize document attribute and class for full html body support
  React.useEffect(() => {
    if (typeof document === 'undefined' || !syncDocumentClass) return;
    document.documentElement.setAttribute('data-theme', resolvedMode);
    if (resolvedMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [resolvedMode, syncDocumentClass]);

  const currentTokens = React.useMemo(() => {
    if (resolvedMode === 'dark') {
      return { ...defaultDarkTokens, ...darkTokens };
    }
    return { ...defaultLightTokens, ...tokens };
  }, [resolvedMode, tokens, darkTokens]);

  const setMode = (newMode: ThemeMode) => {
    setInternalMode(newMode);
    if (typeof window !== 'undefined' && storageKey) {
      try {
        localStorage.setItem(storageKey, newMode);
      } catch {
        // Safe ignore
      }
    }
  };

const toggleMode = () => {
    const nextMode = resolvedMode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
  };

  const [internalStylePreset, setInternalStylePreset] = React.useState<UIStylePreset>(
    () => {
      if (typeof window !== 'undefined' && storageKey) {
        try {
          const stored = localStorage.getItem(`${storageKey}-preset`);
          if (
            stored === 'minimal' ||
            stored === 'glassmorphism' ||
            stored === 'neumorphism' ||
            stored === 'neo-brutalism' ||
            stored === 'dark-first' ||
            stored === 'gradient-glow' ||
            stored === 'material-you'
          ) {
            return stored as UIStylePreset;
          }
        } catch {
          // Safe fallback on localStorage access error
        }
      }
      return defaultStylePreset;
    }
  );

  const stylePreset =
    controlledStylePreset !== undefined ? controlledStylePreset : internalStylePreset;

  const setStylePreset = (preset: UIStylePreset) => {
    setInternalStylePreset(preset);
    if (typeof window !== 'undefined' && storageKey) {
      try {
        localStorage.setItem(`${storageKey}-preset`, preset);
      } catch {
        // Safe ignore
      }
    }
  };

  // Synchronize preset attribute on document element
  React.useEffect(() => {
    if (typeof document === 'undefined' || !syncDocumentPreset) return;
    document.documentElement.setAttribute('data-boost-preset', stylePreset);
  }, [stylePreset, syncDocumentPreset]);

  // Inject CSS Variables for zero-config theming
  const cssVariables = React.useMemo(() => {
    const isDark = resolvedMode === 'dark';
    return `
      :root {
        --boost-primary: ${currentTokens.primary};
        --boost-primary-hover: ${currentTokens.primaryHover};
        --boost-bg: ${currentTokens.background};
        --boost-surface: ${currentTokens.surface};
        --boost-text: ${currentTokens.text};
        --boost-text-muted: ${currentTokens.textMuted};
        --boost-muted: ${currentTokens.textMuted};
        --boost-border: ${currentTokens.border};
        --boost-radius: ${currentTokens.radius};
        --boost-font: ${currentTokens.fontFamily};
        --boost-shadow-sm: ${isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)'};
        --boost-shadow-md: ${isDark ? '0 4px 16px -2px rgba(0, 0, 0, 0.4)' : '0 4px 16px -2px rgba(0, 0, 0, 0.08)'};
        --boost-shadow-lg: ${isDark ? '0 12px 32px -4px rgba(0, 0, 0, 0.55)' : '0 12px 32px -4px rgba(0, 0, 0, 0.12)'};
        --boost-shadow-glow: 0 0 24px ${isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(37, 99, 235, 0.22)'};
        --boost-glass-bg: ${isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
        --boost-glass-border: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.8)'};
      }
[data-theme="${resolvedMode}"] {
        --boost-primary: ${currentTokens.primary};
        --boost-primary-hover: ${currentTokens.primaryHover};
        --boost-bg: ${currentTokens.background};
        --boost-surface: ${currentTokens.surface};
        --boost-text: ${currentTokens.text};
        --boost-text-muted: ${currentTokens.textMuted};
        --boost-muted: ${currentTokens.textMuted};
        --boost-border: ${currentTokens.border};
      }
      [data-boost-preset="${stylePreset}"] {
        --boost-preset-radius: ${presetTokens[stylePreset].radius};
        --boost-preset-border-width: ${presetTokens[stylePreset].borderWidth};
        --boost-preset-shadow: ${presetTokens[stylePreset].shadow};
        --boost-preset-shadow-hover: ${presetTokens[stylePreset].shadowHover};
        --boost-preset-backdrop-blur: ${presetTokens[stylePreset].backdropBlur};
        --boost-preset-surface-opacity: ${presetTokens[stylePreset].surfaceOpacity};
      }
    `;
  }, [currentTokens, resolvedMode, stylePreset]);

  return (
    <BoostThemeContext.Provider
value={{
        mode,
        resolvedMode,
        setMode,
        toggleMode,
        tokens: currentTokens,
        currency,
        locale,
        stylePreset,
        setStylePreset,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      <div
        className={`boost-theme-wrapper ${resolvedMode} ${className}`}
        data-theme={resolvedMode}
        data-boost-preset={stylePreset}
        style={{
          backgroundColor: currentTokens.background,
          color: currentTokens.text,
          fontFamily: currentTokens.fontFamily,
          minHeight: '100%',
          transition: 'background-color 0.2s ease, color 0.2s ease',
        }}
      >
        {children}
      </div>
    </BoostThemeContext.Provider>
  );
};

export const useTheme = (): BoostThemeContextType => {
  const context = React.useContext(BoostThemeContext);
  if (!context) {
    // Fallback safe context if user did not wrap with BoostProvider
    return {
      mode: 'light',
      resolvedMode: 'light',
      setMode: () => {},
      toggleMode: () => {},
      tokens: defaultLightTokens,
      currency: '$',
      locale: 'en-US',
      stylePreset: 'minimal',
      setStylePreset: () => {},
    };
  }
  return context;
};

export const useBoostPreset = () => {
  const theme = useTheme();
  return {
    stylePreset: theme.stylePreset || 'minimal',
    setStylePreset: theme.setStylePreset,
  };
};

export const useCurrency = () => {
  const theme = useTheme();
  return {
    currency: theme.currency || '$',
    locale: theme.locale || 'en-US',
  };
};

BoostProvider.displayName = 'BoostProvider';

