import React, { useState } from 'react';
import {
  Modal,
  Drawer,
  BottomSheet,
  Popover,
  ConfirmationDialog,
  Portal,
  Button,
  Checkbox,
} from '@boostengine/ui';

interface PreviewProps {
  onShowToast: (msg: string) => void;
}

export const ModalPreview: React.FC<PreviewProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Sample Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Notification Preferences">
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, margin: '0 0 16px' }}>
          Manage where and how often you receive updates about shipments and exclusive drops.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => setIsOpen(false)}>Save Settings</Button>
        </div>
      </Modal>
    </div>
  );
};

export const DrawerPreview: React.FC<PreviewProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Slide Drawer</Button>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Filter by Attributes" position="right">
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Brand Filter</span>
          <Checkbox label="Nike" />
          <Checkbox label="Adidas" />
          <Checkbox label="Puma" />
        </div>
      </Drawer>
    </div>
  );
};

export const BottomSheetPreview: React.FC<PreviewProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Bottom Sheet</Button>
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Size Variant">
        <div style={{ padding: '16px', display: 'flex', gap: '10px' }}>
          <Button variant="outline">Size S</Button>
          <Button variant="primary">Size M</Button>
          <Button variant="outline">Size L</Button>
          <Button variant="outline">Size XL</Button>
        </div>
      </BottomSheet>
    </div>
  );
};

export const PopoverPreview: React.FC<PreviewProps> = () => (
  <div>
    <Popover
      trigger={<Button variant="outline">View Warranty Details</Button>}
      content={
        <div style={{ padding: '4px', width: '240px', fontSize: '13px', color: 'var(--boost-text, #f8fafc)' }}>
          <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--boost-text, #f8fafc)' }}>1 Year Manufacturer Warranty</strong>
          <p style={{ margin: 0, color: 'var(--boost-text-muted, #94a3b8)', lineHeight: 1.5 }}>Covers any mechanical or internal defects with instant doorstep replacement.</p>
        </div>
      }
    />
  </div>
);

export const ConfirmationDialogPreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>Cancel Order</Button>
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          setIsOpen(false);
          onShowToast('Order cancelled successfully.');
        }}
        title="Cancel Order #9281?"
        message="Are you sure you want to cancel this order? Refund will be initiated to source account within 48 hours."
        confirmText="Confirm Cancellation"
        confirmVariant="destructive"
      />
    </div>
  );
};

export const PortalPreview: React.FC<PreviewProps> = () => {
  const [showPortal, setShowPortal] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Button onClick={() => setShowPortal(!showPortal)}>
        {showPortal ? 'Unmount Portal Content' : 'Mount Portal Content'}
      </Button>
      {showPortal && (
        <Portal>
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            fontSize: '13px',
            border: '1px solid #334155'
          }}>
            Rendered outside standard DOM hierarchy via React Portal
          </div>
        </Portal>
      )}
    </div>
  );
};

export const OverlaysPreviews: React.FC<{ componentId: string; onShowToast: (msg: string) => void }> = ({
  componentId,
  onShowToast,
}) => {
  switch (componentId) {
    case 'Modal': return <ModalPreview onShowToast={onShowToast} />;
    case 'Drawer': return <DrawerPreview onShowToast={onShowToast} />;
    case 'BottomSheet': return <BottomSheetPreview onShowToast={onShowToast} />;
    case 'Popover': return <PopoverPreview onShowToast={onShowToast} />;
    case 'ConfirmationDialog': return <ConfirmationDialogPreview onShowToast={onShowToast} />;
    case 'Portal': return <PortalPreview onShowToast={onShowToast} />;
    default: return null;
  }
};
