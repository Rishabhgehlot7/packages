import * as React from 'react';

export interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
  quote?: string;
  authorName?: string;
  author?: string;
  authorRole?: string;
  role?: string;
  authorCompany?: string;
  company?: string;
  authorAvatar?: string;
  avatar?: string;
  rating?: number;
  verified?: boolean;
  companyLogo?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TestimonialCard: React.FC<TestimonialProps> = ({
  quote = '',
  authorName,
  author,
  authorRole,
  role,
  authorCompany,
  company,
  authorAvatar,
  avatar,
  rating = 5,
  verified = true,
  companyLogo,
  className = '',
  style,
  ...props
}) => {
  const finalAuthor = authorName || author || (props as any).author || 'Verified Buyer';
  const finalRole = authorRole || role || (props as any).role;
  const finalCompany = authorCompany || company || (props as any).company;
  const finalAvatar = authorAvatar || avatar || (props as any).avatar;

  return (
    <div
      className={`boost-testimonial-card ${className}`}
      style={{
        padding: '24px',
        borderRadius: 'var(--boost-radius, 16px)',
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        ...style,
      }}
      {...props}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-testimonial-card,
          .dark .boost-testimonial-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5) !important;
          }
        `}
      </style>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          {rating > 0 && (
            <div style={{ display: 'flex', gap: '3px', color: '#f59e0b' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={i < rating ? '#f59e0b' : 'none'}
                  stroke="#f59e0b"
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          )}
          {companyLogo && <div>{companyLogo}</div>}
        </div>

        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: 'var(--boost-text, #0f172a)',
            fontStyle: 'italic',
            margin: '0 0 24px 0',
          }}
        >
          "{quote}"
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {authorAvatar ? (
          <img
            src={authorAvatar}
            alt={finalAuthor}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid var(--boost-border, #e2e8f0)',
            }}
          />
        ) : (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: 'var(--boost-primary, #2563eb)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
            }}
          >
            {finalAuthor.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--boost-text, #0f172a)',
              }}
            >
              {finalAuthor}
            </span>
            {verified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563eb">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
          </div>
          {(finalRole || finalCompany) && (
            <span
              style={{
                fontSize: '12px',
                color: 'var(--boost-text-muted, #64748b)',
              }}
            >
              {finalRole}
              {finalRole && finalCompany ? ' at ' : ''}
              {finalCompany}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export interface TestimonialGridProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonials?: TestimonialProps[];
  columns?: 2 | 3;
  className?: string;
  style?: React.CSSProperties;
}

export const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  testimonials = [],
  columns = 3,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`boost-testimonial-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {testimonials.map((item, idx) => (
        <TestimonialCard key={idx} {...item} />
      ))}
    </div>
  );
};

TestimonialCard.displayName = 'TestimonialCard';
TestimonialGrid.displayName = 'TestimonialGrid';
