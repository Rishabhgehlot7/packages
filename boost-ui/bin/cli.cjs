#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n⚡ @boostengine/ui CLI - Universal Component Engine');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

const componentsDir = path.resolve(__dirname, '../src/components');

// Map of canonical component names (lowercase to exact filename)
function getAvailableComponents() {
  if (!fs.existsSync(componentsDir)) {
    return [];
  }
  return fs
    .readdirSync(componentsDir)
    .filter((f) => f.endsWith('.tsx') && !f.startsWith('.'))
    .map((f) => f.replace('.tsx', ''));
}

if (command === 'list') {
  const all = getAvailableComponents();
  console.log(`📦 Available Components (${all.length} Total):\n`);

  const categories = {
    '0. Theming': ['BoostProvider'],
    '1. Primitives': ['Box', 'Flex', 'Stack', 'Grid', 'Section', 'AspectRatio', 'ScrollArea', 'Container', 'PageWrapper', 'Motion'],
    '2. Marketing': ['HeroSection', 'FeatureGrid', 'PricingTable', 'TestimonialCard', 'FAQSection', 'LogoCloud', 'CTASection'],
    '3. SaaS & Analytics': ['AreaChart', 'BarChart', 'DonutChart', 'Sparkline', 'KPIWidget', 'CommandPalette', 'ActivityFeed', 'CopyButton', 'FileDropzone', 'StatsCard', 'DataTable', 'Table', 'DateRangePicker', 'ExportButton', 'Filter', 'Sort', 'NotificationCenter'],
    '4. Buttons': ['Button', 'IconButton', 'ButtonGroup', 'FloatingActionButton', 'LinkButton'],
    '5. Forms & Inputs': ['Input', 'Textarea', 'Select', 'MultiSelect', 'Checkbox', 'Radio', 'Switch', 'DatePicker', 'TimePicker', 'FileUpload', 'SearchInput', 'FormField', 'OTPInput'],
    '6. Feedback': ['Toast', 'Alert', 'Snackbar', 'Loader', 'Spinner', 'ProgressBar', 'Skeleton', 'EmptyState', 'ErrorState', 'SuccessMessage'],
    '7. Display': ['Card', 'Image', 'Avatar', 'Badge', 'Tag', 'Tooltip', 'Chip', 'Divider', 'Accordion', 'Carousel'],
    '8. Overlays': ['Modal', 'Drawer', 'BottomSheet', 'Popover', 'ConfirmationDialog', 'Portal'],
    '9. Navigation': ['Header', 'Navbar', 'Sidebar', 'Footer', 'MobileBottomBar', 'MobileBottomNav', 'Breadcrumb', 'NavLink', 'DropdownMenu', 'MegaMenu', 'Pagination', 'Tabs', 'Stepper', 'BackButton'],
    '10. eCommerce': ['CartDrawer', 'StickyAddToCart', 'PincodeChecker', 'TrustBadges', 'OrderTimeline', 'StarRating', 'ProductGallery', 'VariantSelector', 'ProductCard', 'QuantitySelector', 'ReviewBreakdownBars', 'AnnouncementBar', 'LightningDealsBar', 'FrequentlyBoughtTogether', 'BankOffersAccordion', 'AssuredBadge', 'DualMobileActionBar', 'Price', 'AddToCart', 'CouponInput', 'AddressForm', 'OrderSummary'],
    '11. Authentication': ['LoginForm', 'RegisterForm', 'ForgotPassword', 'ResetPassword'],
  };

  for (const [cat, compList] of Object.entries(categories)) {
    console.log(`\x1b[36m${cat}\x1b[0m`);
    console.log(`  ${compList.join(', ')}\n`);
  }
} else if (command === 'add') {
  const targetComponent = args[1];

  if (!targetComponent) {
    console.error('❌ Error: Please specify a component name.');
    console.log('   Example: npx @boostengine/ui add hero-section\n');
    process.exit(1);
  }

  const all = getAvailableComponents();
  const normalizedTarget = targetComponent.toLowerCase().replace(/[-_]/g, '');

  const matched = all.find(
    (c) => c.toLowerCase().replace(/[-_]/g, '') === normalizedTarget
  );

  if (!matched) {
    console.error(`❌ Component "${targetComponent}" not found.`);
    console.log('   Run `npx @boostengine/ui list` to see all available components.\n');
    process.exit(1);
  }

  const srcPath = path.join(componentsDir, `${matched}.tsx`);
  const outDir = path.resolve(process.cwd(), 'components/boost-ui');
  const destPath = path.join(outDir, `${matched}.tsx`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const content = fs.readFileSync(srcPath, 'utf8');
  fs.writeFileSync(destPath, content);

  console.log(`✅ Successfully added ${matched}!`);
  console.log(`   Location: ./components/boost-ui/${matched}.tsx\n`);
  console.log('   Import and use in your app:');
  console.log(`   import { ${matched} } from '@/components/boost-ui/${matched}';\n`);
} else if (command === 'init') {
  const configPath = path.resolve(process.cwd(), 'boost-ui.json');
  const defaultConfig = {
    $schema: 'https://boostengine.dev/schema.json',
    style: 'zero-config',
    componentsDirectory: './components/boost-ui',
    theme: {
      defaultMode: 'system',
      primaryColor: '#2563eb',
      radius: '8px',
    },
  };

  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log('✅ Initialized boost-ui.json in your project root!\n');
  console.log('👉 Add BoostProvider to your root layout:');
  console.log(`
import { BoostProvider } from '@boostengine/ui';

export default function RootLayout({ children }) {
  return (
    <BoostProvider defaultMode="system">
      {children}
    </BoostProvider>
  );
}
  `);
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/ui list                List all 80+ universal components');
  console.log('  npx @boostengine/ui add <component>     Scaffold component directly into your project');
  console.log('  npx @boostengine/ui init                Initialize boost-ui config in your app');
  console.log('  npx @boostengine/ui help                Show this help guide\n');
  console.log('Examples:');
  console.log('  npx @boostengine/ui add hero-section');
  console.log('  npx @boostengine/ui add pricing-table');
  console.log('  npx @boostengine/ui add cart-drawer\n');
}
