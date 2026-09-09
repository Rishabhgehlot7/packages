import * as React from 'react';

export interface AssuredBadgeProps {
  type?: 'assured' | 'prime' | 'supercoin';
  className?: string;
}

export const AssuredBadge: React.FC<AssuredBadgeProps> = ({
  type = 'assured',
  className = '',
}) => {
  if (type === 'prime') {
    return (
      <span
        className={`boost-badge-prime ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: '#002f34',
          color: '#00a8e1',
          fontSize: '11px',
          fontWeight: 800,
          fontStyle: 'italic',
          padding: '2px 8px',
          borderRadius: '4px',
          letterSpacing: '0.05em',
        }}
      >
        <span style={{ color: '#ffffff' }}>BOOST</span>
        <span style={{ color: '#00a8e1' }}>prime</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00a8e1" strokeWidth="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    );
  }

  if (type === 'supercoin') {
    return (
      <span
        className={`boost-badge-supercoin ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: '#fffbeb',
          color: '#b45309',
          border: '1px solid #fde68a',
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '9999px',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '14px',
            height: '14px',
            borderRadius: '9999px',
            backgroundColor: '#f59e0b',
            color: '#ffffff',
            fontSize: '9px',
            fontWeight: 900,
          }}
        >
          🪙
        </span>
        SuperCoins Partner
      </span>
    );
  }

  // Default: Flipkart Assured style badge
  return (
    <span
      className={`boost-badge-assured ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: '#eef2ff',
        color: '#2874f0',
        border: '1px solid #bfdbfe',
        fontSize: '11px',
        fontWeight: 800,
        fontStyle: 'italic',
        padding: '2px 8px',
        borderRadius: '4px',
      }}
    >
      <span>Boost</span>
      <span
        style={{
          backgroundColor: '#2874f0',
          color: '#ffffff',
          padding: '1px 4px',
          borderRadius: '2px',
          fontSize: '10px',
          fontStyle: 'normal',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        Assured
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    </span>
  );
};
