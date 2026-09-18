import * as React from 'react';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
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
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
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
              style={{
                width: '42px',
                height: '48px',
                fontSize: '20px',
                fontWeight: 700,
                textAlign: 'center',
                color: '#0f172a',
                backgroundColor: disabled ? '#f8fafc' : '#ffffff',
                border: `1.5px solid ${error ? '#ef4444' : value[idx] ? '#2563eb' : '#cbd5e1'}`,
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.15s ease',
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
