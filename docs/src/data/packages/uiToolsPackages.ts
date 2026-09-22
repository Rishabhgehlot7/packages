import { PackageDoc } from '../../types';

export const uiToolsPackages: PackageDoc[] = [
  {
    id: 'boost-ui',
    name: '@boostengine/ui',
    categoryId: 'ui-tools',
    version: '2.1.1',
    description: 'Universal, Zero-Config UI Component Suite for Next.js & React: 7 Multi-Theme Design Presets, 180+ battle-tested components across 13 multi-entry targets, Enterprise DataTable with sorting & CSV export, Asynchronous Toast Lifecycle, Design System Tokens JSON with Tailwind preset, zero-dependency SVG charts, and WAI-ARIA 1.2 accessibility.',
    badge: 'v2.1.1 • 180+ Components & 13 Multi-Entry Targets',
    npmInstall: 'npm i @boostengine/ui',
    bundleSize: 'Modular / Tree-shakable (sideEffects: false)',
    useCase: 'Eliminates external UI bloat with an all-in-one design system: 180+ production-ready components supporting 7 universal style presets (Minimal, Glassmorphism, Neumorphism, Neo-Brutalism, Dark First, Gradient Glow, Material You), Figma Design Tokens Studio sync, Tailwind integration, full SSR/Next.js safety, and zero external styling runtime.',
    features: [
      '13 Multi-Entry Targets (v2.1.1): Root + /hooks, /utils, /next, /vue, /svelte, /solid, /angular, /qwik, /web, /native, /vite, /tokens, /styles.css — import only what you ship',
      'Multi-Platform Framework Adapters: @boostengine/ui/next is a drop-in for the Next.js App Router with no hydration mismatch config, /vue /svelte /solid /angular /qwik ship native framework wrapper exports, /web serves the framework-agnostic ESM runtime, /native targets React Native',
      'Vite Plugin & Tokens Pipeline: @boostengine/ui/vite provides zero-config Tailwind preset + tokens.json injection, createTailwindPreset() & boostTokens for Figma Tokens Studio / Style Dictionary',
      'Universal Multi-Theme Presets Engine (v2.0.0): 7 built-in aesthetic presets (minimal, glassmorphism, neumorphism, neo-brutalism, dark-first, gradient-glow, material-you) with runtime switcher (PresetSwitcher) and per-component stylePreset prop',
      'Design Tokens & Tailwind Integration (v1.8.2): Exported tokens.json for Figma Tokens Studio & Style Dictionary, typed boostTokens object, and createTailwindPreset() helper for zero-config Tailwind utility mapping',
      'Enterprise DataTable (v1.8.2): Multi-row checkbox selection (selectable, onSelectionChange), column sorting (sortable), sticky headers, customizable maxHeight, 1-click CSV export (exportable), and client/server pagination',
      'Asynchronous Toast Lifecycle (v1.8.2): Full toast.promise<T>() support in ToastProvider transitioning smoothly through loading, success, and error states',
      'Strict Polymorphism: Typesafe as prop forwarding across layout primitives (Box as="section" | "a" | "button" | "ul" | "form" etc.) with full ref forwarding',
      'Tree-Shaking & SSR Resilience (v1.8.1): sideEffects: false compliance, standalone @boostengine/ui/styles.css stylesheet, safe zero-prop defaults across 21 components, and zero client hydration mismatch',
      'WAI-ARIA 1.2 Accessibility Engine (v1.8.0): useFocusTrap for modal/drawer focus trapping, useAnnounce for screen-reader live regions, full keyboard navigation (Tabs, Accordion, DropdownMenu with Escape restoration)',
      'Universal Locale & Currency: useCurrency hook, configurable currency ($ / ₹ / € / £) and locale across all eCommerce components (ProductCard, CartDrawer, Price, OrderSummary)',
      'Zero-Dependency SVG Charts: AreaChart, BarChart, DonutChart, Sparkline (SVG math based with interactive tooltips)',
      'Form State & Validation: useForm hook with validationSummary, getFieldError, setFieldValue, setFieldError, and isValid status',
      'Layout Primitives: Box, Flex, Stack, HStack, VStack, Grid, Section, AspectRatio, ScrollArea, Motion, Divider',
      'Marketing & Landing Blocks: HeroSection, FeatureGrid, PricingTable, TestimonialCard, TestimonialGrid, FAQSection, LogoCloud, CTASection',
      'SaaS & Enterprise: KPIWidget, CommandPalette, ActivityFeed, NotificationCenter, CopyButton, FileDropzone, StatsCard, DataTable',
      'Buttons & Actions: Button, IconButton, ButtonGroup, FloatingActionButton, LinkButton, CopyButton',
      'Forms & Inputs: Input, Textarea, Select, MultiSelect, Checkbox, Radio, Switch, DatePicker, TimePicker, FileUpload, SearchInput, FormField, OTPInput, FileDropzone',
      'Feedback & Status: Loader, Spinner, ProgressBar, Skeleton, Toast, ToastProvider, useToast, Alert, Snackbar, EmptyState, ErrorState, SuccessMessage',
      'Content & Display: Card, Image, Avatar, Badge, Tag, Tooltip, Chip, Divider, Accordion, Carousel',
      'Overlays & Dialogs: Modal, Dialog, Drawer, BottomSheet, Popover, ConfirmationDialog, CommandPalette, Portal',
      'Layout & Navigation: Header, Navbar, Sidebar, Footer, MobileBottomBar, MobileBottomNav, Breadcrumb, Container, PageWrapper, NavLink, DropdownMenu, MegaMenu, Pagination, Tabs, Stepper, BackButton',
      'Authentication: LoginForm, RegisterForm, ForgotPassword, ResetPassword',
      'E-Commerce & Store: Price, AddToCart, CouponInput, AddressForm, OrderSummary, CartDrawer, PincodeChecker, StickyAddToCart, ProductCard, ProductGallery, VariantSelector, QuantitySelector, StarRating, ReviewBreakdownBars, TrustBadges, OrderTimeline, AnnouncementBar, LightningDealsBar, FrequentlyBoughtTogether, BankOffersAccordion, AssuredBadge, DualMobileActionBar',
      'Utility Hooks: useBoostPreset, useTheme, useCurrency, useFocusTrap, useAnnounce, useForm, useMediaQuery, useClickOutside, useDebounce, useLocalStorage, useWindowSize, useScrollPosition, usePrevious, useCopyToClipboard, useToggle, useIntersectionObserver'
    ],
    apiMethods: [
      {
        name: 'BoostProvider',
        signature: '<BoostProvider defaultMode="dark | light | system" defaultStylePreset="minimal | glassmorphism | neumorphism | neo-brutalism | dark-first | gradient-glow | material-you" currency="$" locale="en-US" syncDocumentPreset>{children}</BoostProvider>',
        description: 'Root design system context provider managing 7 universal multi-theme style presets, dark/light modes, currency context, and CSS variable injection.',
        params: [
          { name: 'defaultStylePreset', type: 'UIStylePreset', description: 'Default design preset (minimal, glassmorphism, neumorphism, neo-brutalism, dark-first, gradient-glow, material-you)', required: false },
          { name: 'defaultMode', type: "'light' | 'dark' | 'system'", description: 'Initial color scheme mode', required: false },
          { name: 'currency', type: 'string', description: 'Universal currency symbol (e.g. $, ₹, €)', required: false },
          { name: 'locale', type: 'string', description: 'Locale string (e.g. en-US, en-IN)', required: false },
          { name: 'syncDocumentPreset', type: 'boolean', description: 'Syncs data-preset on <html> tag', required: false }
        ],
        returns: 'React JSX Element'
      },
      {
        name: 'PresetSwitcher',
        signature: '<PresetSwitcher mode="dropdown | pills" value={preset} onChange={(preset) => void} />',
        description: 'Interactive control widget allowing users or administrators to switch design presets live at runtime.',
        params: [
          { name: 'mode', type: "'dropdown' | 'pills'", description: 'Display mode — dropdown button or inline selectable pills', required: false },
          { name: 'value', type: 'UIStylePreset', description: 'Optional controlled preset override', required: false },
          { name: 'onChange', type: '(preset: UIStylePreset) => void', description: 'Callback fired when preset changes', required: false }
        ],
        returns: 'React JSX Element'
      },
      {
        name: 'DataTable',
        signature: '<DataTable columns={cols} data={rows} selectable sortable exportable stickyHeader maxHeight="480px" />',
        description: 'Enterprise data table with multi-row checkbox selection, column sorting, search filter, sticky headers, and 1-click CSV export.',
        params: [
          { name: 'columns', type: 'DataTableColumn<T>[]', description: 'Column headers, sortable flags, and custom cell formatters', required: true },
          { name: 'data', type: 'T[]', description: 'Array of data records', required: true },
          { name: 'selectable', type: 'boolean', description: 'Enables multi-row selection with checkboxes and select-all', required: false },
          { name: 'exportable', type: 'boolean', description: 'Displays built-in CSV export button', required: false },
          { name: 'sortable', type: 'boolean', description: 'Enables column header click-to-sort', required: false }
        ],
        returns: 'React JSX Element'
      },
      {
        name: 'toast.promise',
        signature: 'toast.promise<T>(promise, { loading: string, success: string | fn, error: string | fn }, options?)',
        description: 'Asynchronous notification lifecycle manager that transitions from loading spinner to success or error message.',
        params: [
          { name: 'promise', type: 'Promise<T>', description: 'Target async promise to observe', required: true },
          { name: 'messages', type: '{ loading, success, error }', description: 'Feedback messages or message factory functions', required: true }
        ],
        returns: 'Promise<T>'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root + 13 Subpath Targets',
        language: 'tsx',
        code: `// Root: full component library
import { Button, BoostProvider } from '@boostengine/ui';
import { useMediaQuery } from '@boostengine/ui/hooks';
import { formatCurrency } from '@boostengine/ui/utils';

// Framework adapters & tooling (also available)
import { NextLink } from '@boostengine/ui/next';    // Next.js App Router adapter
import { tokenCssVars } from '@boostengine/ui/tokens'; // Design tokens
import '@boostengine/ui/styles.css';                 // Prebuilt stylesheet

export function App() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  return (
    <BoostProvider defaultMode="dark" defaultStylePreset="glassmorphism">
      <Button>{formatCurrency(1499, 'INR')} · {isMobile ? 'Mobile' : 'Desktop'}</Button>
    </BoostProvider>
  );
}`
      },
      {
        title: 'Multi-Preset Provider & Preset Switcher Setup',
        language: 'tsx',
        code: `import { BoostProvider, ToastProvider, PresetSwitcher, Button, Card } from '@boostengine/ui';

export function App() {
  return (
    <BoostProvider defaultMode="dark" defaultStylePreset="glassmorphism" syncDocumentPreset>
      <ToastProvider position="bottom-right">
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
          <h2>My App</h2>
          {/* Live Switcher between 7 Presets */}
          <PresetSwitcher mode="dropdown" />
        </header>

        <main style={{ padding: '24px' }}>
          <Card style={{ padding: '20px' }}>
            <h3>Universal Multi-Theme Presets</h3>
            <p>Every component adapts automatically to the selected preset!</p>
            <Button variant="primary">Themed Button</Button>
          </Card>
        </main>
      </ToastProvider>
    </BoostProvider>
  );
}`
      },
      {
        title: 'Enterprise DataTable with Checkbox Selection & CSV Export',
        language: 'tsx',
        code: `import { DataTable, DataTableColumn } from '@boostengine/ui';
import { useState } from 'react';

interface OrderItem {
  id: string;
  customer: string;
  total: string;
  status: string;
}

const columns: DataTableColumn<OrderItem>[] = [
  { key: 'id', header: 'Order ID', sortable: true },
  { key: 'customer', header: 'Customer Name', sortable: true },
  { key: 'total', header: 'Order Value', sortable: true },
  { key: 'status', header: 'Fulfillment Status' }
];

const data: OrderItem[] = [
  { id: '#1001', customer: 'Rahul Sharma', total: '₹2,499', status: 'Shipped' },
  { id: '#1002', customer: 'Priya Patel', total: '₹1,299', status: 'Delivered' },
  { id: '#1003', customer: 'Amit Kumar', total: '₹4,999', status: 'Processing' }
];

export function OrdersGrid() {
  const [selected, setSelected] = useState<OrderItem[]>([]);

  return (
    <DataTable
      columns={columns}
      data={data}
      selectable
      onSelectionChange={setSelected}
      exportable
      exportFilename="orders-report.csv"
      searchable
      stickyHeader
      maxHeight="400px"
    />
  );
}`
      }
    ]
  }
];
