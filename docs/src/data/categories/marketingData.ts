import { UIComponentItem } from '../../types';

export const marketingData: UIComponentItem[] = [
  {
    id: 'HeroSection',
    name: 'HeroSection',
    category: 'marketing',
    description: 'High-converting hero banner with bold headline, dynamic action buttons, trust metrics, and optional badge.',
    badge: 'Marketing',
    cliCommand: 'npx boost-ui add hero-section',
    codeSnippet: `import { HeroSection } from '@boostengine/ui';

export function LandingHero() {
  return (
    <HeroSection
      badge="⚡ Next-Gen Architecture"
      title="Build 10x Faster D2C Stores"
      subtitle="Assemble production-grade eCommerce storefronts in minutes with zero bloat and native Indian payment rails."
      primaryAction={{ label: 'Start Free Trial', href: '#trial' }}
      secondaryAction={{ label: 'Live Demo', href: '#demo' }}
      align="center"
    />
  );
}`,
    props: [
      { name: 'title', type: 'string', default: "''", description: 'Main hero headline' },
      { name: 'subtitle', type: 'string', default: "''", description: 'Supporting subheadline or lead text' },
      { name: 'badge', type: 'string', default: 'undefined', description: 'Top announcement badge or tag' },
      { name: 'primaryAction', type: 'HeroAction', default: 'undefined', description: 'Primary CTA button (label, href, onClick)' },
      { name: 'secondaryAction', type: 'HeroAction', default: 'undefined', description: 'Secondary ghost or outline CTA button' },
      { name: 'align', type: "'left' | 'center'", default: "'center'", description: 'Content text alignment' }
    ]
  },
  {
    id: 'FeatureGrid',
    name: 'FeatureGrid',
    category: 'marketing',
    description: 'Responsive multi-column showcase grid for product capabilities, USPs, and feature highlights.',
    badge: 'Marketing',
    cliCommand: 'npx boost-ui add feature-grid',
    codeSnippet: `import { FeatureGrid } from '@boostengine/ui';

export function Features() {
  return (
    <FeatureGrid
      title="Engineered for Performance"
      subtitle="Every micro-package is decoupled, tree-shakable, and fully accessible."
      columns={3}
      features={[
        { title: 'Zero Bloat', description: 'Pure inline SVGs, zero runtime icon dependencies, sub-5KB chunks.' },
        { title: 'Unified Pay Switch', description: 'Razorpay, PhonePe, Cashfree, and COD with 1 single API.' },
        { title: 'India-First Tax', description: 'Native CGST + SGST vs IGST engine with real-time HSN validation.' }
      ]}
    />
  );
}`,
    props: [
      { name: 'title', type: 'string', default: "''", description: 'Section title' },
      { name: 'subtitle', type: 'string', default: "''", description: 'Section subtitle' },
      { name: 'features', type: 'FeatureItem[]', default: '[]', description: 'Array of feature items (title, description, icon)' },
      { name: 'columns', type: '2 | 3 | 4', default: '3', description: 'Grid column count on desktop view' }
    ]
  },
  {
    id: 'PricingTable',
    name: 'PricingTable',
    category: 'marketing',
    description: 'Interactive SaaS and subscription pricing matrix with monthly/annual toggle and popular tier highlighting.',
    badge: 'Marketing',
    cliCommand: 'npx boost-ui add pricing-table',
    codeSnippet: `import { PricingTable } from '@boostengine/ui';
import { useState } from 'react';

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <PricingTable
      title="Simple, Transparent Pricing"
      subtitle="No hidden transaction fees. Cancel anytime."
      annualBilling={annual}
      onBillingToggle={setAnnual}
      tiers={[
        {
          id: 'starter',
          name: 'Starter',
          price: annual ? '₹1,999' : '₹2,499',
          period: '/month',
          description: 'Perfect for new D2C brands launching online.',
          features: [
            { text: 'Up to 500 orders/mo', included: true },
            { text: 'Razorpay & PhonePe Gateway', included: true },
            { text: 'Automated GST Invoices', included: true },
            { text: 'Dedicated Account Manager', included: false }
          ],
          ctaText: 'Get Started'
        },
        {
          id: 'growth',
          name: 'Growth',
          popular: true,
          price: annual ? '₹4,999' : '₹5,999',
          period: '/month',
          description: 'For rapidly scaling eCommerce brands.',
          features: [
            { text: 'Unlimited orders', included: true },
            { text: 'Automated NDR & RTO Shield', included: true },
            { text: 'Custom Domain & Checkout', included: true },
            { text: 'Dedicated Account Manager', included: true }
          ],
          ctaText: 'Upgrade to Growth'
        }
      ]}
    />
  );
}`,
    props: [
      { name: 'tiers', type: 'PricingTier[]', default: '[]', description: 'List of pricing plans and tiers' },
      { name: 'annualBilling', type: 'boolean', default: 'false', description: 'Annual vs Monthly billing toggle state' },
      { name: 'onBillingToggle', type: '(annual: boolean) => void', default: 'undefined', description: 'Handler for billing cycle toggle' },
      { name: 'onSelectTier', type: '(tierId: string) => void', default: 'undefined', description: 'Handler when a user selects a plan' }
    ]
  },
  {
    id: 'TestimonialCard',
    name: 'TestimonialCard',
    category: 'marketing',
    description: 'Customer review and social proof card with star ratings, author avatar, designation, and verified badge.',
    badge: 'Marketing',
    cliCommand: 'npx boost-ui add testimonial-card',
    codeSnippet: `import { TestimonialCard, TestimonialGrid } from '@boostengine/ui';

export function Proof() {
  return (
    <TestimonialCard
      quote="BoostEngine reduced our checkout bounce rate by 34% within the first week of deployment."
      author="Aarav Sharma"
      role="Founder & CEO"
      company="UrbanVibe D2C"
      rating={5}
    />
  );
}`,
    props: [
      { name: 'quote', type: 'string', default: "''", description: 'Customer feedback or testimonial quote' },
      { name: 'author', type: 'string', default: "''", description: 'Customer or client full name' },
      { name: 'role', type: 'string', default: "''", description: 'Job title or role' },
      { name: 'company', type: 'string', default: "''", description: 'Company or brand name' },
      { name: 'rating', type: 'number', default: '5', description: 'Star rating from 1 to 5' }
    ]
  },
  {
    id: 'FAQSection',
    name: 'FAQSection',
    category: 'marketing',
    description: 'Collapsible frequently asked questions accordion designed for SEO and high buyer reassurance.',
    badge: 'Marketing',
    cliCommand: 'npx boost-ui add faq-section',
    codeSnippet: `import { FAQSection } from '@boostengine/ui';

export function StoreFAQ() {
  return (
    <FAQSection
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about our ecosystem."
      items={[
        { question: 'Does BoostEngine support Indian GST calculations?', answer: 'Yes! Native intra-state (CGST+SGST) vs inter-state (IGST) calculations are pre-built.' },
        { question: 'Can I use this with Next.js App Router?', answer: '100%. All components are SSR-safe and optimized for React Server Components.' }
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'FAQItem[]', default: '[]', description: 'Array of questions and answers' },
      { name: 'allowMultiple', type: 'boolean', default: 'false', description: 'Allow expanding multiple items concurrently' }
    ]
  },
  {
    id: 'LogoCloud',
    name: 'LogoCloud',
    category: 'marketing',
    description: 'Logo strip for showcasing trusted partners, enterprise clients, or payment gateway certifications.',
    badge: 'Marketing',
    cliCommand: 'npx boost-ui add logo-cloud',
    codeSnippet: `import { LogoCloud } from '@boostengine/ui';

export function Partners() {
  return (
    <LogoCloud
      title="Trusted by 2,500+ D2C Founders & Engineering Teams"
      grayscale
      logos={[
        { name: 'Razorpay', label: 'Razorpay' },
        { name: 'Shiprocket', label: 'Shiprocket' },
        { name: 'PhonePe', label: 'PhonePe' },
        { name: 'Delhivery', label: 'Delhivery' }
      ]}
    />
  );
}`,
    props: [
      { name: 'logos', type: 'LogoItem[]', default: '[]', description: 'List of logo objects with name and src/label' },
      { name: 'grayscale', type: 'boolean', default: 'true', description: 'Applies sleek monochrome grayscale filter with hover reveal' }
    ]
  },
  {
    id: 'CTASection',
    name: 'CTASection',
    category: 'marketing',
    description: 'Final high-impact call-to-action block with gradient backing, headline, and primary conversion button.',
    badge: 'Marketing',
    cliCommand: 'npx boost-ui add cta-section',
    codeSnippet: `import { CTASection } from '@boostengine/ui';

export function BottomCTA() {
  return (
    <CTASection
      title="Ready to Scale Your D2C eCommerce Stack?"
      description="Join 2,500+ developers building with @boostengine/ui today."
      primaryAction={{ label: 'Install via NPM', onClick: () => console.log('NPM') }}
      secondaryAction={{ label: 'Explore GitHub', href: 'https://github.com' }}
      variant="gradient"
    />
  );
}`,
    props: [
      { name: 'title', type: 'string', default: "''", description: 'Main CTA headline' },
      { name: 'description', type: 'string', default: "''", description: 'Supporting description text' },
      { name: 'primaryAction', type: 'HeroAction', default: 'undefined', description: 'Primary action button configuration' },
      { name: 'variant', type: "'default' | 'gradient' | 'card'", default: "'default'", description: 'Container aesthetic styling variant' }
    ]
  }
];
