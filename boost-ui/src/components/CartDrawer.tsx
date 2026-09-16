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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        fontFamily: 'inherit',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
            Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button
            onClick={onClose}
            aria-label="Close Cart Drawer"
            style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div style={{ padding: '12px 20px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: isFreeShippingUnlocked ? '#16a34a' : '#374151', marginBottom: '6px' }}>
            {isFreeShippingUnlocked ? (
              '🎉 You unlocked FREE Delivery!'
            ) : (
              `🚚 Add ₹${amountRemaining.toFixed(0)} more for FREE Delivery!`
            )}
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: isFreeShippingUnlocked ? '#16a34a' : '#2563eb',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛒</div>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>Your cart is empty</p>
              <button
                onClick={onClose}
                style={{ marginTop: '12px', background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    {item.variantTitle && (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.variantTitle}</div>
                    )}
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease Quantity"
                      style={{ padding: '4px 8px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '12px' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 600 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase Quantity"
                      style={{ padding: '4px 8px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '12px' }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item from cart"
                    style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#4b5563' }}>Subtotal:</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>₹{subtotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckoutClick}
              disabled={isCheckingOut}
              style={{
                width: '100%',
                backgroundColor: isCheckingOut ? '#374151' : '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                opacity: isCheckingOut ? 0.8 : 1,
                transition: 'all 0.2s ease',
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
