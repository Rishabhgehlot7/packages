import { ref, computed, watch, type Ref } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_KEY = 'boost-theme';

export function useTheme(defaultMode: ThemeMode = 'system') {
  const mode = ref<ThemeMode>('system');
  const systemIsDark = ref(false);

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    mode.value = stored || defaultMode;
    systemIsDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      systemIsDark.value = e.matches;
    });
  }

  const resolvedMode = computed<'light' | 'dark'>(() =>
    mode.value === 'system' ? (systemIsDark.value ? 'dark' : 'light') : mode.value
  );
  const isDark = computed(() => resolvedMode.value === 'dark');

  watch(resolvedMode, (val) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', val);
      if (val === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, { immediate: true });

  function setMode(newMode: ThemeMode) {
    mode.value = newMode;
    if (typeof window !== 'undefined') localStorage.setItem(THEME_KEY, newMode);
  }
  function toggle() { setMode(resolvedMode.value === 'dark' ? 'light' : 'dark'); }

  return { mode: mode as Ref<ThemeMode>, resolvedMode, isDark, setMode, toggle };
}