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
  align?: 'center' | 'left';
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
  align = 'center',
  showGlow = true,
  glowColor = 'rgba(37, 99, 235, 0.15)',
  className = '',
  style,
  ...props
}) => {
  const isCenter = align === 'center';

  return (
    <section
      className={`boost-hero-section ${className}`}
      style={{
        position: 'relative',
        padding: '72px 24px',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {showGlow && (
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: isCenter ? '50%' : '20%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: glowColor,
            filter: 'blur(120px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isCenter ? 'column' : 'row',
          flexWrap: 'wrap',
          alignItems: isCenter ? 'center' : 'center',
          justifyContent: 'space-between',
          gap: '48px',
          textAlign: isCenter ? 'center' : 'left',
        }}
      >
        <div style={{ maxWidth: isCenter ? '820px' : '620px', width: '100%' }}>
          {badge && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                color: 'var(--boost-primary, #2563eb)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              {badge}
            </div>
          )}

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: '0 0 20px 0',
              color: 'inherit',
            }}
          >
            {title}
          </h1>

          {description && (
            <p
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                lineHeight: 1.6,
                color: 'var(--boost-text-muted, #64748b)',
                margin: '0 0 32px 0',
                maxWidth: isCenter ? '700px' : '100%',
                marginLeft: isCenter ? 'auto' : 0,
                marginRight: isCenter ? 'auto' : 0,
              }}
            >
              {description}
            </p>
          )}

          {(primaryAction || secondaryAction) && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                justifyContent: isCenter ? 'center' : 'flex-start',
                alignItems: 'center',
              }}
            >
              {primaryAction && (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  style={{
                    padding: '12px 26px',
                    borderRadius: 'var(--boost-radius, 8px)',
                    backgroundColor: 'var(--boost-primary, #2563eb)',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                    transition: 'transform 0.15s ease, background-color 0.15s ease',
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
                    padding: '12px 26px',
                    borderRadius: 'var(--boost-radius, 8px)',
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: '1px solid var(--boost-border, #cbd5e1)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
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
              flex: 1,
              width: '100%',
              maxWidth: isCenter ? '900px' : '520px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
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
