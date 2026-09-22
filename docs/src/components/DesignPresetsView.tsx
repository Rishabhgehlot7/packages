import React, { useState } from 'react';
import {
  Button,
  Card,
  Badge,
  Input,
  StatsCard,
  ProductCard,
  PresetSwitcher,
  useBoostPreset,
} from '@boostengine/ui';
import type { UIStylePreset } from '@boostengine/ui';
import {
  Sparkles,
  Palette,
  Check,
  Copy,
  Layers,
  ArrowRight,
  Shield,
  Eye,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';

interface DesignPresetsViewProps {
  onShowToast: (msg: string) => void;
}

interface PresetMeta {
  id: UIStylePreset;
  title: string;
  tagline: string;
  icon: string;
  description: string;
  characteristics: string[];
  bestFor: string;
  badgeColor: string;
}

const PRESET_DEFINITIONS: PresetMeta[] = [
  {
    id: 'minimal',
    title: 'Minimal',
    tagline: 'Clean & Contemporary',
    icon: '◻',
    description: 'Crisp 1px borders, subtle ambient shadows, and generous whitespace for distraction-free content.',
    characteristics: ['8px border radius', 'Subtle 1px border', 'Soft drop shadow', 'Clean high-legibility layout'],
    bestFor: 'Modern B2B SaaS, Content platforms, Editorial storefronts',
    badgeColor: '#64748b',
  },
  {
    id: 'glassmorphism',
    title: 'Glassmorphism',
    tagline: 'Frosted Glass & Depth',
    icon: '◈',
    description: 'Translucent frosted backgrounds, 16px backdrop-filter blur, and delicate luminous borders.',
    characteristics: ['16px backdrop blur', 'Translucent rgba background', 'Luminous border reflections', '16px smooth radius'],
    bestFor: 'Web3, Crypto apps, Premium lifestyle fashion, Fintech dashboards',
    badgeColor: '#06b6d4',
  },
  {
    id: 'neumorphism',
    title: 'Neumorphism',
    tagline: 'Soft 3D Tactile Emboss',
    icon: '◉',
    description: 'Soft dual-direction extruded and inset shadows creating a tactile physical feel without harsh lines.',
    characteristics: ['Zero harsh borders', 'Dual light/dark drop shadows', 'Pill-smooth 20px corners', 'Extruded button depth'],
    bestFor: 'Smart home IoT controls, Audio tools, Fitness & Health trackers',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'neo-brutalism',
    title: 'Neo-Brutalism',
    tagline: 'High-Energy Pop & Contrast',
    icon: '■',
    description: 'Bold 3px solid black outlines, punchy 5px offset hard block shadows, and unapologetic character.',
    characteristics: ['Thick 3px solid borders', 'Hard 5px 5px block shadow', 'Sharp 2px crisp corners', 'High-contrast pop'],
    bestFor: 'Gen-Z D2C streetwear, Creator economy apps, Bold marketing campaigns',
    badgeColor: '#f59e0b',
  },
  {
    id: 'dark-first',
    title: 'Dark First',
    tagline: 'OLED Cyber Stealth',
    icon: '◼',
    description: 'Deep OLED black foundations, high-contrast typography, and sleek electric ambient depth.',
    characteristics: ['Deep #0f172a surface', 'High-contrast white text', 'Subtle dark elevation shadows', 'Glanceable KPI metrics'],
    bestFor: 'Developer tools, Crypto trading terminals, Gaming hubs, Night-mode apps',
    badgeColor: '#10b981',
  },
  {
    id: 'gradient-glow',
    title: 'Gradient Glow',
    tagline: 'SaaS Neon Radiant Aura',
    icon: '✦',
    description: 'Vibrant violet-to-cyan ambient glow, glowing borders, and high-converting modern gradient energy.',
    characteristics: ['Radiant 20px ambient glow', 'Gradient accent highlights', '12px modern corners', 'High visual conversion'],
    bestFor: 'AI tools, High-ticket SaaS, Digital products, Tech startups',
    badgeColor: '#6366f1',
  },
  {
    id: 'material-you',
    title: 'Material You',
    tagline: 'Google M3 Dynamic Curves',
    icon: '◍',
    description: 'Signature Google Material 3 pebble shapes with ultra-smooth 24px curvature and soft pastel tonal surfaces.',
    characteristics: ['Pebble 24px soft curvature', 'Tonal background elevation', 'Friendly accessible feel', 'Touch-optimized targets'],
    bestFor: 'Consumer mobile web, Food delivery, Everyday commerce, Travel portals',
    badgeColor: '#ec4899',
  },
];

export const DesignPresetsView: React.FC<DesignPresetsViewProps> = ({ onShowToast }) => {
  const { stylePreset: activeGlobalPreset, setStylePreset: setGlobalPreset } = useBoostPreset();
  const [selectedInteractivePreset, setSelectedInteractivePreset] = useState<UIStylePreset>(activeGlobalPreset);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    onShowToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyGlobal = (preset: UIStylePreset) => {
    setGlobalPreset(preset);
    setSelectedInteractivePreset(preset);
    onShowToast(`Applied ${preset.toUpperCase()} across the entire docs portal!`);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            color: '#ffffff'
          }}>
            <Sparkles size={13} />
            BoostEngine UI v2.0.0 Feature
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Universal Theme Engine</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          7 Universal Design Presets Showcase
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '780px', margin: '0 0 24px', lineHeight: 1.6 }}>
          Har component bina kisi CSS code badle in <strong>7 aesthetic styles</strong> mein instantly adapt ho jata hai. 
          Aap global preset switch kar sakte hain ya kisi specific component par <code>stylePreset="..."</code> laga sakte hain.
        </p>

        {/* Quick Global Switcher Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '16px 20px',
          background: 'var(--card-bg)',
          borderRadius: '14px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
            <Palette size={16} color="var(--primary)" />
            <span>Active Global Preset:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {PRESET_DEFINITIONS.map((p) => {
              const isActive = activeGlobalPreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleApplyGlobal(p.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.title}</span>
                  {isActive && <Check size={13} color="var(--primary)" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactive Live Sandbox */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px' }}>
              Interactive Live Preset Sandbox
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Neeche diye gaye preset chips par click karke dekhein kaise components ka look-and-feel live badalta hai.
            </p>
          </div>

          <button
            onClick={() => handleCopy(
              `<BoostProvider defaultStylePreset="${selectedInteractivePreset}">\n  <Button stylePreset="${selectedInteractivePreset}">Click Me</Button>\n</BoostProvider>`,
              'JSX Code'
            )}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {copiedCode === 'JSX Code' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedCode === 'JSX Code' ? 'Copied Code' : 'Copy JSX Example'}</span>
          </button>
        </div>

        {/* Preset Selector Tabs */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {PRESET_DEFINITIONS.map((p) => {
            const isSelected = selectedInteractivePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedInteractivePreset(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 14px rgba(99, 102, 241, 0.35)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '16px' }}>{p.icon}</span>
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Live Playground Showcase in Selected Preset */}
        <div style={{
          padding: '30px',
          borderRadius: '18px',
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: 800 }}>
                Currently Previewing
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0 0' }}>
                {PRESET_DEFINITIONS.find(p => p.id === selectedInteractivePreset)?.icon}{' '}
                {PRESET_DEFINITIONS.find(p => p.id === selectedInteractivePreset)?.title} Preset
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="outline"
                size="sm"
                stylePreset={selectedInteractivePreset}
                onClick={() => handleApplyGlobal(selectedInteractivePreset)}
              >
                Set as Docs Portal Preset
              </Button>
            </div>
          </div>

          {/* Component Demo Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
            {/* 1. Buttons & Controls Card */}
            <Card stylePreset={selectedInteractivePreset} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} color="var(--primary)" />
                <span>Interactive Buttons</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Button variant="primary" stylePreset={selectedInteractivePreset} onClick={() => onShowToast(`Clicked Primary Button (${selectedInteractivePreset})`)}>
                  Primary Action Button
                </Button>
                <Button variant="secondary" stylePreset={selectedInteractivePreset} onClick={() => onShowToast(`Clicked Secondary Button (${selectedInteractivePreset})`)}>
                  Secondary Action
                </Button>
                <Button variant="outline" stylePreset={selectedInteractivePreset} onClick={() => onShowToast(`Clicked Outline Button (${selectedInteractivePreset})`)}>
                  Outline Button
                </Button>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Badge variant="primary" stylePreset={selectedInteractivePreset}>New Drop</Badge>
                <Badge variant="success" stylePreset={selectedInteractivePreset}>In Stock</Badge>
                <Badge variant="warning" stylePreset={selectedInteractivePreset}>Limited Edition</Badge>
              </div>
            </Card>

            {/* 2. Stats KPI Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <StatsCard
                title="Direct Store Revenue"
                value="₹1,84,200"
                trend={{ value: 24.5, isPositive: true }}
                description="Compared to last 7 days"
                stylePreset={selectedInteractivePreset}
              />
              <Card stylePreset={selectedInteractivePreset} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>Quick Search Input</span>
                <Input
                  placeholder="Search catalog in this preset..."
                  stylePreset={selectedInteractivePreset}
                  onChange={() => {}}
                />
              </Card>
            </div>

            {/* 3. Product E-Commerce Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ProductCard
                title="Vintage Oversized Denim Jacket"
                price={2999}
                compareAtPrice={4499}
                currencySymbol="₹"
                imageUrl="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80"
                brand="BoostStreet"
                rating={4.8}
                reviewCount={124}
                stylePreset={selectedInteractivePreset}
                onAddToCart={() => onShowToast(`Added to Cart (${selectedInteractivePreset})`)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: All 7 Presets Side-By-Side Visual Cards */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px' }}>
            Saare 7 Presets Ek Saath (Side-by-Side Comparison)
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            Neeche har preset ka live styled card, uske visual rules aur real buttons render ho rahe hain:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {PRESET_DEFINITIONS.map((preset) => {
            const isCurrentActive = activeGlobalPreset === preset.id;
            return (
              <div
                key={preset.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderRadius: '16px',
                  padding: '24px',
                  background: 'var(--card-bg)',
                  border: isCurrentActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                  boxShadow: isCurrentActive ? '0 0 20px rgba(99, 102, 241, 0.2)' : 'none',
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '20px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border)'
                    }}>
                      {preset.icon}
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>{preset.title}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{preset.tagline}</span>
                    </div>
                  </div>

                  {isCurrentActive ? (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: 'var(--primary)',
                      color: '#ffffff'
                    }}>
                      ACTIVE
                    </span>
                  ) : null}
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {preset.description}
                </p>

                {/* Live Styled Preview Box */}
                <Card
                  stylePreset={preset.id}
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>Card Component</span>
                    <Badge variant="primary" stylePreset={preset.id}>{preset.title}</Badge>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      stylePreset={preset.id}
                      onClick={() => onShowToast(`Clicked ${preset.title} Button`)}
                    >
                      Primary
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      stylePreset={preset.id}
                      onClick={() => onShowToast(`Clicked ${preset.title} Outline`)}
                    >
                      Outline
                    </Button>
                  </div>
                </Card>

                {/* Characteristics list */}
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>Key Traits:</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {preset.characteristics.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Best For */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  fontSize: '12px',
                  color: 'var(--text-muted)'
                }}>
                  <strong style={{ color: 'var(--text-main)' }}>Best For:</strong> {preset.bestFor}
                </div>

                {/* Action button */}
                <Button
                  variant={isCurrentActive ? 'secondary' : 'outline'}
                  size="sm"
                  stylePreset={preset.id}
                  onClick={() => handleApplyGlobal(preset.id)}
                  style={{ marginTop: 'auto' }}
                >
                  {isCurrentActive ? '✓ Currently Selected' : `Apply ${preset.title} Globally`}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: How to Use in Next.js & React */}
      <section style={{
        padding: '28px',
        borderRadius: '18px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
          How to Use Design Presets in Your Code
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Method 1: Global via BoostProvider */}
          <div style={{ background: 'var(--bg-secondary)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
              1. Global App-Wide Preset (BoostProvider)
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 12px' }}>
              Puri application ko ek preset me daalne ke liye <code>defaultStylePreset</code> pass karein:
            </p>
            <pre style={{
              background: '#0a0d14',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#e2e8f0',
              overflowX: 'auto'
            }}>
              <code>{`import { BoostProvider } from '@boostengine/ui';

export function App({ children }) {
  return (
    <BoostProvider defaultStylePreset="glassmorphism">
      {children}
    </BoostProvider>
  );
}`}</code>
            </pre>
          </div>

          {/* Method 2: Per-Component Override */}
          <div style={{ background: 'var(--bg-secondary)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
              2. Per-Component Override (stylePreset prop)
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 12px' }}>
              Kisi specific button ya card ko different preset style dene ke liye:
            </p>
            <pre style={{
              background: '#0a0d14',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#e2e8f0',
              overflowX: 'auto'
            }}>
              <code>{`import { Button, Card, ProductCard } from '@boostengine/ui';

// Gen-Z brutalist hero button
<Button stylePreset="neo-brutalism">Shop Drop</Button>

// Frosted glass notification card
<Card stylePreset="glassmorphism">...</Card>

// Google M3 pebble product
<ProductCard stylePreset="material-you" ... />`}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
