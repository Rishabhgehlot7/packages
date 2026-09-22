import React, { useState } from 'react';
import {
  Input,
  Select,
  Textarea,
  Switch,
  Checkbox,
  FileDropzone,
  ThemeToggle,
  ConfirmationDialog,
  Badge,
  Button,
} from '@boostengine/ui';
import { Settings, Shield, Bell, Palette, AlertTriangle, Save } from 'lucide-react';

interface SettingsExampleProps {
  onShowToast: (msg: string) => void;
}

export const SettingsExample: React.FC<SettingsExampleProps> = ({ onShowToast }) => {
  const [storeName, setStoreName] = useState('UrbanLoop Apparel Co.');
  const [supportEmail, setSupportEmail] = useState('support@urbanloop.in');
  const [gstin, setGstin] = useState('29ABCDE1234F1Z5');
  const [stateCode, setStateCode] = useState('KA');
  const [storeBio, setStoreBio] = useState('Premium heavyweight apparel and streetwear engineered for modern youth.');
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoSettle, setAutoSettle] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleSaveSettings = () => {
    onShowToast('Store configuration saved successfully!');
  };

  return (
    <div style={{ backgroundColor: 'var(--boost-bg, #090d16)', color: 'var(--boost-text, #f8fafc)', minHeight: '100vh', padding: '24px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>Store Profile & Settings</h1>
              <Badge variant="success">PRODUCTION READY</Badge>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>
              Configure business details, GSTIN compliance, theme preferences, and fulfillment webhooks.
            </p>
          </div>

          <Button variant="primary" onClick={handleSaveSettings}>
            <Save size={15} style={{ marginRight: '6px' }} />
            <span>Save Changes</span>
          </Button>
        </div>

        {/* Form Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Section 1: Business Profile */}
          <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Settings size={18} color="#6366f1" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Store & Legal Identity</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <Input
                label="Store Trade Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
              <Input
                label="Customer Support Email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
              <Input
                label="GSTIN Identification Number"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                helperText="Used for automated B2B & B2C tax invoice generation"
              />
              <Select
                label="Registered State of Origin"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                options={[
                  { label: 'Karnataka (KA - 29)', value: 'KA' },
                  { label: 'Maharashtra (MH - 27)', value: 'MH' },
                  { label: 'Delhi (DL - 07)', value: 'DL' },
                  { label: 'Gujarat (GJ - 24)', value: 'GJ' }
                ]}
              />
            </div>

            <Textarea
              label="Store Tagline / Bio"
              value={storeBio}
              onChange={(e) => setStoreBio(e.target.value)}
              rows={3}
            />
          </div>

          {/* Section 2: KYC Documents & Brand Assets */}
          <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Shield size={18} color="#10b981" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>GST Certificate & Brand Assets</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)', margin: '0 0 16px' }}>
              Upload your GST Registration Certificate or Vector Brand Logo for invoice stamping.
            </p>
            <FileDropzone
              accept=".pdf,.png,.jpg,.jpeg"
              maxSizeMB={10}
              onFilesSelected={(files: File[]) => onShowToast(`Uploaded ${files.length} document(s)!`)}
            />
          </div>

          {/* Section 3: Appearance & Theme Mode */}
          <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Palette size={18} color="#f59e0b" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Storefront Design Mode</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>Default Visual Theme</span>
                <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #94a3b8)' }}>Choose how components adapt to user devices</span>
              </div>
              <ThemeToggle variant="segmented" />
            </div>
          </div>

          {/* Section 4: Notifications & Webhooks */}
          <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Bell size={18} color="#8b5cf6" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Notification Channels</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>WhatsApp Order Updates</span>
                  <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #94a3b8)' }}>Send AWB and delivery alerts directly via WhatsApp</span>
                </div>
                <Switch checked={whatsappNotifications} onChange={setWhatsappNotifications} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>Low Inventory Email Alerts</span>
                  <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #94a3b8)' }}>Notify store manager when SKU count drops below threshold</span>
                </div>
                <Switch checked={emailAlerts} onChange={setEmailAlerts} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>Daily Settlement Auto-Sync</span>
                  <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #94a3b8)' }}>Reconcile Razorpay and PhonePe payouts at midnight</span>
                </div>
                <Switch checked={autoSettle} onChange={setAutoSettle} />
              </div>
            </div>
          </div>

          {/* Section 5: Danger Zone */}
          <div style={{ border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', padding: '24px', background: 'rgba(239, 68, 68, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ef4444' }}>
              <AlertTriangle size={18} />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Danger Zone</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)', margin: '0 0 16px' }}>
              Permanently delete this merchant workspace, revoke all API credentials, and disconnect payment gateways.
            </p>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
              Deactivate Storefront
            </Button>
          </div>
        </div>

        {/* Delete Store Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            setIsDeleteOpen(false);
            onShowToast('Action cancelled: Demo workspace is protected.');
          }}
          title="Deactivate Storefront?"
          message="Are you sure you want to shut down this store? All active customer carts, webhooks, and analytics will be permanently erased."
          confirmText="Yes, Deactivate"
          confirmVariant="destructive"
        />
      </div>
    </div>
  );
};
