import * as React from 'react';

export interface BankOffer {
  id: string;
  type: 'instant' | 'emi' | 'cashback' | 'partner';
  title: string;
  description: string;
  code?: string;
  termsUrl?: string;
}

export interface BankOffersAccordionProps {
  offers?: BankOffer[];
  className?: string;
}

const DEFAULT_OFFERS: BankOffer[] = [
  {
    id: 'hdfc-instant',
    type: 'instant',
    title: 'Bank Offer: 10% Instant Discount',
    description: 'Up to ₹1,500 on HDFC Bank Credit & Debit Card EMI transactions on min purchase ₹5,000.',
    code: 'HDFC10',
  },
  {
    id: 'sbi-instant',
    type: 'instant',
    title: 'Bank Offer: Flat ₹1,250 Off',
    description: 'On SBI Credit Card Non-EMI transactions on orders above ₹10,000.',
    code: 'SBISPECIAL',
  },
  {
    id: 'no-cost-emi',
    type: 'emi',
    title: 'No Cost EMI Available',
    description: 'Avail No Cost EMI on select cards for orders above ₹3,000. Interest savings upfront.',
  },
  {
    id: 'supercoins-offer',
    type: 'cashback',
    title: 'SuperCoins / Pay Cashback',
    description: 'Get extra 5% cashback or 4 SuperCoins per ₹100 for Gold & SuperStar members.',
  },
];

export const BankOffersAccordion: React.FC<BankOffersAccordionProps> = ({
  offers = DEFAULT_OFFERS,
  className = '',
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const displayedOffers = expanded ? offers : offers.slice(0, 2);

  return (
    <div
      className={`boost-bank-offers ${className}`}
      style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
          Available Offers & Discounts
        </span>
        <span
          style={{
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '4px',
            marginLeft: 'auto',
          }}
        >
          {offers.length} Offers
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {displayedOffers.map((offer) => (
          <div
            key={offer.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #edf2f7',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: '#2563eb',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                {offer.title}
              </span>
              {offer.code && (
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px dashed #cbd5e1',
                    marginLeft: 'auto',
                  }}
                >
                  {offer.code}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: '11px',
                color: '#64748b',
                margin: '0 0 0 12px',
                lineHeight: 1.4,
              }}
            >
              {offer.description}
            </p>
          </div>
        ))}
      </div>

      {offers.length > 2 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 0',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {expanded ? 'Show Less Offers' : `View ${offers.length - 2} More Offers`}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};
