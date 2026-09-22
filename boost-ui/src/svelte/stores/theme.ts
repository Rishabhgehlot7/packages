import { writable, derived } from 'svelte/store';

export type ThemeMode = 'light' | 'dark' | 'system';

function createThemeStore(defaultMode: ThemeMode = 'system') {
  const stored = typeof localStorage !== 'undefined'
    ? (localStorage.getItem('boost-theme') as ThemeMode) || defaultMode
    : defaultMode;

  const { subscribe, set, update } = writable<ThemeMode>(stored);
  const darkQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  if (darkQuery) {
    darkQuery.addEventListener('change', (e) => {
      update((m) => m === 'system' ? m : m); // trigger re-evaluation
    });
  }

  const resolved = derived({ subscribe }, ($mode: any) => {
    if ($mode === 'system') return darkQuery?.matches ? 'dark' : 'light';
    return $mode as 'light' | 'dark';
  });

  const isDark = derived(resolved, ($r: any) => $r === 'dark');

  resolved.subscribe(($r: any) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', $r);
      document.documentElement.classList.toggle('dark', $r === 'dark');
    }
  });

  return {
    subscribe,
    set,
    update,
    resolved,
    isDark,
    toggle: () => update((m) => {
      const next = resolved ? (darkQuery?.matches ? 'dark' : 'light') : m;
      if (m === 'system') {
        const r = darkQuery?.matches ? 'dark' : 'light';
        return r === 'dark' ? 'light' : 'dark';
      }
      return m === 'dark' ? 'light' : 'dark';
    }),
  };
}

export const themeStore = createThemeStore();