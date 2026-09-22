import { ref } from 'vue';

export type UIStylePreset = 'minimal' | 'glassmorphism' | 'neumorphism' | 'neo-brutalism' | 'dark-first' | 'gradient-glow' | 'material-you';

const PRESET_KEY = 'boost-preset';

export function usePreset(defaultPreset: UIStylePreset = 'minimal') {
  const preset = ref<UIStylePreset>('minimal');
  const presets: UIStylePreset[] = ['minimal', 'glassmorphism', 'neumorphism', 'neo-brutalism', 'dark-first', 'gradient-glow', 'material-you'];

  if (typeof window !== 'undefined') {
    preset.value = (localStorage.getItem(PRESET_KEY) as UIStylePreset) || defaultPreset;
  }

  function setPreset(newPreset: UIStylePreset) {
    preset.value = newPreset;
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRESET_KEY, newPreset);
      document.documentElement.setAttribute('data-boost-preset', newPreset);
    }
  }

  return { preset, setPreset, presets };
}