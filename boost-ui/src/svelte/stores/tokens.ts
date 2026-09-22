import { derived } from 'svelte/store';
import { themeStore } from './theme';

interface SvelteTokens {
  bg: string; surface: string; text: string; textMuted: string;
  border: string; primary: string; success: string;
  warning: string; destructive: string; info: string;
}

const light: SvelteTokens = {
  bg: '#ffffff', surface: '#f8fafc', text: '#0f172a', textMuted: '#64748b',
  border: '#e2e8f0', primary: '#2563eb', success: '#16a34a',
  warning: '#f59e0b', destructive: '#ef4444', info: '#2563eb',
};

const dark: SvelteTokens = {
  bg: '#090d16', surface: '#0f172a', text: '#f8fafc', textMuted: '#94a3b8',
  border: '#1e293b', primary: '#3b82f6', success: '#22c55e',
  warning: '#fbbf24', destructive: '#f87171', info: '#60a5fa',
};

export const tokenStore = derived(themeStore.isDark, ($isDark: any) => $isDark ? dark : light);