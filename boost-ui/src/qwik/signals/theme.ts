import { signal, useVisibleTask$ } from '@builder.io/qwik';

export type ThemeMode = 'light' | 'dark' | 'system';

export function useTheme(defaultMode: ThemeMode = 'system') {
  const stored = typeof localStorage !== 'undefined'
    ? localStorage.getItem('boost-theme')
    : null;
  const mode = signal<ThemeMode>((stored as ThemeMode) || defaultMode);
  const systemDark = signal(false);

  useVisibleTask$(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    systemDark.value = mq.matches;
    mq.addEventListener('change', (e) => { systemDark.value = e.matches; });
  });

  const resolved = () => mode.value === 'system' ? (systemDark.value ? 'dark' : 'light') : mode.value;
  const isDark = () => resolved() === 'dark';

  const toggle = () => {
    const next = resolved() === 'dark' ? 'light' : 'dark';
    mode.value = next;
    localStorage.setItem('boost-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return {
    mode: mode.value,
    resolved: resolved(),
    isDark: isDark(),
    toggle,
    setMode: (newMode: ThemeMode) => {
      mode.value = newMode;
      localStorage.setItem('boost-theme', newMode);
    },
  };
}

export function useTokens() {
  return { value: { bg: '#ffffff', surface: '#f8fafc', text: '#0f172a' } };
}