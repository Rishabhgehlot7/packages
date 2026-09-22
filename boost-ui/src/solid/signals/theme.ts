import { createSignal, createEffect, onMount } from 'solid-js';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * useTheme — Solid.js reactive signal for BoostEngine theme.
 *
 * @example
 * ```tsx
 * const [mode, { toggle, isDark }] = useTheme();
 * ```
 */
export function useTheme(defaultMode: ThemeMode = 'system') {
  const stored = typeof localStorage !== 'undefined'
    ? localStorage.getItem('boost-theme')
    : null;
  const [mode, setMode] = createSignal<ThemeMode>(
    (stored as ThemeMode) || defaultMode
  );
  const [systemDark, setSystemDark] = createSignal(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );

  onMount(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', (e) => setSystemDark(e.matches));
  });

  const resolved = () => {
    const m = mode();
    return m === 'system' ? (systemDark() ? 'dark' : 'light') : m;
  };
  const isDark = () => resolved() === 'dark';

  createEffect(() => {
    const r = resolved();
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', r);
      document.documentElement.classList.toggle('dark', r === 'dark');
    }
  });

  const toggle = () => {
    const next = resolved() === 'dark' ? 'light' : 'dark';
    setMode(next);
    localStorage.setItem('boost-theme', next);
  };

  return [mode, { setMode, toggle, resolved, isDark }] as const;
}

/**
 * useTokens — Solid.js reactive signal returning current design tokens.
 *
 * @example
 * const tokens = useTokens();
 * return <div style={{ background: tokens().bg }} />;
 */
export function useTokens() {
  const [, { isDark }] = useTheme();
  return () => {
    const dark = isDark();
    return dark ? darkTokens : lightTokens;
  };
}

const lightTokens = {
  bg: '#ffffff', surface: '#f8fafc', text: '#0f172a', textMuted: '#64748b',
  border: '#e2e8f0', primary: '#2563eb', success: '#16a34a',
  warning: '#f59e0b', destructive: '#ef4444', info: '#2563eb',
};
const darkTokens = {
  bg: '#090d16', surface: '#0f172a', text: '#f8fafc', textMuted: '#94a3b8',
  border: '#1e293b', primary: '#3b82f6', success: '#22c55e',
  warning: '#fbbf24', destructive: '#f87171', info: '#60a5fa',
};