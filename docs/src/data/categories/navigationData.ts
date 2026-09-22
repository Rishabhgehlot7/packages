import { UIComponentItem } from '../../types';

export const navigationData: UIComponentItem[] = [
  {
    id: 'Header',
    name: 'Header',
    category: 'navigation',
    description: 'Clean site header with brand logo, navigation links, and right-side action buttons.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add header',
    codeSnippet: `import { Header, Button } from '@boostengine/ui';

export function AppHeader() {
  return (
    <Header
      logo={<strong>BOOST</strong>}
      links={[
        { label: 'Shop', href: '/shop' },
        { label: 'About', href: '/about' }
      ]}
      actions={<Button size="sm">Sign In</Button>}
    />
  );
}`,
    props: [
      { name: 'logo', type: 'ReactNode', default: 'undefined', description: 'Brand element or image' }
    ]
  },
  {
    id: 'Navbar',
    name: 'Navbar',
    category: 'navigation',
    description: 'Full-featured responsive eCommerce navbar with search input, cart counter, wishlist icon, and sticky positioning.',
    badge: 'Essential',
    cliCommand: 'npx boost-ui add navbar',
    codeSnippet: `import { Navbar } from '@boostengine/ui';

export function MainNavbar() {
  return (
    <Navbar
      brandName="MYSTORE"
      cartCount={3}
      wishlistCount={2}
      onCartClick={() => console.log('Open Cart')}
    />
  );
}`,
    props: [
      { name: 'cartCount', type: 'number', default: '0', description: 'Cart badge number' }
    ]
  },
  {
    id: 'Sidebar',
    name: 'Sidebar',
    category: 'navigation',
    description: 'Collapsible side navigation drawer with grouped links, icons, and counter badges.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add sidebar',
    codeSnippet: `import { Sidebar } from '@boostengine/ui';

export function DashboardSidebar() {
  return (
    <Sidebar
      activeId="orders"
      groups={[
        {
          title: 'Store',
          items: [
            { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
            { id: 'orders', label: 'Orders', href: '/orders', badge: '12' }
          ]
        }
      ]}
    />
  );
}`,
    props: [
      { name: 'groups', type: 'SidebarGroup[]', default: '[]', description: 'Grouped navigation links' }
    ]
  },
  {
    id: 'Footer',
    name: 'Footer',
    category: 'navigation',
    description: 'Multi-column website footer with newsletter signup, link columns, social media SVGs, and payment badges.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add footer',
    codeSnippet: `import { Footer } from '@boostengine/ui';

export function SiteFooter() {
  return (
    <Footer
      brandName="Boost Engine"
      description="Modern commerce infrastructure."
    />
  );
}`,
    props: [
      { name: 'brandName', type: 'string', default: "''", description: 'Company name' }
    ]
  },
  {
    id: 'MobileBottomBar',
    name: 'MobileBottomBar',
    category: 'navigation',
    description: 'Fixed bottom bar with quick action buttons, price preview, and shopping bag triggers for mobile browsers.',
    badge: 'Mobile',
    cliCommand: 'npx boost-ui add mobile-bottom-bar',
    codeSnippet: `import { MobileBottomBar, Button } from '@boostengine/ui';

export function BottomActions() {
  return (
    <MobileBottomBar
      leftAction={<Button variant="outline">Save</Button>}
      rightAction={<Button variant="primary">Buy Now</Button>}
    />
  );
}`,
    props: [
      { name: 'leftAction', type: 'React.ReactNode', default: 'undefined', description: 'Secondary button or content' },
      { name: 'rightAction', type: 'React.ReactNode', default: 'undefined', description: 'Primary action button' }
    ]
  },
  {
    id: 'MobileBottomNav',
    name: 'MobileBottomNav',
    category: 'navigation',
    description: 'Fixed bottom tab bar tailored for smartphone viewports with active highlights and badge counts.',
    badge: 'Mobile',
    cliCommand: 'npx boost-ui add mobile-bottom-nav',
    codeSnippet: `import { MobileBottomNav } from '@boostengine/ui';
import { useState } from 'react';

export function MobileNavigation() {
  const [active, setActive] = useState('home');
  return (
    <MobileBottomNav
      activeId={active}
      onChange={setActive}
      items={[
        { id: 'home', label: 'Home' },
        { id: 'search', label: 'Search' },
        { id: 'cart', label: 'Cart', badge: 3 },
        { id: 'profile', label: 'Profile' }
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'MobileBottomNavItem[]', default: '[]', description: 'Navigation tabs array' }
    ]
  },
  {
    id: 'Breadcrumb',
    name: 'Breadcrumb',
    category: 'navigation',
    description: 'Hierarchical navigation path with SVG separators and accessibility schema metadata.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add breadcrumb',
    codeSnippet: `import { Breadcrumb } from '@boostengine/ui';

export function ProductPath() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Clothing', href: '/clothing' },
        { label: 'T-Shirts' }
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'BreadcrumbItem[]', default: '[]', description: 'List of path steps' }
    ]
  },
  {
    id: 'Container',
    name: 'Container',
    category: 'navigation',
    description: 'Centered responsive layout wrapper with max-width boundaries and padding presets.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add container',
    codeSnippet: `import { Container } from '@boostengine/ui';

export function PageSection() {
  return (
    <Container maxWidth="lg">
      <h1>Content goes here</h1>
    </Container>
  );
}`,
    props: [
      { name: 'maxWidth', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'lg'", description: 'Horizontal boundary limit' }
    ]
  },
  {
    id: 'PageWrapper',
    name: 'PageWrapper',
    category: 'navigation',
    description: 'Application layout scaffold that integrates header, sidebar, main content area, and footer.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add page-wrapper',
    codeSnippet: `import { PageWrapper } from '@boostengine/ui';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper>
      {children}
    </PageWrapper>
  );
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Inner page content' }
    ]
  },
  {
    id: 'NavLink',
    name: 'NavLink',
    category: 'navigation',
    description: 'Navigation link with automatic active route styling, hover transitions, and badge support.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add nav-link',
    codeSnippet: `import { NavLink } from '@boostengine/ui';

export function Links() {
  return (
    <NavLink href="/orders" active badge="5">
      My Orders
    </NavLink>
  );
}`,
    props: [
      { name: 'active', type: 'boolean', default: 'false', description: 'Active route highlight state' }
    ]
  },
  {
    id: 'DropdownMenu',
    name: 'DropdownMenu',
    category: 'navigation',
    description: 'Menu flyout displaying options, dividers, and actions when triggered.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add dropdown-menu',
    codeSnippet: `import { DropdownMenu, Button } from '@boostengine/ui';

export function UserActions() {
  return (
    <DropdownMenu
      trigger={<Button variant="outline">My Account</Button>}
      items={[
        { label: 'Profile', onClick: () => console.log('Profile') },
        { label: 'Orders', onClick: () => console.log('Orders') },
        { label: 'Logout', destructive: true, onClick: () => console.log('Logout') }
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'DropdownMenuItem[]', default: '[]', description: 'Array of actionable menu items' }
    ]
  },
  {
    id: 'MegaMenu',
    name: 'MegaMenu',
    category: 'navigation',
    description: 'Multi-column expander menu for large eCommerce catalog category hierarchies.',
    badge: 'Advanced',
    cliCommand: 'npx boost-ui add mega-menu',
    codeSnippet: `import { MegaMenu } from '@boostengine/ui';

export function CategoryMegaMenu() {
  return (
    <MegaMenu
      categories={[
        {
          id: 'men',
          label: 'Men',
          columns: [
            {
              title: 'Topwear',
              links: [{ label: 'T-Shirts', href: '/men/tshirts' }, { label: 'Shirts', href: '/men/shirts' }]
            }
          ]
        }
      ]}
    />
  );
}`,
    props: [
      { name: 'categories', type: 'MegaMenuCategory[]', default: '[]', description: 'Multi-column category tree' }
    ]
  },
  {
    id: 'Pagination',
    name: 'Pagination',
    category: 'navigation',
    description: 'Page selector controls with previous/next arrows, active page indicators, and smart ellipsis.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add pagination',
    codeSnippet: `import { Pagination } from '@boostengine/ui';
import { useState } from 'react';

export function ProductPagination() {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      currentPage={page}
      totalPages={10}
      onPageChange={setPage}
    />
  );
}`,
    props: [
      { name: 'currentPage', type: 'number', default: '1', description: 'Currently active page' },
      { name: 'totalPages', type: 'number', default: '1', description: 'Total count of available pages' }
    ]
  },
  {
    id: 'Tabs',
    name: 'Tabs',
    category: 'navigation',
    description: 'Accessible tab switcher with pill or underline indicator styles and keyboard navigation.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add tabs',
    codeSnippet: `import { Tabs } from '@boostengine/ui';
import { useState } from 'react';

export function ProductDetailsTabs() {
  const [tab, setTab] = useState('description');
  return (
    <Tabs
      activeId={tab}
      onChange={setTab}
      items={[
        { id: 'description', label: 'Description', content: <div>100% combed organic cotton.</div> },
        { id: 'reviews', label: 'Reviews', content: <div>Customer reviews here</div> }
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'TabItem[]', default: '[]', description: 'Array of tabs and panels' }
    ]
  },
  {
    id: 'Stepper',
    name: 'Stepper',
    category: 'navigation',
    description: 'Multi-step progress indicator for checkout wizards and onboarding steps.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add stepper',
    codeSnippet: `import { Stepper } from '@boostengine/ui';

export function CheckoutSteps() {
  return (
    <Stepper
      currentStep={2}
      steps={[
        { id: 'cart', label: 'Cart' },
        { id: 'address', label: 'Delivery Address' },
        { id: 'payment', label: 'Payment' }
      ]}
    />
  );
}`,
    props: [
      { name: 'currentStep', type: 'number', default: '1', description: '1-indexed active step number' }
    ]
  },
  {
    id: 'BackButton',
    name: 'BackButton',
    category: 'navigation',
    description: 'Navigation back button with SVG left arrow and customizable history action.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add back-button',
    codeSnippet: `import { BackButton } from '@boostengine/ui';

export function SubPage() {
  return <BackButton label="Back to catalog" />;
}`,
    props: [
      { name: 'label', type: 'string', default: "'Back'", description: 'Button text label' }
    ]
  }
];
