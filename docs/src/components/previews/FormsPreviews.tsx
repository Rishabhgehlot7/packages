import React, { useState } from 'react';
import {
  Input,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
  RadioGroup,
  Switch,
  DatePicker,
  TimePicker,
  FileUpload,
  SearchInput,
  FormField,
  OTPInput,
} from '@boostengine/ui';

interface FormsPreviewsProps {
  componentId: string;
  onShowToast: (msg: string) => void;
}

export const FormsPreviews: React.FC<FormsPreviewsProps> = ({ componentId, onShowToast }) => {
  const [sampleText, setSampleText] = useState('');
  const [sampleSelect, setSampleSelect] = useState('IN');
  const [sampleMulti, setSampleMulti] = useState(['electronics', 'fashion']);
  const [sampleCheckbox, setSampleCheckbox] = useState(true);
  const [sampleRadio, setSampleRadio] = useState('card');
  const [sampleSwitch, setSampleSwitch] = useState(true);
  const [sampleDate, setSampleDate] = useState('2026-10-01');
  const [sampleTime, setSampleTime] = useState('14:30');
  const [sampleOTP, setSampleOTP] = useState('');

  switch (componentId) {
    case 'Input':
      return (
        <div style={{ maxWidth: '360px' }}>
          <Input
            label="Email Address"
            placeholder="you@company.com"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            helperText="We will send order confirmation to this address."
          />
        </div>
      );

    case 'Textarea':
      return (
        <div style={{ maxWidth: '400px' }}>
          <Textarea
            label="Delivery Instructions"
            placeholder="E.g. Please leave package at the security desk..."
            rows={3}
            maxLength={200}
            showCount
          />
        </div>
      );

    case 'Select':
      return (
        <div style={{ maxWidth: '320px' }}>
          <Select
            label="Shipping Country"
            value={sampleSelect}
            onChange={(e) => setSampleSelect(e.target.value)}
            options={[
              { label: 'India', value: 'IN' },
              { label: 'United States', value: 'US' },
              { label: 'United Kingdom', value: 'GB' },
              { label: 'Germany', value: 'DE' }
            ]}
          />
        </div>
      );

    case 'MultiSelect':
      return (
        <div style={{ maxWidth: '400px' }}>
          <MultiSelect
            label="Select Interests"
            options={[
              { label: 'Electronics', value: 'electronics' },
              { label: 'Fashion & Apparel', value: 'fashion' },
              { label: 'Home & Kitchen', value: 'home' },
              { label: 'Books & Media', value: 'books' }
            ]}
            value={sampleMulti}
            onChange={setSampleMulti}
          />
        </div>
      );

    case 'Checkbox':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Checkbox
            checked={sampleCheckbox}
            onChange={(e) => setSampleCheckbox(e.target.checked)}
            label="Opt-in for order tracking updates"
            description="Receive SMS and WhatsApp alerts at every fulfillment checkpoint."
          />
        </div>
      );

    case 'Radio':
      return (
        <div style={{ maxWidth: '320px' }}>
          <RadioGroup
            name="payment"
            value={sampleRadio}
            onChange={(val) => setSampleRadio(String(val))}
            options={[
              { label: 'Credit or Debit Card', value: 'card' },
              { label: 'UPI / NetBanking', value: 'upi' },
              { label: 'Cash on Delivery (COD)', value: 'cod' }
            ]}
          />
        </div>
      );

    case 'Switch':
      return (
        <div style={{ maxWidth: '360px' }}>
          <Switch
            checked={sampleSwitch}
            onChange={setSampleSwitch}
            label="Express Delivery Mode"
            description="Prioritize next-day flight routes."
          />
        </div>
      );

    case 'DatePicker':
      return (
        <div style={{ maxWidth: '300px' }}>
          <DatePicker
            label="Select Delivery Date"
            value={sampleDate}
            onChange={setSampleDate}
          />
        </div>
      );

    case 'TimePicker':
      return (
        <div style={{ maxWidth: '260px' }}>
          <TimePicker
            label="Preferred Slot"
            value={sampleTime}
            onChange={setSampleTime}
          />
        </div>
      );

    case 'FileUpload':
      return (
        <div style={{ maxWidth: '420px' }}>
          <FileUpload
            label="Upload Return Item Images"
            maxSizeMB={5}
            accept=".png,.jpg,.jpeg"
            onFilesSelected={(files) => onShowToast(`Selected ${files.length} file(s)`)}
          />
        </div>
      );

    case 'SearchInput':
      return (
        <div style={{ maxWidth: '380px' }}>
          <SearchInput
            placeholder="Search products, brands and categories..."
            onSearch={(q) => onShowToast(`Searching for "${q}"`)}
          />
        </div>
      );

    case 'FormField':
      return (
        <div style={{ maxWidth: '360px' }}>
          <FormField label="Full Name" required helperText="As printed on government ID">
            <input
              type="text"
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid var(--boost-border, #cbd5e1)',
                backgroundColor: 'var(--boost-surface, #ffffff)',
                color: 'var(--boost-text, #0f172a)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </FormField>
        </div>
      );

    case 'OTPInput':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)', fontWeight: 500 }}>Enter 6-digit verification code:</span>
          <OTPInput
            length={6}
            value={sampleOTP}
            onChange={setSampleOTP}
            onComplete={(val) => onShowToast(`OTP entered: ${val}`)}
          />
        </div>
      );

    default:
      return null;
  }
};
