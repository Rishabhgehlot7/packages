import * as React from 'react';
import { useTheme, ThemeMode } from './BoostProvider';


/**
 * ThemeToggleProps — Properties for the light/dark mode toggle switch.
 */
export interface ThemeToggleProps {
  /**
   * Visual style variant
   * - 'icon': Minimalist circular or rounded icon button (default)
   * - 'button': Icon with descriptive text label
   * - 'segmented': Modern 3-option pill control (Light, Dark, System)
   * - 'switch': Compact toggle switch with sun/moon symbols
   */
  variant?: 'icon' | 'button' | 'segmented' | 'switch';
  /** Size of the control */
  size?: 'sm' | 'md' | 'lg';
  /** Show custom labels in 'button' variant */
  showLabel?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  size = 'md',
  showLabel = true,
  className = '',
  style,
}) => {
  const { mode, resolvedMode, toggleMode, setMode } = useTheme();

  // Fallback for standalone usage outside BoostProvider
  const [standaloneMode, setStandaloneMode] = React.useState<ThemeMode>(() => {
    if (typeof document !== 'undefined') {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark' || current === 'light') return current;
      if (document.documentElement.classList.contains('dark')) return 'dark';
    }
    return 'light';
  });

  const effectiveResolvedMode = resolvedMode || standaloneMode;

  const handleToggle = () => {
    if (toggleMode && resolvedMode) {
      toggleMode();
    } else {
      const next = effectiveResolvedMode === 'dark' ? 'light' : 'dark';
      setStandaloneMode(next);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', next);
        if (next === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleSelectMode = (newMode: ThemeMode) => {
    if (setMode) {
      setMode(newMode);
    } else {
      setStandaloneMode(newMode);
      if (typeof document !== 'undefined') {
        const nextResolved = newMode === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : newMode;
        document.documentElement.setAttribute('data-theme', nextResolved);
        if (nextResolved === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
    }
  };

  const isDark = effectiveResolvedMode === 'dark';

  // Dimension helpers based on size
  const sizeMap = {
    sm: { buttonPadding: '6px 10px', iconSize: 14, fontSize: '12px', height: '28px', pillPadding: '2px' },
    md: { buttonPadding: '8px 14px', iconSize: 16, fontSize: '13px', height: '36px', pillPadding: '3px' },
    lg: { buttonPadding: '10px 18px', iconSize: 18, fontSize: '14px', height: '44px', pillPadding: '4px' },
  }[size];

  // SVG Icons
  const SunIcon = ({ size: s }: { size: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );

  const MoonIcon = ({ size: s }: { size: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  const MonitorIcon = ({ size: s }: { size: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );

  // Variant 1: Segmented Switch (Light / Dark / System)
  if (variant === 'segmented') {
    const options: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
      { id: 'light', label: 'Light', icon: <SunIcon size={sizeMap.iconSize} /> },
      { id: 'dark', label: 'Dark', icon: <MoonIcon size={sizeMap.iconSize} /> },
      { id: 'system', label: 'Auto', icon: <MonitorIcon size={sizeMap.iconSize} /> },
    ];

    return (
      <div
        className={`boost-theme-segmented ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'var(--boost-surface, rgba(0, 0, 0, 0.05))',
          borderRadius: '999px',
          padding: sizeMap.pillPadding,
          border: '1px solid var(--boost-border, rgba(0, 0, 0, 0.1))',
          boxSizing: 'border-box',
          ...style,
        }}
      >
        {options.map((opt) => {
          const isSelected = mode === opt.id || (!mode && opt.id === effectiveResolvedMode);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectMode(opt.id)}
              aria-label={`Switch to ${opt.label} mode`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: sizeMap.buttonPadding,
                fontSize: sizeMap.fontSize,
                fontWeight: isSelected ? 600 : 500,
                color: isSelected ? 'var(--boost-text, #0f172a)' : 'var(--boost-text-muted, #64748b)',
                backgroundColor: isSelected ? 'var(--boost-bg, #ffffff)' : 'transparent',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: isSelected ? 'var(--boost-shadow-sm, 0 2px 6px rgba(0,0,0,0.08))' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {opt.icon}
              {showLabel && <span>{opt.label}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // Variant 2: Toggle Switch (Track + Thumb)
  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={handleToggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`boost-theme-switch ${className}`}
        style={{
          width: size === 'sm' ? '44px' : size === 'lg' ? '60px' : '52px',
          height: size === 'sm' ? '24px' : size === 'lg' ? '32px' : '28px',
          borderRadius: '999px',
          backgroundColor: isDark ? 'var(--boost-primary, #3b82f6)' : 'var(--boost-surface, #e2e8f0)',
          border: '1px solid var(--boost-border, rgba(0,0,0,0.1))',
          padding: '2px',
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 0.25s ease',
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div
          style={{
            width: size === 'sm' ? '18px' : size === 'lg' ? '26px' : '22px',
            height: size === 'sm' ? '18px' : size === 'lg' ? '26px' : '22px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isDark
              ? `translateX(${size === 'sm' ? '20px' : size === 'lg' ? '28px' : '24px'})`
              : 'translateX(0px)',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            color: isDark ? '#0f172a' : '#f59e0b',
          }}
        >
          {isDark ? <MoonIcon size={sizeMap.iconSize - 2} /> : <SunIcon size={sizeMap.iconSize - 2} />}
        </div>
      </button>
    );
  }

  // Variant 3: Button with Label
  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`boost-theme-button ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: sizeMap.buttonPadding,
          fontSize: sizeMap.fontSize,
          fontWeight: 600,
          color: 'var(--boost-text, #0f172a)',
          backgroundColor: 'var(--boost-surface, #f8fafc)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: 'var(--boost-radius, 10px)',
          cursor: 'pointer',
          boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          ...style,
        }}
      >
        <span
          style={{
            color: isDark ? '#60a5fa' : '#f59e0b',
            display: 'inline-flex',
            alignItems: 'center',
            transform: isDark ? 'rotate(0deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          {isDark ? <MoonIcon size={sizeMap.iconSize} /> : <SunIcon size={sizeMap.iconSize} />}
        </span>
        {showLabel && <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>}
      </button>
    );
  }

  // Variant 4: Icon Only (Default)
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`boost-theme-icon-toggle ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: sizeMap.height,
        height: sizeMap.height,
        borderRadius: 'var(--boost-radius, 10px)',
        backgroundColor: 'var(--boost-surface, #f8fafc)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        color: isDark ? '#60a5fa' : '#f59e0b',
        cursor: 'pointer',
        boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0,0,0,0.04))',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: 0,
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          transform: isDark ? 'rotate(-12deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {isDark ? <MoonIcon size={sizeMap.iconSize + 2} /> : <SunIcon size={sizeMap.iconSize + 2} />}
      </span>
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';
