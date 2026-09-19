import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  variant?: 'elevated' | 'outlined' | 'glass';
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, variant = 'elevated', className = '', style, children, ...props }, ref) => {
    const isGlass = variant === 'glass';
    const isOutlined = variant === 'outlined';

    return (
      <div
        ref={ref}
        className={`boost-card ${hoverable ? 'boost-card-hoverable' : ''} ${className}`}
        style={{
          backgroundColor: isGlass
            ? 'var(--boost-glass-bg, rgba(255, 255, 255, 0.8))'
            : 'var(--boost-surface, #ffffff)',
          backdropFilter: isGlass ? 'blur(12px)' : undefined,
          WebkitBackdropFilter: isGlass ? 'blur(12px)' : undefined,
          border: `1px solid ${isGlass ? 'var(--boost-glass-border, rgba(226, 232, 240, 0.8))' : 'var(--boost-border, #e2e8f0)'}`,
          borderRadius: 'var(--boost-radius, 16px)',
          boxShadow: isOutlined
            ? 'none'
            : 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
          overflow: 'hidden',
          transition: hoverable ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          fontFamily: 'inherit',
          width: '100%',
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      >
        <style>{`
          :root[data-theme="dark"] .boost-card {
            background-color: #1e293b !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-card-header {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-card-title {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-card-description {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-card-content {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-card-footer {
            background-color: #141e2e !important;
            border-top-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-card-hoverable:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.6) !important;
          }
        `}</style>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', style, children, ...props }) => (
  <div
    style={{
      padding: 'clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 24px)',
      borderBottom: '1px solid var(--boost-border, #f1f5f9)',
      boxSizing: 'border-box',
      ...style,
    }}
    className={`boost-card-header ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', style, children, ...props }) => (
  <h3
    style={{
      margin: 0,
      fontSize: 'clamp(16px, 1.8vw, 19px)',
      fontWeight: 700,
      color: 'var(--boost-text, #0f172a)',
      letterSpacing: '-0.015em',
      ...style,
    }}
    className={`boost-card-title ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({ className = '', style, children, ...props }) => (
  <p
    style={{
      margin: '4px 0 0 0',
      fontSize: '13px',
      color: 'var(--boost-text-muted, #64748b)',
      lineHeight: 1.55,
      ...style,
    }}
    className={`boost-card-description ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<CardContentProps> = ({ className = '', style, children, ...props }) => (
  <div
    style={{
      padding: 'clamp(14px, 2.5vw, 24px) clamp(16px, 3vw, 24px)',
      boxSizing: 'border-box',
      color: 'var(--boost-text, #0f172a)',
      ...style,
    }}
    className={`boost-card-content ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', style, children, ...props }) => (
  <div
    style={{
      padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
      borderTop: '1px solid var(--boost-border, #f1f5f9)',
      backgroundColor: 'var(--boost-surface-secondary, #f8fafc)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '10px',
      boxSizing: 'border-box',
      ...style,
    }}
    className={`boost-card-footer ${className}`}
    {...props}
  >
    {children}
  </div>
);
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
