import * as React from 'react';

interface CartDrawerItem {
    id: string;
    title: string;
    variantTitle?: string;
    price: number;
    quantity: number;
    image?: string;
}
interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartDrawerItem[];
    subtotal: number;
    freeShippingThreshold?: number;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    onCheckout: () => void;
    className?: string;
}
declare const CartDrawer: React.FC<CartDrawerProps>;

interface StickyAddToCartProps {
    title: string;
    price: number;
    compareAtPrice?: number;
    image?: string;
    onAddToCart: (quantity: number) => void;
    onBuyNow?: (quantity: number) => void;
    inStock?: boolean;
    className?: string;
}
declare const StickyAddToCart: React.FC<StickyAddToCartProps>;

interface PincodeCheckResult {
    isServiceable: boolean;
    estimatedDeliveryDate?: string;
    isCodAvailable?: boolean;
    courier?: string;
}
interface PincodeCheckerProps {
    onCheck?: (pincode: string) => Promise<PincodeCheckResult> | PincodeCheckResult;
    defaultPincode?: string;
    className?: string;
}
declare const PincodeChecker: React.FC<PincodeCheckerProps>;

interface TrustBadgesProps {
    layout?: 'row' | 'grid';
    showCodBadge?: boolean;
    showReturnsBadge?: boolean;
    showSecureBadge?: boolean;
    showGenuineBadge?: boolean;
    className?: string;
}
declare const TrustBadges: React.FC<TrustBadgesProps>;

type OrderStage = 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';
interface OrderTimelineProps {
    currentStage: OrderStage;
    dates?: {
        placed?: string;
        confirmed?: string;
        shipped?: string;
        out_for_delivery?: string;
        delivered?: string;
    };
    className?: string;
}
declare const OrderTimeline: React.FC<OrderTimelineProps>;

interface StarRatingProps {
    rating: number;
    reviewCount?: number;
    size?: number;
    color?: string;
    showText?: boolean;
    className?: string;
}
declare const StarRating: React.FC<StarRatingProps>;

interface ProductGalleryProps {
    images: string[];
    title?: string;
    layout?: 'stacked' | 'thumbnails-bottom' | 'thumbnails-left';
    aspectRatio?: 'square' | 'portrait' | 'wide';
    enableZoom?: boolean;
    className?: string;
}
declare const ProductGallery: React.FC<ProductGalleryProps>;

interface VariantOption {
    id: string;
    name: string;
    value: string;
    colorHex?: string;
    priceDelta?: number;
    inStock?: boolean;
}
interface VariantGroup {
    name: string;
    type?: 'color' | 'chip' | 'dropdown';
    options: VariantOption[];
}
type SelectedVariants = Record<string, string>;
interface VariantSelectorProps {
    groups: VariantGroup[];
    selectedValues: SelectedVariants;
    onChange: (groupName: string, optionValue: string, option: VariantOption) => void;
    className?: string;
}
declare const VariantSelector: React.FC<VariantSelectorProps>;

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    brand?: string;
    rating?: number;
    reviewCount?: number;
    inStock?: boolean;
    stockUrgencyText?: string;
    isWishlisted?: boolean;
    onAddToCart?: () => void;
    onToggleWishlist?: () => void;
    onClick?: () => void;
    className?: string;
}
declare const ProductCard: React.FC<ProductCardProps>;

interface QuantitySelectorProps {
    value: number;
    onChange: (quantity: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}
declare const QuantitySelector: React.FC<QuantitySelectorProps>;

interface ReviewBreakdownItem {
    star: number;
    count: number;
}
interface ReviewBreakdownBarsProps {
    averageRating: number;
    totalReviews: number;
    breakdown: Record<number, number> | ReviewBreakdownItem[];
    onFilterByStar?: (star: number) => void;
    selectedStar?: number | null;
    className?: string;
}
declare const ReviewBreakdownBars: React.FC<ReviewBreakdownBarsProps>;

interface AnnouncementBarProps {
    messages: string[] | string;
    couponCode?: string;
    couponBadgeText?: string;
    linkUrl?: string;
    linkText?: string;
    closable?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    onClose?: () => void;
    className?: string;
}
declare const AnnouncementBar: React.FC<AnnouncementBarProps>;

interface NavLinkItem {
    label: string;
    href: string;
    badge?: string;
    isHighlight?: boolean;
}
interface NavbarProps {
    brandName?: string;
    logoUrl?: string;
    navLinks?: NavLinkItem[];
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    onSearchSubmit?: (val: string) => void;
    cartCount?: number;
    wishlistCount?: number;
    onCartClick?: () => void;
    onWishlistClick?: () => void;
    onAccountClick?: () => void;
    onLinkClick?: (href: string) => void;
    isLoggedIn?: boolean;
    userName?: string;
    sticky?: boolean;
    className?: string;
}
declare const Navbar: React.FC<NavbarProps>;

interface FooterColumn {
    title: string;
    links: Array<{
        label: string;
        href: string;
    }>;
}
interface FooterProps {
    brandName?: string;
    description?: string;
    columns?: FooterColumn[];
    onNewsletterSubmit?: (email: string) => void;
    showPaymentBadges?: boolean;
    copyrightYear?: number;
    className?: string;
}
declare const Footer: React.FC<FooterProps>;

interface MobileBottomBarItem {
    id: string;
    label: string;
    icon: 'home' | 'search' | 'categories' | 'wishlist' | 'cart' | 'account';
    badge?: number | string;
    href?: string;
}
interface MobileBottomBarProps {
    activeTab?: string;
    cartCount?: number;
    wishlistCount?: number;
    items?: MobileBottomBarItem[];
    onTabChange?: (tabId: string, href?: string) => void;
    className?: string;
}
declare const MobileBottomBar: React.FC<MobileBottomBarProps>;

interface LightningDealsBarProps {
    dealTitle?: string;
    endsAt: Date | string | number;
    percentageClaimed?: number;
    totalQuantity?: number;
    claimedQuantity?: number;
    badgeColor?: string;
    className?: string;
}
declare const LightningDealsBar: React.FC<LightningDealsBarProps>;

interface BundleItem {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    originalPrice?: number;
}
interface FrequentlyBoughtTogetherProps {
    mainProduct: BundleItem;
    suggestedItems: BundleItem[];
    bundleDiscountPercentage?: number;
    currencySymbol?: string;
    onAddBundleToCart?: (selectedItems: BundleItem[]) => void;
    className?: string;
}
declare const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps>;

interface BankOffer {
    id: string;
    type: 'instant' | 'emi' | 'cashback' | 'partner';
    title: string;
    description: string;
    code?: string;
    termsUrl?: string;
}
interface BankOffersAccordionProps {
    offers?: BankOffer[];
    className?: string;
}
declare const BankOffersAccordion: React.FC<BankOffersAccordionProps>;

interface AssuredBadgeProps {
    type?: 'assured' | 'prime' | 'supercoin';
    className?: string;
}
declare const AssuredBadge: React.FC<AssuredBadgeProps>;

interface DualMobileActionBarProps {
    price: number;
    compareAtPrice?: number;
    currencySymbol?: string;
    isWishlisted?: boolean;
    isInCart?: boolean;
    onAddToCart: () => void;
    onBuyNow: () => void;
    onToggleWishlist?: () => void;
    className?: string;
}
declare const DualMobileActionBar: React.FC<DualMobileActionBarProps>;

export { AnnouncementBar, type AnnouncementBarProps, AssuredBadge, type AssuredBadgeProps, type BankOffer, BankOffersAccordion, type BankOffersAccordionProps, type BundleItem, CartDrawer, type CartDrawerItem, type CartDrawerProps, DualMobileActionBar, type DualMobileActionBarProps, Footer, type FooterColumn, type FooterProps, FrequentlyBoughtTogether, type FrequentlyBoughtTogetherProps, LightningDealsBar, type LightningDealsBarProps, MobileBottomBar, type MobileBottomBarItem, type MobileBottomBarProps, type NavLinkItem, Navbar, type NavbarProps, type OrderStage, OrderTimeline, type OrderTimelineProps, type PincodeCheckResult, PincodeChecker, type PincodeCheckerProps, ProductCard, type ProductCardProps, ProductGallery, type ProductGalleryProps, QuantitySelector, type QuantitySelectorProps, ReviewBreakdownBars, type ReviewBreakdownBarsProps, type ReviewBreakdownItem, type SelectedVariants, StarRating, type StarRatingProps, StickyAddToCart, type StickyAddToCartProps, TrustBadges, type TrustBadgesProps, type VariantGroup, type VariantOption, VariantSelector, type VariantSelectorProps };
