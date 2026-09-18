# Changelog

All notable changes to `@boostengine/ui` are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.4.0] — 2026-09-18

### Added
- **New Components**:
  - `Portal` — SSR-safe React DOM portal rendering to document.body, used by `Modal` and `Drawer`.
  - `Motion` — Zero-dependency scroll & entrance animations (`slide-up`, `fade-in`, `scale-in`, etc.) powered by native `IntersectionObserver`.
- **New Utility Hook**:
  - `useForm` — Lightweight, type-safe form management hook with real-time validation and async submission status.
- **Utility Hooks** — 12 SSR-safe hooks exported directly from package root and `@boostengine/ui/hooks`:
  - `useForm`, `useMediaQuery`, `useClickOutside`, `useDebounce`, `useLocalStorage`, `useWindowSize`, `useScrollPosition`, `usePrevious`, `useCopyToClipboard`, `useToggle`, `useIntersectionObserver`, `useIsomorphicLayoutEffect`.
- **Utility Functions** — 18 utilities exported from package root and `@boostengine/ui/utils`:
  - `cn()`, `formatCurrency()`, `formatNumber()`, `formatDate()`, `formatRelativeTime()`, `truncate()`, `slugify()`, `generateId()`, `clamp()`, `groupBy()`, `deepMerge()`, `omit()`, `pick()`, `debounce()`, `getInitials()`, `isValidEmail()`, `isValidIndianPincode()`, `isValidIndianMobile()`.
- **Subpath Exports** — Official support for `@boostengine/ui/hooks` and `@boostengine/ui/utils` in `package.json`.
- **Tree-Shaking & Performance** — Added `"sideEffects": false` and `"engines": { "node": ">=18.0.0" }`.
- **Accessibility & Form Integration** — Added `React.forwardRef` and `displayName` to `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `OTPInput`, and `SearchInput`.
- **No-Provider Fallback** — Injected static default CSS variables and keyframes at module load time in `BoostProvider`.
- **Upgraded `llms-full.txt` & `llms.txt`** — Complete specs for all 115 components and full page templates.
- **Upgraded `test-suite.cjs`** — Comprehensive test coverage across all components, hooks, utils, and package.json configuration.

### Changed
- `package.json` version bumped to `1.4.0`

---

## [1.3.0] — 2026-09-17

### Added
- **Marketing Blocks** — `HeroSection`, `FeatureGrid`, `PricingTable`, `TestimonialCard`, `TestimonialGrid`, `FAQSection`, `LogoCloud`, `CTASection`
- **SaaS Dashboard Blocks** — `KPIWidget`, `CommandPalette`, `ActivityFeed`, `NotificationCenter`
- **File Handling** — `FileDropzone` (drag-and-drop with preview), `ExportButton` (CSV/Excel/PDF/JSON)
- **Data Table** — `DataTable` with search, sort, and pagination
- **CLI Tooling** — `npx @boostengine/ui add <component>`, `npx @boostengine/ui list`, `npx @boostengine/ui init`
- **AI Documentation** — `llms.txt` and `llms-full.txt` machine-readable manifests
- **Advanced Forms** — `DateRangePicker`, `MultiSelect`, `FileDropzone`, `OTPInput`

### Changed
- `BoostProvider` now supports `darkTokens` prop for independent dark-mode token overrides
- All components now use CSS variable references (`var(--boost-*)`) for themeable surfaces

---

## [1.2.0] — 2026-09-10

### Added
- **E-Commerce Suite** — `CartDrawer`, `StickyAddToCart`, `PincodeChecker`, `TrustBadges`, `OrderTimeline`, `ProductCard`, `ProductGallery`, `VariantSelector`, `QuantitySelector`, `ReviewBreakdownBars`
- **Indian D2C Specific** — `AnnouncementBar`, `LightningDealsBar`, `FrequentlyBoughtTogether`, `BankOffersAccordion`, `AssuredBadge`, `DualMobileActionBar`
- **Checkout Suite** — `Price`, `AddToCart`, `CouponInput`, `AddressForm`, `OrderSummary`
- **Authentication** — `LoginForm`, `RegisterForm`, `ForgotPassword`, `ResetPassword`

---

## [1.1.0] — 2026-09-05

### Added
- **Layout Primitives** — `Box`, `Flex`, `Stack`, `VStack`, `HStack`, `Grid`, `GridItem`, `Section`, `AspectRatio`, `ScrollArea`, `Container`, `PageWrapper`
- **Navigation** — `Navbar`, `Sidebar`, `Footer`, `MobileBottomBar`, `MobileBottomNav`, `MegaMenu`, `DropdownMenu`
- **Theming Engine** — `BoostProvider` with CSS variable injection, `useTheme` hook, automatic system/dark/light mode

---

## [1.0.0] — 2026-09-01

### Added
- Initial release with 30 core components
- `Button`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Modal`, `Drawer`, `Toast`, `Alert`, `Card`, `Badge`, `Avatar`, `Tooltip`, `Accordion`, `Carousel`, `Table`, `Pagination`, `Tabs`, `Breadcrumb`, `Skeleton`, `Loader`, `Spinner`, `ProgressBar`, `EmptyState`, `Stepper`, `StarRating`, `Divider`, `Tag`, `Chip`
- Zero external CSS dependency architecture
- TypeScript-first with complete type declarations
- Next.js App Router compatible (`'use client'` banner injection)
