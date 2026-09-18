# @boostengine/ui

[![npm version](https://img.shields.io/npm/v/@boostengine/ui.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/ui)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/ui.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/ui)
[![license](https://img.shields.io/npm/l/@boostengine/ui.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React 18 & 19](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg?style=flat-square)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-13%20%7C%2014%20%7C%2015-black.svg?style=flat-square)](https://nextjs.org/)

> **Universal, industry-standard UI component kit for Next.js, React, and AI-driven development. Build high-converting eCommerce storefronts, modern B2B SaaS platforms, enterprise dashboards, and landing pages from A to Z with zero external CSS dependencies.**

---

## Key Highlights

- 🧩 **115 Production Components & Blocks**: From foundational layout primitives (`Box`, `Flex`, `Grid`, `Stack`, `Motion`) to conversion-tested D2C storefront widgets, SaaS dashboard blocks, and modals with `Portal`.
- 🎨 **1-Click Theming & Dark Mode**: Built-in `BoostProvider` with CSS variable design tokens, automatic system/light/dark mode switching, and static fallback CSS injection.
- ⚡ **Zero External CSS**: Pure zero-dependency styling and vector SVGs with no Tailwind or PostCSS configuration required.
- 🪝 **12 SSR-Safe Utility Hooks**: `useForm`, `useMediaQuery`, `useClickOutside`, `useDebounce`, `useLocalStorage`, `useCopyToClipboard`, `useToggle`, `useIntersectionObserver`, and more.
- 🔧 **18 Utility Functions**: `cn()`, `formatCurrency()`, `slugify()`, `getInitials()`, `isValidIndianPincode()`, `debounce()`, and more — zero extra packages.
- 🤖 **AI Coding Agent Native**: Comes with machine-readable `llms.txt` and `llms-full.txt` manifests tailored for Cursor, Claude, Windsurf, Copilot, and Gemini.
- 🚀 **Next.js App Router Ready**: Pre-bundled with `'use client'` directives for instantaneous SSR/SSG compatibility.

---

## Installation

```bash
# npm
npm install @boostengine/ui

# pnpm
pnpm add @boostengine/ui

# yarn
yarn add @boostengine/ui
```

### Or Use Shadcn-Style Component Scaffolding
Copy component source code directly into your `./components/boost-ui` folder:
```bash
npx @boostengine/ui add hero-section
npx @boostengine/ui add cart-drawer
npx @boostengine/ui add pricing-table
npx @boostengine/ui list
```

---

## 🎨 Theming & Dark Mode Setup

Wrap your application root (e.g. `layout.tsx` or `_app.tsx`) with `BoostProvider` and optional `ToastProvider`:

```tsx
import { BoostProvider, ToastProvider, useTheme, useToast } from '@boostengine/ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <BoostProvider defaultMode="system">
      <ToastProvider position="bottom-right">
        {children}
      </ToastProvider>
    </BoostProvider>
  );
}

// In any child component:
function MyComponent() {
  const { resolvedMode, toggleMode } = useTheme();
  const { toast } = useToast();

  return (
    <button
      onClick={() => {
        toggleMode();
        toast.success(`Switched to ${resolvedMode === 'dark' ? 'Light' : 'Dark'} mode!`);
      }}
    >
      Toggle Mode
    </button>
  );
}
```

---

## 📦 Complete Component Suite (115 Components)

### 0. Theming & Architecture
* `BoostProvider` - Root design system provider with CSS variable token injection
* `useTheme` - Context hook for dynamic dark/light mode toggling and token inspection
* `ToastProvider` & `useToast` - Lightweight imperative notification manager (`toast.success()`, `toast.error()`)

### 1. Layout Primitives (Lego Bricks)
* `Box` - Polymorphic wrapper (`as="div" | "section" | "article" | ...`) with shorthand spacing props
* `Flex` - Flexbox layout container with direction, justify, align, wrap, and gap
* `Stack`, `VStack`, `HStack` - Spaced stack layouts for clean vertical & horizontal spacing
* `Grid`, `GridItem` - CSS Grid container with column templates, row/col spans, and gaps
* `Section` - Standardized page section boundary with max-width and vertical rhythm
* `AspectRatio` - Aspect-ratio lock (`16/9`, `1/1`, `4/3`) for videos, banners, and product media
* `ScrollArea` - Minimalist custom scrollbar container for sidebars and panels
* `Container` - Max-width responsive container boundary
* `PageWrapper` - Standard app shell wrapper
* `Motion` - Zero-dependency entrance and scroll-triggered animations (`fade-in`, `slide-up`, `scale-in`)

### 2. Marketing & High-Converting Landing Blocks
* `HeroSection` - Headline, badge, description, dual action buttons, and background glow/media
* `FeatureGrid` - Multi-column feature highlights with icon containers and descriptions
* `PricingTable` - Tiered pricing cards with monthly/annual switch toggle, checkmarks, and "Popular" ribbon
* `TestimonialCard` & `TestimonialGrid` - Customer review cards with avatars, ratings, and verified badges
* `FAQSection` - Searchable, interactive accordion for frequently asked questions
* `LogoCloud` - Client/partner brand logo strip with grayscale hover transitions
* `CTASection` - High-contrast lead generation banner with integrated newsletter capture

### 3. SaaS & Enterprise Dashboard Blocks
* `KPIWidget` - Metric card with positive/negative trend percentages, sparkline slot, and subtitles
* `CommandPalette` - `Cmd+K` / `Ctrl+K` searchable modal for quick actions and shortcuts
* `ActivityFeed` - Chronological audit log with user avatars, actions, and status tags
* `NotificationCenter` - Bell icon with unread badge and dropdown notification drawer
* `CopyButton` - 1-click clipboard copy button with checkmark transition
* `FileDropzone` - Drag-and-drop file upload zone with file type validation and previews
* `StatsCard` - Compact KPI metric card with positive/negative trend badges
* `DataTable` - Advanced table with live search filtering, column sorting, and pagination
* `DateRangePicker` - Dual-calendar date range selector for analytical reports
* `ExportButton` - Dataset exporter for CSV, Excel, PDF, and JSON
* `Filter` & `Sort` - Dropdown filters and criteria sorters

### 4. Buttons & Actions
* `Button` - Multi-variant button (`primary`, `secondary`, `outline`, `ghost`, `destructive`, `link`) with loading spinner
* `IconButton` - Accessible icon button with square, rounded, or circular shapes
* `ButtonGroup` - Unified grouping for related action buttons
* `FloatingActionButton` - Fixed-position floating action button (FAB) for fast actions
* `LinkButton` - Semantic anchor link styled identically to buttons

### 5. Forms & Inputs
* `Input` - Text input with integrated labels, error states, and helper instructions
* `Textarea` - Multi-line input with auto-resize, character limit, and counter badge
* `Select` & `MultiSelect` - Accessible select dropdowns and multi-tag pickers
* `Checkbox` - Checkbox with SVG checkmark and indeterminate state
* `Radio` & `RadioGroup` - Radio option selectors for single-choice forms
* `Switch` - Smooth interactive toggle switch with accessible ARIA roles
* `DatePicker` & `TimePicker` - Clean calendar date picker and 24hr time selector
* `FileUpload` - Drag-and-drop file upload zone
* `SearchInput` - Search box with SVG search icon and quick clear button
* `FormField` - Standard layout container with required indicators and error displays
* `OTPInput` - Auto-advancing numeric verification code inputs

### 6. Feedback & Status
* `Toast`, `ToastProvider`, `useToast` - Imperative toast system with auto-dismiss
* `Loader` & `Spinner` - Circular animated spinners
* `ProgressBar` - Percentage completion bar with custom color states
* `Skeleton` - Shimmering placeholder bones for text, cards, and avatars
* `Alert` & `Snackbar` - Notification callouts and bottom action alerts
* `EmptyState` - Zero-data container with clean vector illustration and CTA
* `ErrorState` - Error screen with retry callback for failed API requests
* `SuccessMessage` - Order and payment confirmation container

### 7. Content & Display
* `Card` - Compound card system (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`)
* `Image` - Progressive image loader with fallback source and aspect ratio lock
* `Avatar` & `AvatarGroup` - User profile pictures and overlapping group avatars with +N counter
* `Badge` & `Tag` - Status pills and removable tags
* `Tooltip` - 4-way direction hover tooltip (top, bottom, left, right)
* `Chip` - Interactive selectable or deletable pill
* `Divider` - Horizontal or vertical separator with optional text label
* `Accordion` - Collapsible question-and-answer panels
* `Carousel` - Content and banner slider with auto-advance and dot indicators

### 8. Overlays & Dialogs
* `Modal` / `Dialog` - Accessible modal dialog with frosted backdrop and Escape key listener
* `Drawer` - Slide-out drawer anchored to left, right, top, or bottom edges
* `BottomSheet` - Mobile-first slide-up sheet with drag handle
* `Popover` - Contextual floating popover attached to trigger element
* `ConfirmationDialog` - Pre-styled prompt for destructive actions
* `Portal` - SSR-safe DOM portal for rendering overlays directly into document.body

### 9. Navigation & Menus
* `Header` & `Navbar` - Responsive navigation bar with search, cart counter, and wishlist
* `Sidebar` - Collapsible sidebar drawer with grouped links and badges
* `Footer` - Multi-column site footer with newsletter subscription form
* `MobileBottomBar` & `MobileBottomNav` - Smartphone bottom tab navigation bar
* `Breadcrumb` - Hierarchical path navigation with SVG separators
* `NavLink`, `DropdownMenu`, `MegaMenu` - Interactive flyouts and catalog menus
* `Pagination`, `Tabs`, `Stepper`, `BackButton` - Step workflows and page navigation

### 10. E-Commerce & D2C Storefront Suite
* `CartDrawer` - Slide-out cart drawer with dynamic Indian free shipping progress meter
* `StickyAddToCart` - Mobile sticky bottom buy bar that activates on scroll
* `PincodeChecker` - Indian 6-digit pincode serviceability and Cash on Delivery (COD) checker
* `ProductCard` - Conversion product card with ratings and quick add button
* `ProductGallery` - Image gallery with thumbnail strip and zoom capability
* `VariantSelector` - Size and color variant swatches
* `QuantitySelector` - Plus and minus quantity stepper
* `StarRating` & `ReviewBreakdownBars` - Rating stars and 5-star histogram breakdown
* `TrustBadges` - Verified badges (COD, 7-day returns, authentic)
* `OrderTimeline` - Post-purchase shipment tracking timeline
* `AnnouncementBar` - Top promotional banner for coupon codes
* `LightningDealsBar` - Countdown urgency bar with claimed progress
* `FrequentlyBoughtTogether` - Amazon-style product bundle upsell widget
* `BankOffersAccordion` - Flipkart-style instant bank discount accordion
* `Price`, `AddToCart`, `CouponInput`, `AddressForm`, `OrderSummary` - End-to-end checkout primitives

---

## 🤖 AI Coding Agents Integration

`@boostengine/ui` is designed to be the #1 choice for AI Coding Assistants (Cursor, Claude, Windsurf, Copilot, Gemini):

1. **Machine-Readable LLM Manifests**:
   - `llms.txt`: High-level prompt index for agent context ingestion.
   - `llms-full.txt`: Comprehensive copy-paste snippet guide for zero-hallucination code generation.
2. **Predictable Prop Naming**:
   - States: `isOpen`, `isLoading`, `disabled`
   - Actions: `onSelect`, `onClick`, `onChange`, `onSubmit`
   - Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`

---

## Quick Example: Modern SaaS Landing Page

```tsx
import {
  BoostProvider,
  Navbar,
  HeroSection,
  FeatureGrid,
  PricingTable,
  FAQSection,
  CTASection,
  Footer
} from '@boostengine/ui';

export default function SaaSPage() {
  return (
    <BoostProvider defaultMode="system">
      <Navbar brandName="CLOUDBOOST" />
      <HeroSection
        badge="🚀 AI Platform 2.0"
        title="Deploy Autonomous Microservices"
        description="Ship scalable architectures with automated scaling and zero config."
        primaryAction={{ label: 'Get Started Free' }}
        secondaryAction={{ label: 'View Documentation' }}
      />
      <FeatureGrid
        features={[
          { title: 'Global Edge Cache', description: 'Under 10ms latency worldwide.' },
          { title: 'Instant Rollbacks', description: 'Zero downtime disaster recovery.' },
          { title: 'Built-in Telemetry', description: 'Real-time traces and metrics.' }
        ]}
      />
      <PricingTable
        tiers={[
          { id: '1', name: 'Developer', priceMonthly: 0, features: ['10 Projects', 'Community Support'] },
          { id: '2', name: 'Scale', priceMonthly: 49, isPopular: true, features: ['Unlimited Projects', '24/7 SLA'] }
        ]}
      />
      <FAQSection
        items={[
          { question: 'How do I start?', answer: 'Simply run npm i @boostengine/ui and import components.' }
        ]}
      />
      <CTASection
        title="Start Building Today"
        description="Join thousands of developers shipping with Boost Engine."
        showNewsletter
      />
      <Footer brandName="CLOUDBOOST" />
    </BoostProvider>
  );
}
```

---

## 🪝 Utility Hooks (SSR-Safe)

All hooks are exported directly from `@boostengine/ui` — no separate package needed:

```tsx
import {
  useMediaQuery,          // Reactive CSS media query
  useClickOutside,        // Click-outside detection for dropdowns/modals
  useDebounce,            // Delay state updates (perfect for search inputs)
  useLocalStorage,        // Persistent state with JSON serialization
  useWindowSize,          // Reactive window dimensions
  useScrollPosition,      // Reactive scrollY/scrollX
  usePrevious,            // Track previous value of state/prop
  useCopyToClipboard,     // Clipboard write with auto-reset copied state
  useToggle,              // Simple boolean toggle
  useIntersectionObserver // Viewport visibility for scroll animations
} from '@boostengine/ui';

// Scroll-aware sticky navbar
const { scrollY } = useScrollPosition();
const isSticky = scrollY > 60;

// Debounced search
const debouncedQuery = useDebounce(searchQuery, 400);

// Persistent cart in localStorage
const [cart, setCart] = useLocalStorage('cart', []);

// Fade-in on scroll
const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
<div ref={sectionRef} style={{ opacity: isVisible ? 1 : 0 }} />
```

---

## 🔧 Utility Functions

```tsx
import {
  cn,                    // Class merging (like clsx, zero dependencies)
  formatCurrency,        // ₹1,499 or $49.99
  formatDate,            // '18 Sep 2026'
  formatRelativeTime,    // '2 minutes ago'
  slugify,               // 'my-product-name-2026'
  getInitials,           // 'AS' from 'Aarav Sharma'
  isValidEmail,          // Email format validation
  isValidIndianPincode,  // 6-digit Indian postal code validation
  isValidIndianMobile,   // 10-digit Indian mobile validation
  clamp, truncate, generateId, groupBy, deepMerge, debounce
} from '@boostengine/ui';

formatCurrency(1499)              // => '₹1,499'
formatCurrency(49.99, 'USD')      // => '$49.99'
getInitials('Aarav Sharma')       // => 'AS'
slugify('My Product (2026)')      // => 'my-product-2026'
isValidIndianPincode('110001')    // => true
cn('btn', isActive && 'active')   // => 'btn active'
```

---

## Quick Example: eCommerce Storefront

```tsx
import {
  BoostProvider, ToastProvider, Navbar, CartDrawer,
  HeroSection, ProductCard, Grid, MobileBottomNav, Footer
} from '@boostengine/ui';

export default function StorePage() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <BoostProvider defaultMode="light">
      <ToastProvider position="top-center">
        <Navbar brandName="BOOST STORE" cartCount={3} onCartClick={() => setCartOpen(true)} showSearch />
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} freeDeliveryThreshold={999} />
        <HeroSection badge="🔥 Sale Live" title="Up to 70% Off" primaryAction={{ label: 'Shop Now' }} />
        <Grid cols={4} gap={24} style={{ padding: '40px 24px' }}>
          {products.map(p => (
            <ProductCard key={p.id} {...p} onAddToCart={() => addToCart(p)} />
          ))}
        </Grid>
        <MobileBottomNav items={navItems} activeItemId="home" />
        <Footer brandName="BOOST STORE" />
      </ToastProvider>
    </BoostProvider>
  );
}
```

## Quick Example: Admin Dashboard

```tsx
import {
  BoostProvider, ToastProvider, Sidebar, Grid,
  KPIWidget, DataTable, ActivityFeed, HStack
} from '@boostengine/ui';

export default function AdminDashboard() {
  return (
    <BoostProvider defaultMode="dark">
      <ToastProvider position="top-right">
        <HStack align="flex-start" style={{ minHeight: '100vh' }}>
          <Sidebar groups={adminNavGroups} isOpen activeItemId="overview" />
          <main style={{ flex: 1, padding: '32px' }}>
            <Grid cols={4} gap={20}>
              <KPIWidget title="Revenue" value="₹14,82,900" change={18.4} changePeriod="vs last month" />
              <KPIWidget title="Orders" value="1,284" change={7.2} changePeriod="vs last month" />
              <KPIWidget title="Customers" value="892" change={-2.1} changePeriod="vs last month" />
              <KPIWidget title="Avg. Order" value="₹1,154" change={12.3} changePeriod="vs last month" />
            </Grid>
            <DataTable columns={orderColumns} data={orders} searchable pageSize={20} />
            <ActivityFeed title="Recent Activity" items={activityItems} />
          </main>
        </HStack>
      </ToastProvider>
    </BoostProvider>
  );
}
```

---

## License

MIT License (c) 2026 Boost Engine. Developed for modern global and Indian D2C & SaaS creators.
See [LICENSE](./LICENSE) for full license text.
