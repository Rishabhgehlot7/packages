const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ui = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/ui Test Suite v1.4.0...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${err.message}`);
    failed++;
    process.exitCode = 1;
  }
}

function assertExport(name) {
  assert.ok(ui[name] !== undefined, `"${name}" must be exported from @boostengine/ui`);
}

// ─── TEST 1: Build Artifacts ────────────────────────────────────────────────
test('Build artifacts exist (CJS, ESM, DTS)', () => {
  assert.ok(fs.existsSync(path.join(__dirname, 'dist/index.cjs')), 'dist/index.cjs must exist');
  assert.ok(fs.existsSync(path.join(__dirname, 'dist/index.mjs')), 'dist/index.mjs must exist');
  assert.ok(fs.existsSync(path.join(__dirname, 'dist/index.d.ts')), 'dist/index.d.ts must exist');
});

// ─── TEST 2: Next.js Client Directive ─────────────────────────────────────
test('"use client" directive present in all build outputs', () => {
  const cjs = fs.readFileSync(path.join(__dirname, 'dist/index.cjs'), 'utf-8');
  const mjs = fs.readFileSync(path.join(__dirname, 'dist/index.mjs'), 'utf-8');
  assert.ok(cjs.includes("'use client'") || cjs.includes('"use client"'), 'CJS must have "use client"');
  assert.ok(mjs.includes("'use client'") || mjs.includes('"use client"'), 'MJS must have "use client"');
});

// ─── TEST 3: DTS Declarations ─────────────────────────────────────────────
test('TypeScript declarations contain core symbols', () => {
  const dts = fs.readFileSync(path.join(__dirname, 'dist/index.d.ts'), 'utf-8');
  ['CartDrawer', 'ProductGallery', 'Navbar', 'Footer', 'BoostProvider', 'HeroSection', 'KPIWidget'].forEach((sym) => {
    assert.ok(dts.includes(sym), `DTS must declare "${sym}"`);
  });
});

// ─── TEST 4: AI Documentation Files ───────────────────────────────────────
test('llms.txt and llms-full.txt exist and are populated', () => {
  const llms = fs.readFileSync(path.join(__dirname, 'llms.txt'), 'utf-8');
  const llmsFull = fs.readFileSync(path.join(__dirname, 'llms-full.txt'), 'utf-8');
  assert.ok(llms.length > 1000, 'llms.txt must be at least 1,000 characters');
  assert.ok(llmsFull.length > 5000, 'llms-full.txt must be at least 5,000 characters');
  assert.ok(llms.includes('@boostengine/ui'), 'llms.txt must reference @boostengine/ui');
  assert.ok(llmsFull.includes('BoostProvider'), 'llms-full.txt must document BoostProvider');
  assert.ok(llmsFull.includes('PricingTable'), 'llms-full.txt must document PricingTable');
  assert.ok(llmsFull.includes('CartDrawer'), 'llms-full.txt must document CartDrawer');
});

// ─── TEST 5: Theming & Provider ───────────────────────────────────────────
test('Theming exports: BoostProvider, useTheme', () => {
  assertExport('BoostProvider');
  assertExport('useTheme');
  assert.strictEqual(typeof ui.BoostProvider, 'function', 'BoostProvider must be a function/component');
  assert.strictEqual(typeof ui.useTheme, 'function', 'useTheme must be a function/hook');
});

// ─── TEST 6: Layout Primitives ────────────────────────────────────────────
test('Layout primitives: Box, Flex, Stack, VStack, HStack, Grid, GridItem, Section, AspectRatio, ScrollArea, Motion', () => {
  ['Box', 'Flex', 'Stack', 'VStack', 'HStack', 'Grid', 'GridItem', 'Section', 'AspectRatio', 'ScrollArea', 'Container', 'PageWrapper', 'Motion'].forEach(assertExport);
});

// ─── TEST 7: Button Components ───────────────────────────────────────────
test('Button components: Button, IconButton, ButtonGroup, FloatingActionButton, LinkButton, CopyButton', () => {
  ['Button', 'IconButton', 'ButtonGroup', 'FloatingActionButton', 'LinkButton', 'CopyButton'].forEach(assertExport);
});

// ─── TEST 8: Form Components ─────────────────────────────────────────────
test('Form components: Input, Textarea, Select, MultiSelect, Checkbox, Radio, Switch, DatePicker, OTPInput, FileDropzone', () => {
  ['Input', 'Textarea', 'Select', 'MultiSelect', 'Checkbox', 'Radio', 'RadioGroup', 'Switch', 'DatePicker', 'TimePicker', 'FileUpload', 'FileDropzone', 'SearchInput', 'FormField', 'OTPInput'].forEach(assertExport);
});

// ─── TEST 9: Feedback Components ─────────────────────────────────────────
test('Feedback components: Toast, Alert, Skeleton, EmptyState, ErrorState, SuccessMessage', () => {
  ['Toast', 'ToastProvider', 'useToast', 'Loader', 'Spinner', 'ProgressBar', 'Skeleton', 'Alert', 'Snackbar', 'EmptyState', 'ErrorState', 'SuccessMessage'].forEach(assertExport);
});

// ─── TEST 10: Content & Display ──────────────────────────────────────────
test('Content & Display: Card, Avatar, Badge, Tooltip, Accordion, Carousel', () => {
  ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter', 'Image', 'Avatar', 'AvatarGroup', 'Badge', 'Tag', 'Tooltip', 'Chip', 'Divider', 'Accordion', 'Carousel'].forEach(assertExport);
});

// ─── TEST 11: Overlays & Dialogs ─────────────────────────────────────────
test('Overlays: Modal, Dialog, Drawer, BottomSheet, Popover, ConfirmationDialog, CommandPalette, Portal', () => {
  ['Modal', 'Dialog', 'Drawer', 'BottomSheet', 'Popover', 'ConfirmationDialog', 'CommandPalette', 'Portal'].forEach(assertExport);
});

// ─── TEST 12: Navigation ─────────────────────────────────────────────────
test('Navigation: Navbar, Sidebar, Footer, MobileBottomNav, Breadcrumb, MegaMenu, Tabs, Stepper', () => {
  ['Header', 'Navbar', 'Sidebar', 'Footer', 'MobileBottomBar', 'MobileBottomNav', 'Breadcrumb', 'NavLink', 'DropdownMenu', 'MegaMenu', 'Pagination', 'Tabs', 'Stepper', 'BackButton'].forEach(assertExport);
});

// ─── TEST 13: Data & Analytics ───────────────────────────────────────────
test('Data & Analytics: Table, DataTable, KPIWidget, ActivityFeed, NotificationCenter', () => {
  ['Table', 'DataTable', 'StatsCard', 'KPIWidget', 'ActivityFeed', 'NotificationCenter', 'DateRangePicker', 'ExportButton', 'Filter', 'Sort'].forEach(assertExport);
});

// ─── TEST 14: Authentication ─────────────────────────────────────────────
test('Auth: LoginForm, RegisterForm, ForgotPassword, ResetPassword', () => {
  ['LoginForm', 'RegisterForm', 'ForgotPassword', 'ResetPassword'].forEach(assertExport);
});

// ─── TEST 15: E-Commerce Suite ───────────────────────────────────────────
test('eCommerce Suite: CartDrawer, ProductCard, VariantSelector, PincodeChecker, LightningDealsBar', () => {
  [
    'CartDrawer', 'StickyAddToCart', 'PincodeChecker', 'TrustBadges', 'OrderTimeline',
    'StarRating', 'ProductGallery', 'VariantSelector', 'ProductCard', 'QuantitySelector',
    'ReviewBreakdownBars', 'AnnouncementBar', 'LightningDealsBar', 'FrequentlyBoughtTogether',
    'BankOffersAccordion', 'AssuredBadge', 'DualMobileActionBar', 'Price', 'AddToCart',
    'CouponInput', 'AddressForm', 'OrderSummary'
  ].forEach(assertExport);
});

// ─── TEST 16: Marketing Blocks ───────────────────────────────────────────
test('Marketing Blocks: HeroSection, FeatureGrid, PricingTable, TestimonialCard, FAQSection, CTASection', () => {
  ['HeroSection', 'FeatureGrid', 'PricingTable', 'TestimonialCard', 'TestimonialGrid', 'FAQSection', 'LogoCloud', 'CTASection'].forEach(assertExport);
});

// ─── TEST 17: Utility Hooks ──────────────────────────────────────────────
test('Utility Hooks: useMediaQuery, useClickOutside, useDebounce, useLocalStorage, useCopyToClipboard, useToggle, useForm', () => {
  ['useMediaQuery', 'useClickOutside', 'useDebounce', 'useLocalStorage', 'useWindowSize', 'useScrollPosition', 'usePrevious', 'useCopyToClipboard', 'useToggle', 'useIntersectionObserver', 'useIsomorphicLayoutEffect', 'useForm'].forEach(assertExport);
  // Verify they are functions
  ['useMediaQuery', 'useClickOutside', 'useDebounce', 'useLocalStorage', 'useForm'].forEach((hook) => {
    assert.strictEqual(typeof ui[hook], 'function', `${hook} must be a function`);
  });
});

// ─── TEST 18: Utility Functions ──────────────────────────────────────────
test('Utility Functions: cn, formatCurrency, formatDate, slugify, getInitials, validators', () => {
  ['cn', 'formatCurrency', 'formatNumber', 'formatDate', 'formatRelativeTime', 'truncate', 'slugify', 'generateId', 'clamp', 'groupBy', 'deepMerge', 'omit', 'pick', 'debounce', 'getInitials', 'isValidEmail', 'isValidIndianPincode', 'isValidIndianMobile'].forEach(assertExport);
  // Functional validation
  assert.strictEqual(ui.cn('a', false, 'b', null, 'c'), 'a b c', 'cn() should filter falsy values');
  assert.strictEqual(ui.clamp(150, 0, 100), 100, 'clamp(150, 0, 100) should return 100');
  assert.strictEqual(ui.clamp(-5, 0, 100), 0, 'clamp(-5, 0, 100) should return 0');
  assert.strictEqual(ui.clamp(50, 0, 100), 50, 'clamp(50, 0, 100) should return 50');
  assert.strictEqual(ui.slugify('Hello World!'), 'hello-world', 'slugify should produce URL-safe slugs');
  assert.strictEqual(ui.getInitials('Aarav Sharma'), 'AS', 'getInitials should return "AS" for "Aarav Sharma"');
  assert.strictEqual(ui.getInitials('Priya'), 'P', 'getInitials should return "P" for single-name');
  assert.strictEqual(ui.truncate('Hello World', 8), 'Hello...', 'truncate should trim and add ellipsis');
  assert.strictEqual(ui.isValidEmail('user@example.com'), true, 'should validate correct email');
  assert.strictEqual(ui.isValidEmail('invalid'), false, 'should reject invalid email');
  assert.strictEqual(ui.isValidIndianPincode('110001'), true, 'should validate 6-digit pincode');
  assert.strictEqual(ui.isValidIndianPincode('1234'), false, 'should reject 4-digit pincode');
  assert.strictEqual(ui.isValidIndianMobile('9876543210'), true, 'should validate Indian mobile');
  assert.strictEqual(ui.isValidIndianMobile('1234567890'), false, 'should reject invalid mobile (starts with 1)');
});

// ─── TEST 19: Export Count Sanity Check ──────────────────────────────────
test('Minimum export count sanity check (>= 130 exports)', () => {
  const exportCount = Object.keys(ui).length;
  assert.ok(exportCount >= 130, `Expected >= 130 exports, found ${exportCount}`);
  console.log(`     📊 Total exports: ${exportCount}`);
});

// ─── TEST 20: Package.json Sanity ────────────────────────────────────────
test('package.json has required fields: name, version, description, keywords, exports, bin, files, sideEffects, engines', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
  assert.ok(pkg.name === '@boostengine/ui', 'Package name must be @boostengine/ui');
  assert.ok(pkg.version, 'Package must have a version');
  assert.strictEqual(pkg.sideEffects, false, 'sideEffects must be false');
  assert.ok(pkg.engines?.node, 'engines.node must be specified');
  assert.ok(Array.isArray(pkg.keywords) && pkg.keywords.length > 5, 'Must have > 5 keywords');
  assert.ok(pkg.exports?.['.'], 'Package.json must have exports["."]');
  assert.ok(pkg.exports?.['./hooks'], 'Package.json must have exports["./hooks"]');
  assert.ok(pkg.exports?.['./utils'], 'Package.json must have exports["./utils"]');
  assert.ok(pkg.exports?.['.']?.import, 'ESM export must be configured');
  assert.ok(pkg.exports?.['.']?.require, 'CJS export must be configured');
  assert.ok(pkg.bin?.['boost-ui'], 'bin.boost-ui CLI must be configured');
  assert.ok(Array.isArray(pkg.files) && pkg.files.includes('llms.txt'), 'llms.txt must be in files array');
});

// ─── RESULTS ────────────────────────────────────────────────────────────
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (failed === 0) {
  console.log(`\n🎉 All ${passed} test suites in @boostengine/ui passed successfully!\n`);
} else {
  console.error(`\n⚠️  ${passed} passed, ${failed} failed. Fix failures before publishing.\n`);
  process.exit(1);
}
