import * as React from 'react';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description?: string;
  priceMonthly: number | string;
  priceAnnual?: number | string;
  originalPriceMonthly?: number | string;
  originalPriceAnnual?: number | string;
  badge?: string;
  currency?: string;
  features: (string | PricingFeature)[];
  isPopular?: boolean;
  popularLabel?: string;
  ctaText?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface PricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers?: PricingTier[];
  billingCycle?: 'monthly' | 'annual';
  onBillingCycleChange?: (cycle: 'monthly' | 'annual') => void;
  annualDiscountLabel?: string;
  showToggle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  tiers = [],
  billingCycle = 'monthly',
  onBillingCycleChange,
  annualDiscountLabel = 'Save 20%',
  showToggle = true,
  className = '',
  style,
  ...props
}) => {
  const [internalCycle, setInternalCycle] = React.useState<'monthly' | 'annual'>(billingCycle);

  const activeCycle = onBillingCycleChange ? billingCycle : internalCycle;

  const handleCycleChange = (cycle: 'monthly' | 'annual') => {
    if (onBillingCycleChange) {
      onBillingCycleChange(cycle);
    } else {
      setInternalCycle(cycle);
    }
  };

  return (
    <div
      className={`boost-pricing-table ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-pricing-card,
          .dark .boost-pricing-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-pricing-card.is-popular,
          .dark .boost-pricing-card.is-popular {
            border-color: var(--boost-primary, #6366f1) !important;
            box-shadow: 0 12px 35px rgba(99, 102, 241, 0.25) !important;
          }
        `}
      </style>
      {showToggle && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--boost-surface, #f1f5f9)',
            padding: '4px',
            borderRadius: '9999px',
            border: '1px solid var(--boost-border, #e2e8f0)',
            marginBottom: '40px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => handleCycleChange('monthly')}
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeCycle === 'monthly' ? 'var(--boost-bg, #ffffff)' : 'transparent',
              color: activeCycle === 'monthly' ? 'var(--boost-text, #0f172a)' : 'var(--boost-text-muted, #64748b)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: activeCycle === 'monthly' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => handleCycleChange('annual')}
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeCycle === 'annual' ? 'var(--boost-bg, #ffffff)' : 'transparent',
              color: activeCycle === 'annual' ? 'var(--boost-text, #0f172a)' : 'var(--boost-text-muted, #64748b)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: activeCycle === 'annual' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Annual
            {annualDiscountLabel && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#16a34a',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                {annualDiscountLabel}
              </span>
            )}
          </button>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`,
          gap: '28px',
          width: '100%',
          maxWidth: '1200px',
          boxSizing: 'border-box',
        }}
      >
        {tiers.map((tier) => {
          const rawPrice =
            activeCycle === 'annual' && tier.priceAnnual !== undefined
              ? tier.priceAnnual
              : tier.priceMonthly;

          const rawOriginalPrice =
            activeCycle === 'annual' && tier.originalPriceAnnual !== undefined
              ? tier.originalPriceAnnual
              : tier.originalPriceMonthly;

          const currency = tier.currency || '$';
          const isPop = tier.isPopular;

          return (
            <div
              key={tier.id}
              className={`boost-pricing-card ${isPop ? 'is-popular' : ''}`}
              style={{
                position: 'relative',
                boxSizing: 'border-box',
                padding: 'clamp(24px, 4vw, 36px) clamp(20px, 3vw, 30px)',
                borderRadius: 'var(--boost-radius, 16px)',
                backgroundColor: 'var(--boost-surface, #ffffff)',
                border: isPop
                  ? '2px solid var(--boost-primary, #2563eb)'
                  : '1px solid var(--boost-border, #e2e8f0)',
                boxShadow: isPop
                  ? 'var(--boost-shadow-glow, 0 16px 36px rgba(37, 99, 235, 0.18))'
                  : 'var(--boost-shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.04))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              {isPop && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-13px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--boost-primary, #2563eb)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  {tier.popularLabel || 'Most Popular'}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      margin: 0,
                      color: 'var(--boost-text, #0f172a)',
                    }}
                  >
                    {tier.name}
                  </h3>
                  {tier.badge && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#16a34a',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      {tier.badge}
                    </span>
                  )}
                </div>
                {tier.description && (
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--boost-text-muted, #64748b)',
                      margin: '0 0 24px 0',
                      minHeight: '40px',
                      lineHeight: 1.5,
                    }}
                  >
                    {tier.description}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px',
                    marginBottom: '28px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'clamp(36px, 4vw, 46px)',
                      fontWeight: 800,
                      color: 'var(--boost-text, #0f172a)',
                      lineHeight: 1,
                    }}
                  >
                    {typeof rawPrice === 'number' ? `${currency}${rawPrice}` : rawPrice}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--boost-text-muted, #64748b)',
                    }}
                  >
                    /{activeCycle === 'annual' ? 'yr' : 'mo'}
                  </span>
                  {rawOriginalPrice && (
                    <div style={{ width: '100%', marginTop: '2px' }}>
                      <span
                        style={{
                          fontSize: '15px',
                          color: 'var(--boost-text-muted, #94a3b8)',
                          textDecoration: 'line-through',
                          fontWeight: 500,
                        }}
                      >
                        {typeof rawOriginalPrice === 'number' ? `${currency}${rawOriginalPrice}` : rawOriginalPrice}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--boost-border, #e2e8f0)',
                    paddingTop: '24px',
                    marginBottom: '32px',
                  }}
                >
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '13px',
                    }}
                  >
                    {tier.features.map((feat, fIdx) => {
                      const text = typeof feat === 'string' ? feat : feat.text;
                      const included = typeof feat === 'string' ? true : feat.included;

                      return (
                        <li
                          key={fIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '14px',
                            color: included
                              ? 'var(--boost-text, #0f172a)'
                              : 'var(--boost-text-muted, #94a3b8)',
                            opacity: included ? 1 : 0.6,
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '20px',
                              height: '20px',
                              borderRadius: '9999px',
                              backgroundColor: included ? 'rgba(37, 99, 235, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                              flexShrink: 0,
                            }}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={included ? 'var(--boost-primary, #2563eb)' : '#94a3b8'}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {included ? (
                                <polyline points="20 6 9 17 4 12" />
                              ) : (
                                <>
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                              )}
                            </svg>
                          </span>
                          <span>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={tier.onSelect}
                disabled={tier.disabled}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 'var(--boost-radius, 10px)',
                  backgroundColor: isPop
                    ? 'var(--boost-primary, #2563eb)'
                    : 'var(--boost-bg, #f8fafc)',
                  color: isPop ? '#ffffff' : 'var(--boost-text, #0f172a)',
                  border: isPop
                    ? 'none'
                    : '1px solid var(--boost-border, #e2e8f0)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: tier.disabled ? 'not-allowed' : 'pointer',
                  opacity: tier.disabled ? 0.5 : 1,
                  boxShadow: isPop
                    ? 'var(--boost-shadow-glow, 0 4px 14px rgba(37, 99, 235, 0.3))'
                    : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {tier.ctaText || (isPop ? 'Get Started Now' : 'Choose Plan')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};


PricingTable.displayName = 'PricingTable';
