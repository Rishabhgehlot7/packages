import React, { useState } from 'react';


/**
 * AddressData — Shape of address form data.
 */
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


/**
 * AddressFormProps — Properties for the address input form.
 */
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

  const [errors, setErrors] = useState<Partial<Record<keyof AddressData, string>>>({});

  const handleChange = (field: keyof AddressData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const errs: Partial<Record<keyof AddressData, string>> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter a valid name';
    }

    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid phone number';
    }

    const cleanPin = formData.pincode.trim();
    if (!cleanPin) {
      errs.pincode = 'Postal / ZIP code is required';
    } else if (!/^[\w\d\s-]{3,10}$/i.test(cleanPin)) {
      errs.pincode = 'Please enter a valid postal / ZIP code';
    }

    if (!formData.houseNumber.trim()) {
      errs.houseNumber = 'House / Flat number is required';
    }

    if (!formData.street.trim()) {
      errs.street = 'Street or area details are required';
    }

    if (!formData.city.trim()) {
      errs.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errs.state = 'State is required';
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit?.(formData);
  };

  const getInputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 14px',
    fontSize: '13px',
    border: `1px solid ${hasError ? '#ef4444' : 'var(--boost-border, #cbd5e1)'}`,
    borderRadius: 'var(--boost-radius, 10px)',
    backgroundColor: 'var(--boost-bg, #ffffff)',
    color: 'var(--boost-text, #0f172a)',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--boost-text, #334155)',
    marginBottom: '6px',
  };

  const renderError = (msg?: string) => {
    if (!msg) return null;
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {msg}
      </span>
    );
  };

  return (
    <div
      className="boost-address-form"
      style={{
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        borderRadius: 'var(--boost-radius, 16px)',
        padding: 'clamp(16px, 3vw, 24px)',
        fontFamily: 'inherit',
        boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
        boxSizing: 'border-box',
        width: '100%',
        ...style,
      }}
    >
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--boost-text, #0f172a)', margin: '0 0 20px' }}>{title}</h3>

      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              style={getInputStyle(!!errors.fullName)}
            />
            {renderError(errors.fullName)}
          </div>

          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone number (e.g. +1 555-0199)"
              style={getInputStyle(!!errors.phone)}
            />
            {renderError(errors.phone)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Postal / ZIP Code *</label>
            <input
              type="text"
              maxLength={10}
              value={formData.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              placeholder="e.g. 90210 or 110001"
              style={getInputStyle(!!errors.pincode)}
            />
            {renderError(errors.pincode)}
          </div>

          <div style={{ gridColumn: 'span 1' }}>
            <label style={labelStyle}>Apt / Suite / House No. *</label>
            <input
              type="text"
              value={formData.houseNumber}
              onChange={(e) => handleChange('houseNumber', e.target.value)}
              placeholder="e.g. Apt 4B or Suite 200"
              style={getInputStyle(!!errors.houseNumber)}
            />
            {renderError(errors.houseNumber)}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Street Address *</label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="e.g. 123 Main Street or Broadway"
            style={getInputStyle(!!errors.street)}
          />
          {renderError(errors.street)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
          <div>
            <label style={labelStyle}>City / Town *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. New York or London"
              style={getInputStyle(!!errors.city)}
            />
            {renderError(errors.city)}
          </div>

          <div>
            <label style={labelStyle}>State / Province / Region *</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="e.g. California or Ontario"
              style={getInputStyle(!!errors.state)}
            />
            {renderError(errors.state)}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Address Type</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
            {(['home', 'work', 'other'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('addressType', type)}
                style={{
                  padding: '7px 16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  borderRadius: 'var(--boost-radius, 8px)',
                  border: `1px solid ${formData.addressType === type ? 'var(--boost-primary, #2563eb)' : 'var(--boost-border, #cbd5e1)'}`,
                  backgroundColor: formData.addressType === type ? 'var(--boost-primary, #2563eb)' : 'var(--boost-surface, #ffffff)',
                  color: formData.addressType === type ? '#ffffff' : 'var(--boost-text-muted, #475569)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
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
          <label htmlFor="default-address-checkbox" style={{ fontSize: '13px', color: 'var(--boost-text-muted, #475569)', cursor: 'pointer' }}>
            Make this my default shipping address
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: '1 1 200px',
              padding: '13px',
              backgroundColor: 'var(--boost-primary, #2563eb)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: 'var(--boost-radius, 12px)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--boost-shadow-glow, 0 4px 14px rgba(37, 99, 235, 0.35))',
              transition: 'all 0.15s ease',
            }}
          >
            {loading && (
              <svg
                style={{ animation: 'boost-spin 1s linear infinite', width: '16px', height: '16px' }}
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
                padding: '13px 20px',
                backgroundColor: 'transparent',
                color: 'var(--boost-text-muted, #475569)',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: 'var(--boost-radius, 12px)',
                border: '1px solid var(--boost-border, #cbd5e1)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
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
