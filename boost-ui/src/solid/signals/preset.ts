import { createSignal, createEffect } from 'solid-js';

export type PresetName = 'minimal' | 'glassmorphism' | 'neumorphism' | 'neo-brutalism' | 'dark-first' | 'gradient-glow' | 'material-you';

export function usePreset(defaultPreset: PresetName = 'minimal') {
  const stored = typeof localStorage !== 'undefined'
    ? localStorage.getItem('boost-preset')
    : null;
  const [preset, setPresetState] = createSignal<PresetName>(
    (stored as PresetName) || defaultPreset
  );

  createEffect(() => {
    const p = preset();
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-boost-preset', p);
    }
  });

  const setPreset = (newPreset: PresetName) => {
    setPresetState(newPreset);
    if (typeof localStorage !== 'undefined') localStorage.setItem('boost-preset', newPreset);
  };

  return [preset, { setPreset }] as const;
}