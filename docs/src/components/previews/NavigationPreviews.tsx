import React, { useState } from 'react';
import {
  Header,
  Navbar as StoreNavbar,
  Sidebar as StoreSidebar,
  Footer as StoreFooter,
  MobileBottomBar,
  MobileBottomNav,
  Breadcrumb,
  Container,
  PageWrapper,
  NavLink,
  DropdownMenu,
  MegaMenu,
  Pagination,
  Tabs,
  Stepper,
  BackButton,
  Button,
} from '@boostengine/ui';

interface PreviewProps {
  onShowToast: (msg: string) => void;
}

export const HeaderPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ border: '1px solid var(--boost-border, rgba(255, 255, 255, 0.1))', borderRadius: '12px', overflow: 'hidden', width: '100%', background: 'var(--boost-bg, #0f172a)' }}>
    <Header
      logo={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '14px' }}>B</div>
          <strong style={{ letterSpacing: '0.5px', fontSize: '15px' }}>BOOST ENGINE</strong>
        </div>
      }
      brandBadge="PRO"
      activeHref="/shop"
      links={[
        { label: 'Shop', href: '/shop', badge: 'Hot' },
        { label: 'New Arrivals', href: '/new' },
        { label: 'Collections', href: '/collections' },
        { label: 'Deals', href: '/deals' }
      ]}
      searchBar={
        <div style={{ position: 'relative', width: '220px' }}>
          <input
            type="text"
            placeholder="Search store..."
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              borderRadius: '8px',
              border: '1px solid var(--boost-border, #334155)',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--boost-text, #f8fafc)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <svg style={{ position: 'absolute', left: '10px', top: '9px', width: '14px', height: '14px', color: '#94a3b8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      }
      actions={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button size="sm" variant="outline" onClick={() => onShowToast('Sign in clicked')}>Sign In</Button>
          <Button size="sm" onClick={() => onShowToast('Get Started clicked')}>Get Started</Button>
        </div>
      }
      onLinkClick={(href) => {
        onShowToast(`Navigated to: ${href}`);
      }}
    />
  </div>
);

export const NavbarPreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  return (
    <div style={{ border: '1px solid var(--boost-border, rgba(255, 255, 255, 0.1))', borderRadius: '12px', overflow: 'hidden', width: '100%', background: 'var(--boost-bg, #0f172a)' }}>
      <StoreNavbar
        brandName="BOOSTSTORE"
        brandBadge="OFFICIAL"
        cartCount={3}
        wishlistCount={2}
        showSearch={true}
        onCartClick={() => onShowToast('Cart opened')}
        onWishlistClick={() => onShowToast('Wishlist opened')}
        onSearchSubmit={(query) => onShowToast(`Searching: ${query}`)}
        actions={
          <Button size="sm" variant="ghost" onClick={() => onShowToast('Profile menu opened')}>Account</Button>
        }
      />
    </div>
  );
};

export const SidebarPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '260px', border: '1px solid var(--boost-border, rgba(255, 255, 255, 0.1))', borderRadius: '8px', overflow: 'hidden' }}>
    <StoreSidebar
      activeId="orders"
      groups={[
        {
          title: 'Store Management',
          items: [
            { id: 'overview', label: 'Overview' },
            { id: 'orders', label: 'Orders', badge: '5 New' },
            { id: 'products', label: 'Inventory' },
            { id: 'analytics', label: 'Analytics' }
          ]
        }
      ]}
    />
  </div>
);

export const FooterPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ border: '1px solid var(--boost-border, rgba(255, 255, 255, 0.1))', borderRadius: '12px', overflow: 'hidden', width: '100%' }}>
    <StoreFooter
      brandName="Boost Engine Commerce"
      brandBadge="ENTERPRISE"
      description="High-performance eCommerce UI engineering for modern digital retailers and D2C brands worldwide."
      newsletter={true}
      onNewsletterSubmit={(email) => onShowToast(`Subscribed: ${email}`)}
      socialLinks={[
        { platform: 'twitter', href: 'https://twitter.com' },
        { platform: 'instagram', href: 'https://instagram.com' },
        { platform: 'youtube', href: 'https://youtube.com' }
      ]}
      bottomLinks={[
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Security & SLA', href: '#security' }
      ]}
    />
  </div>
);

export const MobileBottomNavPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%' }}>
    <div style={{ position: 'relative', height: '80px', width: '100%', maxWidth: '390px', margin: '0 auto', border: '1px solid var(--boost-border, #334155)', borderRadius: '20px', overflow: 'hidden', background: 'var(--boost-surface, #1e293b)', boxShadow: '0 12px 36px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
      <MobileBottomNav
        variant="glass"
        defaultActiveId="home"
        items={[
          { id: 'home', label: 'Home' },
          { id: 'catalog', label: 'Catalog' },
          { id: 'cart', label: 'Cart', badge: 3 },
          { id: 'account', label: 'Account' }
        ]}
        onChange={(id) => onShowToast(`Active Tab: ${id}`)}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%' }}
      />
    </div>
    <div style={{ fontSize: '12px', color: 'var(--boost-text-muted, #94a3b8)' }}>
      Interactive live demo — tap any icon above to switch tabs with smooth active animations.
    </div>
  </div>
);

export const MobileBottomBarPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%' }}>
    <div style={{ position: 'relative', height: '80px', width: '100%', maxWidth: '390px', margin: '0 auto', border: '1px solid var(--boost-border, #334155)', borderRadius: '20px', overflow: 'hidden', background: 'var(--boost-surface, #1e293b)', boxShadow: '0 12px 36px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
      <MobileBottomBar
        variant="floating"
        defaultActiveTab="home"
        cartCount={4}
        wishlistCount={2}
        onTabChange={(tab) => onShowToast(`Switched to: ${tab}`)}
        style={{ position: 'absolute', bottom: '6px', left: '12px', right: '12px' }}
      />
    </div>
    <div style={{ fontSize: '12px', color: 'var(--boost-text-muted, #94a3b8)' }}>
      Floating Pill Variant with internal tab persistence & animated indicators.
    </div>
  </div>
);

export const BreadcrumbPreview: React.FC<PreviewProps> = () => (
  <Breadcrumb
    items={[
      { label: 'Home', href: '/' },
      { label: 'Apparel', href: '/apparel' },
      { label: 'Oversized Tees' }
    ]}
  />
);

export const ContainerPreview: React.FC<PreviewProps> = () => (
  <Container maxWidth="md" style={{ backgroundColor: 'var(--boost-surface, #1e293b)', padding: '20px', borderRadius: '8px', border: '1px dashed var(--boost-border, #475569)' }}>
    <span style={{ fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>Responsive bounded container (max-width: md)</span>
  </Container>
);

export const PageWrapperPreview: React.FC<PreviewProps> = () => (
  <PageWrapper style={{ border: '1px solid var(--boost-border, rgba(255, 255, 255, 0.1))', borderRadius: '8px', padding: '16px' }}>
    <span style={{ fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>App scaffold wrapper preview</span>
  </PageWrapper>
);

export const NavLinkPreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'flex', gap: '16px' }}>
    <NavLink href="#preview" active badge="3">Orders</NavLink>
    <NavLink href="#preview">Wishlist</NavLink>
    <NavLink href="#preview">Saved Cards</NavLink>
  </div>
);

export const DropdownMenuPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <DropdownMenu
    trigger={<Button variant="outline">My Account</Button>}
    items={[
      { label: 'Profile Details', onClick: () => onShowToast('Profile clicked') },
      { label: 'Order History', onClick: () => onShowToast('Orders clicked') },
      { label: 'Sign Out', destructive: true, onClick: () => onShowToast('Sign out clicked') }
    ]}
  />
);

export const MegaMenuPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ border: '1px solid var(--boost-border, rgba(255, 255, 255, 0.1))', borderRadius: '12px', minHeight: '400px', width: '100%', padding: '16px', background: 'var(--boost-bg, #0f172a)', containerType: 'inline-size' }}>
    <div style={{ marginBottom: '14px', fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>
      Interactive MegaMenu (click or hover categories to reveal multi-column flyout with banner):
    </div>
    <MegaMenu
      categories={[
        {
          id: 'men',
          label: 'Men',
          columns: [
            {
              title: 'Topwear',
              links: [
                { label: 'T-Shirts & Polos', href: '#tshirts', badge: 'Hot' },
                { label: 'Casual Shirts', href: '#shirts' },
                { label: 'Hoodies & Sweatshirts', href: '#hoodies' }
              ]
            },
            {
              title: 'Bottomwear',
              links: [
                { label: 'Denim Jeans', href: '#jeans' },
                { label: 'Cargo Pants', href: '#cargos' },
                { label: 'Trackpants & Joggers', href: '#joggers' }
              ]
            },
            {
              title: 'Footwear & Accessories',
              links: [
                { label: 'Sneakers & High-Tops', href: '#sneakers' },
                { label: 'Wallets & Belts', href: '#accessories' },
                { label: 'Caps & Beanies', href: '#caps' }
              ]
            }
          ]
        },
        {
          id: 'women',
          label: 'Women',
          columns: [
            {
              title: 'Western Wear',
              links: [
                { label: 'Dresses & Jumpsuits', href: '#dresses' },
                { label: 'Tops, Tees & Bodysuits', href: '#tops', badge: 'Sale' },
                { label: 'Jackets & Blazers', href: '#jackets' }
              ]
            },
            {
              title: 'Ethnic & Fusion',
              links: [
                { label: 'Kurta Sets', href: '#kurtas' },
                { label: 'Sarees & Lehengas', href: '#sarees' }
              ]
            }
          ]
        },
        {
          id: 'accessories',
          label: 'Accessories',
          columns: [
            {
              title: 'Eyewear & Watches',
              links: [
                { label: 'Polarized Sunglasses', href: '#sunglasses' },
                { label: 'Chronograph Watches', href: '#watches' }
              ]
            },
            {
              title: 'Bags & Luggage',
              links: [
                { label: 'Leather Backpacks', href: '#backpacks' },
                { label: 'Weekender Duffles', href: '#duffles' }
              ]
            }
          ]
        }
      ]}
      onLinkClick={(link) => {
        onShowToast(`Clicked: ${link.label}`);
      }}
    />
  </div>
);

export const PaginationPreview: React.FC<PreviewProps> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={8}
      onPageChange={setCurrentPage}
    />
  );
};

export const TabsPreview: React.FC<PreviewProps> = () => {
  const [activeTab, setActiveTab] = useState('description');
  return (
    <div style={{ maxWidth: '440px' }}>
      <Tabs
        activeId={activeTab}
        onChange={setActiveTab}
        items={[
          { id: 'description', label: 'Product Specs', content: <div style={{ fontSize: '13px', color: '#475569' }}>Crafted with 240 GSM pre-shrunk organic loopknit cotton.</div> },
          { id: 'shipping', label: 'Shipping & Delivery', content: <div style={{ fontSize: '13px', color: '#475569' }}>Dispatched within 24 hours. Estimated delivery: 2-3 business days.</div> },
          { id: 'care', label: 'Wash Care', content: <div style={{ fontSize: '13px', color: '#475569' }}>Machine wash cold inside-out with like colors. Do not iron print directly.</div> }
        ]}
      />
    </div>
  );
};

export const StepperPreview: React.FC<PreviewProps> = () => {
  const [currentStep, setCurrentStep] = useState(2);
  return (
    <div style={{ maxWidth: '500px' }}>
      <Stepper
        currentStep={currentStep}
        steps={[
          { id: 'cart', label: 'Cart Review' },
          { id: 'shipping', label: 'Delivery Address' },
          { id: 'payment', label: 'Payment' },
          { id: 'confirmed', label: 'Confirmation' }
        ]}
      />
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}>Previous Step</Button>
        <Button size="sm" onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}>Next Step</Button>
      </div>
    </div>
  );
};

export const BackButtonPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <BackButton label="Back to Product Catalog" onClick={() => onShowToast('Back clicked')} />
);

export const NavigationPreviews: React.FC<{ componentId: string; onShowToast: (msg: string) => void }> = ({
  componentId,
  onShowToast,
}) => {
  switch (componentId) {
    case 'Header': return <HeaderPreview onShowToast={onShowToast} />;
    case 'Navbar': return <NavbarPreview onShowToast={onShowToast} />;
    case 'Sidebar': return <SidebarPreview onShowToast={onShowToast} />;
    case 'Footer': return <FooterPreview onShowToast={onShowToast} />;
    case 'MobileBottomNav': return <MobileBottomNavPreview onShowToast={onShowToast} />;
    case 'MobileBottomBar': return <MobileBottomBarPreview onShowToast={onShowToast} />;
    case 'Breadcrumb': return <BreadcrumbPreview onShowToast={onShowToast} />;
    case 'Container': return <ContainerPreview onShowToast={onShowToast} />;
    case 'PageWrapper': return <PageWrapperPreview onShowToast={onShowToast} />;
    case 'NavLink': return <NavLinkPreview onShowToast={onShowToast} />;
    case 'DropdownMenu': return <DropdownMenuPreview onShowToast={onShowToast} />;
    case 'MegaMenu': return <MegaMenuPreview onShowToast={onShowToast} />;
    case 'Pagination': return <PaginationPreview onShowToast={onShowToast} />;
    case 'Tabs': return <TabsPreview onShowToast={onShowToast} />;
    case 'Stepper': return <StepperPreview onShowToast={onShowToast} />;
    case 'BackButton': return <BackButtonPreview onShowToast={onShowToast} />;
    default: return null;
  }
};
