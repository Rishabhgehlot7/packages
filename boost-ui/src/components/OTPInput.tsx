import * as React from 'react';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
  (
    {
      length = 6,
      value,
      onChange,
      onComplete,
      disabled = false,
      error,
      className = '',
      style,
    },
    ref
  ) => {
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

    React.useImperativeHandle(ref, () => inputsRef.current[0] as HTMLInputElement);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === 'Backspace') {
        if (!value[idx] && idx > 0) {
          inputsRef.current[idx - 1]?.focus();
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      const char = e.target.value.slice(-1).replace(/\D/g, '');
      const chars = value.split('');
      chars[idx] = char;
      const newOtp = chars.join('').slice(0, length);
      onChange(newOtp);

      if (char && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }

      if (newOtp.length === length && onComplete) {
        onComplete(newOtp);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (pasted) {
        onChange(pasted);
        if (pasted.length === length && onComplete) {
          onComplete(pasted);
        }
        inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
      }
    };

    return (
      <div
        className={`boost-otp-wrapper ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'inherit',
          maxWidth: '100%',
          ...style,
        }}
      >
        <style>
          {`
            .boost-otp-box {
              width: 44px;
              height: 52px;
              font-size: 22px;
              font-weight: 700;
              text-align: center;
              border-radius: 12px;
              outline: none;
              transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
              background-color: var(--boost-surface, #ffffff);
              border: 1.5px solid var(--boost-border, #cbd5e1);
              color: var(--boost-text-primary, #0f172a);
            }
            :root[data-theme="dark"] .boost-otp-box,
            .dark .boost-otp-box {
              background-color: rgba(255, 255, 255, 0.08) !important;
              border-color: rgba(255, 255, 255, 0.2) !important;
              color: #ffffff !important;
            }
            .boost-otp-box:focus {
              border-color: var(--boost-primary, #6366f1) !important;
              box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3) !important;
              background-color: rgba(99, 102, 241, 0.08) !important;
            }
            @media (max-width: 420px) {
              .boost-otp-box {
                width: 38px;
                height: 46px;
                font-size: 18px;
                border-radius: 8px;
              }
            }
          `}
        </style>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length }).map((_, idx) => (
            <input
              key={idx}
              ref={(el) => { inputsRef.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[idx] || ''}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              disabled={disabled}
              className="boost-otp-box"
              style={{
                borderColor: error ? '#ef4444' : value[idx] ? 'var(--boost-primary, #6366f1)' : undefined,
                boxShadow: value[idx] ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : undefined,
              }}
            />
          ))}
        </div>

        {error && (
          <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

OTPInput.displayName = 'OTPInput';
