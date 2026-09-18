import * as React from 'react';

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  label?: string;
  copiedLabel?: string;
  timeout?: number;
  variant?: 'outline' | 'ghost' | 'solid';
  size?: 'sm' | 'md';
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  timeout = 2000,
  variant = 'outline',
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const isSmall = size === 'sm';

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: copied ? '#16a34a' : 'var(--boost-primary, #2563eb)',
          color: '#ffffff',
          border: 'none',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: copied ? '#16a34a' : 'var(--boost-text, #0f172a)',
          border: 'none',
        };
      default: // outline
        return {
          backgroundColor: 'transparent',
          color: copied ? '#16a34a' : 'var(--boost-text, #0f172a)',
          border: `1px solid ${copied ? '#16a34a' : 'var(--boost-border, #cbd5e1)'}`,
        };
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`boost-copy-button ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSmall ? '4px 8px' : '6px 12px',
        borderRadius: 'var(--boost-radius, 6px)',
        fontSize: isSmall ? '12px' : '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {copied ? (
        <svg
          width={isSmall ? '14' : '16'}
          height={isSmall ? '14' : '16'}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width={isSmall ? '14' : '16'}
          height={isSmall ? '14' : '16'}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
};


CopyButton.displayName = 'CopyButton';
