import * as React from 'react';
import { lightNativeTokens, darkNativeTokens, type NativeTokens } from './tokens';

export interface BoostNativeProviderProps {
  children: React.ReactNode;
  mode?: 'light' | 'dark' | 'system';
  tokens?: Partial<NativeTokens>;
  darkTokens?: Partial<NativeTokens>;
}

const NativeThemeContext = React.createContext<{
  tokens: NativeTokens; isDark: boolean;
}>({ tokens: lightNativeTokens, isDark: false });

export const useBoostNative = () => React.useContext(NativeThemeContext);

export const BoostNativeProvider: React.FC<BoostNativeProviderProps> = ({
  children, mode = 'system', tokens = {}, darkTokens: darkOverrides = {},
}) => {
  const [systemDark, setSystemDark] = React.useState(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedMode = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  const isDark = resolvedMode === 'dark';
  const mergedTokens = isDark ? { ...darkNativeTokens, ...darkOverrides } : { ...lightNativeTokens, ...tokens };

  return (
    <NativeThemeContext.Provider value={{ tokens: mergedTokens, isDark }}>
      {children}
    </NativeThemeContext.Provider>
  );
};

BoostNativeProvider.displayName = 'BoostNativeProvider';