import * as React from 'react';

export interface CTASectionProps {
  badge?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
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
}

export const CTASection: React.FC<CTASectionProps> = ({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  showNewsletter = false,
  newsletterPlaceholder = 'Enter your email address...',
  newsletterButtonText = 'Get Started',
  onSubscribe,
  variant = 'card',
  className = '',
  style,
  ...props
}) => {
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

  return (
    <section
      className={`boost-cta-section ${className}`}
      style={{
        width: '100%',
        padding: isCard ? '40px 20px' : '80px 24px',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          maxWidth: isCard ? '1100px' : '100%',
          margin: '0 auto',
          borderRadius: isCard ? 'var(--boost-radius, 20px)' : '0px',
          background: isGradient
            ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)'
            : 'var(--boost-primary, #2563eb)',
          color: '#ffffff',
          padding: '56px 36px',
          textAlign: 'center',
          boxShadow: isCard ? '0 20px 40px rgba(37, 99, 235, 0.25)' : 'none',
          boxSizing: 'border-box',
        }}
      >
        {badge && (
          <div
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}
          >
            {badge}
          </div>
        )}

        <h2
          style={{
            fontSize: 'clamp(28px, 4.5vw, 46px)',
            fontWeight: 800,
            lineHeight: 1.2,
            margin: '0 0 16px 0',
            color: '#ffffff',
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
              color: 'rgba(255, 255, 255, 0.85)',
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
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontWeight: 600,
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
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '12px 18px',
                  borderRadius: 'var(--boost-radius, 8px)',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: '#0f172a',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  borderRadius: 'var(--boost-radius, 8px)',
                  border: 'none',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {newsletterButtonText}
              </button>
            </form>
          )
        ) : (
          (primaryAction || secondaryAction) && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '14px',
              }}
            >
              {primaryAction && (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  style={{
                    padding: '14px 30px',
                    borderRadius: 'var(--boost-radius, 8px)',
                    backgroundColor: '#ffffff',
                    color: 'var(--boost-primary, #2563eb)',
                    fontSize: '15px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
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
                    padding: '14px 30px',
                    borderRadius: 'var(--boost-radius, 8px)',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                  }}
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
