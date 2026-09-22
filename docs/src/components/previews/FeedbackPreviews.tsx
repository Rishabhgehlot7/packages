import React from 'react';
import {
  Loader,
  Spinner,
  ProgressBar,
  Skeleton,
  Toast,
  useToast,
  Button,
  Alert,
  Snackbar,
  EmptyState,
  ErrorState,
  SuccessMessage,
} from '@boostengine/ui';

interface FeedbackPreviewsProps {
  componentId: string;
  onShowToast: (msg: string) => void;
}

const ToastDemo: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px' }}>
      <Toast
        type="success"
        title="Cart Updated"
        message="Oversized Tee has been added to your shopping bag."
        onClose={() => onShowToast('Dismissed static toast')}
      />
      <div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          Asynchronous Lifecycle Notification
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            toast.promise(
              new Promise((resolve) => setTimeout(() => resolve({ orderId: '#9821' }), 1500)),
              {
                loading: 'Processing payment with Razorpay...',
                success: (data: any) => `Order ${data?.orderId || '#9821'} verified!`,
                error: 'Payment transaction failed'
              }
            );
          }}
        >
          Test toast.promise()
        </Button>
      </div>
    </div>
  );
};

export const FeedbackPreviews: React.FC<FeedbackPreviewsProps> = ({ componentId, onShowToast }) => {
  switch (componentId) {
    case 'Loader':
      return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Loader size="sm" />
          <Loader size="md" color="#2563eb" />
          <Loader size="lg" color="#16a34a" />
        </div>
      );

    case 'Spinner':
      return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Spinner size={18} color="#64748b" />
          <Spinner size={24} color="#0f172a" />
          <Spinner size={32} color="#2563eb" />
        </div>
      );

    case 'ProgressBar':
      return (
        <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ProgressBar value={45} label="Free shipping goal" showPercent />
          <ProgressBar value={85} label="Profile completion" showPercent color="#16a34a" />
        </div>
      );

    case 'Skeleton':
      return (
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Skeleton height="150px" borderRadius="8px" />
          <Skeleton height="18px" width="80%" />
          <Skeleton height="14px" width="50%" />
        </div>
      );

    case 'Toast':
      return <ToastDemo onShowToast={onShowToast} />;

    case 'Alert':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px' }}>
          <Alert
            type="info"
            title="Festive Shipping Note"
            description="Deliveries during festival week might take 1 extra business day."
          />
          <Alert
            type="warning"
            title="Low Inventory Warning"
            description="Only 3 units left in stock for selected colorway."
          />
        </div>
      );

    case 'Snackbar':
      return (
        <div style={{ position: 'relative', height: '80px' }}>
          <Snackbar
            message="Item moved to wishlist"
            actionLabel="Undo"
            onAction={() => onShowToast('Restored to cart')}
            style={{ position: 'static' }}
          />
        </div>
      );

    case 'EmptyState':
      return (
        <div style={{ background: 'var(--boost-surface, #ffffff)', borderRadius: '12px', border: '1px solid var(--boost-border, #e2e8f0)', overflow: 'hidden' }}>
          <EmptyState
            title="No Orders Found"
            description="You have not placed any orders yet. Start exploring our latest drops."
            actionLabel="Shop Now"
            onAction={() => onShowToast('Navigating to shop')}
          />
        </div>
      );

    case 'ErrorState':
      return (
        <div style={{ background: 'var(--boost-surface, #ffffff)', borderRadius: '12px', border: '1px solid var(--boost-border, #e2e8f0)', overflow: 'hidden' }}>
          <ErrorState
            title="Failed to Load Recommendations"
            description="A network timeout occurred while fetching recommended items."
            onRetry={() => onShowToast('Retrying request...')}
          />
        </div>
      );

    case 'SuccessMessage':
      return (
        <div style={{ background: 'var(--boost-surface, #ffffff)', borderRadius: '12px', border: '1px solid var(--boost-border, #e2e8f0)', overflow: 'hidden' }}>
          <SuccessMessage
            title="Order Confirmed"
            description="Thank you for your purchase! We have sent tracking details to your email."
          />
        </div>
      );

    default:
      return null;
  }
};
