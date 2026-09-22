import { UIComponentItem } from '../../types';

export const feedbackData: UIComponentItem[] = [
  {
    id: 'Loader',
    name: 'Loader',
    category: 'feedback',
    description: 'Animated SVG circular spinner for asynchronous loading and background task indication.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add loader',
    codeSnippet: `import { Loader } from '@boostengine/ui';

export function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Loader size="md" color="#2563eb" />
      <span>Loading catalog data...</span>
    </div>
  );
}`,
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", description: 'Spinner dimension' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Stroke color' }
    ]
  },
  {
    id: 'Spinner',
    name: 'Spinner',
    category: 'feedback',
    description: 'Ultra-lightweight inline SVG spinner with customizable stroke width and rotation dynamics.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add spinner',
    codeSnippet: `import { Spinner } from '@boostengine/ui';

export function InlineSpinner() {
  return <Spinner size={20} color="#0f172a" />;
}`,
    props: [
      { name: 'size', type: 'number | string', default: "'md'", description: 'Pixel size' }
    ]
  },
  {
    id: 'ProgressBar',
    name: 'ProgressBar',
    category: 'feedback',
    description: 'Progress meter with percentage label, smooth width transitions, and multi-color status modes.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add progress-bar',
    codeSnippet: `import { ProgressBar } from '@boostengine/ui';

export function UploadProgress() {
  return <ProgressBar value={72} label="Uploading photos..." showPercent />;
}`,
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Progress percentage (0 to 100)' },
      { name: 'showPercent', type: 'boolean', default: 'true', description: 'Renders right-aligned numeric percentage' }
    ]
  },
  {
    id: 'Skeleton',
    name: 'Skeleton',
    category: 'feedback',
    description: 'Shimmering placeholder bones for content loading cards, avatars, and text paragraphs.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add skeleton',
    codeSnippet: `import { Skeleton } from '@boostengine/ui';

export function CardSkeleton() {
  return (
    <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Skeleton height="160px" borderRadius="8px" />
      <Skeleton height="18px" width="80%" />
      <Skeleton height="14px" width="50%" />
    </div>
  );
}`,
    props: [
      { name: 'height', type: 'string', default: "'20px'", description: 'Placeholder height' },
      { name: 'width', type: 'string', default: "'100%'", description: 'Placeholder width' },
      { name: 'variant', type: "'text' | 'rectangular' | 'circular'", default: "'text'", description: 'Shape variant' }
    ]
  },
  {
    id: 'Toast',
    name: 'Toast',
    category: 'feedback',
    description: 'Transient alert notification banner and ToastProvider context supporting synchronous notifications and asynchronous promise lifecycle tracking (toast.promise).',
    badge: 'Core • v2.0.0',
    cliCommand: 'npx boost-ui add toast',
    codeSnippet: `import { useToast, Toast } from '@boostengine/ui';

export function CheckoutActions() {
  const { toast } = useToast();

  const handleAsyncOrder = () => {
    // Asynchronous Toast Lifecycle Tracking
    toast.promise(
      new Promise((resolve) => setTimeout(() => resolve({ orderId: '#9821' }), 2000)),
      {
        loading: 'Processing payment with Razorpay...',
        success: (data) => \`Payment confirmed for \${data.orderId}!\`,
        error: 'Payment transaction failed'
      }
    );
  };

  return (
    <button onClick={handleAsyncOrder}>
      Pay with toast.promise()
    </button>
  );
}`,
    props: [
      { name: 'type', type: "'success' | 'error' | 'warning' | 'info'", default: "'info'", description: 'Visual intent and SVG icon' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Bold headline' },
      { name: 'message', type: 'string', default: "''", description: 'Detailed notification body text' },
      { name: 'onClose', type: '() => void', default: 'undefined', description: 'Callback when toast is dismissed' },
      { name: 'promise', type: 'toast.promise(promise, msgs, opts)', default: 'function', description: 'Async helper for tracking loading, success, and error states' }
    ]
  },
  {
    id: 'Alert',
    name: 'Alert',
    category: 'feedback',
    description: 'In-page callout banner for high-visibility notices, warnings, and announcements.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add alert',
    codeSnippet: `import { Alert } from '@boostengine/ui';

export function MaintenanceBanner() {
  return (
    <Alert
      type="warning"
      title="Scheduled Server Maintenance"
      description="Our checkout system will undergo updates on Sunday at 02:00 AM IST."
    />
  );
}`,
    props: [
      { name: 'type', type: "'info' | 'success' | 'warning' | 'destructive'", default: "'info'", description: 'Color scheme and icon' },
      { name: 'title', type: 'string', default: "''", description: 'Alert heading' }
    ]
  },
  {
    id: 'Snackbar',
    name: 'Snackbar',
    category: 'feedback',
    description: 'Bottom floating snackbar with brief message and action button (e.g. Undo).',
    badge: 'Core',
    cliCommand: 'npx boost-ui add snackbar',
    codeSnippet: `import { Snackbar } from '@boostengine/ui';

export function CartSnackbar() {
  return (
    <Snackbar
      message="Item removed from your cart"
      actionLabel="Undo"
      onAction={() => console.log('Item restored')}
    />
  );
}`,
    props: [
      { name: 'message', type: 'string', default: "''", description: 'Main notification text' },
      { name: 'actionLabel', type: 'string', default: 'undefined', description: 'Action button text' }
    ]
  },
  {
    id: 'EmptyState',
    name: 'EmptyState',
    category: 'feedback',
    description: 'Descriptive zero-data screen with clean SVG illustration, informative title, and primary CTA.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add empty-state',
    codeSnippet: `import { EmptyState } from '@boostengine/ui';

export function EmptyCart() {
  return (
    <EmptyState
      title="Your cart is currently empty"
      description="Looks like you have not added anything yet. Explore our fresh arrivals."
      actionLabel="Start Shopping"
      onAction={() => window.location.href = '/shop'}
    />
  );
}`,
    props: [
      { name: 'title', type: 'string', default: "''", description: 'Primary headline' },
      { name: 'description', type: 'string', default: "''", description: 'Subtext message' },
      { name: 'actionLabel', type: 'string', default: 'undefined', description: 'CTA button text' }
    ]
  },
  {
    id: 'ErrorState',
    name: 'ErrorState',
    category: 'feedback',
    description: 'Dedicated error message screen with retry action for network failures or unhandled exceptions.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add error-state',
    codeSnippet: `import { ErrorState } from '@boostengine/ui';

export function FetchError() {
  return (
    <ErrorState
      title="Unable to load products"
      description="There was a temporary problem connecting to our catalog. Please try again."
      onRetry={() => console.log('Retrying request')}
    />
  );
}`,
    props: [
      { name: 'onRetry', type: '() => void', default: 'undefined', description: 'Retry button callback' }
    ]
  },
  {
    id: 'SuccessMessage',
    name: 'SuccessMessage',
    category: 'feedback',
    description: 'Success confirmation container with animated SVG checkmark and next steps guidance.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add success-message',
    codeSnippet: `import { SuccessMessage } from '@boostengine/ui';

export function OrderConfirmation() {
  return (
    <SuccessMessage
      title="Payment Received"
      description="Your order #84920 has been placed. You will receive an SMS when it ships."
    />
  );
}`,
    props: [
      { name: 'title', type: 'string', default: "''", description: 'Confirmation title' }
    ]
  }
];
