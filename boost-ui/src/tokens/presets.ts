import { UIStylePreset, PresetTokens } from '../types/presets';

export const presetTokenCssVars = {
  minimal: {
    '--boost-preset-radius': '8px',
    '--boost-preset-border-width': '1px',
    '--boost-preset-shadow': '0 1px 3px rgba(0, 0, 0, 0.05)',
    '--boost-preset-shadow-hover': '0 2px 6px rgba(0, 0, 0, 0.1)',
    '--boost-preset-backdrop-blur': 'none',
    '--boost-preset-surface-opacity': '1',
  },
  glassmorphism: {
    '--boost-preset-radius': '12px',
    '--boost-preset-border-width': '1px',
    '--boost-preset-shadow': '0 4px 20px rgba(0, 0, 0, 0.1)',
    '--boost-preset-shadow-hover': '0 8px 32px rgba(0, 0, 0, 0.15)',
    '--boost-preset-backdrop-blur': '16px',
    '--boost-preset-surface-opacity': '0.85',
  },
  neumorphism: {
    '--boost-preset-radius': '16px',
    '--boost-preset-border-width': '0px',
    '--boost-preset-shadow': '6px 6px 12px #c5cad3, -6px -6px 12px #ffffff',
    '--boost-preset-shadow-hover': '-6px -6px 12px #c5cad3, 6px 6px 12px #ffffff',
    '--boost-preset-backdrop-blur': 'none',
    '--boost-preset-surface-opacity': '1',
  },
  'neo-brutalism': {
    '--boost-preset-radius': '0px',
    '--boost-preset-border-width': '2px',
    '--boost-preset-shadow': '4px 4px 0px #000',
    '--boost-preset-shadow-hover': '6px 6px 0px #000',
    '--boost-preset-backdrop-blur': 'none',
    '--boost-preset-surface-opacity': '1',
  },
  'dark-first': {
    '--boost-preset-radius': '8px',
    '--boost-preset-border-width': '1px',
    '--boost-preset-shadow': '0 4px 16px -2px rgba(0, 0, 0, 0.45)',
    '--boost-preset-shadow-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.5)',
    '--boost-preset-backdrop-blur': 'none',
    '--boost-preset-surface-opacity': '0.95',
  },
  'gradient-glow': {
    '--boost-preset-radius': '12px',
    '--boost-preset-border-width': '1px',
    '--boost-preset-shadow': '0 0 20px rgba(99, 102, 241, 0.35)',
    '--boost-preset-shadow-hover': '0 0 30px rgba(99, 102, 241, 0.45)',
    '--boost-preset-backdrop-blur': 'none',
    '--boost-preset-surface-opacity': '1',
  },
  'material-you': {
    '--boost-preset-radius': 'calc(var(--boost-radius, 4px) * 1.2)',
    '--boost-preset-border-width': '1px',
    '--boost-preset-shadow': '0 2px 8px rgba(0, 0, 0, 0.1)',
    '--boost-preset-shadow-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
    '--boost-preset-backdrop-blur': 'none',
    '--boost-preset-surface-opacity': '0.9',
  },
};

export type PresetTokenCssVars = typeof presetTokenCssVars;

export const presetHelperClasses: Record<UIStylePreset, string> = {
  minimal: '',
  glassmorphism: '.boost-preset-glassmorphism { backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.85); border: 1px solid rgba(226, 232, 240, 0.8); }',
  neumorphism: '.boost-preset-neumorphism { box-shadow: 6px 6px 12px #c5cad3, -6px -6px 12px #ffffff; }',
  'neo-brutalism': '.boost-preset-neo-brutalism { box-shadow: 4px 4px 0px #000; border: 2px solid #000; }',
  'gradient-glow': '.boost-preset-gradient-glow { box-shadow: 0 0 20px rgba(99, 102, 241, 0.35); }',
  'dark-first': '',
  'material-you': '',
};