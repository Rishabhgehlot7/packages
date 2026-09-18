import * as React from 'react';

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
}

interface BoostThemeContextType {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  tokens: ThemeTokens;
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

// Inject fallback CSS vars + keyframes once at module load (no-BoostProvider safety)
// This ensures Skeleton shimmer, Spinner spin, etc. work even without BoostProvider
if (typeof document !== 'undefined') {
  const STYLE_ID = '__boost_ui_defaults__';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --boost-primary: #2563eb;
        --boost-primary-hover: #1d4ed8;
        --boost-bg: #ffffff;
        --boost-surface: #f8fafc;
        --boost-text: #0f172a;
        --boost-text-muted: #64748b;
        --boost-border: #e2e8f0;
        --boost-radius: 8px;
        --boost-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
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
    `;
    document.head.appendChild(style);
  }
}

export interface BoostProviderProps {
  children: React.ReactNode;
  mode?: ThemeMode;
  defaultMode?: ThemeMode;
  tokens?: ThemeTokens;
  darkTokens?: ThemeTokens;
  className?: string;
}

export const BoostProvider: React.FC<BoostProviderProps> = ({
  children,
  mode: controlledMode,
  defaultMode = 'system',
  tokens = {},
  darkTokens = {},
  className = '',
}) => {
  const [internalMode, setInternalMode] = React.useState<ThemeMode>(defaultMode);
  const mode = controlledMode !== undefined ? controlledMode : internalMode;
  const [systemIsDark, setSystemIsDark] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedMode = mode === 'system' ? (systemIsDark ? 'dark' : 'light') : mode;

  const currentTokens = React.useMemo(() => {
    if (resolvedMode === 'dark') {
      return { ...defaultDarkTokens, ...darkTokens };
    }
    return { ...defaultLightTokens, ...tokens };
  }, [resolvedMode, tokens, darkTokens]);

  const toggleMode = () => {
    const nextMode = resolvedMode === 'dark' ? 'light' : 'dark';
    setInternalMode(nextMode);
  };

  const setMode = (newMode: ThemeMode) => {
    setInternalMode(newMode);
  };

  // Inject CSS Variables for zero-config theming
  const cssVariables = React.useMemo(() => {
    return `
      :root {
        --boost-primary: ${currentTokens.primary};
        --boost-primary-hover: ${currentTokens.primaryHover};
        --boost-bg: ${currentTokens.background};
        --boost-surface: ${currentTokens.surface};
        --boost-text: ${currentTokens.text};
        --boost-text-muted: ${currentTokens.textMuted};
        --boost-border: ${currentTokens.border};
        --boost-radius: ${currentTokens.radius};
        --boost-font: ${currentTokens.fontFamily};
      }
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
      @keyframes boost-countdown {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
  }, [currentTokens]);

  return (
    <BoostThemeContext.Provider
      value={{
        mode,
        resolvedMode,
        setMode,
        toggleMode,
        tokens: currentTokens,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      <div
        className={`boost-theme-wrapper ${resolvedMode} ${className}`}
        data-theme={resolvedMode}
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
    };
  }
  return context;
};

BoostProvider.displayName = 'BoostProvider';
