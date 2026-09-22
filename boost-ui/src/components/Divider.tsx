import * as React from 'react';


/**
 * DividerProps — Properties for the horizontal/vertical divider line.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: React.ReactNode;
  labelPosition?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  labelPosition = 'center',
  className = '',
  style,
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`boost-divider boost-divider-vertical ${className}`}
        style={{
          display: 'inline-block',
          width: '1px',
          height: '100%',
          minHeight: '18px',
          backgroundColor: 'var(--boost-border, #e2e8f0)',
          margin: '0 8px',
          verticalAlign: 'middle',
          ...style,
        }}
        {...props}
      />
    );
  }

  if (!label) {
    return (
      <hr
        role="separator"
        aria-orientation="horizontal"
        className={`boost-divider boost-divider-horizontal ${className}`}
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: 'var(--boost-border, #e2e8f0)',
          border: 'none',
          margin: '16px 0',
          ...style,
        }}
        {...props}
      />
    );
  }

  const getFlexDistribution = () => {
    switch (labelPosition) {
      case 'left':
        return { before: '0.1', after: '1' };
      case 'right':
        return { before: '1', after: '0.1' };
      case 'center':
      default:
        return { before: '1', after: '1' };
    }
  };

  const distribution = getFlexDistribution();

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`boost-divider boost-divider-with-label ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        margin: '16px 0',
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          flex: distribution.before,
          height: '1px',
          backgroundColor: 'var(--boost-border, #e2e8f0)',
        }}
      />
      <span
        style={{
          padding: '0 12px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--boost-text-muted, #64748b)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: distribution.after,
          height: '1px',
          backgroundColor: 'var(--boost-border, #e2e8f0)',
        }}
      />
    </div>
  );
};

Divider.displayName = 'Divider';
