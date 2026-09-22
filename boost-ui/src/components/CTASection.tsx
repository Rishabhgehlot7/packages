import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';


/**
 * CTASectionProps — Properties for the call-to-action banner section.
 */
export interface CTASectionProps {
  badge?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  backgroundImage?: string;
  overlayOpacity?: number;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  showNewsletter?: boolean;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  onSubscribe?: (email: string) => void;
  variant?: 'card' | 'full' | 'gradient';
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
}

export const CTASection: React.FC<CTASectionProps> = ({
  badge,
  title,
  description,
  backgroundImage,
  overlayOpacity,
  primaryAction,
  secondaryAction,
  showNewsletter = false,
  newsletterPlaceholder = 'Enter your email address...',
  newsletterButtonText = 'Get Started',
  onSubscribe,
  variant = 'card',
  className = '',
  style,
  stylePreset: stylePresetProp,
  ...props
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;

  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (onSubscribe) onSubscribe(email);
    setSubmitted(true);
  };

  const isCard = variant === 'card';
  const isGradient = variant === 'gradient';
  const hasBgImage = !!backgroundImage;
  const overlayAlpha = overlayOpacity ?? 0.6;

  const getCardBackground = (): string => {
    if (hasBgImage) {
      return `linear-gradient(rgba(0, 0, 0, ${overlayAlpha}), rgba(0, 0, 0, ${overlayAlpha})), url(${backgroundImage}) center/cover no-repeat`;
    }
    switch (preset) {
      case 'neo-brutalism':
        return '#fbbf24';
      case 'glassmorphism':
        return 'rgba(255, 255, 255, 0.12)';
      case 'gradient-glow':
        return 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #6366f1 100%)';
      case 'neumorphism':
        return '#e0e5ec';
      case 'material-you':
        return 'var(--boost-surface, #ece6f0)';
      case 'dark-first':
        return '#111827';
      case 'minimal':
      default:
        return isGradient
          ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)'
          : 'var(--boost-primary, #2563eb)';
    }
  };

  const getContainerStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      maxWidth: isCard ? '1100px' : '100%',
      margin: '0 auto',
      background: getCardBackground(),
      color: preset === 'neo-brutalism' ? '#000000' : preset === 'neumorphism' ? '#0f172a' : preset === 'material-you' ? '#1c1b1f' : '#ffffff',
      padding: 'clamp(36px, 6vw, 60px) clamp(20px, 4vw, 48px)',
      textAlign: 'center',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    };

    if (!isCard) {
      return {
        ...base,
        borderRadius: '0px',
        boxShadow: 'none',
      };
    }

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '4px',
          border: '3px solid #000000',
          boxShadow: '6px 6px 0px #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '20px',
          border: '1.5px solid rgba(99, 102, 241, 0.5)',
          boxShadow: '0 0 50px rgba(99, 102, 241, 0.35), 0 20px 40px rgba(0, 0, 0, 0.25)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '28px',
          border: 'none',
          boxShadow: '10px 10px 24px #bec3c9, -10px -10px 24px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '32px',
          border: 'none',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        };
      case 'dark-first':
        return {
          ...base,
          borderRadius: '16px',
          border: '1px solid #1f2937',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        };
      case 'minimal':
      default:
        return {
          ...base,
          borderRadius: '12px',
          boxShadow: 'var(--boost-shadow-glow, 0 20px 40px rgba(37, 99, 235, 0.25))',
        };
    }
  };

  const getBadgeStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-block',
      padding: '6px 14px',
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '16px',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          backgroundColor: '#000000',
          color: '#fbbf24',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          color: '#ffffff',
          backdropFilter: 'blur(8px)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.3)',
          border: '1px solid rgba(99, 102, 241, 0.5)',
          color: '#ffffff',
          boxShadow: '0 0 14px rgba(99, 102, 241, 0.4)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: '#e0e5ec',
          color: 'var(--boost-primary, #2563eb)',
          boxShadow: 'inset 2px 2px 4px #bec3c9, inset -2px -2px 4px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: 'var(--boost-surface-variant, #e8def8)',
          color: 'var(--boost-primary, #6750a4)',
        };
      default:
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
        };
    }
  };

  const getPrimaryButtonStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '14px 30px',
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
          backgroundColor: '#000000',
          color: '#ffffff',
          border: '3px solid #000000',
          boxShadow: '3px 3px 0px #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          color: 'var(--boost-primary, #6366f1)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          color: 'var(--boost-primary, #4338ca)',
          border: 'none',
          boxShadow: '0 0 25px rgba(255, 255, 255, 0.4)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: '#e0e5ec',
          color: 'var(--boost-primary, #2563eb)',
          border: 'none',
          boxShadow: '4px 4px 10px #bec3c9, -4px -4px 10px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '28px',
          backgroundColor: 'var(--boost-primary, #6750a4)',
          color: '#ffffff',
          border: 'none',
        };
      default:
        return {
          ...base,
          borderRadius: 'var(--boost-radius, 8px)',
          backgroundColor: '#ffffff',
          color: 'var(--boost-primary, #2563eb)',
          border: 'none',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
        };
    }
  };

  const getSecondaryButtonStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '14px 30px',
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '3px solid #000000',
          boxShadow: '3px 3px 0px #000000',
          fontWeight: 800,
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(8px)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 0 16px rgba(255, 255, 255, 0.15)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: '#e0e5ec',
          color: '#475569',
          border: 'none',
          boxShadow: 'inset 2px 2px 4px #bec3c9, inset -2px -2px 4px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '28px',
          backgroundColor: 'transparent',
          color: 'var(--boost-primary, #6750a4)',
          border: '1px solid var(--boost-primary, #6750a4)',
        };
      default:
        return {
          ...base,
          borderRadius: 'var(--boost-radius, 8px)',
          backgroundColor: 'transparent',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        };
    }
  };

  const getInputStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      flex: 1,
      minWidth: '220px',
      padding: '12px 18px',
      fontSize: '15px',
      outline: 'none',
      color: '#0f172a',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          backgroundColor: '#ffffff',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(8px)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '14px',
          backgroundColor: '#e0e5ec',
          border: 'none',
          boxShadow: 'inset 3px 3px 6px #bec3c9, inset -3px -3px 6px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '24px',
          backgroundColor: '#ffffff',
          border: 'none',
        };
      default:
        return {
          ...base,
          borderRadius: 'var(--boost-radius, 8px)',
          border: 'none',
        };
    }
  };

  return (
    <section
      className={`boost-cta-section boost-cta-${preset} ${className}`}
      data-boost-preset={preset}
      style={{
        width: '100%',
        padding: isCard ? 'clamp(24px, 4vw, 48px) clamp(14px, 3vw, 24px)' : 'clamp(48px, 8vw, 84px) clamp(16px, 4vw, 32px)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <style>
        {`
          .boost-cta-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 14px;
          }
          @media (max-width: 640px) {
            .boost-cta-buttons {
              flex-direction: column;
              width: 100%;
            }
            .boost-cta-buttons button {
              width: 100%;
            }
          }
        `}
      </style>
      <div style={getContainerStyles()}>
        {badge && (
          <div style={getBadgeStyles()}>
            {badge}
          </div>
        )}

        <h2
          style={{
            fontSize: 'clamp(28px, 4.5vw, 46px)',
            fontWeight: 800,
            lineHeight: 1.2,
            margin: '0 0 16px 0',
            color: preset === 'neo-brutalism' ? '#000000' : preset === 'neumorphism' ? '#0f172a' : preset === 'material-you' ? '#1c1b1f' : '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h2>

        {description && (
          <p
            style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              lineHeight: 1.6,
              color: preset === 'neo-brutalism' ? '#27272a' : preset === 'neumorphism' ? '#475569' : preset === 'material-you' ? '#49454f' : 'rgba(255, 255, 255, 0.85)',
              margin: '0 auto 36px auto',
              maxWidth: '650px',
            }}
          >
            {description}
          </p>
        )}

        {showNewsletter ? (
          submitted ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: preset === 'neo-brutalism' ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontWeight: 600,
                border: preset === 'neo-brutalism' ? '2px solid #000' : 'none',
              }}
            >
              ✓ Thank you! We have sent a confirmation link to your inbox.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '10px',
                maxWidth: '480px',
                margin: '0 auto',
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletterPlaceholder}
                style={getInputStyles()}
              />
              <button
                type="submit"
                style={getPrimaryButtonStyles()}
              >
                {newsletterButtonText}
              </button>
            </form>
          )
        ) : (
          (primaryAction || secondaryAction) && (
            <div className="boost-cta-buttons">
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
          )
        )}
      </div>
    </section>
  );
};

CTASection.displayName = 'CTASection';
