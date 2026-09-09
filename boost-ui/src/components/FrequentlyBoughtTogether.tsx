import * as React from 'react';

export interface BundleItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  originalPrice?: number;
}

export interface FrequentlyBoughtTogetherProps {
  mainProduct: BundleItem;
  suggestedItems: BundleItem[];
  bundleDiscountPercentage?: number;
  currencySymbol?: string;
  onAddBundleToCart?: (selectedItems: BundleItem[]) => void;
  className?: string;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  mainProduct,
  suggestedItems,
  bundleDiscountPercentage = 10,
  currencySymbol = '₹',
  onAddBundleToCart,
  className = '',
}) => {
  const allItems = [mainProduct, ...suggestedItems];
  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    allItems.map((i) => i.id)
  );

  const toggleItem = (id: string) => {
    // Keep main product always checked or allow uncheck
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedItems = allItems.filter((i) => selectedIds.includes(i.id));
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount =
    selectedItems.length > 1
      ? Math.round((subtotal * bundleDiscountPercentage) / 100)
      : 0;
  const finalPrice = subtotal - discountAmount;

  return (
    <div
      className={`boost-frequently-bought ${className}`}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#111827',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Frequently Bought Together
        </h3>
        {selectedItems.length > 1 && (
          <span
            style={{
              backgroundColor: '#ecfdf5',
              color: '#059669',
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '9999px',
              border: '1px solid #a7f3d0',
            }}
          >
            Save {bundleDiscountPercentage}% on Combo
          </span>
        )}
      </div>

      {/* Visual Image Grid with '+' connectors */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {allItems.map((item, index) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <React.Fragment key={item.id}>
              {index > 0 && (
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#9ca3af',
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              )}
              <div
                onClick={() => toggleItem(item.id)}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px',
                  cursor: 'pointer',
                  position: 'relative',
                  opacity: isSelected ? 1 : 0.4,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
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
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleItem(item.id)}
                style={{
                  marginTop: '3px',
                  accentColor: '#2563eb',
                  cursor: 'pointer',
                }}
              />
              <span style={{ color: isSelected ? '#111827' : '#6b7280', flex: 1 }}>
                <span style={{ fontWeight: 600 }}>
                  {idx === 0 ? 'This item: ' : ''}
                </span>
                {item.title}
                <span style={{ fontWeight: 700, marginLeft: '6px', color: '#111827' }}>
                  {currencySymbol}
                  {item.price.toLocaleString('en-IN')}
                </span>
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
          paddingTop: '16px',
          borderTop: '1px solid #f3f4f6',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Total price:</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>
              {currencySymbol}
              {finalPrice.toLocaleString('en-IN')}
            </span>
            {discountAmount > 0 && (
              <span
                style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                  textDecoration: 'line-through',
                }}
              >
                {currencySymbol}
                {subtotal.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {discountAmount > 0 && (
            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
              You save {currencySymbol}
              {discountAmount.toLocaleString('en-IN')} ({bundleDiscountPercentage}% OFF)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAddBundleToCart && onAddBundleToCart(selectedItems)}
          style={{
            backgroundColor: '#facc15',
            color: '#111827',
            fontWeight: 700,
            fontSize: '13px',
            padding: '10px 20px',
            borderRadius: '9999px',
            border: '1px solid #eab308',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          Add {selectedItems.length} items to Cart
        </button>
      </div>
    </div>
  );
};
