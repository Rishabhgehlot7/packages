import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

const PRESETS: { value: UIStylePreset; label: string; icon: string; description: string }[] = [
  {
    value: 'minimal',
    label: 'Minimal',
    icon: '◻',
    description: 'Clean whitespace, subtle lines',
  },
  {
    value: 'glassmorphism',
    label: 'Glassmorphism',
    icon: '◈',
    description: 'Frosted glass, translucent blur',
  },
  {
    value: 'neumorphism',
    label: 'Neumorphism',
    icon: '◉',
    description: 'Soft dual shadows, embossed',
  },
  {
    value: 'neo-brutalism',
    label: 'Neo-Brutalism',
    icon: '■',
    description: 'Thick borders, hard shadows',
  },
  {
    value: 'dark-first',
    label: 'Dark First',
    icon: '◼',
    description: 'OLED dark, gradient accents',
  },
  {
    value: 'gradient-glow',
    label: 'Gradient Glow',
    icon: '✦',
    description: 'SaaS, glowing radiant borders',
  },
  {
    value: 'material-you',
    label: 'Material You',
    icon: '◍',
    description: 'Google M3 pebble, tonal color',
  },
];


/**
 * PresetSwitcherProps — Properties for the design preset switcher UI.
 */
export interface PresetSwitcherProps {
  /** Display mode — 'dropdown' collapses into a button; 'pills' shows all presets inline */
  mode?: 'dropdown' | 'pills';
  /** Optional override to control the active preset externally */
  value?: UIStylePreset;
  /** Callback when the active preset changes */
  onChange?: (preset: UIStylePreset) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const PresetSwitcher: React.FC<PresetSwitcherProps> = ({
  mode = 'dropdown',
  value,
  onChange,
  className = '',
  style,
}) => {
  const { stylePreset: contextPreset, setStylePreset } = useBoostPreset();
  const activePreset: UIStylePreset = value ?? contextPreset;
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleSelect = (preset: UIStylePreset) => {
    if (onChange) {
      onChange(preset);
    } else {
      setStylePreset(preset);
    }
    setIsOpen(false);
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeInfo = PRESETS.find((p) => p.value === activePreset) ?? PRESETS[0];

  const getTriggerStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 14px',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      position: 'relative',
    };

    switch (activePreset) {
      case 'neo-brutalism':
        return {
          ...base,
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '2px solid #000000',
          borderRadius: '2px',
          boxShadow: '3px 3px 0px #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          color: 'var(--boost-text, #0f172a)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '12px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        };
      case 'gradient-glow':
        return {
          ...base,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.45)',
        };
      case 'neumorphism':
        return {
          ...base,
          backgroundColor: '#e0e5ec',
          color: '#0f172a',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '4px 4px 8px #bec3c9, -4px -4px 8px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          backgroundColor: 'var(--boost-primary, #6750a4)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '24px',
        };
      case 'dark-first':
        return {
          ...base,
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #334155',
          borderRadius: '10px',
          boxShadow: '0 0 16px rgba(59, 130, 246, 0.25)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'var(--boost-surface, #f8fafc)',
          color: 'var(--boost-text, #0f172a)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: '8px',
        };
    }
  };

  const getDropdownStyles = (): React.CSSProperties => ({
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    zIndex: 9999,
    minWidth: '240px',
    backgroundColor:
      activePreset === 'dark-first' ? '#0f172a' :
      activePreset === 'glassmorphism' ? 'rgba(255, 255, 255, 0.85)' :
      activePreset === 'neumorphism' ? '#e0e5ec' :
      'var(--boost-bg, #ffffff)',
    backdropFilter: activePreset === 'glassmorphism' ? 'blur(16px)' : 'none',
    WebkitBackdropFilter: activePreset === 'glassmorphism' ? 'blur(16px)' : 'none',
    border:
      activePreset === 'neo-brutalism' ? '2px solid #000000' :
      activePreset === 'dark-first' ? '1px solid #1e293b' :
      activePreset === 'glassmorphism' ? '1px solid rgba(255, 255, 255, 0.4)' :
      '1px solid var(--boost-border, #e2e8f0)',
    borderRadius:
      activePreset === 'neo-brutalism' ? '2px' :
      activePreset === 'material-you' ? '20px' :
      activePreset === 'neumorphism' ? '16px' : '12px',
    boxShadow:
      activePreset === 'neo-brutalism' ? '4px 4px 0px #000000' :
      activePreset === 'neumorphism' ? '8px 8px 18px #bec3c9, -8px -8px 18px #ffffff' :
      activePreset === 'dark-first' ? '0 8px 24px rgba(0, 0, 0, 0.5)' :
      '0 8px 24px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  });

  const getItemStyles = (isActive: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      cursor: 'pointer',
      transition: 'all 0.12s ease',
      border: 'none',
      textAlign: 'left',
      width: '100%',
      fontFamily: 'inherit',
    };

    if (isActive) {
      switch (activePreset) {
        case 'neo-brutalism':
          return {
            ...base,
            backgroundColor: '#fbbf24',
            color: '#000000',
            borderRadius: '2px',
            border: '2px solid #000000',
            fontWeight: 700,
          };
        case 'glassmorphism':
          return {
            ...base,
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--boost-primary, #6366f1)',
            borderRadius: '8px',
            fontWeight: 600,
          };
        case 'gradient-glow':
          return {
            ...base,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12))',
            color: 'var(--boost-primary, #6366f1)',
            borderRadius: '8px',
            fontWeight: 600,
          };
        case 'neumorphism':
          return {
            ...base,
            backgroundColor: '#e0e5ec',
            color: 'var(--boost-primary, #2563eb)',
            borderRadius: '10px',
            boxShadow: 'inset 2px 2px 4px #bec3c9, inset -2px -2px 4px #ffffff',
            fontWeight: 600,
          };
        case 'material-you':
          return {
            ...base,
            backgroundColor: 'var(--boost-surface, #e8def8)',
            color: 'var(--boost-primary, #6750a4)',
            borderRadius: '12px',
            fontWeight: 600,
          };
        case 'dark-first':
          return {
            ...base,
            backgroundColor: '#1e3a5f',
            color: '#60a5fa',
            borderRadius: '8px',
            fontWeight: 600,
          };
        default:
          return {
            ...base,
            backgroundColor: 'var(--boost-surface, #f1f5f9)',
            color: 'var(--boost-text, #0f172a)',
            borderRadius: '6px',
            fontWeight: 600,
          };
      }
    }

    return {
      ...base,
      backgroundColor: 'transparent',
      color:
        activePreset === 'dark-first' ? '#94a3b8' :
        activePreset === 'neo-brutalism' ? '#3f3f46' :
        'var(--boost-text-muted, #64748b)',
      borderRadius:
        activePreset === 'neo-brutalism' ? '2px' :
        activePreset === 'material-you' ? '12px' : '6px',
      fontWeight: 400,
    };
  };

  const getPillStyles = (isActive: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      border: 'none',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    };

    if (isActive) {
      switch (activePreset) {
        case 'neo-brutalism':
          return { ...base, backgroundColor: '#fbbf24', color: '#000', border: '2px solid #000', borderRadius: '2px', boxShadow: '2px 2px 0px #000' };
        case 'glassmorphism':
          return { ...base, backgroundColor: 'rgba(99,102,241,0.15)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '9999px' };
        case 'gradient-glow':
          return { ...base, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', borderRadius: '9999px', boxShadow: '0 0 14px rgba(99,102,241,0.4)' };
        case 'neumorphism':
          return { ...base, backgroundColor: '#e0e5ec', color: '#2563eb', borderRadius: '9999px', boxShadow: '3px 3px 6px #bec3c9, -3px -3px 6px #fff' };
        case 'material-you':
          return { ...base, backgroundColor: 'var(--boost-primary, #6750a4)', color: '#fff', borderRadius: '20px' };
        case 'dark-first':
          return { ...base, backgroundColor: '#1e3a5f', color: '#60a5fa', border: '1px solid #334155', borderRadius: '9999px' };
        default:
          return { ...base, backgroundColor: 'var(--boost-surface, #0f172a)', color: '#fff', borderRadius: '6px' };
      }
    }

    return {
      ...base,
      backgroundColor: 'transparent',
      color:
        activePreset === 'dark-first' ? '#94a3b8' :
        activePreset === 'neumorphism' ? '#64748b' :
        'var(--boost-text-muted, #64748b)',
      borderRadius:
        activePreset === 'neo-brutalism' ? '2px' :
        activePreset === 'material-you' ? '20px' : '6px',
      border:
        activePreset === 'neumorphism' ? 'none' :
        '1px solid var(--boost-border, #e2e8f0)',
    };
  };

  if (mode === 'pills') {
    return (
      <>
        <style>{`
          .boost-preset-switcher-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
          }
        `}</style>
        <div
          className={`boost-preset-switcher boost-preset-switcher-pills ${className}`}
          style={style}
        >
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              title={p.description}
              aria-pressed={activePreset === p.value}
              onClick={() => handleSelect(p.value)}
              style={getPillStyles(activePreset === p.value)}
            >
              <span aria-hidden="true">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`boost-preset-switcher boost-preset-switcher-dropdown ${className}`}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        style={getTriggerStyles()}
      >
        <span aria-hidden="true" style={{ fontSize: '15px' }}>{activeInfo.icon}</span>
        <span>{activeInfo.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            marginLeft: '2px',
            transition: 'transform 0.15s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div role="listbox" aria-label="Select style preset" style={getDropdownStyles()}>
          {PRESETS.map((p) => {
            const isActive = activePreset === p.value;
            return (
              <button
                key={p.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(p.value)}
                style={getItemStyles(isActive)}
              >
                <span
                  style={{
                    fontSize: '16px',
                    lineHeight: 1,
                    width: '20px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  {p.icon}
                </span>
                <span style={{ flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: isActive ? 700 : 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {p.label}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      opacity: 0.65,
                      marginTop: '2px',
                    }}
                  >
                    {p.description}
                  </span>
                </span>
                {isActive && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

PresetSwitcher.displayName = 'PresetSwitcher';
