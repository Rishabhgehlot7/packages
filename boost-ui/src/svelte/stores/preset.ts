import { writable } from 'svelte/store';

export type PresetName = 'minimal' | 'glassmorphism' | 'neumorphism' | 'neo-brutalism' | 'dark-first' | 'gradient-glow' | 'material-you';

function createPresetStore(defaultPreset: PresetName = 'minimal') {
  const stored = typeof localStorage !== 'undefined'
    ? (localStorage.getItem('boost-preset') as PresetName) || defaultPreset
    : defaultPreset;

  const { subscribe, set } = writable<PresetName>(stored);

  subscribe((p) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-boost-preset', p);
    }
  });

  return {
    subscribe,
    set: (newPreset: PresetName) => {
      if (typeof localStorage !== 'undefined') localStorage.setItem('boost-preset', newPreset);
      set(newPreset);
    },
  };
}

export const presetStore = createPresetStore();