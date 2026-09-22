import React, { useState } from 'react';
import {
  KPIWidget,
  CommandPalette,
  ActivityFeed,
  NotificationCenter,
  CopyButton,
  FileDropzone,
  Button,
  VStack,
} from '@boostengine/ui';

interface PreviewProps {
  onShowToast: (msg: string) => void;
}

export const KPIWidgetPreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', width: '100%' }}>
    <KPIWidget
      title="Gross Merchandise Value (GMV)"
      value="₹28,45,200"
      change="+31.4%"
      changePeriod="vs last month"
      subtitle="Compared to last month"
    />
    <KPIWidget
      title="Return-to-Origin (RTO)"
      value="3.8%"
      change="-2.1%"
      changePeriod="vs industry avg"
      subtitle="Best in class D2C rate"
    />
    <KPIWidget
      title="Active Carts"
      value="1,492"
      change="+18.2%"
      changePeriod="live shoppers"
      subtitle="Real-time traffic"
    />
  </div>
);

export const CommandPalettePreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <VStack gap="12px" align="flex-start">
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
      >
        Open Command Palette (Press Ctrl+K or Click)
      </Button>
      <CommandPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placeholder="Search actions, orders, or pages..."
        items={[
          { id: '1', label: 'Open Analytics Dashboard', group: 'Navigation', onSelect: () => onShowToast('Navigating to Analytics') },
          { id: '2', label: 'Create New Discount Coupon', group: 'Actions', onSelect: () => onShowToast('Opening Coupon Modal') },
          { id: '3', label: 'Export GST B2B Report (Excel)', group: 'Reports', onSelect: () => onShowToast('Exporting Report...') },
          { id: '4', label: 'Configure Razorpay Webhook', group: 'Settings', onSelect: () => onShowToast('Opening Settings') }
        ]}
      />
    </VStack>
  );
};

export const ActivityFeedPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '480px' }}>
    <ActivityFeed
      items={[
        {
          id: '1',
          user: { name: 'Customer #1892' },
          action: 'paid via PhonePe UPI',
          timestamp: 'Just now',
          statusBadge: { label: 'SUCCESS', variant: 'success' }
        },
        {
          id: '2',
          user: { name: 'Shiprocket Logistics' },
          action: 'assigned AWB tracking #827361',
          timestamp: '14 minutes ago',
          statusBadge: { label: 'DISPATCHED', variant: 'info' }
        },
        {
          id: '3',
          user: { name: 'Fraud Shield' },
          action: 'detected high RTO risk on COD order',
          timestamp: '1 hour ago',
          statusBadge: { label: 'FLAGGED', variant: 'warning' }
        }
      ]}
    />
  </div>
);

export const NotificationCenterPreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  const [notificationsList, setNotificationsList] = useState([
    { id: '1', title: 'Payment Received', description: '₹2,499 via PhonePe UPI', timestamp: 'Just now', read: false },
    { id: '2', title: 'New Customer', description: 'Ananya S. registered', timestamp: '12m ago', read: false },
    { id: '3', title: 'Low Stock Alert', description: 'Oversized Tee (M) has 2 units left', timestamp: '1h ago', read: true }
  ]);

  return (
    <div style={{ width: '100%', maxWidth: '440px', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        background: 'var(--bg-card, #ffffff)',
        borderRadius: '14px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 15px -4px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
            Merchant Dashboard
          </span>
        </div>
        <NotificationCenter
          notifications={notificationsList}
          onMarkAllAsRead={() => {
            setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
            onShowToast('Marked all as read');
          }}
          onClearAll={() => {
            setNotificationsList([]);
            onShowToast('All cleared');
          }}
          onItemClick={(item) => onShowToast(`Clicked: ${item.title}`)}
        />
      </div>
      <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
        Click the bell icon to open the interactive notifications popover
      </p>
    </div>
  );
};

export const CopyButtonPreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
    <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text)' }}>
      npm i @boostengine/ui
    </span>
    <CopyButton text="npm i @boostengine/ui" />
  </div>
);

export const FileDropzonePreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '520px' }}>
    <FileDropzone
      accept=".png,.jpg,.jpeg,.csv,.xlsx"
      maxSizeMB={5}
      onFilesSelected={(files: File[]) => onShowToast(`Uploaded ${files.length} file(s)!`)}
    />
  </div>
);

export const SaaSPreviews: React.FC<{ componentId: string; onShowToast: (msg: string) => void }> = ({
  componentId,
  onShowToast,
}) => {
  switch (componentId) {
    case 'KPIWidget': return <KPIWidgetPreview onShowToast={onShowToast} />;
    case 'CommandPalette': return <CommandPalettePreview onShowToast={onShowToast} />;
    case 'ActivityFeed': return <ActivityFeedPreview onShowToast={onShowToast} />;
    case 'NotificationCenter': return <NotificationCenterPreview onShowToast={onShowToast} />;
    case 'CopyButton': return <CopyButtonPreview onShowToast={onShowToast} />;
    case 'FileDropzone': return <FileDropzonePreview onShowToast={onShowToast} />;
    default: return null;
  }
};
