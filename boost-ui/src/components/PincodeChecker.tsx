import * as React from 'react';


/**
 * PincodeCheckResult — Result of a pincode availability check.
 */
export interface PincodeCheckResult {
  isServiceable: boolean;
  estimatedDeliveryDate?: string;
  isCodAvailable?: boolean;
  courier?: string;
}


/**
 * PincodeCheckerProps — Properties for the pincode availability checker.
 */
export interface PincodeCheckerProps {
  onCheck?: (pincode: string) => Promise<PincodeCheckResult> | PincodeCheckResult;
  defaultPincode?: string;
  label?: string;
  placeholder?: string;
  buttonText?: string;
  locale?: string;
  className?: string;
}

export const PincodeChecker: React.FC<PincodeCheckerProps> = ({
  onCheck,
  defaultPincode = '',
  label = 'Check Delivery & Serviceability',
  placeholder = 'Enter Postal / PIN Code',
  buttonText = 'Check',
  locale = 'en-US',
  className = '',
}) => {
  const [pincode, setPincode] = React.useState(defaultPincode);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<PincodeCheckResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const activeRequestIdRef = React.useRef(0);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleCheck = async () => {
    const clean = pincode.trim();
    if (!clean || clean.length < 3) {
      setError('Please enter a valid postal code');
      setResult(null);
      return;
    }

    const currentReqId = ++activeRequestIdRef.current;
    setError(null);
    setLoading(true);

    try {
      if (onCheck) {
        // Network resilience: 10-second timeout guard against hung connections
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Postal code check timed out. Please try again.')), 10000)
        );
        const res = await Promise.race([Promise.resolve(onCheck(clean)), timeoutPromise]);

        // Guard against stale responses or unmounted component
        if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
          setResult(res);
        }
      } else {
        // Default realistic estimator
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
          setResult({
            isServiceable: true,
            estimatedDeliveryDate: deliveryDate.toLocaleDateString(locale, options),
            isCodAvailable: true,
            courier: 'Express Courier',
          });
        }
      }
    } catch (err: any) {
      if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
        setError(err.message || 'Failed to verify postal code');
      }
    } finally {
      if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ margin: '14px 0', fontFamily: 'inherit' }} className={`boost-pincode-checker ${className}`}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--boost-text-primary, inherit)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity={0.8}>
          <rect x="1" y="3" width="15" height="13" rx="1" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span>{label}</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', maxWidth: '340px' }}>
        <input
          type="text"
          maxLength={10}
          placeholder={placeholder}
          value={pincode}
          onChange={(e: any) => setPincode(e.target.value)}
          onKeyDown={(e: any) => e.key === 'Enter' && handleCheck()}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--boost-border, #334155)',
            backgroundColor: 'transparent',
            color: 'var(--boost-text-primary, inherit)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        <button
          onClick={handleCheck}
          disabled={loading || !pincode.trim()}
          style={{
            backgroundColor: 'var(--boost-primary, #3b82f6)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading || !pincode.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !pincode.trim() ? 0.6 : 1,
            transition: 'opacity 0.2s, background-color 0.2s',
          }}
        >
          {loading ? 'Checking...' : buttonText}
        </button>
      </div>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '12px' }}>
          {result.isServiceable ? (
            <div style={{ background: 'rgba(34, 197, 94, 0.08)', padding: '12px 16px', borderRadius: '8px', border: '1px dashed rgba(34, 197, 94, 0.3)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <strong>Delivery by {result.estimatedDeliveryDate}</strong>
              </div>
              {result.isCodAvailable && (
                <div style={{ color: 'var(--boost-text-muted, #94a3b8)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '2px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <span>Cash on Delivery (COD) is available</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px 16px', borderRadius: '8px', border: '1px dashed rgba(239, 68, 68, 0.3)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Postal code currently not serviceable for delivery</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


PincodeChecker.displayName = 'PincodeChecker';
