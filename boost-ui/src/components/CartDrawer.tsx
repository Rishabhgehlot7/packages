import * as React from 'react';

export interface CartDrawerItem {
  id: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartDrawerItem[];
  subtotal: number;
  freeShippingThreshold?: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => Promise<void> | void;
  className?: string;
  onTabSync?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  freeShippingThreshold = 999,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  className = '',
  onTabSync,
}) => {
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
    if (isCheckingOut) return; // Concurrency mutex: Prevent duplicate double-clicks
    try {
      setIsCheckingOut(true);
      await Promise.resolve(onCheckout());
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className={`boost-cart-drawer-backdrop ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
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
        :root[data-theme="dark"] .boost-cart-drawer-panel,
        .dark .boost-cart-drawer-panel {
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
        className="boost-cart-drawer-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--boost-bg, #ffffff)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--boost-shadow-lg, -4px 0 32px rgba(0, 0, 0, 0.2))',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="boost-cart-header"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--boost-border, #e2e8f0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--boost-surface, #f8fafc)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--boost-text, #0f172a)' }}>
              Your Cart
            </h2>
            <span
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--boost-primary, #2563eb)',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Cart Drawer"
            style={{
              background: 'none',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--boost-text-muted, #64748b)',
              fontSize: '18px',
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
            backgroundColor: 'var(--boost-surface, #f8fafc)',
            borderBottom: '1px solid var(--boost-border, #e2e8f0)',
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
              <span>Add <strong>₹{amountRemaining.toFixed(0)}</strong> more for FREE Delivery!</span>
            )}
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'var(--boost-border, #e2e8f0)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: isFreeShippingUnlocked
                  ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                  : 'linear-gradient(90deg, #2563eb, #3b82f6)',
                borderRadius: '999px',
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
                  backgroundColor: 'var(--boost-primary, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxShadow: 'var(--boost-shadow-glow, 0 4px 12px rgba(37, 99, 235, 0.25))',
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
                    borderBottom: '1px solid var(--boost-border, #e2e8f0)',
                    paddingBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '10px',
                      border: '1px solid var(--boost-border, #e2e8f0)',
                      backgroundColor: 'var(--boost-surface, #f8fafc)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}
                  >
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
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div
                    className="boost-cart-qty"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--boost-border, #e2e8f0)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--boost-surface, #f8fafc)',
                    }}
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
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--boost-border, #e2e8f0)',
              backgroundColor: 'var(--boost-surface, #f8fafc)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', color: 'var(--boost-text-muted, #64748b)' }}>Subtotal:</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--boost-text, #0f172a)' }}>
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckoutClick}
              disabled={isCheckingOut}
              style={{
                width: '100%',
                backgroundColor: 'var(--boost-primary, #2563eb)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                opacity: isCheckingOut ? 0.7 : 1,
                boxShadow: 'var(--boost-shadow-glow, 0 4px 14px rgba(37, 99, 235, 0.35))',
                transition: 'all 0.15s ease',
              }}
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
