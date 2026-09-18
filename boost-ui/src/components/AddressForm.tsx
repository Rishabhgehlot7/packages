import React, { useState } from 'react';

export interface AddressData {
  fullName: string;
  phone: string;
  pincode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  addressType: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface AddressFormProps {
  onSubmit?: (data: AddressData) => void;
  initialData?: Partial<AddressData>;
  loading?: boolean;
  onCancel?: () => void;
  title?: string;
  style?: React.CSSProperties;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData,
  loading = false,
  onCancel,
  title = 'Shipping Address',
  style,
}) => {
  const [formData, setFormData] = useState<AddressData>({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    pincode: initialData?.pincode || '',
    houseNumber: initialData?.houseNumber || '',
    street: initialData?.street || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    addressType: initialData?.addressType || 'home',
    isDefault: initialData?.isDefault ?? true,
  });

  const handleChange = (field: keyof AddressData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.pincode || !formData.street || !formData.city || !formData.state) {
      return;
    }
    onSubmit?.(formData);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '9px 12px',
    fontSize: '13px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '4px',
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        ...style,
      }}
    >
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>{title}</h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="10-digit mobile number"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Pincode *</label>
            <input
              type="text"
              required
              maxLength={6}
              value={formData.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              placeholder="e.g. 110001"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Flat / House No. / Building *</label>
            <input
              type="text"
              required
              value={formData.houseNumber}
              onChange={(e) => handleChange('houseNumber', e.target.value)}
              placeholder="e.g. Flat 402, Lotus Tower"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Area / Street / Sector *</label>
          <input
            type="text"
            required
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="e.g. MG Road, Near Central Park"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>City / Town *</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. New Delhi"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>State *</label>
            <input
              type="text"
              required
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="e.g. Delhi"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Address Type</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            {(['home', 'work', 'other'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('addressType', type)}
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  borderRadius: '6px',
                  border: `1px solid ${formData.addressType === type ? '#0f172a' : '#cbd5e1'}`,
                  backgroundColor: formData.addressType === type ? '#0f172a' : '#ffffff',
                  color: formData.addressType === type ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <input
            type="checkbox"
            id="default-address-checkbox"
            checked={formData.isDefault}
            onChange={(e) => handleChange('isDefault', e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="default-address-checkbox" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
            Make this my default shipping address
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '11px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading && (
              <svg
                style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
            <span>Save & Deliver Here</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '11px 18px',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};


AddressForm.displayName = 'AddressForm';
