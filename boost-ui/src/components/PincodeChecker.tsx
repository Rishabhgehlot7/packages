import * as React from 'react';

export interface PincodeCheckResult {
  isServiceable: boolean;
  estimatedDeliveryDate?: string;
  isCodAvailable?: boolean;
  courier?: string;
}

export interface PincodeCheckerProps {
  onCheck?: (pincode: string) => Promise<PincodeCheckResult> | PincodeCheckResult;
  defaultPincode?: string;
  className?: string;
}

export const PincodeChecker: React.FC<PincodeCheckerProps> = ({
  onCheck,
  defaultPincode = '',
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
    if (!/^\d{6}$/.test(clean)) {
      setError('Please enter a valid 6-digit Indian pincode');
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
          setTimeout(() => reject(new Error('Pincode check timed out. Please try again.')), 10000)
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
            estimatedDeliveryDate: deliveryDate.toLocaleDateString('en-IN', options),
            isCodAvailable: true,
            courier: 'Express Courier',
          });
        }
      }
    } catch (err: any) {
      if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
        setError(err.message || 'Failed to verify pincode');
      }
    } finally {
      if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ margin: '14px 0', fontFamily: 'inherit' }} className={`boost-pincode-checker ${className}`}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
        🚚 Check Delivery & COD Availability:
      </div>

      <div style={{ display: 'flex', gap: '8px', maxWidth: '320px' }}>
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e: any) => setPincode(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e: any) => e.key === 'Enter' && handleCheck()}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#166534', background: '#f0fdf4', padding: '8px 12px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
          {result.isServiceable ? (
            <div>
              <div>✅ <strong>Delivery by {result.estimatedDeliveryDate}</strong></div>
              {result.isCodAvailable && <div style={{ color: '#854d0e', marginTop: '2px' }}>💵 Cash on Delivery (COD) is available</div>}
            </div>
          ) : (
            <div style={{ color: '#dc2626' }}>❌ Pincode currently not serviceable for delivery</div>
          )}
        </div>
      )}
    </div>
  );
};
