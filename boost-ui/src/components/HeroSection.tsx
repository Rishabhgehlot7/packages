import * as React from 'react';

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
  glowColor = 'rgba(37, 99, 235, 0.15)',
  className = '',
  style,
  ...props
}) => {
  const isCenter = align === 'center';
  const isRight = align === 'right';
  const hasBg = !!backgroundImage;

  return (
    <section
      className={`boost-hero-section ${className}`}
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

      {!hasBg && showGlow && (
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: isCenter ? '50%' : '30%',
            transform: 'translateX(-50%)',
            width: 'clamp(280px, 45vw, 600px)',
            height: 'clamp(280px, 45vw, 600px)',
            borderRadius: '50%',
            background: glowColor,
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
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: hasBg ? 'rgba(255, 255, 255, 0.15)' : 'rgba(37, 99, 235, 0.1)',
                border: hasBg ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(37, 99, 235, 0.22)',
                color: hasBg ? '#ffffff' : 'var(--boost-primary, #2563eb)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '20px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
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
                  style={{
                    padding: '14px 32px',
                    borderRadius: 'var(--boost-radius, 12px)',
                    backgroundColor: 'var(--boost-primary, #2563eb)',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: 'var(--boost-shadow-glow, 0 4px 16px rgba(37, 99, 235, 0.35))',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {primaryAction.label}
                </button>
              )}

              {secondaryAction && (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  style={{
                    padding: '14px 32px',
                    borderRadius: 'var(--boost-radius, 12px)',
                    backgroundColor: hasBg ? 'rgba(255, 255, 255, 0.1)' : 'var(--boost-surface, transparent)',
                    color: hasBg ? '#ffffff' : 'var(--boost-text, inherit)',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: hasBg ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid var(--boost-border, #cbd5e1)',
                    backdropFilter: hasBg ? 'blur(8px)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>

        {media && (
          <div
            style={{
              flex: isCenter ? 'none' : '1 1 320px',
              width: '100%',
              maxWidth: isCenter ? '900px' : '540px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'var(--boost-radius, 16px)',
              overflow: 'hidden',
            }}
          >
            {media}
          </div>
        )}
      </div>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
