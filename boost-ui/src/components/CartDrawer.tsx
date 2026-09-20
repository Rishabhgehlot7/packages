import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface CartDrawerItem {
  id: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CartDrawerItem[];
  subtotal?: number;
  currencySymbol?: string;
  freeShippingThreshold?: number;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => Promise<void> | void;
  className?: string;
  onTabSync?: () => void;
  stylePreset?: UIStylePreset;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen = false,
  onClose = () => {},
  items = [],
  subtotal = 0,
  currencySymbol = '$',
  freeShippingThreshold = 50,
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onCheckout = () => {},
  className = '',
  onTabSync,
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  // Keyboard accessibility (Escape key) & Body scroll locking
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Multi-tab synchronization
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'boost_cart' || e.key === 'cart_items') {
        onTabSync?.();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [onTabSync]);

  if (!isOpen) return null;

  const amountRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const isFreeShippingUnlocked = amountRemaining === 0;

  const handleCheckoutClick = async () => {
    if (isCheckingOut) return;
    try {
      setIsCheckingOut(true);
      await Promise.resolve(onCheckout());
    } finally {
      setIsCheckingOut(false);
    }
  };

  const getPanelStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      maxWidth: '440px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          backgroundColor: '#ffffff',
          borderLeft: '3px solid #000000',
          boxShadow: '-6px 0px 0px #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.12)',
        };
      case 'gradient-glow':
        return {
          ...base,
          backgroundColor: 'var(--boost-bg, #ffffff)',
          borderLeft: '1.5px solid rgba(99, 102, 241, 0.35)',
          boxShadow: '-10px 0 40px rgba(99, 102, 241, 0.2)',
        };
      case 'neumorphism':
        return {
          ...base,
          backgroundColor: '#e0e5ec',
          borderLeft: 'none',
          boxShadow: '-12px 0 30px #bec3c9',
        };
      case 'material-you':
        return {
          ...base,
          backgroundColor: 'var(--boost-surface, #f7f2fa)',
          borderTopLeftRadius: '28px',
          borderBottomLeftRadius: '28px',
          borderLeft: 'none',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.08)',
        };
      case 'dark-first':
        return {
          ...base,
          backgroundColor: '#0f172a',
          borderLeft: '1px solid #1e293b',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.4)',
        };
      case 'minimal':
      default:
        return {
          ...base,
          backgroundColor: 'var(--boost-bg, #ffffff)',
          boxShadow: 'var(--boost-shadow-lg, -4px 0 32px rgba(0, 0, 0, 0.2))',
        };
    }
  };

  const getHeaderStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          backgroundColor: '#ffffff',
          borderBottom: '3px solid #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        };
      case 'neumorphism':
        return {
          ...base,
          backgroundColor: '#e0e5ec',
          borderBottom: '1px solid #d1d5db',
        };
      case 'material-you':
        return {
          ...base,
          backgroundColor: 'var(--boost-surface-variant, #ece6f0)',
          borderBottom: 'none',
        };
      default:
        return {
          ...base,
          borderBottom: '1px solid var(--boost-border, #e2e8f0)',
          backgroundColor: 'var(--boost-surface, #f8fafc)',
        };
    }
  };

  const getCountBadgeStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '2px 8px',
      fontSize: '12px',
      fontWeight: 700,
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          backgroundColor: '#fbbf24',
          color: '#000000',
          border: '1.5px solid #000000',
          borderRadius: '2px',
        };
      case 'glassmorphism':
        return {
          ...base,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          color: 'var(--boost-primary, #6366f1)',
          borderRadius: '9999px',
        };
      case 'material-you':
        return {
          ...base,
          backgroundColor: 'var(--boost-primary, #6750a4)',
          color: '#ffffff',
          borderRadius: '12px',
        };
      default:
        return {
          ...base,
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          color: 'var(--boost-primary, #2563eb)',
          borderRadius: '9999px',
        };
    }
  };

  const getItemThumbStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '64px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          border: '2px solid #000000',
          backgroundColor: '#ffffff',
          boxShadow: '2px 2px 0px #000000',
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '14px',
          border: 'none',
          backgroundColor: '#e0e5ec',
          boxShadow: 'inset 2px 2px 4px #bec3c9, inset -2px -2px 4px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '16px',
          border: 'none',
          backgroundColor: 'var(--boost-surface-variant, #ece6f0)',
        };
      default:
        return {
          ...base,
          borderRadius: '10px',
          border: '1px solid var(--boost-border, #e2e8f0)',
          backgroundColor: 'var(--boost-surface, #f8fafc)',
        };
    }
  };

  const getQtyStepperStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
          borderRadius: '2px',
          backgroundColor: '#ffffff',
        };
      case 'glassmorphism':
        return {
          ...base,
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(8px)',
        };
      case 'neumorphism':
        return {
          ...base,
          border: 'none',
          borderRadius: '12px',
          backgroundColor: '#e0e5ec',
          boxShadow: '2px 2px 5px #bec3c9, -2px -2px 5px #ffffff',
        };
      case 'material-you':
        return {
          ...base,
          border: 'none',
          borderRadius: '20px',
          backgroundColor: 'var(--boost-surface-variant, #e8def8)',
        };
      default:
        return {
          ...base,
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: '8px',
          backgroundColor: 'var(--boost-surface, #f8fafc)',
        };
    }
  };

  const getFooterStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '16px 20px',
    };

    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderTop: '3px solid #000000',
          backgroundColor: '#ffffff',
        };
      case 'glassmorphism':
        return {
          ...base,
          borderTop: '1px solid rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
        };
      case 'neumorphism':
        return {
          ...base,
          borderTop: '1px solid #d1d5db',
          backgroundColor: '#e0e5ec',
        };
      case 'material-you':
        return {
          ...base,
          borderTop: 'none',
          backgroundColor: 'var(--boost-surface-variant, #ece6f0)',
        };
      default:
        return {
          ...base,
          borderTop: '1px solid var(--boost-border, #e2e8f0)',
          backgroundColor: 'var(--boost-surface, #f8fafc)',
        };
    }
  };

  const getCheckoutButtonStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      fontWeight: 700,
      cursor: isCheckingOut ? 'not-allowed' : 'pointer',
      opacity: isCheckingOut ? 0.7 : 1,
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
          backgroundColor: 'var(--boost-primary, #6366f1)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
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
      case 'dark-first':
        return {
          ...base,
          borderRadius: '10px',
          backgroundColor: 'var(--boost-primary, #3b82f6)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)',
        };
      case 'minimal':
      default:
        return {
          ...base,
          borderRadius: '12px',
          backgroundColor: 'var(--boost-primary, #2563eb)',
          color: '#ffffff',
          border: 'none',
          boxShadow: 'var(--boost-shadow-glow, 0 4px 14px rgba(37, 99, 235, 0.35))',
        };
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className={`boost-cart-drawer-backdrop boost-cart-drawer-${preset} ${className}`}
      data-boost-preset={preset}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: preset === 'neo-brutalism' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        backdropFilter: preset === 'neo-brutalism' ? 'none' : 'blur(6px)',
        WebkitBackdropFilter: preset === 'neo-brutalism' ? 'none' : 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        fontFamily: 'inherit',
        animation: 'boost-fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <style>{`
        @media (max-width: 640px) {
          .boost-cart-drawer-panel {
            max-height: 92vh !important;
            border-top-left-radius: 20px !important;
            border-top-right-radius: 20px !important;
            animation: boost-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
        }
        @media (min-width: 641px) {
          .boost-cart-drawer-panel {
            height: 100% !important;
            animation: boost-slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
        }
        @keyframes boost-slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        :root[data-theme="dark"] .boost-cart-drawer-panel.preset-glassmorphism,
        .dark .boost-cart-drawer-panel.preset-glassmorphism {
          background-color: rgba(15, 23, 42, 0.8) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-cart-drawer-panel.preset-neo-brutalism,
        .dark .boost-cart-drawer-panel.preset-neo-brutalism {
          background-color: #18181b !important;
          border-color: #ffffff !important;
          box-shadow: -6px 0px 0px #ffffff !important;
          color: #ffffff !important;
        }
        :root[data-theme="dark"] .boost-cart-drawer-panel.preset-neumorphism,
        .dark .boost-cart-drawer-panel.preset-neumorphism {
          background-color: #1e2530 !important;
          box-shadow: -12px 0 30px #13171e !important;
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-cart-drawer-panel:not(.preset-glassmorphism):not(.preset-neo-brutalism):not(.preset-neumorphism),
        .dark .boost-cart-drawer-panel:not(.preset-glassmorphism):not(.preset-neo-brutalism):not(.preset-neumorphism) {
          background-color: var(--boost-bg, #0f172a) !important;
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-cart-header,
        .dark .boost-cart-header,
        :root[data-theme="dark"] .boost-shipping-banner,
        .dark .boost-shipping-banner,
        :root[data-theme="dark"] .boost-cart-footer,
        .dark .boost-cart-footer {
          background-color: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        :root[data-theme="dark"] .boost-cart-qty,
        .dark .boost-cart-qty {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }
      `}</style>
      <div
        className={`boost-cart-drawer-panel preset-${preset}`}
        style={getPanelStyles()}
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="boost-cart-header"
          style={getHeaderStyles()}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--boost-text, #0f172a)' }}>
              Your Cart
            </h2>
            <span style={getCountBadgeStyles()}>
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Cart Drawer"
            style={{
              background: preset === 'neo-brutalism' ? '#ffffff' : 'none',
              border: preset === 'neo-brutalism' ? '2px solid #000000' : 'none',
              width: '32px',
              height: '32px',
              borderRadius: preset === 'neo-brutalism' ? '2px' : '8px',
              boxShadow: preset === 'neo-brutalism' ? '2px 2px 0px #000000' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: preset === 'neo-brutalism' ? '#000000' : 'var(--boost-text-muted, #64748b)',
              fontSize: '18px',
              fontWeight: preset === 'neo-brutalism' ? 800 : 400,
              transition: 'background-color 0.15s ease',
            }}
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div
          className="boost-shipping-banner"
          style={{
            padding: '12px 20px',
            backgroundColor: preset === 'neumorphism' ? '#e0e5ec' : preset === 'material-you' ? 'var(--boost-surface, #f7f2fa)' : 'var(--boost-surface, #f8fafc)',
            borderBottom: preset === 'neo-brutalism' ? '2px solid #000000' : '1px solid var(--boost-border, #e2e8f0)',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: isFreeShippingUnlocked ? '#16a34a' : 'var(--boost-text, #374151)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isFreeShippingUnlocked ? (
              <span>🎉 You unlocked <strong>FREE Delivery</strong>!</span>
            ) : (
              <span>Add <strong>{currencySymbol}{amountRemaining.toFixed(0)}</strong> more for FREE Delivery!</span>
            )}
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: preset === 'neo-brutalism' ? '#e2e8f0' : 'var(--boost-border, #e2e8f0)',
              borderRadius: preset === 'neo-brutalism' ? '0px' : '999px',
              border: preset === 'neo-brutalism' ? '1px solid #000' : 'none',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: isFreeShippingUnlocked
                  ? (preset === 'neo-brutalism' ? '#22c55e' : 'linear-gradient(90deg, #16a34a, #22c55e)')
                  : (preset === 'neo-brutalism' ? '#fbbf24' : 'linear-gradient(90deg, #2563eb, #3b82f6)'),
                borderRadius: preset === 'neo-brutalism' ? '0px' : '999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--boost-text-muted, #64748b)' }}>
              <div style={{ display: 'inline-flex', marginBottom: '14px', color: 'var(--boost-text-muted, #94a3b8)' }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--boost-text, #0f172a)' }}>
                Your cart is empty
              </p>
              <p style={{ fontSize: '13px', margin: '0 0 20px 0' }}>Looks like you haven't added anything yet.</p>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: preset === 'neo-brutalism' ? '#fbbf24' : 'var(--boost-primary, #2563eb)',
                  color: preset === 'neo-brutalism' ? '#000000' : '#fff',
                  border: preset === 'neo-brutalism' ? '2px solid #000' : 'none',
                  boxShadow: preset === 'neo-brutalism' ? '3px 3px 0px #000' : 'var(--boost-shadow-glow, 0 4px 12px rgba(37, 99, 235, 0.25))',
                  padding: '10px 22px',
                  borderRadius: preset === 'neo-brutalism' ? '2px' : '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    borderBottom: preset === 'neo-brutalism' ? '2px solid #000000' : '1px solid var(--boost-border, #e2e8f0)',
                    paddingBottom: '14px',
                  }}
                >
                  <div style={getItemThumbStyles()}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--boost-text-muted, #94a3b8)' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--boost-text, #0f172a)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </div>
                    {item.variantTitle && (
                      <div style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)', marginTop: '4px' }}>
                        {item.variantTitle}
                      </div>
                    )}
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--boost-text, #0f172a)', marginTop: '6px' }}>
                      {currencySymbol}{item.price}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div
                    className="boost-cart-qty"
                    style={getQtyStepperStyles()}
                  >
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease Quantity"
                      style={{
                        padding: '6px 10px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--boost-text, #0f172a)',
                      }}
                    >
                      -
                    </button>
                    <span
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--boost-text, #0f172a)',
                        minWidth: '20px',
                        textAlign: 'center',
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase Quantity"
                      style={{
                        padding: '6px 10px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--boost-text, #0f172a)',
                      }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item from cart"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--boost-text-muted, #94a3b8)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px',
                      borderRadius: '6px',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div
            className="boost-cart-footer"
            style={getFooterStyles()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', color: 'var(--boost-text-muted, #64748b)' }}>Subtotal:</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--boost-text, #0f172a)' }}>
                {currencySymbol}{subtotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckoutClick}
              disabled={isCheckingOut}
              style={getCheckoutButtonStyles()}
            >
              {isCheckingOut ? 'Securing Order...' : 'Proceed to Checkout →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

CartDrawer.displayName = 'CartDrawer';
