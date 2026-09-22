import { computed } from 'vue';
import { useTheme } from './useTheme';

interface VueTokens {
  bg: string; surface: string; surfaceSecondary: string;
  text: string; textMuted: string; border: string;
  primary: string; success: string; warning: string;
  destructive: string; info: string;
  shadowSm: string; shadowMd: string; shadowLg: string;
}

const light: VueTokens = {
  bg: '#ffffff', surface: '#f8fafc', surfaceSecondary: '#f1f5f9',
  text: '#0f172a', textMuted: '#64748b', border: '#e2e8f0',
  primary: '#2563eb', success: '#16a34a', warning: '#f59e0b',
  destructive: '#ef4444', info: '#2563eb',
  shadowSm: '0 1px 3px rgba(0,0,0,0.05)',
  shadowMd: '0 4px 16px -2px rgba(0,0,0,0.08)',
  shadowLg: '0 12px 32px -4px rgba(0,0,0,0.12)',
};

const dark: VueTokens = {
  bg: '#090d16', surface: '#0f172a', surfaceSecondary: '#1e293b',
  text: '#f8fafc', textMuted: '#94a3b8', border: '#1e293b',
  primary: '#3b82f6', success: '#22c55e', warning: '#fbbf24',
  destructive: '#f87171', info: '#60a5fa',
  shadowSm: '0 1px 3px rgba(0,0,0,0.3)',
  shadowMd: '0 4px 16px -2px rgba(0,0,0,0.4)',
  shadowLg: '0 12px 32px -4px rgba(0,0,0,0.55)',
};

export function useTokens() {
  const theme = useTheme();
  const tokens = computed<VueTokens>(() => theme.isDark.value ? dark : light);
  return { tokens, isDark: theme.isDark, resolvedMode: theme.resolvedMode };
}