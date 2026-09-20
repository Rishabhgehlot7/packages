import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface HeroAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface HeroSectionProps {
  badge?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  media?: React.ReactNode;
  backgroundImage?: string;
  overlayOpacity?: number;
  align?: 'center' | 'left' | 'right';
  showGlow?: boolean;
  glowColor?: string;
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  media,
  backgroundImage,
  overlayOpacity = 0.5,
  align = 'center',
  showGlow = true,
  glowColor,
  className = '',
  style,
  stylePreset: stylePresetProp,
  ...props
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;

  const isCenter = align === 'center';
  const isRight = align === 'right';
  const hasBg = !!backgroundImage;

  const defaultGlowColor =
    preset === 'gradient-glow'
      ? 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 70%)'
      : preset === 'neo-brutalism'
      ? 'rgba(0, 0, 0, 0.05)'
      : 'rgba(37, 99, 235, 0.15)';

  const activeGlow = glowColor || defaultGlowColor;

  const getBadgeStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 14px',
      fontSize: '13px',
      fontWeight: 600,
      marginBottom: '20px',
    };

    if (hasBg) {
      return {
        ...base,
        borderRadius: '9999px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: '#ffffff',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      };
    }

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          backgroundColor: '#fbbf24',
          color: '#000000',
          border: '2px solid #000000',
          boxShadow: '3px 3px 0px #000000',
          fontWeight: 800,
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          color: 'var(--boost-primary, #2563eb)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          color: 'var(--boost-primary, #6366f1)',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.25)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: '#e0e5ec',
          color: 'var(--boost-primary, #2563eb)',
          boxShadow: '3px 3px 6px #bec3c9, -3px -3px 6px #ffffff',
          fontWeight: 700,
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: 'var(--boost-surface, #e8def8)',
          color: 'var(--boost-primary, #6750a4)',
          fontWeight: 600,
        };
      case 'dark-first':
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa',
        };
      case 'minimal':
      default:
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(37, 99, 235, 0.22)',
          color: 'var(--boost-primary, #2563eb)',
        };
    }
  };

  const getPrimaryButtonStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '14px 32px',
      fontSize: '15px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          backgroundColor: '#fbbf24',
          color: '#000000',
          border: '3px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          fontWeight: 800,
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '12px',
          backgroundColor: 'rgba(99, 102, 241, 0.85)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
          backdropFilter: 'blur(8px)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.6), 0 4px 16px rgba(99, 102, 241, 0.3)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: '#e0e5ec',
          color: 'var(--boost-primary, #2563eb)',
          border: 'none',
          boxShadow: '5px 5px 12px #bec3c9, -5px -5px 12px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '28px',
          backgroundColor: 'var(--boost-primary, #6750a4)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        };
      case 'dark-first':
        return {
          ...base,
          borderRadius: '10px',
          backgroundColor: 'var(--boost-primary, #3b82f6)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
        };
      case 'minimal':
      default:
        return {
          ...base,
          borderRadius: '6px',
          backgroundColor: 'var(--boost-text, #0f172a)',
          color: '#ffffff',
          border: 'none',
          boxShadow: 'none',
        };
    }
  };

  const getSecondaryButtonStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '14px 32px',
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    };

    if (hasBg) {
      return {
        ...base,
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(8px)',
      };
    }

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '3px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          fontWeight: 800,
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          color: 'var(--boost-text, inherit)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '12px',
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          color: 'var(--boost-text, inherit)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 0 12px rgba(99, 102, 241, 0.15)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: '#e0e5ec',
          color: '#475569',
          border: 'none',
          boxShadow: 'inset 2px 2px 5px #bec3c9, inset -2px -2px 5px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '28px',
          backgroundColor: 'transparent',
          color: 'var(--boost-primary, #6750a4)',
          border: '1px solid var(--boost-primary, #6750a4)',
        };
      case 'dark-first':
        return {
          ...base,
          borderRadius: '10px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          border: '1px solid #374151',
        };
      case 'minimal':
      default:
        return {
          ...base,
          borderRadius: '6px',
          backgroundColor: 'transparent',
          color: 'var(--boost-text, inherit)',
          border: '1px solid var(--boost-border, #cbd5e1)',
        };
    }
  };

  const getMediaContainerStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      flex: isCenter ? 'none' : '1 1 320px',
      width: '100%',
      maxWidth: isCenter ? '900px' : '540px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '4px',
          border: '3px solid #000000',
          boxShadow: '8px 8px 0px #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '16px',
          boxShadow: '0 0 40px rgba(99, 102, 241, 0.25)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '28px',
          boxShadow: '10px 10px 24px #bec3c9, -10px -10px 24px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '28px',
        };
      default:
        return {
          ...base,
          borderRadius: 'var(--boost-radius, 16px)',
        };
    }
  };

  return (
    <section
      className={`boost-hero-section boost-hero-${preset} ${className}`}
      data-boost-preset={preset}
      style={{
        position: 'relative',
        padding: 'clamp(64px, 10vw, 120px) clamp(16px, 4vw, 32px)',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        backgroundImage: hasBg ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...style,
      }}
      {...props}
    >
      <style>{`
        @media (max-width: 640px) {
          .boost-hero-section {
            padding: 48px 20px !important;
          }
          .boost-hero-title {
            font-size: 32px !important;
            line-height: 1.2 !important;
          }
          .boost-hero-desc {
            font-size: 16px !important;
            margin-bottom: 24px !important;
          }
          .boost-hero-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100% !important;
          }
          .boost-hero-buttons button {
            width: 100% !important;
          }
          .boost-hero-content {
            text-align: center !important;
          }
          .boost-hero-content p {
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }
      `}</style>

      {hasBg && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000',
            opacity: overlayOpacity,
            zIndex: 0,
          }}
        />
      )}

      {!hasBg && showGlow && preset !== 'neo-brutalism' && (
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: isCenter ? '50%' : '30%',
            transform: 'translateX(-50%)',
            width: 'clamp(280px, 45vw, 600px)',
            height: 'clamp(280px, 45vw, 600px)',
            borderRadius: '50%',
            background: activeGlow,
            filter: 'blur(clamp(60px, 10vw, 120px))',
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'boost-pulse 6s ease-in-out infinite alternate',
          }}
        />
      )}

      <div
        className="boost-hero-layout"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isCenter ? 'column' : (isRight ? 'row-reverse' : 'row'),
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: isCenter ? 'center' : 'space-between',
          gap: 'clamp(32px, 5vw, 56px)',
          textAlign: isCenter ? 'center' : (isRight ? 'right' : 'left'),
        }}
      >
        <div className="boost-hero-content" style={{ maxWidth: isCenter ? '820px' : '620px', width: '100%', flex: isCenter ? 'none' : '1 1 300px' }}>
          {badge && (
            <div style={getBadgeStyles()}>
              {badge}
            </div>
          )}

          <h1
            className="boost-hero-title"
            style={{
              fontSize: 'clamp(36px, 5.2vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              margin: '0 0 20px 0',
              color: hasBg ? '#ffffff' : 'var(--boost-text, #0f172a)',
            }}
          >
            {title}
          </h1>

          {description && (
            <p
              className="boost-hero-desc"
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                lineHeight: 1.65,
                color: hasBg ? 'rgba(255, 255, 255, 0.85)' : 'var(--boost-text-muted, #64748b)',
                margin: '0 0 32px 0',
                maxWidth: isCenter ? '700px' : '100%',
                marginLeft: isCenter ? 'auto' : (isRight ? 'auto' : 0),
                marginRight: isCenter ? 'auto' : (isRight ? 0 : 'auto'),
              }}
            >
              {description}
            </p>
          )}

          {(primaryAction || secondaryAction) && (
            <div
              className="boost-hero-buttons"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: isCenter ? 'center' : (isRight ? 'flex-end' : 'flex-start'),
                alignItems: 'center',
              }}
            >
              {primaryAction && (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  style={getPrimaryButtonStyles()}
                >
                  {primaryAction.label}
                </button>
              )}

              {secondaryAction && (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  style={getSecondaryButtonStyles()}
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>

        {media && (
          <div style={getMediaContainerStyles()}>
            {media}
          </div>
        )}
      </div>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
