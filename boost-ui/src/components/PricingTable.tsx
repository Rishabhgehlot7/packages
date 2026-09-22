import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';


/**
 * PricingFeature — A single feature row in the pricing comparison.
 */
export interface PricingFeature {
  text: string;
  included: boolean;
}


/**
 * PricingTier — A single pricing plan/tier.
 */
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


/**
 * PricingTableProps — Properties for the pricing table/plans component.
 */
export interface PricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers?: PricingTier[];
  billingCycle?: 'monthly' | 'annual';
  onBillingCycleChange?: (cycle: 'monthly' | 'annual') => void;
  annualDiscountLabel?: string;
  showToggle?: boolean;
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  tiers = [],
  billingCycle = 'monthly',
  onBillingCycleChange,
  annualDiscountLabel = 'Save 20%',
  showToggle = true,
  className = '',
  style,
  stylePreset: stylePresetProp,
  ...props
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [internalCycle, setInternalCycle] = React.useState<'monthly' | 'annual'>(billingCycle);

  const activeCycle = onBillingCycleChange ? billingCycle : internalCycle;

  const handleCycleChange = (cycle: 'monthly' | 'annual') => {
    if (onBillingCycleChange) {
      onBillingCycleChange(cycle);
    } else {
      setInternalCycle(cycle);
    }
  };

  const getToggleContainerStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '4px',
          borderRadius: '4px',
          border: '2px solid #000000',
          boxShadow: '3px 3px 0px #000000',
          marginBottom: '40px',
          gap: '4px',
        };
      case 'glassmorphism':
        return {
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          marginBottom: '40px',
          gap: '4px',
        };
      case 'neumorphism':
        return {
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#e0e5ec',
          padding: '6px',
          borderRadius: '9999px',
          border: 'none',
          boxShadow: 'inset 3px 3px 6px #bec3c9, inset -3px -3px 6px #ffffff',
          marginBottom: '40px',
          gap: '6px',
        };
      case 'gradient-glow':
        return {
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'var(--boost-surface, #f8fafc)',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.2)',
          marginBottom: '40px',
          gap: '4px',
        };
      case 'material-you':
        return {
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'var(--boost-surface, #ece6f0)',
          padding: '6px',
          borderRadius: '24px',
          border: 'none',
          marginBottom: '40px',
          gap: '4px',
        };
      case 'dark-first':
        return {
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#1e293b',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid #334155',
          marginBottom: '40px',
          gap: '4px',
        };
      case 'minimal':
      default:
        return {
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'var(--boost-surface, #f1f5f9)',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid var(--boost-border, #e2e8f0)',
          marginBottom: '40px',
          gap: '4px',
        };
    }
  };

  const getToggleButtonStyles = (isActive: boolean): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          padding: '8px 20px',
          borderRadius: '2px',
          border: isActive ? '2px solid #000000' : '2px solid transparent',
          backgroundColor: isActive ? 'var(--boost-primary, #fbbf24)' : 'transparent',
          color: '#000000',
          fontWeight: 800,
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: isActive ? '2px 2px 0px #000000' : 'none',
          transition: 'all 0.15s ease',
        };
      case 'glassmorphism':
        return {
          padding: '8px 20px',
          borderRadius: '9999px',
          border: 'none',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          color: isActive ? 'var(--boost-text, #0f172a)' : 'var(--boost-text-muted, #64748b)',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
          transition: 'all 0.15s ease',
        };
      case 'neumorphism':
        return {
          padding: '8px 20px',
          borderRadius: '9999px',
          border: 'none',
          backgroundColor: '#e0e5ec',
          color: isActive ? 'var(--boost-primary, #2563eb)' : '#64748b',
          fontWeight: 700,
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: isActive ? '3px 3px 6px #bec3c9, -3px -3px 6px #ffffff' : 'none',
          transition: 'all 0.15s ease',
        };
      case 'material-you':
        return {
          padding: '8px 20px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: isActive ? 'var(--boost-primary, #6750a4)' : 'transparent',
          color: isActive ? '#ffffff' : 'var(--boost-text, #49454f)',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        };
      default:
        return {
          padding: '8px 20px',
          borderRadius: '9999px',
          border: 'none',
          backgroundColor: isActive ? 'var(--boost-bg, #ffffff)' : 'transparent',
          color: isActive ? 'var(--boost-text, #0f172a)' : 'var(--boost-text-muted, #64748b)',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: isActive ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
          transition: 'all 0.15s ease',
        };
    }
  };

  const getTierCardStyles = (isPop?: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'relative',
      boxSizing: 'border-box',
      padding: 'clamp(24px, 4vw, 36px) clamp(20px, 3vw, 30px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          border: '3px solid #000000',
          boxShadow: isPop ? '6px 6px 0px #000000' : '4px 4px 0px #000000',
          transform: isPop ? 'translate(-2px, -2px)' : 'none',
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: isPop ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isPop
            ? '1.5px solid rgba(99, 102, 241, 0.6)'
            : '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: isPop
            ? '0 16px 40px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(99, 102, 241, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.06)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: isPop
            ? '2px solid var(--boost-primary, #6366f1)'
            : '1px solid var(--boost-border, #e2e8f0)',
          boxShadow: isPop
            ? '0 0 35px rgba(99, 102, 241, 0.35), 0 12px 30px rgba(99, 102, 241, 0.2)'
            : '0 4px 20px rgba(0, 0, 0, 0.05)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '24px',
          backgroundColor: '#e0e5ec',
          border: 'none',
          boxShadow: isPop
            ? 'inset 2px 2px 5px #bec3c9, inset -2px -2px 5px #ffffff, 8px 8px 20px #bec3c9'
            : '8px 8px 18px #bec3c9, -8px -8px 18px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '28px',
          backgroundColor: isPop ? 'var(--boost-surface, #e8def8)' : 'var(--boost-surface, #f3edf7)',
          border: 'none',
          boxShadow: isPop ? '0 4px 16px rgba(0, 0, 0, 0.08)' : 'none',
        };
      case 'dark-first':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: '#111827',
          border: isPop ? '1.5px solid var(--boost-primary, #3b82f6)' : '1px solid #1f2937',
          boxShadow: isPop ? '0 0 25px rgba(59, 130, 246, 0.25)' : 'none',
        };
      case 'minimal':
      default:
        return {
          ...base,
          borderRadius: '8px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: isPop ? '2px solid #0f172a' : '1px solid var(--boost-border, #e2e8f0)',
          boxShadow: isPop ? '0 8px 24px rgba(0, 0, 0, 0.06)' : 'none',
        };
    }
  };

  const getPopularBadgeStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      top: '-13px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '11px',
      fontWeight: 800,
      padding: '4px 14px',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      zIndex: 2,
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          backgroundColor: '#fbbf24',
          color: '#000000',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
          borderRadius: '2px',
        };
      case 'glassmorphism':
        return {
          ...base,
          backgroundColor: 'rgba(99, 102, 241, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#ffffff',
          borderRadius: '9999px',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
        };
      case 'gradient-glow':
        return {
          ...base,
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: '#ffffff',
          borderRadius: '9999px',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.6)',
        };
      case 'neumorphism':
        return {
          ...base,
          backgroundColor: '#e0e5ec',
          color: 'var(--boost-primary, #2563eb)',
          borderRadius: '9999px',
          boxShadow: '3px 3px 6px #bec3c9, -3px -3px 6px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          backgroundColor: 'var(--boost-primary, #6750a4)',
          color: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
        };
      default:
        return {
          ...base,
          backgroundColor: 'var(--boost-primary, #2563eb)',
          color: '#ffffff',
          borderRadius: '9999px',
          boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)',
        };
    }
  };

  const getButtonStyles = (isPop?: boolean, disabled?: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      padding: '13px',
      fontWeight: 700,
      fontSize: '14px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'all 0.15s ease',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          backgroundColor: isPop ? '#fbbf24' : '#ffffff',
          color: '#000000',
          border: '2px solid #000000',
          boxShadow: '3px 3px 0px #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '12px',
          backgroundColor: isPop ? 'var(--boost-primary, #6366f1)' : 'rgba(255, 255, 255, 0.5)',
          color: isPop ? '#ffffff' : 'var(--boost-text, #0f172a)',
          border: isPop ? 'none' : '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: isPop ? '0 4px 16px rgba(99, 102, 241, 0.4)' : 'none',
          backdropFilter: 'blur(8px)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '10px',
          background: isPop
            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
            : 'var(--boost-bg, #f8fafc)',
          color: isPop ? '#ffffff' : 'var(--boost-text, #0f172a)',
          border: isPop ? 'none' : '1px solid var(--boost-border, #e2e8f0)',
          boxShadow: isPop ? '0 0 20px rgba(99, 102, 241, 0.5)' : 'none',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '16px',
          backgroundColor: '#e0e5ec',
          color: isPop ? 'var(--boost-primary, #2563eb)' : 'var(--boost-text, #0f172a)',
          border: 'none',
          boxShadow: isPop
            ? 'inset 2px 2px 5px #bec3c9, inset -2px -2px 5px #ffffff'
            : '4px 4px 10px #bec3c9, -4px -4px 10px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '24px',
          backgroundColor: isPop ? 'var(--boost-primary, #6750a4)' : 'transparent',
          color: isPop ? '#ffffff' : 'var(--boost-primary, #6750a4)',
          border: isPop ? 'none' : '1px solid var(--boost-primary, #6750a4)',
        };
      case 'dark-first':
        return {
          ...base,
          borderRadius: '10px',
          backgroundColor: isPop ? 'var(--boost-primary, #3b82f6)' : '#1f2937',
          color: '#ffffff',
          border: 'none',
          boxShadow: isPop ? '0 0 16px rgba(59, 130, 246, 0.4)' : 'none',
        };
      case 'minimal':
      default:
        return {
          ...base,
          borderRadius: '6px',
          backgroundColor: isPop ? '#0f172a' : 'transparent',
          color: isPop ? '#ffffff' : 'var(--boost-text, #0f172a)',
          border: isPop ? 'none' : '1px solid var(--boost-border, #e2e8f0)',
        };
    }
  };

  return (
    <div
      className={`boost-pricing-table boost-pricing-table-${preset} ${className}`}
      data-boost-preset={preset}
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
          :root[data-theme="dark"] .boost-pricing-card.preset-glassmorphism,
          .dark .boost-pricing-card.preset-glassmorphism {
            background-color: rgba(15, 23, 42, 0.75) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-pricing-card.preset-neo-brutalism,
          .dark .boost-pricing-card.preset-neo-brutalism {
            background-color: #18181b !important;
            border-color: #ffffff !important;
            box-shadow: 4px 4px 0px #ffffff !important;
            color: #ffffff !important;
          }
          :root[data-theme="dark"] .boost-pricing-card.preset-neo-brutalism.is-popular,
          .dark .boost-pricing-card.preset-neo-brutalism.is-popular {
            box-shadow: 6px 6px 0px #ffffff !important;
          }
          :root[data-theme="dark"] .boost-pricing-card.preset-neumorphism,
          .dark .boost-pricing-card.preset-neumorphism {
            background-color: #1e2530 !important;
            box-shadow: 6px 6px 14px #13171e, -6px -6px 14px #293342 !important;
          }
          :root[data-theme="dark"] .boost-pricing-card:not(.preset-glassmorphism):not(.preset-neo-brutalism):not(.preset-neumorphism),
          .dark .boost-pricing-card:not(.preset-glassmorphism):not(.preset-neo-brutalism):not(.preset-neumorphism) {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-pricing-card.is-popular:not(.preset-glassmorphism):not(.preset-neo-brutalism):not(.preset-neumorphism),
          .dark .boost-pricing-card.is-popular:not(.preset-glassmorphism):not(.preset-neo-brutalism):not(.preset-neumorphism) {
            border-color: var(--boost-primary, #6366f1) !important;
            box-shadow: 0 12px 35px rgba(99, 102, 241, 0.25) !important;
          }
        `}
      </style>
      {showToggle && (
        <div style={getToggleContainerStyles()}>
          <button
            type="button"
            onClick={() => handleCycleChange('monthly')}
            style={getToggleButtonStyles(activeCycle === 'monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => handleCycleChange('annual')}
            style={{
              ...getToggleButtonStyles(activeCycle === 'annual'),
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
              className={`boost-pricing-card preset-${preset} ${isPop ? 'is-popular' : ''}`}
              style={getTierCardStyles(isPop)}
            >
              {isPop && (
                <div style={getPopularBadgeStyles()}>
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
                        borderRadius: preset === 'neo-brutalism' ? '2px' : '9999px',
                        border: preset === 'neo-brutalism' ? '1.5px solid #000' : '1px solid rgba(34, 197, 94, 0.2)',
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
                    borderTop: preset === 'neo-brutalism' ? '2px solid #000' : '1px solid var(--boost-border, #e2e8f0)',
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
                              borderRadius: preset === 'neo-brutalism' ? '2px' : '9999px',
                              backgroundColor: preset === 'neo-brutalism'
                                ? (included ? '#fbbf24' : '#f1f5f9')
                                : (included ? 'rgba(37, 99, 235, 0.1)' : 'rgba(148, 163, 184, 0.1)'),
                              border: preset === 'neo-brutalism' ? '1.5px solid #000' : 'none',
                              flexShrink: 0,
                            }}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={included ? (preset === 'neo-brutalism' ? '#000000' : 'var(--boost-primary, #2563eb)') : '#94a3b8'}
                              strokeWidth={preset === 'neo-brutalism' ? '3' : '2.5'}
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
                style={getButtonStyles(isPop, tier.disabled)}
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
