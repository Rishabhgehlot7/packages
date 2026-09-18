import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className = '', style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`boost-card ${className}`}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          transition: hoverable ? 'transform 0.2s ease, box-shadow 0.2s ease' : 'none',
          fontFamily: 'inherit',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', style, children, ...props }) => (
  <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', ...style }} className={className} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', style, children, ...props }) => (
  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0f172a', ...style }} className={className} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({ className = '', style, children, ...props }) => (
  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5, ...style }} className={className} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<CardContentProps> = ({ className = '', style, children, ...props }) => (
  <div style={{ padding: '20px 24px', ...style }} className={className} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', style, children, ...props }) => (
  <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', ...style }} className={className} {...props}>
    {children}
  </div>
);
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
