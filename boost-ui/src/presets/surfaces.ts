import type { CSSProperties } from 'react';
import type { UIStylePreset } from '../types/presets';

/**
 * Authentic surface styling per preset (theme-independent aesthetic).
 * Returns {} for 'minimal' so existing variant styling stays untouched.
 */
export function getSurfacePresetStyles(preset: UIStylePreset): CSSProperties {
  switch (preset) {
    case 'neo-brutalism':
      return {
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '3px solid #000',
        borderRadius: '4px',
        boxShadow: '6px 6px 0 #000',
      };
    case 'glassmorphism':
      return {
        backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.8))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      };
    case 'neumorphism':
      return {
        backgroundColor: 'var(--boost-surface, #eef0f4)',
        border: 'none',
        borderRadius: '18px',
        boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
      };
    case 'gradient-glow':
      return {
        background:
          'linear-gradient(var(--boost-surface, #ffffff), var(--boost-surface, #ffffff)) padding-box, linear-gradient(135deg, rgba(99, 102, 241, 0.55), rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.12)) border-box',
        border: '1px solid transparent',
        borderRadius: '12px',
        boxShadow: '0 0 18px rgba(99, 102, 241, 0.18), 0 4px 18px rgba(0, 0, 0, 0.08)',
      };
    case 'material-you':
      return {
        backgroundColor: 'var(--boost-surface, #eef2f7)',
        border: '1px solid transparent',
        borderRadius: '24px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      };
    case 'dark-first':
      return {
        backgroundColor: 'var(--boost-bg, #090d16)',
        border: '1px solid var(--boost-border, #27272a)',
        borderRadius: '8px',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.9)',
      };
    case 'minimal':
    default:
      return {};
  }
}

/**
 * Authentic overlay backdrop per preset. Returns {} for 'minimal'.
 */
export function getBackdropPresetStyles(preset: UIStylePreset): CSSProperties {
  switch (preset) {
    case 'neo-brutalism':
      return { backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'none', WebkitBackdropFilter: 'none' };
    case 'glassmorphism':
      return { backgroundColor: 'rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' };
    case 'neumorphism':
      return { backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' };
    case 'gradient-glow':
      return { backgroundColor: 'rgba(24, 24, 46, 0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' };
    case 'material-you':
      return { backgroundColor: 'rgba(10, 15, 30, 0.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' };
    case 'dark-first':
      return { backgroundColor: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' };
    case 'minimal':
    default:
      return {};
  }
}