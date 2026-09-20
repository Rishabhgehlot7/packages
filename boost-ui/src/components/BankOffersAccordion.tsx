import * as React from 'react';

export interface BankOffer {
  id: string;
  type?: 'instant' | 'emi' | 'cashback' | 'partner' | string;
  title: string;
  description?: string;
  terms?: string;
  code?: string;
  termsUrl?: string;
}

export interface BankOffersAccordionProps {
  offers?: BankOffer[];
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_OFFERS: BankOffer[] = [
  {
    id: 'card-instant',
    type: 'instant',
    title: '10% Instant Discount on Premium Credit Cards',
    description: 'Up to $50 on select credit cards on minimum purchase of $150.',
    code: 'CARD10',
  },
  {
    id: 'special-reward',
    type: 'instant',
    title: 'Flat $25 Off on Partner Cards',
    description: 'Applicable on online checkout for orders above $200.',
    code: 'PARTNER25',
  },
  {
    id: 'zero-interest-split',
    type: 'emi',
    title: 'Pay in 4 Interest-Free Installments',
    description: 'Split your purchase into 4 flexible payments on orders over $50.',
  },
  {
    id: 'cashback-reward',
    type: 'cashback',
    title: '5% Instant Cashback on Digital Wallets',
    description: 'Instant cashback credited directly to your payment account.',
    code: 'WALLET5',
  },
];

export const BankOffersAccordion: React.FC<BankOffersAccordionProps> = ({
  offers = DEFAULT_OFFERS,
  className = '',
  style,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const safeOffers = Array.isArray(offers) ? offers : DEFAULT_OFFERS;
  const displayedOffers = expanded ? safeOffers : safeOffers.slice(0, 2);

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div
      className={`boost-bank-offers ${className}`}
      style={{
        borderRadius: '18px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <style>
        {`
          .boost-bank-offers {
            background-color: var(--boost-surface, #ffffff);
            border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02);
            transition: all 0.3s ease;
          }

          :root[data-theme="dark"] .boost-bank-offers,
          .dark .boost-bank-offers {
            background-color: var(--boost-surface, #111827) !important;
            border-color: var(--boost-border, rgba(255, 255, 255, 0.1)) !important;
            box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.5) !important;
          }

          .boost-bank-header-title {
            font-size: 15px;
            font-weight: 800;
            color: var(--boost-text-primary, #0f172a);
            letter-spacing: -0.01em;
          }

          :root[data-theme="dark"] .boost-bank-header-title,
          .dark .boost-bank-header-title {
            color: #f8fafc !important;
          }

          .boost-bank-count-pill {
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.15) 100%);
            color: var(--boost-primary, #4f46e5);
            font-size: 11px;
            font-weight: 700;
            padding: 4px 9px;
            border-radius: 9999px;
            border: 1px solid rgba(99, 102, 241, 0.25);
            white-space: nowrap;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }

          :root[data-theme="dark"] .boost-bank-count-pill,
          .dark .boost-bank-count-pill {
            background: rgba(99, 102, 241, 0.2);
            color: #a5b4fc;
            border-color: rgba(165, 180, 252, 0.3);
          }

          .boost-offer-row {
            background-color: var(--boost-bg-muted, #f8fafc);
            border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.05));
            border-radius: 12px;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .boost-offer-row:hover {
            transform: translateX(2px);
            border-color: rgba(99, 102, 241, 0.3);
          }

          :root[data-theme="dark"] .boost-offer-row,
          .dark .boost-offer-row {
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
          }

          .boost-offer-row-title {
            font-size: 13px;
            font-weight: 700;
            color: var(--boost-text-primary, #0f172a);
            line-height: 1.3;
          }

          :root[data-theme="dark"] .boost-offer-row-title,
          .dark .boost-offer-row-title {
            color: #f1f5f9 !important;
          }

          .boost-offer-row-desc {
            font-size: 12px;
            color: var(--boost-text-secondary, #64748b);
            margin: 0;
            line-height: 1.45;
          }

          :root[data-theme="dark"] .boost-offer-row-desc,
          .dark .boost-offer-row-desc {
            color: #94a3b8 !important;
          }

          .boost-copy-chip {
            font-size: 11px;
            font-family: monospace;
            font-weight: 700;
            background: var(--boost-surface, #ffffff);
            color: var(--boost-primary, #4f46e5);
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px dashed rgba(99, 102, 241, 0.4);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s ease;
            flex-shrink: 0;
          }

          .boost-copy-chip:hover {
            background: rgba(99, 102, 241, 0.1);
          }

          :root[data-theme="dark"] .boost-copy-chip,
          .dark .boost-copy-chip {
            background: rgba(99, 102, 241, 0.15);
            color: #c7d2fe;
            border-color: rgba(165, 180, 252, 0.4);
          }

          .boost-expand-btn {
            background: none;
            border: none;
            color: var(--boost-primary, #4f46e5);
            font-size: 13px;
            font-weight: 700;
            padding: 6px 0 2px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: color 0.2s ease;
          }

          .boost-expand-btn:hover {
            color: #3730a3;
          }

          :root[data-theme="dark"] .boost-expand-btn,
          .dark .boost-expand-btn {
            color: #818cf8 !important;
          }
          :root[data-theme="dark"] .boost-expand-btn:hover,
          .dark .boost-expand-btn:hover {
            color: #a5b4fc !important;
          }
          @media (max-width: 480px) {
            .boost-bank-offers {
              padding: 14px 16px !important;
              gap: 12px !important;
            }
            .boost-bank-header-title {
              font-size: 13.5px !important;
            }
          }
        `}
      </style>

      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <span className="boost-bank-header-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
            Bank Offers & Discounts
          </span>
        </div>
        <span className="boost-bank-count-pill">
          {offers.length} Offers
        </span>
      </div>

      {/* Offers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {displayedOffers.map((offer) => {
          const offerDesc = offer.description || offer.terms || '';
          return (
            <div key={offer.id} className="boost-offer-row">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 180px', minWidth: 0 }}>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--boost-primary, #6366f1)',
                      flexShrink: 0,
                    }}
                  />
                  <span className="boost-offer-row-title" style={{ wordBreak: 'break-word' }}>
                    {offer.title}
                  </span>
                </div>

                {offer.code && (
                  <button
                    type="button"
                    onClick={(e) => handleCopy(offer.code!, e)}
                    className="boost-copy-chip"
                    title="Click to copy coupon code"
                  >
                    {copiedCode === offer.code ? (
                      <span style={{ color: 'var(--boost-success, #10b981)', fontWeight: 800 }}>✓ COPIED</span>
                    ) : (
                      <>
                        <span>{offer.code}</span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>

              {offerDesc && (
                <p className="boost-offer-row-desc" style={{ paddingLeft: '15px' }}>
                  {offerDesc}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* View More / Less Toggle */}
      {offers.length > 2 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="boost-expand-btn"
        >
          <span>{expanded ? 'Show Less Offers' : `View All ${offers.length} Offers`}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};

BankOffersAccordion.displayName = 'BankOffersAccordion';
