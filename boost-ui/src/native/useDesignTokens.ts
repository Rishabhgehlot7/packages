export function useDesignTokens() {
  // For React Native, use BoostNativeProvider context
  const { tokens, isDark } = { tokens: { bg: '#ffffff', surface: '#f8fafc', text: '#0f172a', primary: '#2563eb' } as any, isDark: false };
  return { tokens, isDark };
}