import * as React from 'react';

export type OrderStage = 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface OrderTimelineProps {
  currentStage: OrderStage;
  dates?: {
    placed?: string;
    confirmed?: string;
    shipped?: string;
    out_for_delivery?: string;
    delivered?: string;
  };
  className?: string;
}

const STAGES: Array<{ id: OrderStage; label: string }> = [
  { id: 'placed', label: 'Order Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'out_for_delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  currentStage,
  dates = {},
  className = '',
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className={`boost-order-timeline ${className}`} style={{ padding: '16px 0', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Background track line */}
        <div style={{ position: 'absolute', top: '14px', left: '20px', right: '20px', height: '3px', backgroundColor: '#e5e7eb', zIndex: 0 }} />

        {STAGES.map((stage, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, minWidth: '60px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '999px',
                  backgroundColor: isPassed ? '#16a34a' : '#ffffff',
                  border: `2px solid ${isPassed ? '#16a34a' : '#d1d5db'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  boxShadow: isCurrent ? '0 0 0 4px rgba(22, 163, 74, 0.2)' : 'none',
                }}
              >
                {isPassed ? '✓' : idx + 1}
              </div>

              <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#111827' : '#6b7280', textAlign: 'center' }}>
                {stage.label}
              </div>

              {dates[stage.id] && (
                <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                  {dates[stage.id]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


OrderTimeline.displayName = 'OrderTimeline';
