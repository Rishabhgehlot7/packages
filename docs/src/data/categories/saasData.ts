import { UIComponentItem } from '../../types';

export const saasData: UIComponentItem[] = [
  {
    id: 'KPIWidget',
    name: 'KPIWidget',
    category: 'saas',
    description: 'Analytics metric display widget featuring percentage change indicators, positive/negative trends, and tooltips.',
    badge: 'SaaS',
    cliCommand: 'npx boost-ui add kpi-widget',
    codeSnippet: `import { KPIWidget } from '@boostengine/ui';

export function DashboardMetrics() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <KPIWidget
        title="Total Revenue (GMV)"
        value="₹14,82,900"
        change="+24.8%"
        trend="up"
        info="Compared to last 30 days"
      />
      <KPIWidget
        title="Return to Origin (RTO)"
        value="4.2%"
        change="-1.8%"
        trend="down"
        info="Industry average is 18%"
      />
      <KPIWidget
        title="Active Shoppers"
        value="3,842"
        change="+12.4%"
        trend="up"
      />
    </div>
  );
}`,
    props: [
      { name: 'title', type: 'string', default: "''", description: 'KPI metric label' },
      { name: 'value', type: 'string | number', default: "''", description: 'Primary metric value' },
      { name: 'change', type: 'string', default: 'undefined', description: 'Percentage change string (e.g. +14.2%)' },
      { name: 'trend', type: "'up' | 'down' | 'neutral'", default: "'neutral'", description: 'Trend direction controlling green/red colors' },
      { name: 'info', type: 'string', default: 'undefined', description: 'Footer context or comparison notes' }
    ]
  },
  {
    id: 'CommandPalette',
    name: 'CommandPalette',
    category: 'saas',
    description: 'Spotlight/Raycast-style keyboard command palette with instant search, shortcut navigation, and action grouping.',
    badge: 'SaaS',
    cliCommand: 'npx boost-ui add command-palette',
    codeSnippet: `import { CommandPalette } from '@boostengine/ui';
import { useState } from 'react';

export function QuickLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <CommandPalette
      isOpen={open}
      onClose={() => setOpen(false)}
      placeholder="Type a command or search documentation..."
      items={[
        { id: '1', label: 'Go to Orders', group: 'Navigation', onSelect: () => console.log('Orders') },
        { id: '2', label: 'Create Discount Code', group: 'Actions', onSelect: () => console.log('Discount') },
        { id: '3', label: 'Configure Razorpay API', group: 'Settings', onSelect: () => console.log('Razorpay') }
      ]}
    />
  );
}`,
    props: [
      { name: 'isOpen', type: 'boolean', default: 'false', description: 'Controls visibility of command dialog' },
      { name: 'onClose', type: '() => void', default: 'undefined', description: 'Close request handler' },
      { name: 'items', type: 'CommandItem[]', default: '[]', description: 'Array of searchable actions and items' },
      { name: 'placeholder', type: 'string', default: "'Type a command...'", description: 'Search input placeholder text' }
    ]
  },
  {
    id: 'ActivityFeed',
    name: 'ActivityFeed',
    category: 'saas',
    description: 'Chronological timeline of system events, team actions, audit logs, and customer updates.',
    badge: 'SaaS',
    cliCommand: 'npx boost-ui add activity-feed',
    codeSnippet: `import { ActivityFeed } from '@boostengine/ui';

export function Logs() {
  return (
    <ActivityFeed
      items={[
        { id: '1', title: 'Order #9821 paid via UPI', time: '2 mins ago', type: 'success' },
        { id: '2', title: 'Shipment dispatched via Delhivery Express', time: '18 mins ago', type: 'info' },
        { id: '3', title: 'High RTO risk flagged for PIN 110001', time: '1 hour ago', type: 'warning' }
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'ActivityItem[]', default: '[]', description: 'List of activity event items' }
    ]
  },
  {
    id: 'NotificationCenter',
    name: 'NotificationCenter',
    category: 'saas',
    description: 'In-app notification drawer/popover with unread counter, filter tabs, and mark-all-read triggers.',
    badge: 'SaaS',
    cliCommand: 'npx boost-ui add notification-center',
    codeSnippet: `import { NotificationCenter } from '@boostengine/ui';

export function Notifications() {
  return (
    <NotificationCenter
      notifications={[
        { id: '1', title: 'New Customer Signup', message: 'Rohit K. created an account.', time: '5m ago', read: false },
        { id: '2', title: 'Daily Settlement Ready', message: '₹42,800 transferred to HDFC Bank.', time: '1h ago', read: true }
      ]}
      onMarkAsRead={(id) => console.log('Mark read:', id)}
      onClearAll={() => console.log('Clear all')}
    />
  );
}`,
    props: [
      { name: 'notifications', type: 'NotificationItem[]', default: '[]', description: 'List of notifications' },
      { name: 'onMarkAsRead', type: '(id: string) => void', default: 'undefined', description: 'Single read callback' },
      { name: 'onClearAll', type: '() => void', default: 'undefined', description: 'Clear all notifications callback' }
    ]
  },
  {
    id: 'CopyButton',
    name: 'CopyButton',
    category: 'saas',
    description: 'One-click clipboard copy button with smooth icon transition and success confirmation tooltip.',
    badge: 'Utility',
    cliCommand: 'npx boost-ui add copy-button',
    codeSnippet: `import { CopyButton } from '@boostengine/ui';

export function ApiKeyBox() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <code>sk_live_98273648123</code>
      <CopyButton text="sk_live_98273648123" />
    </div>
  );
}`,
    props: [
      { name: 'text', type: 'string', default: "''", description: 'String value to copy to system clipboard' },
      { name: 'label', type: 'string', default: "'Copy'", description: 'Button text label' },
      { name: 'copiedLabel', type: 'string', default: "'Copied!'", description: 'Text shown during success state' }
    ]
  },
  {
    id: 'FileDropzone',
    name: 'FileDropzone',
    category: 'forms',
    description: 'Drag and drop file upload target with validation, file type restrictions, and max file size indicators.',
    badge: 'Upload',
    cliCommand: 'npx boost-ui add file-dropzone',
    codeSnippet: `import { FileDropzone } from '@boostengine/ui';

export function CatalogUpload() {
  return (
    <FileDropzone
      accept={['image/png', 'image/jpeg', '.csv']}
      maxSize={5 * 1024 * 1024}
      onDrop={(files) => console.log('Uploaded files:', files)}
    />
  );
}`,
    props: [
      { name: 'onDrop', type: '(files: File[]) => void', default: 'undefined', description: 'Callback with accepted files' },
      { name: 'accept', type: 'string[]', default: 'undefined', description: 'Accepted MIME types or file extensions' },
      { name: 'maxSize', type: 'number', default: 'undefined', description: 'Maximum file size in bytes' },
      { name: 'multiple', type: 'boolean', default: 'true', description: 'Allow multiple file selection' }
    ]
  }
];
