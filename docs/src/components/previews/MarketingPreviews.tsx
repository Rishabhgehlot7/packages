import React, { useState } from 'react';
import {
  HeroSection,
  FeatureGrid,
  PricingTable,
  TestimonialCard,
  FAQSection,
  LogoCloud,
  CTASection,
} from '@boostengine/ui';

interface PreviewProps {
  onShowToast: (msg: string) => void;
}

export const HeroSectionPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(11, 15, 25, 0.9) 100%)' }}>
    <HeroSection
      badge="⚡ v1.4.1 Live on NPM"
      title={
        <span>
          Build High-Converting{' '}
          <span style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            D2C Stores
          </span>{' '}
          Faster
        </span>
      }
      description="The 10-minute decoupled eCommerce suite for India & global brands with unified payments, GST calculation, and native tracking."
      primaryAction={{ label: 'Get Started Now', onClick: () => onShowToast('Starting Setup...') }}
      secondaryAction={{ label: 'Explore Components', onClick: () => onShowToast('Browsing Catalog...') }}
      align="center"
    />
  </div>
);

export const FeatureGridPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%' }}>
    <FeatureGrid
      columns={3}
      features={[
        { title: 'Zero Bloat', description: 'Zero third-party icon libraries, pure inline SVGs, and sub-5KB chunks.' },
        { title: 'Payment Switch', description: 'One single unified API for Razorpay, PhonePe, Cashfree, Paytm & COD.' },
        { title: 'Indian GST Engine', description: 'Real-time intra-state (CGST+SGST) vs inter-state (IGST) calculation.' }
      ]}
    />
  </div>
);

export const PricingTablePreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  const [annualPricing, setAnnualPricing] = useState(false);
  return (
    <div style={{ width: '100%' }}>
      <PricingTable
        billingCycle={annualPricing ? 'annual' : 'monthly'}
        onBillingCycleChange={(cycle) => setAnnualPricing(cycle === 'annual')}
        tiers={[
          {
            id: 'starter',
            name: 'Starter D2C',
            priceMonthly: 1999,
            priceAnnual: 1499,
            currency: '₹',
            description: 'For growing creators and emerging direct-to-consumer brands.',
            features: [
              { text: 'Up to 1,000 orders/month', included: true },
              { text: 'Razorpay & PhonePe Gateways', included: true },
              { text: 'Automatic GST Invoices', included: true },
              { text: 'Custom Domain & SSL', included: false }
            ],
            ctaText: 'Start Free 14-Day Trial',
            onSelect: () => onShowToast('Selected Starter Plan')
          },
          {
            id: 'scale',
            name: 'Hyper-Scale',
            isPopular: true,
            priceMonthly: 4999,
            priceAnnual: 3999,
            currency: '₹',
            description: 'For high-volume retail stores demanding 99.99% uptime.',
            features: [
              { text: 'Unlimited monthly orders', included: true },
              { text: 'RTO & NDR Automated Shield', included: true },
              { text: 'Shiprocket & Delhivery Auto-Sync', included: true },
              { text: 'Priority 24/7 Slack Support', included: true }
            ],
            ctaText: 'Upgrade to Hyper-Scale',
            onSelect: () => onShowToast('Selected Hyper-Scale Plan')
          }
        ]}
      />
    </div>
  );
};

export const TestimonialCardPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '520px' }}>
    <TestimonialCard
      quote="BoostEngine saved us over ₹4,50,000 in monthly Shopify app subscriptions. Our checkout load time dropped from 3.8s down to 0.4s."
      author="Vikramaditya Rathore"
      role="Head of Engineering"
      company="Kashmir Silk Co."
      rating={5}
    />
  </div>
);

export const FAQSectionPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '720px' }}>
    <FAQSection
      title="Frequently Asked Questions"
      subtitle="Quick answers about setup, performance, and Indian logistics integrations."
      items={[
        {
          question: 'Is @boostengine/ui compatible with Next.js 14 and 15?',
          answer: 'Yes! All 125+ components are SSR-safe and fully verified on Next.js 14/15 App Router, React 18 & 19, and Vite.'
        },
        {
          question: 'Does it support dark mode and custom brand tokens?',
          answer: 'Yes! Wrap your application in <BoostProvider defaultMode="dark">. All components use clean CSS custom properties that you can customize.'
        },
        {
          question: 'How does the Indian Pincode & GST engine work?',
          answer: 'The library contains pre-compiled HSN/SAC databases and validates India Post serviceability without external API latencies.'
        }
      ]}
    />
  </div>
);

export const LogoCloudPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '780px' }}>
    <LogoCloud
      title="POWERING INDIA'S FASTEST-GROWING D2C BRANDS"
      logos={[
        {
          name: 'Razorpay',
          logo: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>Razorpay</span>
            </div>
          )
        },
        {
          name: 'PhonePe',
          logo: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#7c3aed"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M12 7v10M8 11h8" stroke="#fff" strokeWidth="2.5"/></svg>
              <span>PhonePe</span>
            </div>
          )
        },
        {
          name: 'Shiprocket',
          logo: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#a855f7"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <span>Shiprocket</span>
            </div>
          )
        },
        {
          name: 'Delhivery',
          logo: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444"><rect width="20" height="14" x="2" y="5" rx="3"/><path d="M16 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
              <span>Delhivery</span>
            </div>
          )
        },
        {
          name: 'Cashfree',
          logo: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#10b981"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2.5"/></svg>
              <span>Cashfree</span>
            </div>
          )
        }
      ]}
    />
  </div>
);

export const CTASectionPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%' }}>
    <CTASection
      title="Ready to Build Your Dream Storefront?"
      description="Install @boostengine/ui and start shipping production features in less than 5 minutes."
      primaryAction={{ label: 'npm i @boostengine/ui', onClick: () => onShowToast('npm i @boostengine/ui copied!') }}
      secondaryAction={{ label: 'View Source on GitHub', onClick: () => onShowToast('Redirecting...') }}
      variant="gradient"
    />
  </div>
);

export const MarketingPreviews: React.FC<{ componentId: string; onShowToast: (msg: string) => void }> = ({
  componentId,
  onShowToast,
}) => {
  switch (componentId) {
    case 'HeroSection': return <HeroSectionPreview onShowToast={onShowToast} />;
    case 'FeatureGrid': return <FeatureGridPreview onShowToast={onShowToast} />;
    case 'PricingTable': return <PricingTablePreview onShowToast={onShowToast} />;
    case 'TestimonialCard': return <TestimonialCardPreview onShowToast={onShowToast} />;
    case 'FAQSection': return <FAQSectionPreview onShowToast={onShowToast} />;
    case 'LogoCloud': return <LogoCloudPreview onShowToast={onShowToast} />;
    case 'CTASection': return <CTASectionPreview onShowToast={onShowToast} />;
    default: return null;
  }
};
