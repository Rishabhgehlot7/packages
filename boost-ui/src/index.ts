// ==========================================
// @boostengine/ui - Master Component Exports
// ==========================================
export { ErrorBoundary } from './components/ErrorBoundary';
export type { ErrorBoundaryProps } from './components/ErrorBoundary';

// Utility Hooks (SSR-safe)
export {
  useMediaQuery,
  useClickOutside,
  useDebounce,
  useLocalStorage,
  useWindowSize,
  useScrollPosition,
  usePrevious,
  useCopyToClipboard,
  useToggle,
  useIntersectionObserver,
  useIsomorphicLayoutEffect,
  useForm,
  useFocusTrap,
  useAnnounce,
  useBreakpoint,
} from './hooks';
export type { UseFormOptions } from './hooks';

// Utility Functions
export {
  cn,
  formatCurrency,
  formatNumber,
  formatDate,
  formatRelativeTime,
  truncate,
  slugify,
  generateId,
  clamp,
  groupBy,
  deepMerge,
  omit,
  pick,
  debounce,
  getInitials,
  isValidEmail,
  isValidIndianPincode,
  isValidIndianMobile,
} from './utils';

// 0. Theming & Design System
export { BoostProvider, useTheme, useCurrency, useBoostPreset, useDesignTokens, injectBoostGlobalStyles } from './components/BoostProvider';
export { ThemeToggle } from './components/ThemeToggle';
export { PresetSwitcher } from './components/PresetSwitcher';
export { boostTokens, createTailwindPreset } from './tokens';
export { lightTokens, darkTokens, resolveTokens, tokensToCssVars } from './tokens';
export type { BoostTokens } from './tokens';
export { presetTokenCssVars, presetHelperClasses } from './tokens/presets';
export { presetTokens } from './types/presets';
export type {
  BoostProviderProps,
  BoostThemeConfig,
  ThemeMode,
  ThemeTokens,
} from './components/BoostProvider';
export type { ThemeToggleProps } from './components/ThemeToggle';
export type { PresetSwitcherProps } from './components/PresetSwitcher';
export type {
  AsProp,
  PolymorphicComponentProp,
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from './types/polymorphic';
export type {
  UIStylePreset,
  PresetTokens,
} from './types/presets';

// 1. Buttons & Actions
export { Button } from './components/Button';
export { IconButton } from './components/IconButton';
export { ButtonGroup } from './components/ButtonGroup';
export { FloatingActionButton } from './components/FloatingActionButton';
export { LinkButton } from './components/LinkButton';
export { CopyButton } from './components/CopyButton';

export type { ButtonProps } from './components/Button';
export type { IconButtonProps } from './components/IconButton';
export type { ButtonGroupProps } from './components/ButtonGroup';
export type { FloatingActionButtonProps } from './components/FloatingActionButton';
export type { LinkButtonProps } from './components/LinkButton';
export type { CopyButtonProps } from './components/CopyButton';

// 2. Forms & Inputs
export { Input } from './components/Input';
export { Textarea } from './components/Textarea';
export { Select } from './components/Select';
export { MultiSelect } from './components/MultiSelect';
export { Checkbox } from './components/Checkbox';
export { Radio, RadioGroup } from './components/Radio';
export { Switch } from './components/Switch';
export { DatePicker } from './components/DatePicker';
export { TimePicker } from './components/TimePicker';
export { FileUpload } from './components/FileUpload';
export { SearchInput } from './components/SearchInput';
export { FormField } from './components/FormField';
export { OTPInput } from './components/OTPInput';
export { FileDropzone } from './components/FileDropzone';

export type { InputProps } from './components/Input';
export type { TextareaProps } from './components/Textarea';
export type { SelectProps, SelectOption } from './components/Select';
export type { MultiSelectProps, MultiSelectOption } from './components/MultiSelect';
export type { CheckboxProps } from './components/Checkbox';
export type { RadioProps, RadioGroupProps, RadioOption } from './components/Radio';
export type { SwitchProps } from './components/Switch';
export type { DatePickerProps } from './components/DatePicker';
export type { TimePickerProps } from './components/TimePicker';
export type { FileUploadProps } from './components/FileUpload';
export type { SearchInputProps } from './components/SearchInput';
export type { FormFieldProps } from './components/FormField';
export type { OTPInputProps } from './components/OTPInput';
export type { FileDropzoneProps } from './components/FileDropzone';

// 3. Feedback & Status
export { Loader } from './components/Loader';
export { Spinner } from './components/Spinner';
export { ProgressBar } from './components/ProgressBar';
export { Skeleton } from './components/Skeleton';
export { Toast, ToastProvider, useToast } from './components/Toast';
export { Alert } from './components/Alert';
export { Snackbar } from './components/Snackbar';
export { EmptyState } from './components/EmptyState';
export { ErrorState } from './components/ErrorState';
export { SuccessMessage } from './components/SuccessMessage';

export type { LoaderProps } from './components/Loader';
export type { SpinnerProps } from './components/Spinner';
export type { ProgressBarProps } from './components/ProgressBar';
export type { SkeletonProps } from './components/Skeleton';
export type {
  ToastProps,
  ToastProviderProps,
  ToastOptions,
  ToastPromiseOptions,
  ToastVariant,
  ToastPosition,
  ToastContextType,
} from './components/Toast';
export type { AlertProps } from './components/Alert';
export type { SnackbarProps } from './components/Snackbar';
export type { EmptyStateProps } from './components/EmptyState';
export type { ErrorStateProps } from './components/ErrorState';
export type { SuccessMessageProps } from './components/SuccessMessage';

// 4. Content & Display
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/Card';
export { Image } from './components/Image';
export { Avatar, AvatarGroup } from './components/Avatar';
export { Badge } from './components/Badge';
export { Tag } from './components/Tag';
export { Tooltip } from './components/Tooltip';
export { Chip } from './components/Chip';
export { Divider } from './components/Divider';
export { Accordion } from './components/Accordion';
export { Carousel } from './components/Carousel';

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './components/Card';
export type { ImageProps } from './components/Image';
export type { AvatarProps, AvatarGroupProps } from './components/Avatar';
export type { BadgeProps } from './components/Badge';
export type { TagProps } from './components/Tag';
export type { TooltipProps } from './components/Tooltip';
export type { ChipProps } from './components/Chip';
export type { DividerProps } from './components/Divider';
export type { AccordionProps, AccordionItem } from './components/Accordion';
export type { CarouselProps, CarouselSlide } from './components/Carousel';

// 5. Overlays & Dialogs
export { Modal, Dialog } from './components/Modal';
export { Drawer } from './components/Drawer';
export { BottomSheet } from './components/BottomSheet';
export { Popover } from './components/Popover';
export { ConfirmationDialog } from './components/ConfirmationDialog';
export { CommandPalette } from './components/CommandPalette';
export { Portal } from './components/Portal';

export type { ModalProps, DialogProps } from './components/Modal';
export type { DrawerProps } from './components/Drawer';
export type { BottomSheetProps } from './components/BottomSheet';
export type { PopoverProps } from './components/Popover';
export type { ConfirmationDialogProps } from './components/ConfirmationDialog';
export type { CommandPaletteProps, CommandItem } from './components/CommandPalette';
export type { PortalProps } from './components/Portal';

// 6. Navigation & Layout Primitives
export { Box } from './components/Box';
export { Flex } from './components/Flex';
export { Stack, VStack, HStack } from './components/Stack';
export { Grid, GridItem } from './components/Grid';
export { Section } from './components/Section';
export { AspectRatio } from './components/AspectRatio';
export { ScrollArea } from './components/ScrollArea';
export { Motion } from './components/Motion';
export { Header } from './components/Header';
export { Navbar } from './components/Navbar';
export { Sidebar } from './components/Sidebar';
export { Footer } from './components/Footer';
export { MobileBottomBar } from './components/MobileBottomBar';
export { MobileBottomNav } from './components/MobileBottomNav';
export { Breadcrumb } from './components/Breadcrumb';
export { Container } from './components/Container';
export { PageWrapper } from './components/PageWrapper';
export { NavLink } from './components/NavLink';
export { DropdownMenu } from './components/DropdownMenu';
export { MegaMenu } from './components/MegaMenu';
export { Pagination } from './components/Pagination';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
export { Stepper } from './components/Stepper';
export { BackButton } from './components/BackButton';

export type { BoxProps, BoxAsTag } from './components/Box';
export type { FlexProps } from './components/Flex';
export type { StackProps, VStackProps, HStackProps } from './components/Stack';
export type { GridProps, GridItemProps, ResponsiveBreakpoints } from './components/Grid';
export type { SectionProps } from './components/Section';
export type { AspectRatioProps } from './components/AspectRatio';
export type { ScrollAreaProps } from './components/ScrollArea';
export type { MotionProps } from './components/Motion';
export type { HeaderProps } from './components/Header';
export type { NavbarProps, NavLinkItem } from './components/Navbar';
export type { SidebarProps, SidebarItem, SidebarGroup } from './components/Sidebar';
export type { FooterProps, FooterColumn } from './components/Footer';
export type { MobileBottomBarProps, MobileBottomBarItem } from './components/MobileBottomBar';
export type { MobileBottomNavProps, MobileBottomNavItem } from './components/MobileBottomNav';
export type { BreadcrumbProps, BreadcrumbItem } from './components/Breadcrumb';
export type { ContainerProps } from './components/Container';
export type { PageWrapperProps } from './components/PageWrapper';
export type { NavLinkProps } from './components/NavLink';
export type { DropdownMenuProps, DropdownMenuItem } from './components/DropdownMenu';
export type { MegaMenuProps, MegaMenuCategory, MegaMenuColumn } from './components/MegaMenu';
export type { PaginationProps } from './components/Pagination';
export type { TabsProps, TabItem, TabsListProps, TabsTriggerProps, TabsContentProps } from './components/Tabs';
export type { StepperProps, StepItem } from './components/Stepper';
export type { BackButtonProps } from './components/BackButton';

// 7. Data & Analytics
export { Table } from './components/Table';
export { DataTable } from './components/DataTable';
export { StatsCard } from './components/StatsCard';
export { KPIWidget } from './components/KPIWidget';
export { AreaChart } from './components/AreaChart';
export { BarChart } from './components/BarChart';
export { DonutChart } from './components/DonutChart';
export { Sparkline } from './components/Sparkline';
export { ActivityFeed } from './components/ActivityFeed';
export { NotificationCenter } from './components/NotificationCenter';
export { DateRangePicker } from './components/DateRangePicker';
export { ExportButton } from './components/ExportButton';
export { Filter } from './components/Filter';
export { Sort } from './components/Sort';

export type { TableProps, TableColumn } from './components/Table';
export type { DataTableProps, DataTableColumn } from './components/DataTable';
export type { StatsCardProps } from './components/StatsCard';
export type { KPIWidgetProps } from './components/KPIWidget';
export type { AreaChartProps, ChartDataPoint } from './components/AreaChart';
export type { BarChartProps, BarChartDataPoint } from './components/BarChart';
export type { DonutChartProps, DonutDataPoint } from './components/DonutChart';
export type { SparklineProps } from './components/Sparkline';
export type { ActivityFeedProps, ActivityItem, ActivityUser } from './components/ActivityFeed';
export type { NotificationCenterProps, NotificationItem } from './components/NotificationCenter';
export type { DateRangePickerProps, DateRange } from './components/DateRangePicker';
export type { ExportButtonProps } from './components/ExportButton';
export type { FilterProps, FilterOption } from './components/Filter';
export type { SortProps, SortOption, SortDirection } from './components/Sort';

// 8. Authentication
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { ForgotPassword } from './components/ForgotPassword';
export { ResetPassword } from './components/ResetPassword';

export type { LoginFormProps } from './components/LoginForm';
export type { RegisterFormProps, RegisterFormData } from './components/RegisterForm';
export type { ForgotPasswordProps } from './components/ForgotPassword';
export type { ResetPasswordProps } from './components/ResetPassword';

// 9. E-Commerce & D2C Experiences
export { CartDrawer } from './components/CartDrawer';
export { StickyAddToCart } from './components/StickyAddToCart';
export { PincodeChecker } from './components/PincodeChecker';
export { TrustBadges } from './components/TrustBadges';
export { OrderTimeline } from './components/OrderTimeline';
export { StarRating } from './components/StarRating';
export { ProductGallery } from './components/ProductGallery';
export { VariantSelector } from './components/VariantSelector';
export { ProductCard } from './components/ProductCard';
export { QuantitySelector } from './components/QuantitySelector';
export { ReviewBreakdownBars } from './components/ReviewBreakdownBars';
export { AnnouncementBar } from './components/AnnouncementBar';
export { LightningDealsBar } from './components/LightningDealsBar';
export { FrequentlyBoughtTogether } from './components/FrequentlyBoughtTogether';
export { BankOffersAccordion } from './components/BankOffersAccordion';
export { AssuredBadge } from './components/AssuredBadge';
export { DualMobileActionBar } from './components/DualMobileActionBar';
export { Price } from './components/Price';
export { AddToCart } from './components/AddToCart';
export { CouponInput } from './components/CouponInput';
export { AddressForm } from './components/AddressForm';
export { OrderSummary } from './components/OrderSummary';

export type { CartDrawerProps, CartDrawerItem } from './components/CartDrawer';
export type { StickyAddToCartProps } from './components/StickyAddToCart';
export type { PincodeCheckerProps, PincodeCheckResult } from './components/PincodeChecker';
export type { TrustBadgesProps } from './components/TrustBadges';
export type { OrderTimelineProps, OrderStage } from './components/OrderTimeline';
export type { StarRatingProps } from './components/StarRating';
export type { ProductGalleryProps, ProductGalleryImageItem } from './components/ProductGallery';
export type {
  VariantSelectorProps,
  VariantOption,
  VariantGroup,
  SelectedVariants,
} from './components/VariantSelector';
export type { ProductCardProps } from './components/ProductCard';
export type { QuantitySelectorProps } from './components/QuantitySelector';
export type {
  ReviewBreakdownBarsProps,
  ReviewBreakdownItem,
} from './components/ReviewBreakdownBars';
export type { AnnouncementBarProps } from './components/AnnouncementBar';
export type { LightningDealsBarProps } from './components/LightningDealsBar';
export type { FrequentlyBoughtTogetherProps, BundleItem } from './components/FrequentlyBoughtTogether';
export type { BankOffersAccordionProps, BankOffer } from './components/BankOffersAccordion';
export type { AssuredBadgeProps } from './components/AssuredBadge';
export type { DualMobileActionBarProps } from './components/DualMobileActionBar';
export type { PriceProps } from './components/Price';
export type { AddToCartProps } from './components/AddToCart';
export type { CouponInputProps } from './components/CouponInput';
export type { AddressFormProps, AddressData } from './components/AddressForm';
export type { OrderSummaryProps, OrderSummaryItem } from './components/OrderSummary';

// 10. Marketing & High-Converting Landing Blocks
export { HeroSection } from './components/HeroSection';
export { FeatureGrid } from './components/FeatureGrid';
export { PricingTable } from './components/PricingTable';
export { TestimonialCard, TestimonialGrid } from './components/TestimonialCard';
export { FAQSection } from './components/FAQSection';
export { LogoCloud } from './components/LogoCloud';
export { CTASection } from './components/CTASection';

export type { HeroSectionProps, HeroAction } from './components/HeroSection';
export type { FeatureGridProps, FeatureItem } from './components/FeatureGrid';
export type { PricingTableProps, PricingTier, PricingFeature } from './components/PricingTable';
export type {
  TestimonialProps,
  TestimonialGridProps,
} from './components/TestimonialCard';
export type { FAQSectionProps, FAQItem } from './components/FAQSection';
export type { LogoCloudProps, LogoItem } from './components/LogoCloud';
export type { CTASectionProps } from './components/CTASection';
