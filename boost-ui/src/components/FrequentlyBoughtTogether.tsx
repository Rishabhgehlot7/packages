import * as React from 'react';

export interface BundleItem {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  originalPrice?: number;
}

export interface FrequentlyBoughtTogetherProps {
  mainProduct: BundleItem;
  suggestedItems: BundleItem[];
  bundleDiscountPercentage?: number;
  currencySymbol?: string;
  onAddBundleToCart?: (selectedItems: BundleItem[]) => void;
  onAddBundle?: (selectedItems: BundleItem[] | string[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  mainProduct,
  suggestedItems,
  bundleDiscountPercentage = 10,
  currencySymbol = '₹',
  onAddBundleToCart,
  onAddBundle,
  className = '',
  style,
}) => {
  const allItems = [mainProduct, ...suggestedItems];
  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    allItems.map((i) => i.id)
  );
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const selectedItems = allItems.filter((i) => selectedIds.includes(i.id));
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const originalSubtotal = selectedItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price),
    0
  );
  const discountAmount =
    selectedItems.length > 1
      ? Math.round((subtotal * bundleDiscountPercentage) / 100)
      : 0;
  const finalPrice = subtotal - discountAmount;
  const totalSavings = originalSubtotal - finalPrice;

  const handleAddToCart = () => {
    if (onAddBundleToCart) {
      onAddBundleToCart(selectedItems);
    }
    if (onAddBundle) {
      onAddBundle(selectedItems.map((i) => i.id));
    }
  };

  return (
    <div
      className={`boost-frequently-bought ${className}`}
      style={{
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, rgba(0, 0, 0, 0.08))',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 12px 30px -10px var(--boost-shadow, rgba(0, 0, 0, 0.05))',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <style>
        {`
          .boost-frequently-bought {
            transition: all 0.3s ease;
          }

          :root[data-theme="dark"] .boost-frequently-bought,
          .dark .boost-frequently-bought {
            background-color: var(--boost-surface, #111827) !important;
            border-color: var(--boost-border, rgba(255, 255, 255, 0.1)) !important;
            box-shadow: 0 12px 35px -10px rgba(0, 0, 0, 0.5) !important;
          }

          .boost-fbt-title {
            font-size: 18px;
            font-weight: 800;
            color: var(--boost-text-primary, #0f172a);
            margin: 0;
            letter-spacing: -0.02em;
          }
          :root[data-theme="dark"] .boost-fbt-title,
          .dark .boost-fbt-title {
            color: #f8fafc !important;
          }

          .boost-fbt-item-text {
            color: var(--boost-text-primary, #0f172a);
          }
          :root[data-theme="dark"] .boost-fbt-item-text,
          .dark .boost-fbt-item-text {
            color: #f1f5f9 !important;
          }

          .boost-fbt-price {
            color: var(--boost-text-primary, #0f172a);
          }
          :root[data-theme="dark"] .boost-fbt-price,
          .dark .boost-fbt-price {
            color: #ffffff !important;
          }

          .boost-fbt-total {
            color: var(--boost-text-primary, #0f172a);
          }
          :root[data-theme="dark"] .boost-fbt-total,
          .dark .boost-fbt-total {
            color: #ffffff !important;
          }

          .boost-combo-badge {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.18) 100%);
            color: var(--boost-success, #059669);
            border: 1px solid rgba(16, 185, 129, 0.3);
            font-size: 12px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          :root[data-theme="dark"] .boost-combo-badge,
          .dark .boost-combo-badge {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border-color: rgba(52, 211, 153, 0.3);
          }

          .boost-bundle-card {
            width: 96px;
            height: 96px;
            border-radius: 14px;
            background: var(--boost-bg-muted, #f8fafc);
            border: 2px solid var(--boost-border, rgba(0,0,0,0.06));
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px;
            cursor: pointer;
            position: relative;
            flex-shrink: 0;
            overflow: visible;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
          }

          .boost-bundle-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 18px rgba(0,0,0,0.12);
          }

          .boost-bundle-card.selected {
            border-color: var(--boost-primary, #6366f1);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            opacity: 1;
          }

          .boost-bundle-card.unselected {
            opacity: 0.35;
            filter: grayscale(80%);
          }

          :root[data-theme="dark"] .boost-bundle-card,
          .dark .boost-bundle-card {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.12);
          }

          :root[data-theme="dark"] .boost-bundle-card.selected,
          .dark .boost-bundle-card.selected {
            border-color: #818cf8;
            box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.3);
          }

          .boost-bundle-check-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: var(--boost-primary, #6366f1);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            font-size: 11px;
            font-weight: 800;
            z-index: 5;
            border: 2px solid var(--boost-surface, #ffffff);
          }

          :root[data-theme="dark"] .boost-bundle-check-badge,
          .dark .boost-bundle-check-badge {
            border-color: #111827;
            background: #6366f1;
          }

          .boost-bundle-plus-chip {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--boost-bg-muted, #f1f5f9);
            color: var(--boost-text-muted, #64748b);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 700;
            flex-shrink: 0;
            border: 1px solid var(--boost-border, rgba(0,0,0,0.06));
          }

          :root[data-theme="dark"] .boost-bundle-plus-chip,
          .dark .boost-bundle-plus-chip {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.1);
            color: #94a3b8;
          }

          .boost-bundle-btn {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            font-weight: 700;
            font-size: 14px;
            padding: 12px 24px;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .boost-bundle-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(15, 23, 42, 0.3);
          }

          .boost-bundle-btn:active {
            transform: scale(0.98);
          }

          :root[data-theme="dark"] .boost-bundle-btn,
          .dark .boost-bundle-btn {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
          }
        `}
      </style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <h3 className="boost-fbt-title">
          Frequently Bought Together
        </h3>
        {selectedItems.length > 1 && (
          <span className="boost-combo-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Save {bundleDiscountPercentage}% on Combo
          </span>
        )}
      </div>

      {/* Visual Image Grid with '+' connectors */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          overflowX: 'auto',
          padding: '12px 8px 12px 8px',
        }}
      >
        {allItems.map((item, index) => {
          const isSelected = selectedIds.includes(item.id);
          const hasError = !item.imageUrl || imageErrors[item.id];

          return (
            <React.Fragment key={item.id}>
              {index > 0 && (
                <div className="boost-bundle-plus-chip">+</div>
              )}
              <div
                onClick={() => toggleItem(item.id)}
                className={`boost-bundle-card ${isSelected ? 'selected' : 'unselected'}`}
                title={item.title}
              >
                {isSelected && (
                  <div className="boost-bundle-check-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                {!hasError ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onError={() => handleImageError(item.id)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      color: 'var(--boost-text-muted, #94a3b8)',
                      textAlign: 'center',
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <span style={{ fontSize: '9px', fontWeight: 600, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </span>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Checkbox List & Titles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {allItems.map((item, idx) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '13px',
                cursor: 'pointer',
                padding: '4px 0',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleItem(item.id)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--boost-primary, #6366f1)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  flexShrink: 0,
                }}
              />
              <span
                className="boost-fbt-item-text"
                style={{
                  flex: 1,
                  lineHeight: 1.4,
                  transition: 'color 0.2s ease',
                  opacity: isSelected ? 1 : 0.5,
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {idx === 0 ? 'This item: ' : ''}
                </span>
                {item.title}
                <span
                  className="boost-fbt-price"
                  style={{
                    fontWeight: 700,
                    marginLeft: '8px',
                  }}
                >
                  {currencySymbol}
                  {item.price.toLocaleString('en-IN')}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--boost-text-muted, #94a3b8)',
                      textDecoration: 'line-through',
                      marginLeft: '6px',
                    }}
                  >
                    {currencySymbol}
                    {item.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {/* Price Summary & Action */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          paddingTop: '18px',
          borderTop: '1px solid var(--boost-border, rgba(0,0,0,0.06))',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--boost-text-secondary, #64748b)', fontWeight: 500 }}>
              Total price:
            </span>
            <span
              className="boost-fbt-total"
              style={{
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {currencySymbol}
              {finalPrice.toLocaleString('en-IN')}
            </span>
            {discountAmount > 0 && (
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--boost-text-muted, #94a3b8)',
                  textDecoration: 'line-through',
                }}
              >
                {currencySymbol}
                {subtotal.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {discountAmount > 0 && (
            <div
              style={{
                fontSize: '12px',
                color: 'var(--boost-success, #10b981)',
                fontWeight: 700,
                marginTop: '2px',
              }}
            >
              🎉 You save {currencySymbol}
              {totalSavings > 0 ? totalSavings.toLocaleString('en-IN') : discountAmount.toLocaleString('en-IN')} ({bundleDiscountPercentage}% combo discount)
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="boost-bundle-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span>Add {selectedItems.length} items to Cart</span>
        </button>
      </div>
    </div>
  );
};

FrequentlyBoughtTogether.displayName = 'FrequentlyBoughtTogether';
