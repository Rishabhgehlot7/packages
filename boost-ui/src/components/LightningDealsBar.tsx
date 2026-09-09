import * as React from 'react';

export interface LightningDealsBarProps {
  dealTitle?: string;
  endsAt: Date | string | number;
  percentageClaimed?: number;
  totalQuantity?: number;
  claimedQuantity?: number;
  badgeColor?: string;
  className?: string;
}

export const LightningDealsBar: React.FC<LightningDealsBarProps> = ({
  dealTitle = '⚡ LIGHTNING DEAL',
  endsAt,
  percentageClaimed = 78,
  totalQuantity,
  claimedQuantity,
  badgeColor = '#ef4444',
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  React.useEffect(() => {
    const end = new Date(endsAt).getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      if (diff === 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const pad = (n: number) => String(n).padStart(2, '0');

  // Compute claimed %
  let percent = percentageClaimed;
  if (totalQuantity && claimedQuantity !== undefined) {
    percent = Math.min(100, Math.round((claimedQuantity / totalQuantity) * 100));
  }

  if (timeLeft.isExpired) {
    return null;
  }

  return (
    <div
      className={`boost-lightning-deals-bar ${className}`}
      style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top Header: Badge + Countdown Timer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              backgroundColor: badgeColor,
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {dealTitle}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
            Ends in:
          </span>
        </div>

        {/* Digital Clock Boxes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              backgroundColor: '#1f2937',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pad(timeLeft.hours)}h
          </span>
          <span style={{ fontWeight: 800, color: '#92400e' }}>:</span>
          <span
            style={{
              backgroundColor: '#1f2937',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pad(timeLeft.minutes)}m
          </span>
          <span style={{ fontWeight: 800, color: '#92400e' }}>:</span>
          <span
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pad(timeLeft.seconds)}s
          </span>
        </div>
      </div>

      {/* Bottom Claim Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div
          style={{
            height: '6px',
            backgroundColor: '#e5e7eb',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              backgroundColor: percent > 85 ? '#dc2626' : '#f59e0b',
              borderRadius: '9999px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#78350f',
            fontWeight: 600,
          }}
        >
          <span>{percent}% Claimed</span>
          <span>Hurry, limited stock!</span>
        </div>
      </div>
    </div>
  );
};
