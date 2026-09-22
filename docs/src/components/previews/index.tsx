import React from 'react';
import { ButtonsPreviews } from './ButtonsPreviews';
import { FormsPreviews } from './FormsPreviews';
import { FeedbackPreviews } from './FeedbackPreviews';
import { ContentPreviews } from './ContentPreviews';
import { OverlaysPreviews } from './OverlaysPreviews';
import { NavigationPreviews } from './NavigationPreviews';
import { DataPreviews } from './DataPreviews';
import { AuthPreviews } from './AuthPreviews';
import { EcommercePreviews } from './EcommercePreviews';
import { MarketingPreviews } from './MarketingPreviews';
import { SaaSPreviews } from './SaaSPreviews';
import { PrimitivesPreviews } from './PrimitivesPreviews';

const BUTTONS_IDS = new Set(['Button', 'IconButton', 'ButtonGroup', 'FloatingActionButton', 'LinkButton']);
const FORMS_IDS = new Set(['Input', 'Textarea', 'Select', 'MultiSelect', 'Checkbox', 'Radio', 'RadioGroup', 'Switch', 'DatePicker', 'TimePicker', 'FileUpload', 'SearchInput', 'FormField', 'OTPInput']);
const FEEDBACK_IDS = new Set(['Loader', 'Spinner', 'ProgressBar', 'Skeleton', 'Toast', 'Alert', 'Snackbar', 'EmptyState', 'ErrorState', 'SuccessMessage']);
const CONTENT_IDS = new Set(['Card', 'Image', 'Avatar', 'Badge', 'Tag', 'Tooltip', 'Chip', 'Divider', 'Accordion', 'Carousel']);
const OVERLAYS_IDS = new Set(['Modal', 'Drawer', 'BottomSheet', 'Popover', 'ConfirmationDialog', 'Portal']);
const NAVIGATION_IDS = new Set(['Header', 'Navbar', 'Sidebar', 'Footer', 'MobileBottomBar', 'MobileBottomNav', 'Breadcrumb', 'Container', 'PageWrapper', 'NavLink', 'DropdownMenu', 'MegaMenu', 'Pagination', 'Tabs', 'Stepper', 'BackButton']);
const DATA_IDS = new Set(['Table', 'DataTable', 'StatsCard', 'DateRangePicker', 'ExportButton', 'Filter', 'Sort', 'AreaChart', 'BarChart', 'DonutChart', 'Sparkline']);
const AUTH_IDS = new Set(['LoginForm', 'RegisterForm', 'ForgotPassword', 'ResetPassword']);
const ECOM_IDS = new Set(['Price', 'AddToCart', 'CouponInput', 'AddressForm', 'OrderSummary', 'CartDrawer', 'PincodeChecker', 'StickyAddToCart', 'ProductCard', 'ProductGallery', 'VariantSelector', 'QuantitySelector', 'StarRating', 'ReviewBreakdownBars', 'TrustBadges', 'OrderTimeline', 'AnnouncementBar', 'LightningDealsBar', 'FrequentlyBoughtTogether', 'BankOffersAccordion', 'AssuredBadge', 'DualMobileActionBar']);
const MARKETING_IDS = new Set(['HeroSection', 'FeatureGrid', 'PricingTable', 'TestimonialCard', 'FAQSection', 'LogoCloud', 'CTASection']);
const SAAS_IDS = new Set(['KPIWidget', 'CommandPalette', 'ActivityFeed', 'NotificationCenter', 'CopyButton', 'FileDropzone']);
const PRIMITIVES_IDS = new Set(['Box', 'Flex', 'Stack', 'VStack', 'HStack', 'Grid', 'Section', 'AspectRatio', 'ScrollArea', 'Motion', 'BoostProvider', 'ThemeToggle', 'PresetSwitcher']);

export const ComponentPreviewRenderer: React.FC<{
  componentId: string;
  onShowToast: (msg: string) => void;
}> = ({ componentId, onShowToast }) => {
  if (BUTTONS_IDS.has(componentId)) {
    return <ButtonsPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (FORMS_IDS.has(componentId)) {
    return <FormsPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (FEEDBACK_IDS.has(componentId)) {
    return <FeedbackPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (CONTENT_IDS.has(componentId)) {
    return <ContentPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (OVERLAYS_IDS.has(componentId)) {
    return <OverlaysPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (NAVIGATION_IDS.has(componentId)) {
    return <NavigationPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (DATA_IDS.has(componentId)) {
    return <DataPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (AUTH_IDS.has(componentId)) {
    return <AuthPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (ECOM_IDS.has(componentId)) {
    return <EcommercePreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (MARKETING_IDS.has(componentId)) {
    return <MarketingPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (SAAS_IDS.has(componentId)) {
    return <SaaSPreviews componentId={componentId} onShowToast={onShowToast} />;
  }
  if (PRIMITIVES_IDS.has(componentId)) {
    return <PrimitivesPreviews componentId={componentId} onShowToast={onShowToast} />;
  }

  return (
    <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
      Component preview ready for <strong>{componentId}</strong>
    </div>
  );
};
