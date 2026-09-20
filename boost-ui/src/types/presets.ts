export type UIStylePreset =
  | 'minimal'
  | 'glassmorphism'
  | 'neumorphism'
  | 'neo-brutalism'
  | 'dark-first'
  | 'gradient-glow'
  | 'material-you';

export interface PresetTokens {
  radius: string;
  borderWidth: string;
  shadow: string;
  shadowHover: string;
  backdropBlur: string;
  surfaceOpacity: string;
}

export const presetTokens: Record<UIStylePreset, PresetTokens> = {
  minimal: {
    radius: '8px',
    borderWidth: '1px',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    shadowHover: '0 2px 6px rgba(0, 0, 0, 0.1)',
    backdropBlur: 'none',
    surfaceOpacity: '1',
  },
  glassmorphism: {
    radius: '12px',
    borderWidth: '1px',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    shadowHover: '0 8px 32px rgba(0, 0, 0, 0.15)',
    backdropBlur: '16px',
    surfaceOpacity: '0.85',
  },
  neumorphism: {
    radius: '16px',
    borderWidth: '0px',
    shadow: '6px 6px 12px #c5cad3, -6px -6px 12px #ffffff',
    shadowHover: '-6px -6px 12px #c5cad3, 6px 6px 12px #ffffff',
    backdropBlur: 'none',
    surfaceOpacity: '1',
  },
  'neo-brutalism': {
    radius: '0px',
    borderWidth: '2px',
    shadow: '4px 4px 0px #000',
    shadowHover: '6px 6px 0px #000',
    backdropBlur: 'none',
    surfaceOpacity: '1',
  },
  'dark-first': {
    radius: '8px',
    borderWidth: '1px',
    shadow: '0 4px 16px -2px rgba(0, 0, 0, 0.45)',
    shadowHover: '0 8px 24px -4px rgba(0, 0, 0, 0.5)',
    backdropBlur: 'none',
    surfaceOpacity: '0.95',
  },
  'gradient-glow': {
    radius: '12px',
    borderWidth: '1px',
    shadow: '0 0 20px rgba(99, 102, 241, 0.35)',
    shadowHover: '0 0 30px rgba(99, 102, 241, 0.45)',
    backdropBlur: 'none',
    surfaceOpacity: '1',
  },
  'material-you': {
    radius: '24px',
    borderWidth: '1px',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    shadowHover: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backdropBlur: 'none',
    surfaceOpacity: '0.9',
  },
};