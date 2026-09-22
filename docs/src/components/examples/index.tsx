import React, { useState } from 'react';
import { StorefrontExample } from './StorefrontExample';
import { DashboardExample } from './DashboardExample';
import { CheckoutExample } from './CheckoutExample';
import { AuthExample } from './AuthExample';
import { SettingsExample } from './SettingsExample';
import { 
  ShoppingBag, 
  LayoutDashboard, 
  CreditCard, 
  Lock, 
  Settings, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Code, 
  Copy, 
  Check,
  Sparkles
} from 'lucide-react';

interface ExamplesViewProps {
  onShowToast: (msg: string) => void;
}

type ExampleId = 'storefront' | 'dashboard' | 'checkout' | 'auth' | 'settings';

const EXAMPLES_META: {
  id: ExampleId;
  name: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  codeSnippet: string;
}[] = [
  {
    id: 'storefront',
    name: 'D2C Storefront (PDP)',
    badge: 'E-Commerce',
    icon: <ShoppingBag size={16} />,
    description: 'Complete high-converting product detail page with ProductGallery, live PincodeChecker, VariantSelector, BankOffers, FrequentlyBoughtTogether, and CartDrawer.',
    codeSnippet: `import React, { useState } from 'react';
import {
  Breadcrumb,
  ProductGallery,
  Price,
  VariantSelector,
  QuantitySelector,
  AssuredBadge,
  PincodeChecker,
  AddToCart,
  BankOffersAccordion,
  FrequentlyBoughtTogether,
  TrustBadges,
  ReviewBreakdownBars,
  CartDrawer,
} from '@boostengine/ui';

export function ProductDetailPage() {
  const [selectedVariants, setSelectedVariants] = useState({ Size: 'L', Color: 'Acid Black' });
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="storefront-page">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Oversized Tees' }]} />
      <div className="product-grid">
        <ProductGallery images={[/* images */]} />
        <div className="buy-box">
          <AssuredBadge type="assured" />
          <h1>Heavyweight Loopknit Oversized Tee</h1>
          <Price amount={1299} originalAmount={2499} size="xl" showDiscount />
          <VariantSelector
            groups={[{ name: 'Size', options: [{ id: 'S', label: 'S' }, { id: 'M', label: 'M' }, { id: 'L', label: 'L' }] }]}
            selectedValues={selectedVariants}
            onChange={(g, opt) => setSelectedVariants(prev => ({ ...prev, [g]: opt }))}
          />
          <AddToCart onAdd={() => setCartOpen(true)} />
          <PincodeChecker onCheck={async (pin) => ({ isServiceable: true, estimatedDeliveryDate: 'Thursday' })} />
          <BankOffersAccordion offers={[/* bank offers */]} />
        </div>
      </div>
      <FrequentlyBoughtTogether mainProduct={/* ... */} suggestedItems={/* ... */} />
    </div>
  );
}`
  },
  {
    id: 'dashboard',
    name: 'Merchant Dashboard',
    badge: 'Analytics',
    icon: <LayoutDashboard size={16} />,
    description: 'Executive revenue and fulfillment dashboard featuring live KPIWidgets, AreaChart gross sales trend, DonutChart payment mix, and shipment DataTable.',
    codeSnippet: `import React from 'react';
import {
  KPIWidget,
  AreaChart,
  DonutChart,
  DataTable,
  ActivityFeed,
  NotificationCenter,
  ExportButton,
} from '@boostengine/ui';

export function StoreDashboard() {
  return (
    <div className="dashboard-layout">
      <div className="kpi-grid">
        <KPIWidget title="GMV Revenue" value="₹28,45,200" change="+31.4%" subtitle="Net Sales" />
        <KPIWidget title="RTO Rate" value="3.2%" change="-1.8%" subtitle="Best in class" />
        <KPIWidget title="Orders" value="1,842" change="+14.2%" subtitle="2.1d TAT" />
      </div>
      <div className="charts-row">
        <AreaChart title="Gross Merchandise Value" data={[/* weekly data */]} color="#3b82f6" />
        <DonutChart title="Payment Methods" data={[/* upi, cod, cards */]} />
      </div>
      <DataTable columns={[/* columns */]} data={[/* live orders */]} />
      <ActivityFeed items={[/* logistics webhook updates */]} />
    </div>
  );
}`
  },
  {
    id: 'checkout',
    name: 'Express Checkout',
    badge: 'Conversion',
    icon: <CreditCard size={16} />,
    description: 'Step-by-step frictionless checkout with Stepper progress, AddressForm with Indian pincode validation, live CouponInput, and OrderSummary.',
    codeSnippet: `import React, { useState } from 'react';
import {
  Stepper,
  AddressForm,
  OrderSummary,
  CouponInput,
  BankOffersAccordion,
  ConfirmationDialog,
} from '@boostengine/ui';

export function CheckoutPage() {
  const [step, setStep] = useState(2);
  const [coupon, setCoupon] = useState('SAVE200');

  return (
    <div className="checkout-container">
      <Stepper currentStep={step} steps={[/* Cart, Address, Payment, Confirm */]} />
      <div className="checkout-columns">
        <AddressForm onSubmit={() => setStep(3)} />
        <div>
          <CouponInput appliedCode={coupon} onApply={setCoupon} />
          <OrderSummary subtotal={3498} discount={200} onCheckout={() => {/* process */}} />
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: 'auth',
    name: 'Authentication Portal',
    badge: 'Account',
    icon: <Lock size={16} />,
    description: 'Split-screen modern login, registration, and OTP password recovery suite with social proof testimonials and partner logos.',
    codeSnippet: `import React, { useState } from 'react';
import {
  LoginForm,
  RegisterForm,
  ForgotPassword,
  OTPInput,
  TestimonialCard,
} from '@boostengine/ui';

export function AuthPortal() {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

  return (
    <div className="auth-split-screen">
      <div className="brand-panel">
        <TestimonialCard quote="Fastest D2C checkout switch in India" author="Founder" />
      </div>
      <div className="form-card">
        {view === 'login' && <LoginForm onSubmit={/* ... */} />}
        {view === 'register' && <RegisterForm onSubmit={/* ... */} />}
        {view === 'forgot' && <OTPInput length={6} onComplete={/* ... */} />}
      </div>
    </div>
  );
}`
  },
  {
    id: 'settings',
    name: 'Store Settings',
    badge: 'Management',
    icon: <Settings size={16} />,
    description: 'Full store configuration with legal GSTIN fields, FileDropzone KYC document upload, ThemeToggle, and notification toggles.',
    codeSnippet: `import React, { useState } from 'react';
import {
  Input,
  Select,
  Textarea,
  Switch,
  FileDropzone,
  ThemeToggle,
  ConfirmationDialog,
} from '@boostengine/ui';

export function StoreSettingsPage() {
  const [gstin, setGstin] = useState('29ABCDE1234F1Z5');
  const [alerts, setAlerts] = useState(true);

  return (
    <div className="settings-page">
      <Input label="GSTIN Number" value={gstin} onChange={e => setGstin(e.target.value)} />
      <FileDropzone accept=".pdf,.png" onFilesSelected={files => {/* upload */}} />
      <ThemeToggle variant="segmented" />
      <Switch checked={alerts} onChange={setAlerts} label="WhatsApp Updates" />
    </div>
  );
}`
  }
];

export const ExamplesView: React.FC<ExamplesViewProps> = ({ onShowToast }) => {
  const [activeExample, setActiveExample] = useState<ExampleId>('storefront');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [canvasMode, setCanvasMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);

  const currentMeta = EXAMPLES_META.find(e => e.id === activeExample) || EXAMPLES_META[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentMeta.codeSnippet);
    setCopiedCode(true);
    onShowToast('Template code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const renderActiveExample = () => {
    switch (activeExample) {
      case 'storefront':
        return <StorefrontExample onShowToast={onShowToast} />;
      case 'dashboard':
        return <DashboardExample onShowToast={onShowToast} />;
      case 'checkout':
        return <CheckoutExample onShowToast={onShowToast} />;
      case 'auth':
        return <AuthExample onShowToast={onShowToast} />;
      case 'settings':
        return <SettingsExample onShowToast={onShowToast} />;
      default:
        return <StorefrontExample onShowToast={onShowToast} />;
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>
      {/* Top Title Banner */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ padding: '6px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', display: 'flex' }}>
            <Sparkles size={18} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Production Application Examples
          </h1>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            5 Full Templates
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim, #94a3b8)', maxWidth: '800px', lineHeight: 1.5 }}>
          Real-world, full-page application templates built with <code>@boostengine/ui</code>. Test responsive views, interact with live state, and copy complete layout code directly into your React / Next.js app.
        </p>
      </div>

      {/* Template Selector Pills */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border, #334155)'
      }}>
        {EXAMPLES_META.map((ex) => {
          const isActive = ex.id === activeExample;
          return (
            <button
              key={ex.id}
              onClick={() => {
                setActiveExample(ex.id);
                window.location.hash = `examples/${ex.id}`;
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: isActive ? '1px solid #6366f1' : '1px solid var(--border, #334155)',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#fff' : 'var(--text-dim, #94a3b8)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {ex.icon}
              <span>{ex.name}</span>
            </button>
          );
        })}
      </div>

      {/* Action Header: View Switcher (Preview vs Code) + Canvas Mode Switcher */}
      <div className="tabs-header" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={15} />
            <span>Interactive Template</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <Code size={15} />
            <span>Template Code</span>
          </button>
        </div>

        {activeTab === 'preview' && (
          <div className="canvas-mode-toggle">
            <button
              className={`mode-btn ${canvasMode === 'desktop' ? 'active' : ''}`}
              onClick={() => setCanvasMode('desktop')}
              title="Desktop View (Full Width)"
            >
              <Monitor size={15} />
            </button>
            <button
              className={`mode-btn ${canvasMode === 'tablet' ? 'active' : ''}`}
              onClick={() => setCanvasMode('tablet')}
              title="Tablet View (768px)"
            >
              <Tablet size={15} />
            </button>
            <button
              className={`mode-btn ${canvasMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setCanvasMode('mobile')}
              title="Mobile View (390px)"
            >
              <Smartphone size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Body */}
      {activeTab === 'preview' ? (
        <div className={`canvas-container ${canvasMode}`} style={{ minHeight: '600px', borderRadius: '16px', overflow: 'hidden' }}>
          <div className="canvas-content" style={{ padding: 0, overflow: 'auto' }}>
            {renderActiveExample()}
          </div>
        </div>
      ) : (
        <div className="code-block-container">
          <div className="code-header">
            <span>React + @boostengine/ui Page Code ({currentMeta.name})</span>
            <button
              className="copy-btn"
              onClick={handleCopyCode}
            >
              {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copied' : 'Copy Template'}</span>
            </button>
          </div>
          <pre className="code-content">
            <code>{currentMeta.codeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
